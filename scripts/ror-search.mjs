// Curation helper: search the downloaded ROR records by keyword(s).
//   node scripts/ror-search.mjs "samarkand medical" "tibbiyot samarqand"
// Prints id, names, founding year and the linked OpenAlex institution with its output.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { normalize } from "./lib/names.mjs";

const raw = join(import.meta.dirname, "..", "data", "raw");
const ror = JSON.parse(readFileSync(join(raw, "ror", "organizations-uz.json"), "utf8"));
const openalex = new Map(
  JSON.parse(readFileSync(join(raw, "openalex", "institutions-uz.json"), "utf8")).filter((i) => i.ror).map((i) => [i.ror, i]),
);

for (const query of process.argv.slice(2)) {
  const words = normalize(query).split(" ");
  console.log(`\n# ${query}`);
  for (const org of ror) {
    const haystack = normalize(org.names.map((n) => n.value).join(" | "));
    if (!words.every((word) => haystack.includes(word))) continue;
    const oa = openalex.get(org.id);
    const names = org.names.filter((n) => n.types.includes("label") || n.types.includes("ror_display")).map((n) => n.value);
    console.log(`${org.id} | est ${org.established ?? "?"} | ${oa ? `${oa.id.split("/").pop()} works=${oa.works_count}` : "no OpenAlex"} | ${[...new Set(names)].join(" / ")}`);
  }
}
