import { describe, expect, it } from "vitest";
import { ALL_INDICATORS, PILLARS, SCORING, pillarWeight } from "@/lib/methodology";
import { buildScale, computeRanking, formatRank, percentile, type EngineIndicator, type RawValues } from "./compute";

const NO_WINSORIZE = [0, 1] as const;
const rules = { ...SCORING, winsorize: NO_WINSORIZE };

const values = (entries: Record<number, Record<string, number>>): RawValues =>
  new Map(Object.entries(entries).map(([id, row]) => [Number(id), new Map(Object.entries(row))]));

const universities = (...ids: number[]) => ids.map((id) => ({ id, eligible: true }));

describe("methodology", () => {
  it("weights add up to 100", () => {
    expect(PILLARS.reduce((sum, pillar) => sum + pillarWeight(pillar), 0)).toBe(100);
  });

  it("has unique indicator keys", () => {
    const keys = ALL_INDICATORS.map((indicator) => indicator.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("percentile", () => {
  it("uses the nearest rank", () => {
    expect(percentile([0, 10, 20, 30, 40], 0.5)).toBe(20);
    expect(percentile([0, 10, 20, 30, 40], 0.95)).toBe(40);
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1000], 0.95)).toBe(19);
  });
});

describe("buildScale", () => {
  it("maps min to 0 and max to 100", () => {
    const scale = buildScale([10, 20, 30], {}, NO_WINSORIZE)!;
    expect(scale(10)).toBe(0);
    expect(scale(20)).toBe(50);
    expect(scale(30)).toBe(100);
  });

  it("reverses when lower is better", () => {
    const scale = buildScale([10, 30], { lowerIsBetter: true }, NO_WINSORIZE)!;
    expect(scale(10)).toBe(100);
    expect(scale(30)).toBe(0);
  });

  it("clips outliers to the winsorize bounds", () => {
    const reference = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1000];
    const scale = buildScale(reference, {}, [0.05, 0.95])!;
    expect(scale(1000)).toBe(100);
    // Without capping, 19 would score under 2; capped, it ties for the top.
    expect(scale(19)).toBe(100);
    expect(scale(2)).toBe(0);
  });

  it("gives everyone 100 when all values are equal", () => {
    const scale = buildScale([5, 5, 5], {}, NO_WINSORIZE)!;
    expect(scale(5)).toBe(100);
  });

  it("log-transforms skewed values", () => {
    const scale = buildScale([0, 9, 99], { log: true }, NO_WINSORIZE)!;
    expect(scale(9)).toBeCloseTo(50, 0);
  });
});

describe("computeRanking", () => {
  const indicators: EngineIndicator[] = [
    { key: "a", pillar: "p1", weight: 60 },
    { key: "b", pillar: "p2", weight: 40 },
  ];

  it("orders by weighted total", () => {
    const result = computeRanking(
      universities(1, 2, 3),
      indicators,
      values({ 1: { a: 0, b: 100 }, 2: { a: 100, b: 0 }, 3: { a: 50, b: 50 } }),
      rules,
    );
    expect(result.map((r) => r.universityId)).toEqual([2, 3, 1]);
    expect(result.map((r) => r.total)).toEqual([60, 50, 40]);
    expect(result.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("shares ranks on equal totals and skips the next rank", () => {
    const result = computeRanking(
      universities(1, 2, 3, 4),
      [{ key: "a", pillar: "p1", weight: 100 }],
      values({ 1: { a: 100 }, 2: { a: 50 }, 3: { a: 50 }, 4: { a: 0 } }),
      rules,
    );
    expect(result.map(formatRank)).toEqual(["1", "=2", "=2", "4"]);
  });

  it("redistributes a missing indicator's weight within its pillar", () => {
    const result = computeRanking(
      universities(1, 2),
      [
        { key: "a", pillar: "p1", weight: 50 },
        { key: "b", pillar: "p1", weight: 30 },
        { key: "c", pillar: "p2", weight: 20 },
      ],
      // University 2 lacks "b": its p1 score comes from "a" alone (62.5% coverage ≥ 50%).
      values({ 1: { a: 0, b: 0, c: 0 }, 2: { a: 100, c: 100 } }),
      rules,
    );
    const second = result.find((r) => r.universityId === 2)!;
    expect(second.pillars.p1).toBe(100);
    expect(second.indicators.b).toBeNull();
    expect(second.coverage).toBeCloseTo(0.7);
    expect(second.status).toBe("ranked");
  });

  it("drops a pillar below minimum coverage and leaves the university unranked below 70%", () => {
    const result = computeRanking(
      universities(1, 2),
      [
        { key: "a", pillar: "p1", weight: 30 },
        { key: "b", pillar: "p1", weight: 40 },
        { key: "c", pillar: "p2", weight: 30 },
      ],
      values({ 1: { a: 0, b: 0, c: 0 }, 2: { a: 100, c: 100 } }),
      rules,
    );
    const second = result.find((r) => r.universityId === 2)!;
    expect(second.pillars.p1).toBeNull(); // 30/70 < 50%
    expect(second.status).toBe("insufficient_data"); // 60% < 70%
    expect(second.rank).toBeNull();
    expect(result[0].universityId).toBe(1);
  });

  it("scores ineligible universities without letting them shift the scale", () => {
    const result = computeRanking(
      [...universities(1, 2), { id: 3, eligible: false }],
      [{ key: "a", pillar: "p1", weight: 100 }],
      values({ 1: { a: 10 }, 2: { a: 20 }, 3: { a: 1000 } }),
      rules,
    );
    const first = result.find((r) => r.universityId === 2)!;
    const outsider = result.find((r) => r.universityId === 3)!;
    expect(first.total).toBe(100);
    expect(outsider.status).toBe("not_eligible");
    expect(outsider.rank).toBeNull();
  });

  it("breaks score ties by the tiebreak pillar for display order", () => {
    const result = computeRanking(
      universities(1, 2),
      [
        { key: "a", pillar: "outcomes", weight: 50 },
        { key: "b", pillar: "research", weight: 50 },
      ],
      values({ 1: { a: 0, b: 100 }, 2: { a: 100, b: 0 } }),
      { ...rules, tiebreakPillar: "outcomes" },
    );
    expect(result.map((r) => r.universityId)).toEqual([2, 1]);
    expect(result.map(formatRank)).toEqual(["=1", "=1"]);
  });
});
