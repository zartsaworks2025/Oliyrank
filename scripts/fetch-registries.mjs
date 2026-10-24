// Downloads the institution registries used to identify universities:
//  - OpenAlex institutions in Uzbekistan (open scholarly database, CC0)
//  - ROR organizations in Uzbekistan (Research Organization Registry, CC0)
// Raw JSON goes to data/raw/{openalex,ror}/.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..", "data", "raw");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url, attempt = 1) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (attempt >= 4) throw new Error(`${url}: ${error.message}`);
    await sleep(2000 * attempt);
    return getJson(url, attempt + 1);
  }
}

// OpenAlex: cursor paging, all institution types in Uzbekistan.
mkdirSync(join(ROOT, "openalex"), { recursive: true });
const openalex = [];
let cursor = "*";
while (cursor) {
  const page = await getJson(
    `https://api.openalex.org/institutions?filter=country_code:UZ&per_page=200&cursor=${encodeURIComponent(cursor)}`,
  );
  openalex.push(...page.results);
  cursor = page.meta.next_cursor;
  await sleep(200);
}
writeFileSync(join(ROOT, "openalex", "institutions-uz.json"), JSON.stringify(openalex, null, 1));
console.log(`OpenAlex: ${openalex.length} institutions`);

// ROR v2: page-numbered, 20 per page.
mkdirSync(join(ROOT, "ror"), { recursive: true });
const ror = [];
for (let page = 1; ; page += 1) {
  const data = await getJson(
    `https://api.ror.org/v2/organizations?filter=country.country_code:UZ&page=${page}`,
  );
  ror.push(...data.items);
  if (ror.length >= data.number_of_results || data.items.length === 0) break;
  await sleep(300);
}
// The paged listing is not stably ordered, so it can repeat some records and skip
// others. Deduplicate, then fetch every ROR record OpenAlex points to that is missing.
const byId = new Map(ror.map((org) => [org.id, org]));
const pagedCount = byId.size;
for (const institution of openalex) {
  if (!institution.ror || byId.has(institution.ror)) continue;
  byId.set(institution.ror, await getJson(`https://api.ror.org/v2/organizations/${institution.ror.split("/").pop()}`));
  await sleep(300);
}
writeFileSync(join(ROOT, "ror", "organizations-uz.json"), JSON.stringify([...byId.values()], null, 1));
console.log(`ROR: ${ror.length} listed, ${pagedCount} unique, ${byId.size} after adding OpenAlex-linked records`);
