/**
 * Ranking engine. Pure functions, no database: raw indicator values in, scores and
 * ranks out. Implements docs/methodology.md §4 (scoring) and §5 (missing data).
 */

export type EngineIndicator = {
  key: string;
  pillar: string;
  weight: number;
  lowerIsBetter?: boolean;
  log?: boolean;
};

export type EngineUniversity = {
  id: number;
  /** False for institutions listed but never ranked (e.g. arts & sport in v1). */
  eligible: boolean;
};

export type EngineRules = {
  winsorize: readonly [number, number];
  minPillarCoverage: number;
  minRankCoverage: number;
  tiebreakPillar: string;
};

export type RankStatus = "ranked" | "insufficient_data" | "not_eligible";

export type EngineResult = {
  universityId: number;
  status: RankStatus;
  /** Null unless status is "ranked". */
  rank: number | null;
  /** True when another university shares this rank (shown as "=3"). */
  tied: boolean;
  total: number | null;
  pillars: Record<string, number | null>;
  /** Indicator scores on the 0–100 scale; null where data is missing. */
  indicators: Record<string, number | null>;
  /** Share of total weight backed by data, 0–1. */
  coverage: number;
};

/** Raw values keyed by university id, then indicator key. */
export type RawValues = Map<number, Map<string, number>>;

const round1 = (value: number) => Math.round(value * 10) / 10;

/**
 * Nearest-rank percentile; `sorted` must be ascending. Unlike linear interpolation, a
 * single extreme value cannot drag the cap with it in small samples (dozens of
 * universities), which is the whole point of winsorizing.
 */
export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN;
  return sorted[Math.round((sorted.length - 1) * p)];
}

/**
 * Builds the 0–100 scale for one indicator from reference values: optional log
 * transform, clip to the winsorize percentiles, then min–max (reversed when lower is
 * better). Returns null when there is nothing to scale against.
 */
export function buildScale(
  reference: number[],
  indicator: Pick<EngineIndicator, "lowerIsBetter" | "log">,
  winsorize: readonly [number, number],
): ((value: number) => number) | null {
  if (reference.length === 0) return null;
  const transform = (value: number) => (indicator.log ? Math.log1p(Math.max(0, value)) : value);
  const sorted = reference.map(transform).sort((a, b) => a - b);
  const low = percentile(sorted, winsorize[0]);
  const high = percentile(sorted, winsorize[1]);

  return (value) => {
    if (high === low) return 100;
    const share = (Math.min(high, Math.max(low, transform(value))) - low) / (high - low);
    return 100 * (indicator.lowerIsBetter ? 1 - share : share);
  };
}

export function computeRanking(
  universities: EngineUniversity[],
  indicators: EngineIndicator[],
  values: RawValues,
  rules: EngineRules,
): EngineResult[] {
  const eligibleIds = new Set(universities.filter((u) => u.eligible).map((u) => u.id));

  // Indicators are scaled against eligible universities only, so excluded institutions
  // never shift anyone else's scores. Ineligible ones are scored on the same scale.
  const scaledByIndicator = new Map<string, Map<number, number>>();
  const valueOf = (id: number, key: string) => {
    const value = values.get(id)?.get(key);
    return value !== undefined && Number.isFinite(value) ? value : undefined;
  };

  for (const indicator of indicators) {
    const reference = [...eligibleIds]
      .map((id) => valueOf(id, indicator.key))
      .filter((value): value is number => value !== undefined);
    const scale = buildScale(reference, indicator, rules.winsorize);

    const scaled = new Map<number, number>();
    if (scale) {
      for (const university of universities) {
        const value = valueOf(university.id, indicator.key);
        if (value !== undefined) scaled.set(university.id, scale(value));
      }
    }
    scaledByIndicator.set(indicator.key, scaled);
  }

  const pillarKeys = [...new Set(indicators.map((indicator) => indicator.pillar))];
  const totalWeight = indicators.reduce((sum, indicator) => sum + indicator.weight, 0);

  const results: EngineResult[] = universities.map((university) => {
    const indicatorScores: Record<string, number | null> = {};
    let coveredWeight = 0;
    for (const indicator of indicators) {
      const score = scaledByIndicator.get(indicator.key)?.get(university.id);
      indicatorScores[indicator.key] = score === undefined ? null : round1(score);
      if (score !== undefined) coveredWeight += indicator.weight;
    }

    // Within a pillar, missing indicators hand their weight to the ones with data,
    // as long as enough of the pillar is covered; otherwise the pillar is missing.
    const pillars: Record<string, number | null> = {};
    let overallSum = 0;
    let overallWeight = 0;
    for (const key of pillarKeys) {
      const members = indicators.filter((indicator) => indicator.pillar === key);
      const pillarTotal = members.reduce((sum, indicator) => sum + indicator.weight, 0);
      let sum = 0;
      let weight = 0;
      for (const indicator of members) {
        const score = scaledByIndicator.get(indicator.key)?.get(university.id);
        if (score === undefined) continue;
        sum += score * indicator.weight;
        weight += indicator.weight;
      }
      if (pillarTotal > 0 && weight / pillarTotal >= rules.minPillarCoverage) {
        const pillarScore = sum / weight;
        pillars[key] = round1(pillarScore);
        overallSum += pillarScore * pillarTotal;
        overallWeight += pillarTotal;
      } else {
        pillars[key] = null;
      }
    }

    const coverage = totalWeight > 0 ? coveredWeight / totalWeight : 0;
    const total = overallWeight > 0 ? round1(overallSum / overallWeight) : null;
    const status: RankStatus = !university.eligible
      ? "not_eligible"
      : coverage >= rules.minRankCoverage && total !== null
        ? "ranked"
        : "insufficient_data";

    return { universityId: university.id, status, rank: null, tied: false, total, pillars, indicators: indicatorScores, coverage };
  });

  const tiebreak = (result: EngineResult) => result.pillars[rules.tiebreakPillar] ?? -1;
  const byScore = (a: EngineResult, b: EngineResult) =>
    (b.total ?? -1) - (a.total ?? -1) || tiebreak(b) - tiebreak(a);

  const ranked = results.filter((r) => r.status === "ranked").sort(byScore);
  // Competition ranking: equal totals share a rank and the next rank skips (1, =2, =2, 4).
  ranked.forEach((result, index) => {
    const previous = ranked[index - 1];
    result.rank = previous && previous.total === result.total ? previous.rank : index + 1;
  });
  const rankCounts = new Map<number, number>();
  for (const result of ranked) rankCounts.set(result.rank!, (rankCounts.get(result.rank!) ?? 0) + 1);
  for (const result of ranked) result.tied = rankCounts.get(result.rank!)! > 1;

  const unranked = results.filter((r) => r.status !== "ranked").sort(byScore);
  return [...ranked, ...unranked];
}

export const formatRank = (result: Pick<EngineResult, "rank" | "tied">) =>
  result.rank === null ? "—" : `${result.tied ? "=" : ""}${result.rank}`;

/** Raw indicator value with trailing zeros trimmed: 2 decimals below 10, else 1 (3.25, 12.5, 40). */
export const formatRawValue = (raw: number) => raw.toFixed(Math.abs(raw) < 10 ? 2 : 1).replace(/\.?0+$/, "");
