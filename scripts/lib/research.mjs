// Research indicators from per-paper OpenAlex records, with fractional counting as in
// the CWTS Leiden Ranking: each paper counts by the institution's share of its
// authorship, so a paper with one of our authors among twenty counts 1/20. This stops
// guest or secondary affiliations from inflating a university's figures.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(import.meta.dirname, "..", "..", "data", "raw", "openalex", "research");

/** Share of a paper's authorship belonging to institution `id` (via lineage). */
export function authorshipShare(authorships, id) {
  if (!authorships?.length) return 0;
  let share = 0;
  for (const authorship of authorships) {
    const institutions = authorship.institutions ?? [];
    if (institutions.length === 0) continue;
    const ours = institutions.filter((i) => (i.lineage ?? [i.id]).some((l) => l.endsWith(`/${id}`))).length;
    share += ours / institutions.length / authorships.length;
  }
  return share;
}

/**
 * Citation impact uses the authorship-weighted median FWCI rather than the mean: with
 * a few dozen papers, a handful of extremely cited ones (often in a single journal)
 * can otherwise carry a whole university's score.
 */
export function weightedMedian(papers) {
  const sorted = [...papers].sort((a, b) => a.f - b.f);
  const total = sorted.reduce((sum, paper) => sum + paper.w, 0);
  if (total === 0) return null;
  let cumulative = 0;
  for (const paper of sorted) {
    cumulative += paper.w;
    if (cumulative >= total / 2) return paper.f;
  }
  return sorted.at(-1).f;
}

/**
 * @returns {null | { papers: number, fractional: number, citationImpact: number|null,
 *   top10Share: number, intlShare: number, years: string, fetchedAt: string }}
 */
export function researchIndicators(openalexId) {
  const file = join(DIR, `${openalexId}.json`);
  if (!existsSync(file)) return null;
  const data = JSON.parse(readFileSync(file, "utf8"));
  const papers = data.papers ?? [];

  let fractional = 0;
  let top10 = 0;
  let international = 0;
  for (const paper of papers) {
    fractional += paper.w;
    if (paper.t) top10 += paper.w;
    if (paper.c > 1) international += paper.w;
  }

  const round = (value, digits) => Math.round(value * 10 ** digits) / 10 ** digits;
  const median = weightedMedian(papers.filter((paper) => paper.f !== null && paper.w > 0));
  return {
    papers: papers.length,
    fractional: round(fractional, 1),
    citationImpact: median === null ? null : round(median, 2),
    top10Share: fractional > 0 ? round((100 * top10) / fractional, 1) : 0,
    intlShare: fractional > 0 ? round((100 * international) / fractional, 1) : 0,
    years: data.years,
    fetchedAt: data.fetchedAt,
  };
}
