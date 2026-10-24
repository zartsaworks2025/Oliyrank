/**
 * Exports the published preview edition to exports/oliyrank-<year>-preview.xlsx.
 *
 * The workbook is formula-driven: raw indicator values are inputs (blue), and every
 * scaled score, pillar score, coverage, total, status and rank is an Excel formula
 * that reads the scoring parameters on the Methodology sheet. Cached results are
 * written alongside the formulas so the file reads correctly before recalculation.
 * Before writing, the script recomputes those formulas in code and checks every total
 * and rank against the site's ranking engine; any mismatch aborts the export.
 *
 *   npx tsx scripts/export-excel.ts
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import ExcelJS from "exceljs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { ALL_INDICATORS, METHODOLOGY_VERSION, SCORING } from "../lib/methodology";
import { computeRanking, formatRank, percentile } from "../lib/ranking/compute";


// Standalone scripts do not get Prisma's config loading, so read .env here.
try {
  process.loadEnvFile(".env");
} catch {}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 }) });

const OWNERSHIP = { STATE: "State", PRIVATE: "Private", INTERNATIONAL_BRANCH: "Foreign branch" } as const;
const PROFILE = {
  MULTIDISCIPLINARY: "Multidisciplinary", TECHNICAL: "Technical & IT", MEDICAL: "Medical", PEDAGOGICAL: "Pedagogical",
  ECONOMICS_LAW: "Economics & law", LANGUAGES: "Languages", AGRICULTURE: "Agriculture", ARTS_SPORT: "Arts & sport",
} as const;

const FONT = "Arial";
const BLUE = { argb: "FF0000FF" };
const HEADER_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0E6B6B" } };
const GROUP_FILL: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFE8DA" } };
const thin: Partial<ExcelJS.Borders> = { bottom: { style: "thin", color: { argb: "FFE3DACB" } } };

async function main() {
  const period = await db.rankingPeriod.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
  });
  if (!period) throw new Error("No published edition to export.");
  const editionKeys = period.indicatorKeys.length ? period.indicatorKeys : ALL_INDICATORS.map((i) => i.key);
  const indicators = ALL_INDICATORS.filter((i) => editionKeys.includes(i.key));
  // The workbook's formulas are written for these four indicators (the preview edition).
  const expected = ["admission_score", "citation_impact", "top10_share", "intl_coauthorship"];
  if (indicators.map((i) => i.key).join() !== expected.join()) {
    throw new Error(`Export layout supports the preview edition only, got: ${indicators.map((i) => i.key).join(", ")}`);
  }
  if (indicators.some((i) => i.log || i.lowerIsBetter)) throw new Error("Unexpected transform in preview indicators.");

  const universities = await db.university.findMany({ where: { status: "ACTIVE" } });
  const scores = await db.score.findMany({ where: { periodId: period.id }, include: { indicator: true, source: true } });

  const raw = new Map<number, Map<string, number>>();
  const notes = new Map<string, string>();
  for (const s of scores) {
    if (!raw.has(s.universityId)) raw.set(s.universityId, new Map());
    raw.get(s.universityId)!.set(s.indicator.key, s.value);
    if (s.note) notes.set(`${s.universityId}:${s.indicator.key}`, s.note);
  }
  const eligible = (u: (typeof universities)[number]) => u.profile !== "ARTS_SPORT";

  // ── Site engine: the reference result ────────────────────────────────────────
  const engine = computeRanking(
    universities.map((u) => ({ id: u.id, eligible: eligible(u) })),
    indicators,
    raw,
    SCORING,
  );
  const order = engine.map((r) => r.universityId);
  const byId = new Map(universities.map((u) => [u.id, u]));

  // ── Replay of the workbook formulas in code ──────────────────────────────────
  const weight = Object.fromEntries(indicators.map((i) => [i.key, i.weight]));
  const bounds = Object.fromEntries(
    indicators.map((i) => {
      const ref = universities.filter(eligible).map((u) => raw.get(u.id)?.get(i.key)).filter((v): v is number => v !== undefined).sort((a, b) => a - b);
      return [i.key, { lo: percentile(ref, SCORING.winsorize[0]), hi: percentile(ref, SCORING.winsorize[1]) }];
    }),
  );
  const scaled = (key: string, value: number | undefined) => {
    if (value === undefined) return undefined;
    const { lo, hi } = bounds[key];
    return hi === lo ? 100 : (100 * (Math.min(hi, Math.max(lo, value)) - lo)) / (hi - lo);
  };
  const teachingWeight = weight.admission_score;
  const researchWeight = weight.citation_impact + weight.top10_share + weight.intl_coauthorship;
  const totalWeight = teachingWeight + researchWeight;

  type Row = {
    u: (typeof universities)[number];
    values: Record<string, number | undefined>;
    sc: Record<string, number | undefined>;
    teaching?: number;
    research?: number;
    coverage: number;
    total?: number;
    status: string;
    rank?: number;
    tied: boolean;
  };
  const rows: Row[] = order.map((id) => {
    const u = byId.get(id)!;
    const values = Object.fromEntries(indicators.map((i) => [i.key, raw.get(id)?.get(i.key)]));
    const sc = Object.fromEntries(indicators.map((i) => [i.key, scaled(i.key, values[i.key])]));
    const teaching = sc.admission_score;
    const researchKeys = ["citation_impact", "top10_share", "intl_coauthorship"];
    const covered = researchKeys.reduce((s, k) => s + (sc[k] !== undefined ? weight[k] : 0), 0);
    const research =
      covered / researchWeight >= SCORING.minPillarCoverage
        ? researchKeys.reduce((s, k) => s + (sc[k] ?? 0) * weight[k], 0) / covered
        : undefined;
    const coverage = indicators.reduce((s, i) => s + (values[i.key] !== undefined ? i.weight : 0), 0) / totalWeight;
    const denominator = (teaching !== undefined ? teachingWeight : 0) + (research !== undefined ? researchWeight : 0);
    const total = denominator ? Math.round((((teaching ?? 0) * teachingWeight + (research ?? 0) * researchWeight) / denominator) * 10) / 10 : undefined;
    const status = !eligible(u) ? "Not eligible" : coverage >= SCORING.minRankCoverage && total !== undefined ? "Ranked" : "Insufficient data";
    return { u, values, sc, teaching, research, coverage, total, status, tied: false };
  });
  const rankedTotals = rows.filter((r) => r.status === "Ranked").map((r) => r.total!);
  for (const r of rows) {
    if (r.status !== "Ranked") continue;
    r.rank = 1 + rankedTotals.filter((t) => t > r.total!).length;
    r.tied = rankedTotals.filter((t) => t === r.total).length > 1;
  }

  // ── Verify replay == engine ───────────────────────────────────────────────────
  const mismatches = rows.filter((r, i) => {
    const e = engine[i];
    const status = e.status === "ranked" ? "Ranked" : e.status === "not_eligible" ? "Not eligible" : "Insufficient data";
    return r.status !== status || (r.rank ?? null) !== e.rank || r.tied !== e.tied || (status === "Ranked" && r.total !== e.total);
  });
  if (mismatches.length) {
    throw new Error(`Formula replay disagrees with the engine for: ${mismatches.map((r) => r.u.name).join("; ")}`);
  }

  // ── Workbook ─────────────────────────────────────────────────────────────────
  const wb = new ExcelJS.Workbook();
  wb.creator = "OliyRank";
  wb.created = new Date();
  wb.calcProperties.fullCalcOnLoad = true;

  const N = rows.length;
  const first = 3;
  const last = first + N - 1;
  const col = (letter: string) => `$${letter}$${first}:$${letter}$${last}`;

  // Methodology sheet first in code (its cells are referenced), shown last in the tab order.
  const meth = wb.addWorksheet("Methodology");
  const rank = wb.addWorksheet("Ranking", { views: [{ state: "frozen", xSplit: 3, ySplit: 2 }] });
  const sources = wb.addWorksheet("Sources", { views: [{ state: "frozen", xSplit: 1, ySplit: 1 }] });
  wb.worksheets.sort((a, b) => ["Ranking", "Methodology", "Sources"].indexOf(a.name) - ["Ranking", "Methodology", "Sources"].indexOf(b.name));
  wb.views = [{ activeTab: 0 } as ExcelJS.WorkbookView];

  // Methodology parameters (rows 4–15), referenced by name from the Ranking sheet.
  meth.columns = [{ width: 4 }, { width: 46 }, { width: 14 }, { width: 70 }];
  meth.getCell("B1").value = `OliyRank ${period.name} — methodology v${METHODOLOGY_VERSION}`;
  meth.getCell("B1").font = { name: FONT, bold: true, size: 14 };
  meth.getCell("B2").value = "Blue cells are parameters. Change one and every score, total and rank on the Ranking sheet recalculates.";
  meth.getCell("B2").font = { name: FONT, italic: true, color: { argb: "FF5B544A" } };
  const params: [string, string, number, string, string?][] = [
    ["P_LO", "Lower outlier cap (percentile)", SCORING.winsorize[0], "Values below this nearest-rank percentile of eligible universities are raised to it.", "0%"],
    ["P_HI", "Upper outlier cap (percentile)", SCORING.winsorize[1], "Values above this nearest-rank percentile are lowered to it.", "0%"],
    ["MIN_COV", "Minimum data coverage to be ranked", SCORING.minRankCoverage, "Share of the edition's total weight that must have data.", "0%"],
    ["MIN_PILLAR", "Minimum coverage for a pillar score", SCORING.minPillarCoverage, "Share of a pillar's weight that must have data; otherwise the pillar is missing.", "0%"],
    ["W_ADM", "Weight: admission selectivity", weight.admission_score, "Teaching & admission pillar."],
    ["W_FWCI", "Weight: citation impact (FWCI)", weight.citation_impact, "Research pillar."],
    ["W_TOP10", "Weight: top-10% most-cited share", weight.top10_share, "Research pillar."],
    ["W_INTL", "Weight: international co-authorship", weight.intl_coauthorship, "Research pillar."],
  ];
  meth.getCell("B3").value = "Parameter";
  meth.getCell("C3").value = "Value";
  meth.getCell("D3").value = "Meaning";
  ["B3", "C3", "D3"].forEach((a) => (meth.getCell(a).font = { name: FONT, bold: true }));
  params.forEach(([name, label, value, meaning, fmt], i) => {
    const r = 4 + i;
    meth.getCell(`B${r}`).value = label;
    meth.getCell(`C${r}`).value = value;
    meth.getCell(`C${r}`).font = { name: FONT, color: BLUE };
    if (fmt) meth.getCell(`C${r}`).numFmt = fmt;
    meth.getCell(`D${r}`).value = meaning;
    wb.definedNames.add(`'Methodology'!$C$${r}`, name);
  });

  // Per-indicator scaling bounds (rows 14–17): nearest-rank percentiles of eligible values.
  meth.getCell("B13").value = "Scaling bounds (computed)";
  meth.getCell("C13").value = "Low";
  meth.getCell("D13").value = "High";
  ["B13", "C13", "D13"].forEach((a) => (meth.getCell(a).font = { name: FONT, bold: true }));
  const helperCol: Record<string, string> = { admission_score: "U", citation_impact: "V", top10_share: "W", intl_coauthorship: "X" };
  indicators.forEach((indicator, i) => {
    const r = 14 + i;
    const h = `Ranking!${col(helperCol[indicator.key])}`;
    meth.getCell(`B${r}`).value = `${indicator.name} (${indicator.unit})`;
    meth.getCell(`C${r}`).value = { formula: `SMALL(${h},ROUND((COUNT(${h})-1)*P_LO,0)+1)`, result: bounds[indicator.key].lo };
    meth.getCell(`D${r}`).value = { formula: `SMALL(${h},ROUND((COUNT(${h})-1)*P_HI,0)+1)`, result: bounds[indicator.key].hi };
    meth.getCell(`D${r}`).alignment = { horizontal: "left" };
    wb.definedNames.add(`'Methodology'!$C$${r}`, `LO_${indicator.key.toUpperCase()}`);
    wb.definedNames.add(`'Methodology'!$D$${r}`, `HI_${indicator.key.toUpperCase()}`);
  });

  const notesStart = 20;
  const text = [
    "WHAT THIS EDITION MEASURES",
    `This is a preview edition. It ranks universities on the indicators that have credible public data today: admission selectivity (Teaching & admission pillar) and research (Research pillar). Graduate outcomes, student voice and international indicators are added when the national rating data (published from 1 November 2026) and verified surveys are available.`,
    "",
    "HOW SCORES ARE CALCULATED",
    "1. Each raw value is capped to the P_LO–P_HI percentile range of eligible universities, then scaled to 0–100 (100 = strongest in Uzbekistan on that measure).",
    "2. A pillar score is the weighted average of its indicators that have data, if at least MIN_PILLAR of the pillar's weight has data.",
    "3. The overall score is the weighted average of the pillar scores (pillar weight = sum of its indicator weights), rounded to 1 decimal.",
    "4. A university is ranked only if at least MIN_COV of the total weight has data. Equal overall scores share a rank (shown as =N).",
    "5. Arts & sport institutions are listed but not ranked (their outcomes do not fit these indicators).",
    "",
    "INDICATORS",
    "Admission selectivity: median 2025 contract passing score (out of 189) across full-time programs with a standard test (creative-exam programs excluded). Source: Knowledge and Skills Assessment Agency, my.uzbmb.uz. Grant cutoffs are not published on those pages.",
    "Citation impact (FWCI): median field-weighted citation impact of the university's papers (weighted by its authorship share), 1.0 = world average; articles and reviews 2021–2025 in CWTS core journals. The median is used because a few extremely cited papers can otherwise dominate small outputs. Source: OpenAlex.",
    "Top-10% share: share of output among the world's 10% most-cited papers for its field and year. Source: OpenAlex.",
    "International co-authorship: share of output with co-authors in more than one country. Source: OpenAlex.",
    `Research indicators use fractional counting (CWTS Leiden Ranking method): each paper counts by the university's share of its authors. Research is measured only with at least ${SCORING.minCoreWorks} fractionally counted papers.`,
    "",
    "UNIVERSITY LIST",
    "All 138 institutions that admitted students through the national test in 2025 (my.uzbmb.uz), plus private universities and foreign branches that run their own admissions, taken from the Research Organization Registry (ror.org). State institutions absent from the 2025 admission list were merged in the 2025 consolidation and are excluded.",
    "",
    "LIMITATIONS",
    "Contract cutoffs also reflect price and quota size. Universities without indexed research or without 2025 admission data cannot be ranked in this edition. Full methodology: https://oliyrank.com/methodology",
  ];
  text.forEach((line, i) => {
    const cell = meth.getCell(`B${notesStart + i}`);
    cell.value = line;
    cell.font = { name: FONT, bold: /^[A-Z ]+$/.test(line) && line.length > 0, size: 10 };
    cell.alignment = { wrapText: true, vertical: "top" };
    meth.mergeCells(`B${notesStart + i}:D${notesStart + i}`);
    if (line.length > 120) meth.getRow(notesStart + i).height = 15 * Math.ceil(line.length / 120);
  });

  // Ranking sheet.
  const headers: [string, number][] = [
    ["Rank", 7], ["University", 52], ["Short name", 12], ["Region", 20], ["Ownership", 14], ["Profile", 18],
    ["Eligible", 9], ["Status", 16], ["Overall score", 10], ["Teaching & admission", 12], ["Research", 10], ["Data coverage", 10],
    ["Admission score (/189)", 12], ["Citation impact (FWCI)", 11], ["Top-10% share (%)", 11], ["Intl co-authorship (%)", 12],
    ["Admission (0–100)", 11], ["FWCI (0–100)", 10], ["Top-10% (0–100)", 10], ["Intl (0–100)", 10],
    ["h: admission", 9], ["h: FWCI", 9], ["h: top-10%", 9], ["h: intl", 9], ["h: ranked total", 9],
  ];
  rank.columns = headers.map(([, width]) => ({ width }));
  const groups: [string, string, string][] = [
    ["A1:L1", "A1", "Result"], ["M1:P1", "M1", "Raw values (inputs, from sources)"],
    ["Q1:T1", "Q1", "Indicator scores (0–100, formulas)"], ["U1:Y1", "U1", "Helpers (eligible values for scaling)"],
  ];
  for (const [range, anchor, label] of groups) {
    rank.mergeCells(range);
    const c = rank.getCell(anchor);
    c.value = label;
    c.font = { name: FONT, bold: true, size: 10 };
    c.fill = GROUP_FILL;
    c.alignment = { horizontal: "center" };
  }
  const head = rank.getRow(2);
  headers.forEach(([title], i) => {
    const c = head.getCell(i + 1);
    c.value = title;
    c.font = { name: FONT, bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    c.fill = HEADER_FILL;
    c.alignment = { wrapText: true, vertical: "middle", horizontal: i === 1 ? "left" : "center" };
  });
  head.height = 42;

  const opt = (v: number | undefined) => (v === undefined ? "" : v);
  rows.forEach((row, i) => {
    const r = first + i;
    const x = rank.getRow(r);
    const f = (formula: string, result: unknown) => ({ formula, result }) as ExcelJS.CellFormulaValue;
    const rankText = row.rank === undefined ? "—" : formatRank({ rank: row.rank, tied: row.tied });
    x.values = [
      f(`IF(H${r}="Ranked",IF(COUNTIF(${col("Y")},I${r})>1,"="&(COUNTIF(${col("Y")},">"&I${r})+1),COUNTIF(${col("Y")},">"&I${r})+1),"—")`, row.rank !== undefined && !row.tied ? row.rank : rankText),
      row.u.name,
      row.u.shortName ?? "",
      row.u.region ?? "",
      row.u.ownership ? OWNERSHIP[row.u.ownership] : "",
      PROFILE[row.u.profile],
      eligible(row.u) ? "Yes" : "No",
      f(`IF(G${r}="No","Not eligible",IF(AND(L${r}>=MIN_COV,I${r}<>""),"Ranked","Insufficient data"))`, row.status),
      f(`IF(AND(J${r}="",K${r}=""),"",ROUND((N(J${r})*W_ADM+N(K${r})*(W_FWCI+W_TOP10+W_INTL))/((J${r}<>"")*W_ADM+(K${r}<>"")*(W_FWCI+W_TOP10+W_INTL)),1))`, opt(row.total)),
      f(`IF(Q${r}="","",Q${r})`, opt(row.teaching)),
      f(`IF(((R${r}<>"")*W_FWCI+(S${r}<>"")*W_TOP10+(T${r}<>"")*W_INTL)/(W_FWCI+W_TOP10+W_INTL)>=MIN_PILLAR,(N(R${r})*W_FWCI+N(S${r})*W_TOP10+N(T${r})*W_INTL)/((R${r}<>"")*W_FWCI+(S${r}<>"")*W_TOP10+(T${r}<>"")*W_INTL),"")`, opt(row.research)),
      f(`((M${r}<>"")*W_ADM+(N${r}<>"")*W_FWCI+(O${r}<>"")*W_TOP10+(P${r}<>"")*W_INTL)/(W_ADM+W_FWCI+W_TOP10+W_INTL)`, row.coverage),
      opt(row.values.admission_score),
      opt(row.values.citation_impact),
      opt(row.values.top10_share),
      opt(row.values.intl_coauthorship),
      ...indicators.map((ind, k) => {
        const rawCol = ["M", "N", "O", "P"][k];
        const name = ind.key.toUpperCase();
        return f(`IF(${rawCol}${r}="","",IF(HI_${name}=LO_${name},100,100*(MIN(HI_${name},MAX(LO_${name},${rawCol}${r}))-LO_${name})/(HI_${name}-LO_${name})))`, opt(row.sc[ind.key]));
      }),
      ...["M", "N", "O", "P"].map((rawCol, k) =>
        f(`IF(AND($G${r}="Yes",${rawCol}${r}<>""),${rawCol}${r},"")`, eligible(row.u) ? opt(row.values[indicators[k].key]) : ""),
      ),
      f(`IF(H${r}="Ranked",I${r},"")`, row.status === "Ranked" ? opt(row.total) : ""),
    ];
    x.eachCell({ includeEmpty: true }, (c, n) => {
      c.font = { name: FONT, size: 10, color: n >= 13 && n <= 16 ? BLUE : undefined, bold: n === 1 || n === 9 };
      c.border = thin;
      if (n === 1) c.alignment = { horizontal: "center" };
    });
    x.getCell(9).numFmt = "0.0";
    [10, 11, 17, 18, 19, 20].forEach((n) => (x.getCell(n).numFmt = "0.0"));
    x.getCell(12).numFmt = "0%";
    x.getCell(13).numFmt = "0.0";
    x.getCell(14).numFmt = "0.00";
    [15, 16].forEach((n) => (x.getCell(n).numFmt = "0.0"));
    for (let n = 21; n <= 25; n += 1) x.getCell(n).font = { name: FONT, size: 9, color: { argb: "FF8A8174" } };
  });
  rank.autoFilter = { from: { row: 2, column: 1 }, to: { row: 2, column: headers.length } };
  const notesRow = last + 2;
  rank.getCell(`B${notesRow}`).value =
    `Notes: blue = raw inputs from sources (see Sources sheet); everything else is calculated by formula from them and from the parameters on the Methodology sheet. ` +
    `Ranked universities: ${rankedTotals.length} of ${N}. Generated ${new Date().toISOString().slice(0, 10)} from edition "${period.name}".`;
  rank.getCell(`B${notesRow}`).font = { name: FONT, italic: true, size: 9 };

  // Sources sheet.
  const srcHeaders: [string, number][] = [
    ["University", 52], ["Admission data (my.uzbmb.uz)", 30], ["Admission note", 28], ["ROR record", 30], ["OpenAlex record", 30],
    ["Research note", 44], ["Founded", 9], ["Website", 30],
  ];
  sources.columns = srcHeaders.map(([, width]) => ({ width }));
  srcHeaders.forEach(([title], i) => {
    const c = sources.getRow(1).getCell(i + 1);
    c.value = title;
    c.font = { name: FONT, bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    c.fill = HEADER_FILL;
  });
  rows.forEach((row, i) => {
    const u = row.u;
    const link = (url: string | null, label: string) => (url ? { text: label, hyperlink: url } : "");
    sources.getRow(2 + i).values = [
      u.name,
      link(u.uzbmbId ? `https://my.uzbmb.uz/university-about-direction/${u.uzbmbId}` : null, u.uzbmbId ? `uzbmb #${u.uzbmbId}` : ""),
      notes.get(`${u.id}:admission_score`) ?? (u.uzbmbId ? "No full-time standard-test contract scores" : "Not in the 2025 national admission"),
      link(u.rorId, u.rorId?.replace("https://", "") ?? ""),
      link(u.openalexId ? `https://openalex.org/${u.openalexId}` : null, u.openalexId ?? ""),
      notes.get(`${u.id}:top10_share`) ?? (u.openalexId ? `Fewer than ${SCORING.minCoreWorks} fractional core papers` : "No OpenAlex record"),
      u.foundedYear ?? "",
      link(u.website, u.website ?? ""),
    ];
    sources.getRow(2 + i).eachCell({ includeEmpty: true }, (c) => {
      c.font = { name: FONT, size: 10, color: c.value && typeof c.value === "object" && "hyperlink" in c.value ? { argb: "FF0E6B6B" } : undefined, underline: c.value && typeof c.value === "object" && "hyperlink" in c.value ? true : undefined };
      c.border = thin;
    });
  });
  sources.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: srcHeaders.length } };

  const outDir = join(import.meta.dirname, "..", "exports");
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `oliyrank-${period.year}-preview.xlsx`);
  await wb.xlsx.writeFile(file);
  console.log(`Wrote ${file}: ${N} universities, ${rankedTotals.length} ranked. Formula replay matches the engine.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
