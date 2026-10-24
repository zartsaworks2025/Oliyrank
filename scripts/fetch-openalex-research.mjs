// Downloads per-paper research data for Uzbek universities from OpenAlex (CC0).
// Window: publication years 2021–2025; articles and reviews in CWTS core sources
// (OpenAlex `primary_location.source.is_core`), attributed through the institution
// lineage so faculties registered under a university count towards it.
//
// For fractional counting (CWTS Leiden Ranking method), each paper is stored with the
// institution's share of its authorship: every author counts 1/n, split equally across
// that author's affiliations. Saved to data/raw/openalex/research/{id}.json as compact
// records { w: share, f: fwci|null, t: top-10% flag, c: countries }.
//
//   node scripts/fetch-openalex-research.mjs [--force]
//   (optional env OPENALEX_API_KEY raises OpenAlex's free daily budget)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { authorshipShare } from "./lib/research.mjs";

const ROOT = join(import.meta.dirname, "..", "data", "raw", "openalex");
const OUT = join(ROOT, "research");
const YEARS = "2021-2025";
const force = process.argv.includes("--force");
const key = process.env.OPENALEX_API_KEY ? `&api_key=${process.env.OPENALEX_API_KEY}` : "";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url, attempt = 1) {
  try {
    const response = await fetch(url + key);
    if (response.status === 429) throw new Error("rate limited (429)");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (attempt >= 5) throw new Error(`${url}: ${error.message}`);
    await sleep(3000 * attempt);
    return getJson(url, attempt + 1);
  }
}

const filter = (id) =>
  `authorships.institutions.lineage:${id},publication_year:${YEARS},type:article|review,primary_location.source.is_core:true`;

const institutions = JSON.parse(readFileSync(join(ROOT, "institutions-uz.json"), "utf8")).filter((i) =>
  ["education", "healthcare"].includes(i.type),
);
mkdirSync(OUT, { recursive: true });

for (const [index, institution] of institutions.entries()) {
  const id = institution.id.split("/").pop();
  const file = join(OUT, `${id}.json`);
  if (!force && existsSync(file) && JSON.parse(readFileSync(file, "utf8")).papers) continue;

  const papers = [];
  // Page-number paging (cursor paging needs an API key); capped at 10,000 results,
  // far above any Uzbek university's core output.
  for (let page = 1; page <= 50; page += 1) {
    const data = await getJson(
      `https://api.openalex.org/works?filter=${filter(id)}&per_page=200&page=${page}` +
        `&select=id,fwci,citation_normalized_percentile,countries_distinct_count,authorships`,
    );
    for (const work of data.results) {
      papers.push({
        w: Math.round(authorshipShare(work.authorships, id) * 10000) / 10000,
        f: typeof work.fwci === "number" ? work.fwci : null,
        t: work.citation_normalized_percentile?.is_in_top_10_percent === true,
        c: work.countries_distinct_count ?? 0,
      });
    }
    if (data.results.length < 200) break;
    await sleep(150);
  }

  writeFileSync(
    file,
    JSON.stringify({ id, name: institution.display_name, years: YEARS, fetchedAt: new Date().toISOString(), papers }),
  );
  console.log(`${index + 1}/${institutions.length} ${institution.display_name}: ${papers.length} core papers`);
  await sleep(150);
}
console.log("Done.");
