/**
 * Imports the real data into the database as the 2026 preview edition:
 *  - universities from data/universities.json (built by scripts/build-universities.mjs)
 *  - admission_score from the official 2025 admission data (uzbmb.uz)
 *  - research indicators from OpenAlex, fractionally counted
 *
 * Only indicators in PREVIEW_INDICATORS are imported; the edition records them so the
 * site ranks on exactly those. Re-running replaces the edition's values.
 *
 *   npx tsx scripts/import-edition.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Ownership, type UniversityProfile } from "../generated/prisma/client";
import { ALL_INDICATORS, METHODOLOGY_VERSION, PREVIEW_INDICATORS, SCORING } from "../lib/methodology";
import { researchIndicators } from "./lib/research.mjs";

type BuiltUniversity = {
  slug: string;
  name: string;
  shortName: string | null;
  ownership: Ownership;
  profile: UniversityProfile;
  region: string | null;
  city: string | null;
  website: string | null;
  foundedYear: number | null;
  uzbmbId: number | null;
  rorId: string | null;
  openalexId: string | null;
  admission: { value: number | null; programs: number; year: number } | null;
};

type Research = {
  papers: number;
  fractional: number;
  citationImpact: number | null;
  top10Share: number;
  intlShare: number;
  years: string;
} | null;

export const EDITION_NAME = "2026 · Dastlabki nashr";


// Standalone scripts do not get Prisma's config loading, so read .env here.
try {
  process.loadEnvFile(".env");
} catch {}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 }) });
const universities: BuiltUniversity[] = JSON.parse(
  readFileSync(join(import.meta.dirname, "..", "data", "universities.json"), "utf8"),
);

async function main() {
  // Indicators always mirror lib/methodology.ts.
  for (const indicator of ALL_INDICATORS) {
    const data = { name: indicator.name, pillar: indicator.pillar, weight: indicator.weight, unit: indicator.unit, source: indicator.source, description: indicator.description };
    await db.indicator.upsert({ where: { key: indicator.key }, update: data, create: { key: indicator.key, ...data } });
  }
  const indicatorId = Object.fromEntries((await db.indicator.findMany()).map((i) => [i.key, i.id]));

  const [admissions, openalex] = await Promise.all([
    upsertSource("Bilim va malakalarni baholash agentligi — 2025 qabul natijalari (my.uzbmb.uz)", "ADMISSIONS_DATA", "https://my.uzbmb.uz/university/1"),
    upsertSource("OpenAlex — 2021–2025 ilmiy maqolalar (CWTS core manbalar, fraksion hisob)", "OPEN_RESEARCH_DATA", "https://openalex.org"),
  ]);

  // Universities: upsert the curated list; hide anything else (e.g. old seed rows).
  const ids = new Map<string, number>();
  for (const u of universities) {
    const data = {
      name: u.name, shortName: u.shortName, ownership: u.ownership, profile: u.profile, region: u.region,
      city: u.city, website: u.website, foundedYear: u.foundedYear, uzbmbId: u.uzbmbId, rorId: u.rorId,
      openalexId: u.openalexId, status: "ACTIVE" as const,
    };
    // Registry IDs are unique, so free them from any stale row before claiming them.
    await db.university.updateMany({
      where: {
        slug: { not: u.slug },
        OR: [
          ...(u.uzbmbId ? [{ uzbmbId: u.uzbmbId }] : []),
          ...(u.rorId ? [{ rorId: u.rorId }] : []),
          ...(u.openalexId ? [{ openalexId: u.openalexId }] : []),
        ],
      },
      data: { uzbmbId: null, rorId: null, openalexId: null },
    });
    const row = await db.university.upsert({ where: { slug: u.slug }, update: data, create: { slug: u.slug, ...data } });
    ids.set(u.slug, row.id);
  }
  const hidden = await db.university.updateMany({
    where: { slug: { notIn: universities.map((u) => u.slug) }, status: "ACTIVE" },
    data: { status: "HIDDEN" },
  });

  // Edition period.
  const period =
    (await db.rankingPeriod.findFirst({ where: { name: EDITION_NAME } })) ??
    (await db.rankingPeriod.create({ data: { name: EDITION_NAME, year: 2026, methodologyVersion: METHODOLOGY_VERSION } }));
  await db.rankingPeriod.update({
    where: { id: period.id },
    data: { status: "PUBLISHED", publishedAt: new Date(), methodologyVersion: METHODOLOGY_VERSION, indicatorKeys: PREVIEW_INDICATORS },
  });
  // Demo data must never sit next to real data.
  await db.rankingPeriod.updateMany({ where: { name: { startsWith: "DEMO" } }, data: { status: "ARCHIVED" } });

  const scores: { universityId: number; indicatorId: number; periodId: number; sourceId: number; value: number; note: string }[] = [];
  let researchMeasured = 0;
  for (const u of universities) {
    const universityId = ids.get(u.slug)!;
    if (u.admission?.value != null) {
      scores.push({
        universityId, indicatorId: indicatorId.admission_score, periodId: period.id, sourceId: admissions.id,
        value: u.admission.value, note: `${u.admission.year} · ${u.admission.programs} ta kunduzgi yoʻnalish`,
      });
    }
    const research: Research = u.openalexId ? researchIndicators(u.openalexId) : null;
    if (research && research.fractional >= SCORING.minCoreWorks) {
      researchMeasured += 1;
      const note = `OpenAlex ${research.years} · ${research.papers} maqola, fraksion ${research.fractional}`;
      if (research.citationImpact !== null) {
        scores.push({ universityId, indicatorId: indicatorId.citation_impact, periodId: period.id, sourceId: openalex.id, value: research.citationImpact, note });
      }
      scores.push({ universityId, indicatorId: indicatorId.top10_share, periodId: period.id, sourceId: openalex.id, value: research.top10Share, note });
      scores.push({ universityId, indicatorId: indicatorId.intl_coauthorship, periodId: period.id, sourceId: openalex.id, value: research.intlShare, note });
    }
  }
  await db.score.deleteMany({ where: { periodId: period.id } });
  await db.score.createMany({ data: scores });

  console.log(`Universities: ${universities.length} active, ${hidden.count} hidden.`);
  console.log(`Edition "${EDITION_NAME}": ${scores.length} values; admission for ${universities.filter((u) => u.admission?.value != null).length}, research for ${researchMeasured}.`);
}

async function upsertSource(name: string, type: "ADMISSIONS_DATA" | "OPEN_RESEARCH_DATA", url: string) {
  const existing = await db.source.findFirst({ where: { name } });
  const data = { name, type, url, publishedAt: new Date() };
  return existing ? db.source.update({ where: { id: existing.id }, data }) : db.source.create({ data });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
