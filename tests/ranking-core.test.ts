import { describe, expect, it } from "vitest";
import { computeRanking } from "@/app/lib/ranking";

describe("computeRanking", () => {
  it("orders institutions by weighted score", () => {
    const institutions = [
      { id: 1, type: "UNIVERSITY" as const },
      { id: 2, type: "UNIVERSITY" as const },
    ];

    const indicators = [
      { id: 1, weight: 60, scope: "BOTH" as const },
      { id: 2, weight: 40, scope: "BOTH" as const },
    ];

    const scores = [
      { institutionId: 1, indicatorId: 1, value: 80 },
      { institutionId: 1, indicatorId: 2, value: 90 },
      { institutionId: 2, indicatorId: 1, value: 95 },
      { institutionId: 2, indicatorId: 2, value: 70 },
    ];

    const ranked = computeRanking({ institutions, indicators, scores });

    expect(ranked[0].institutionId).toBe(2);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].institutionId).toBe(1);
    expect(ranked[1].rank).toBe(2);
  });

  it("assigns same rank for equal scores", () => {
    const institutions = [
      { id: 1, type: "UNIVERSITY" as const },
      { id: 2, type: "UNIVERSITY" as const },
    ];

    const indicators = [{ id: 1, weight: 100, scope: "BOTH" as const }];

    const scores = [
      { institutionId: 1, indicatorId: 1, value: 80 },
      { institutionId: 2, indicatorId: 1, value: 80 },
    ];

    const ranked = computeRanking({ institutions, indicators, scores });

    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(1);
  });
});
