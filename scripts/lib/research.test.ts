import { describe, expect, it } from "vitest";
import { authorshipShare, weightedMedian } from "./research.mjs";

const inst = (id: string, parent?: string) => ({
  id: `https://openalex.org/${id}`,
  lineage: [`https://openalex.org/${id}`, ...(parent ? [`https://openalex.org/${parent}`] : [])],
});

describe("authorshipShare (fractional counting)", () => {
  it("gives 1/n per author", () => {
    const authorships = [{ institutions: [inst("I1")] }, { institutions: [inst("I2")] }, { institutions: [inst("I2")] }, { institutions: [inst("I3")] }];
    expect(authorshipShare(authorships, "I1")).toBeCloseTo(0.25);
    expect(authorshipShare(authorships, "I2")).toBeCloseTo(0.5);
  });

  it("splits an author with two affiliations equally", () => {
    const authorships = [{ institutions: [inst("I1"), inst("I9")] }, { institutions: [inst("I2")] }];
    expect(authorshipShare(authorships, "I1")).toBeCloseTo(0.25);
  });

  it("credits a parent through the lineage", () => {
    const authorships = [{ institutions: [inst("I5", "I1")] }];
    expect(authorshipShare(authorships, "I1")).toBe(1);
  });

  it("is 0 without authorships", () => {
    expect(authorshipShare([], "I1")).toBe(0);
  });
});

describe("weightedMedian", () => {
  it("ignores a few extreme values", () => {
    const papers = [1, 1.2, 0.8, 1.1, 150].map((f) => ({ f, w: 1 }));
    expect(weightedMedian(papers)).toBe(1.1);
  });

  it("respects authorship weights", () => {
    const papers = [
      { f: 10, w: 0.1 },
      { f: 1, w: 1 },
      { f: 2, w: 0.1 },
    ];
    expect(weightedMedian(papers)).toBe(1);
  });

  it("is null for no papers", () => {
    expect(weightedMedian([])).toBeNull();
  });
});
