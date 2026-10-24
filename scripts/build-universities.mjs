// Builds the master university list, data/universities.json, from credible sources only:
//  1. The official 2025 admission list (my.uzbmb.uz): every institution that admitted
//     students in 2025 through the national test, with its region and state/private status.
//  2. ROR (Research Organization Registry): identifiers, founding year, website, acronym,
//     plus degree-granting universities missing from the admission list (mostly private
//     universities and foreign branches that run their own admissions), when hand-approved
//     in data/curation/extra-ror.json.
//  3. OpenAlex institution IDs, linked through ROR.
//
// Matching admission-list names to ROR uses the official Uzbek labels. Uncertain matches
// are written to data/curation/match-review.tsv; decisions go in data/curation/matches.json.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createMatcher, slugify } from "./lib/names.mjs";
import { admissionIndicator, parseUniversity, parseUniversityList } from "./lib/uzbmb.mjs";

const ROOT = join(import.meta.dirname, "..");
const CURATION = join(ROOT, "data", "curation");
mkdirSync(CURATION, { recursive: true });
const readJson = (path, fallback) => (existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : fallback);

const AUTO_MATCH = 0.55;
const ror = readJson(join(ROOT, "data", "raw", "ror", "organizations-uz.json"), []).filter((org) =>
  org.types.some((type) => ["education", "healthcare"].includes(type)),
);
const openalex = readJson(join(ROOT, "data", "raw", "openalex", "institutions-uz.json"), []);
const openalexByRor = new Map(openalex.filter((i) => i.ror).map((i) => [i.ror, i.id.split("/").pop()]));

/** uzbmbId -> ROR id (full URL), or null to force "no ROR record". */
const matchOverrides = readJson(join(CURATION, "matches.json"), {});
/** ROR orgs approved for inclusion although absent from the admission list. */
const extraRor = readJson(join(CURATION, "extra-ror.json"), []);

const latinNames = (org) =>
  org.names.filter((n) => n.lang !== "ru" && !/[Ѐ-ӿ]/.test(n.value)).map((n) => n.value);
const similarity = createMatcher(ror.flatMap((org) => latinNames(org)));
const rorLabel = (org, lang) => org.names.find((n) => n.lang === lang && n.types.includes("label"))?.value;
const rorDisplay = (org) => org.names.find((n) => n.types.includes("ror_display"))?.value;
const rorAcronym = (org) => org.names.find((n) => n.types.includes("acronym"))?.value ?? null;
const rorWebsite = (org) => org.links?.find((l) => l.type === "website")?.value ?? null;
const rorCity = (org) => org.locations?.[0]?.geonames_details?.name ?? null;

const CITY_UZ = {
  Tashkent: "Toshkent", Samarkand: "Samarqand", Bukhara: "Buxoro", Andijan: "Andijon", Fergana: "Fargʻona",
  Namangan: "Namangan", Nukus: "Nukus", Urgench: "Urganch", Termez: "Termiz", Karshi: "Qarshi", Qarshi: "Qarshi",
  Navoiy: "Navoiy", Navoi: "Navoiy", Jizzakh: "Jizzax", Gulistan: "Guliston", Kokand: "Qoʻqon", Chirchiq: "Chirchiq",
  Margilan: "Margʻilon", Shahrisabz: "Shahrisabz", Khiva: "Xiva", Angren: "Angren", Olmaliq: "Olmaliq",
  Almalyk: "Olmaliq", Denov: "Denov", Nurafshon: "Nurafshon",
};

// Main profile from the official name. A classification aid for like-for-like filtering,
// not a data point; documented in docs/methodology.md.
const PROFILE_RULES = [
  ["ARTS_SPORT", /sanʼat|san'at|madaniyat|konservatoriya|musiqa|rassom|teatr|dizayn|jismoniy tarbiya|sport|xoreograf|kino|ijod/i],
  ["MEDICAL", /tibbiyot|medits|farmatsevt|pediatr|stomatolog|medical/i],
  ["PEDAGOGICAL", /pedagogi/i],
  ["LANGUAGES", /tillar|tili |til va|filolog|languages/i],
  ["AGRICULTURE", /qishloq|agro|irrigats|veterinar|chorvachilik|oʻrmon|o'rmon|agrar/i],
  ["ECONOMICS_LAW", /iqtisod|moliya|bank|huquq|yuridik|diplomat|biznes|soliq|bojxona|menejment|economics|finance|law/i],
  ["TECHNICAL", /texni|texnolog|politexn|muhandis|axborot|transport|qurilish|arxitektura|energet|kimyo-texn|neft|kon |konchilik|mashinasoz|aloqa|engineering|technolog|polytechnic/i],
];
const profileOf = (name) => PROFILE_RULES.find(([, pattern]) => pattern.test(name))?.[0] ?? "MULTIDISCIPLINARY";

const isForeignBranch = (name) => /shahridagi|xorijiy|filiali\b.*\b(universiteti|university)/i.test(name) && !/^\S+ (universitet|universiteti) \S+ fill?iali$/i.test(name);

// ── 1. Official admission list ──────────────────────────────────────────────────
const official = parseUniversityList().map((entry) => ({ ...entry, ...parseUniversity(entry.uzbmbId) }));
const admitting = official.filter((u) => u.programs.length > 0);
const notAdmitting = official.filter((u) => u.programs.length === 0);

// ── 2. Match to ROR ─────────────────────────────────────────────────────────────
const review = [["uzbmbId", "official name", "best ROR", "ROR name", "score", "2nd score", "decision"]];
const usedRor = new Set();
const universities = [];

for (const u of admitting) {
  const scored = ror
    .map((org) => ({ org, score: Math.max(0, ...latinNames(org).map((n) => similarity(u.name, n))) }))
    .sort((a, b) => b.score - a.score);
  const [best, second] = scored;
  let org = null;
  let decision;
  if (Object.hasOwn(matchOverrides, u.uzbmbId)) {
    const rorId = matchOverrides[u.uzbmbId];
    org = rorId ? ror.find((o) => o.id === rorId) ?? null : null;
    decision = rorId ? "manual" : "manual: none";
  } else if (best && best.score >= AUTO_MATCH && best.score - (second?.score ?? 0) >= 0.1) {
    org = best.org;
    decision = "auto";
  } else {
    decision = "REVIEW";
  }
  if (org) usedRor.add(org.id);
  review.push([u.uzbmbId, u.name, best?.org.id ?? "", best ? rorLabel(best.org, "uz") ?? rorDisplay(best.org) : "", best?.score.toFixed(2) ?? "", second?.score.toFixed(2) ?? "", decision]);

  const admission = admissionIndicator(u.programs);
  const city = (org && CITY_UZ[rorCity(org)]) ?? (u.region === "Toshkent shahri" ? "Toshkent" : null);
  universities.push({
    slug: uniqueSlug(org ? rorAcronym(org) : null, u.name),
    name: u.name,
    shortName: org ? rorAcronym(org) : null,
    ownership: !u.state ? (isForeignBranch(u.name) ? "INTERNATIONAL_BRANCH" : "PRIVATE") : "STATE",
    profile: profileOf(u.name),
    region: u.region,
    city,
    website: org ? rorWebsite(org) : u.website,
    foundedYear: org?.established ?? null,
    uzbmbId: u.uzbmbId,
    rorId: org?.id ?? null,
    openalexId: org ? openalexByRor.get(org.id) ?? null : null,
    admission: { value: admission.value, programs: admission.programCount, year: 2025 },
    sources: ["uzbmb", ...(org ? ["ror"] : [])],
  });
}

// ── 3. Hand-approved ROR universities missing from the admission list ───────────
for (const extra of extraRor) {
  const org = ror.find((o) => o.id === extra.rorId);
  if (!org || usedRor.has(org.id)) continue;
  usedRor.add(org.id);
  const name = extra.name ?? rorLabel(org, "uz") ?? rorDisplay(org);
  universities.push({
    slug: uniqueSlug(rorAcronym(org), name),
    name,
    shortName: rorAcronym(org),
    ownership: extra.ownership,
    profile: extra.profile ?? profileOf(`${name} ${rorDisplay(org)}`),
    region: extra.region ?? null,
    city: CITY_UZ[rorCity(org)] ?? rorCity(org),
    website: rorWebsite(org),
    foundedYear: org.established ?? null,
    uzbmbId: null,
    rorId: org.id,
    openalexId: openalexByRor.get(org.id) ?? null,
    admission: null,
    sources: ["ror"],
  });
}

/** Short URL slug: the registry acronym when it is free, else the name, numbered on collision. */
function uniqueSlug(acronym, name) {
  const taken = (slug) => universities.some((u) => u.slug === slug);
  const preferred = slugify(acronym ?? "");
  if (preferred && !taken(preferred)) return preferred;
  const base = slugify(name);
  let slug = base;
  for (let n = 2; taken(slug); n += 1) slug = `${base}-${n}`;
  return slug;
}

// Candidates for extra-ror.json: unmatched ROR education orgs that look degree-granting.
const candidates = ror
  .filter((org) => !usedRor.has(org.id) && org.types.includes("education"))
  .filter((org) => !/ilmiy-tadqiqot|research institute|academy of sciences|litsey|lyceum|kollej|college|school/i.test(latinNames(org).join(" ")))
  .map((org) => [org.id, rorLabel(org, "uz") ?? "", rorDisplay(org), rorCity(org) ?? "", org.established ?? ""]);

writeFileSync(join(CURATION, "match-review.tsv"), review.map((row) => row.join("\t")).join("\n") + "\n");
writeFileSync(join(CURATION, "ror-candidates.tsv"), [["rorId", "uz label", "display", "city", "established"], ...candidates].map((r) => r.join("\t")).join("\n") + "\n");
writeFileSync(join(ROOT, "data", "universities.json"), JSON.stringify(universities, null, 1) + "\n");

const needsReview = review.filter((row) => row[6] === "REVIEW").length;
console.log(`Official list: ${official.length} (${admitting.length} admitted in 2025, ${notAdmitting.length} without 2025 programs)`);
console.log(`Universities written: ${universities.length} (${universities.filter((u) => u.rorId).length} linked to ROR, ${universities.filter((u) => u.openalexId).length} to OpenAlex)`);
console.log(`Matches needing review: ${needsReview}; unmatched ROR candidates: ${candidates.length}`);
if (notAdmitting.length) console.log("No 2025 programs:", notAdmitting.map((u) => u.name).join("; "));
