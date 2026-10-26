// Downloads the official 2025 admission data from the Knowledge and Skills Assessment
// Agency (my.uzbmb.uz): the university list and every page of each university's
// programs. Raw HTML is kept in data/raw/uzbmb/ so every derived number is traceable.
//
//   node scripts/fetch-uzbmb.mjs          download whatever is missing
//   node scripts/fetch-uzbmb.mjs --force  re-download everything

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { sleep, withRetry } from "./lib/http.mjs";

const BASE = "https://my.uzbmb.uz";
const OUT = join(import.meta.dirname, "..", "data", "raw", "uzbmb");
const DELAY_MS = 600;
const force = process.argv.includes("--force");

const get = (path) =>
  withRetry(
    async () => {
      const response = await fetch(BASE + path, { headers: { "User-Agent": "OliyRank data collection (research)" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    },
    { label: path },
  );

async function cached(file, path) {
  const target = join(OUT, file);
  if (!force && existsSync(target)) return readFileSync(target, "utf8");
  const html = await get(path);
  writeFileSync(target, html);
  await sleep(DELAY_MS);
  return html;
}

mkdirSync(OUT, { recursive: true });

const listHtml = await cached("university-list-1.html", "/university/1");
const ids = [...new Set([...listHtml.matchAll(/university-about-direction\/(\d+)/g)].map((m) => Number(m[1])))];
console.log(`${ids.length} universities in the official list`);

let pages = 0;
for (const [index, id] of ids.entries()) {
  const first = await cached(`${id}-p1.html`, `/university-about-direction/${id}?page=1`);
  const lastPage = Math.max(1, ...[...first.matchAll(new RegExp(`direction/${id}\\?page=(\\d+)`, "g"))].map((m) => Number(m[1])));
  pages += 1;
  for (let page = 2; page <= lastPage; page += 1) {
    await cached(`${id}-p${page}.html`, `/university-about-direction/${id}?page=${page}`);
    pages += 1;
  }
  if ((index + 1) % 10 === 0) console.log(`${index + 1}/${ids.length} universities, ${pages} pages`);
}
console.log(`Done: ${ids.length} universities, ${pages} pages.`);
