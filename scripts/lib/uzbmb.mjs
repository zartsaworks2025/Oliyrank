// Parses the raw my.uzbmb.uz pages saved by scripts/fetch-uzbmb.mjs.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const UZBMB_DIR = join(import.meta.dirname, "..", "..", "data", "raw", "uzbmb");

const decode = (text) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/** Official list: id, name, and state/private type. */
export function parseUniversityList() {
  const html = readFileSync(join(UZBMB_DIR, "university-list-1.html"), "utf8");
  const pattern =
    /<a href="\/university-about-direction\/(\d+)"[^>]*>\s*<div[^>]*>\s*<span>[\s\S]*?<\/span>\s*<span>([\s\S]*?)<\/span>[\s\S]*?<small[^>]*>([\s\S]*?)<\/small>/g;
  const seen = new Set();
  const universities = [];
  for (const [, id, name, type] of html.matchAll(pattern)) {
    if (seen.has(id)) continue;
    seen.add(id);
    universities.push({ uzbmbId: Number(id), name: decode(name), state: decode(type) === "Davlat" });
  }
  return universities;
}

/** Programs and header details for one university across all saved pages. */
export function parseUniversity(uzbmbId) {
  const programs = [];
  let region = null;
  let website = null;
  for (let page = 1; existsSync(join(UZBMB_DIR, `${uzbmbId}-p${page}.html`)); page += 1) {
    const html = readFileSync(join(UZBMB_DIR, `${uzbmbId}-p${page}.html`), "utf8");
    if (page === 1) {
      const header = html.match(/<h1>[\s\S]*?<\/h1>\s*<div>\s*<a href="#">[^<]*<\/a>\s*<a href="#">([^<]*)<\/a>/);
      region = header ? decode(header[1]) : null;
      const site = html.match(/Web sayt:&nbsp;<\/span>\s*<span>\s*([^<]*?)\s*<\/span>/);
      website = site && site[1].trim() ? decode(site[1]) : null;
    }
    for (const block of html.split('<div class="card_box"').slice(1)) {
      const title = block.match(/<div>\s*<div>([^<]+)<\/div>\s*<div>\s*<span>([^<]+)<\/span>\s*<span>([^<]+)<\/span>/);
      if (!title) continue;
      const subject = (label) => {
        const match = block.match(new RegExp(`<span>${label}</span>([^<]*)</div>`));
        return match ? decode(match[1]) : null;
      };
      const score = (kind) => {
        const match = block.match(new RegExp(`<span>O'tish bali</span>${kind}</div>\\s*<div>\\s*<span>(\\d{4})</span>\\s*([^<]*?)\\s*</div>`));
        if (!match) return { year: null, value: null };
        const value = Number.parseFloat(match[2]);
        return { year: Number(match[1]), value: Number.isFinite(value) && value > 0 ? value : null };
      };
      const grant = score("Grand");
      const contract = score("Kontrakt");
      programs.push({
        program: decode(title[1]),
        form: decode(title[2]),
        language: decode(title[3]),
        subject1: subject("Fan 1"),
        subject2: subject("Fan 2"),
        year: grant.year ?? contract.year,
        grantScore: grant.value,
        contractScore: contract.value,
      });
    }
  }
  return { region, website, programs };
}

const median = (values) => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * Methodology indicator `admission_score` (v1.1): median 2025 contract passing score
 * across full-time (kunduzgi) programs with a standard test, i.e. excluding
 * creative-exam programs, which are scored on a different scale. The agency's pages
 * publish contract cutoffs but not grant cutoffs (every grant value is 0).
 */
export function admissionIndicator(programs) {
  const eligible = programs.filter(
    (p) =>
      p.form === "Kunduzgi" &&
      p.contractScore !== null &&
      !/ijodiy|imtihon/i.test(`${p.subject1} ${p.subject2}`),
  );
  return { value: median(eligible.map((p) => p.contractScore)), programCount: eligible.length };
}
