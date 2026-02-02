import { prisma } from "@/app/lib/prisma";

type ScoreMap = Map<number, Map<number, number>>;

type RankedItem = {
  institutionId: number;
  totalScore: number;
  rank: number;
};

type InstitutionInput = {
  id: number;
  type: "UNIVERSITY" | "LEARNING_CENTER";
};

type IndicatorInput = {
  id: number;
  weight: number;
  scope: "BOTH" | "UNIVERSITY" | "LEARNING_CENTER";
};

type ScoreInput = {
  institutionId: number;
  indicatorId: number;
  value: number;
};

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

export function computeRanking({
  institutions,
  indicators,
  scores,
}: {
  institutions: InstitutionInput[];
  indicators: IndicatorInput[];
  scores: ScoreInput[];
}) {
  const scoreMap: ScoreMap = new Map();
  for (const score of scores) {
    if (!scoreMap.has(score.institutionId)) {
      scoreMap.set(score.institutionId, new Map());
    }
    scoreMap.get(score.institutionId)!.set(score.indicatorId, score.value);
  }

  const ranked: RankedItem[] = institutions.map((institution) => {
    const applicableIndicators = indicators.filter((indicator) => {
      if (indicator.scope === "BOTH") return true;
      if (indicator.scope === "UNIVERSITY" && institution.type === "UNIVERSITY") {
        return true;
      }
      if (
        indicator.scope === "LEARNING_CENTER" &&
        institution.type === "LEARNING_CENTER"
      ) {
        return true;
      }
      return false;
    });

    const totalWeight = applicableIndicators.reduce(
      (sum, indicator) => sum + indicator.weight,
      0
    );

    const indicatorScores = scoreMap.get(institution.id);

    const weightedSum = applicableIndicators.reduce((sum, indicator) => {
      const raw = indicatorScores?.get(indicator.id) ?? 0;
      return sum + clampScore(raw) * indicator.weight;
    }, 0);

    const totalScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

    return {
      institutionId: institution.id,
      totalScore,
      rank: 0,
    };
  });

  ranked.sort((a, b) => b.totalScore - a.totalScore);

  let currentRank = 0;
  let lastScore: number | null = null;
  for (let index = 0; index < ranked.length; index += 1) {
    const item = ranked[index];
    if (lastScore === null || item.totalScore < lastScore) {
      currentRank = index + 1;
      lastScore = item.totalScore;
    }
    item.rank = currentRank;
  }

  return ranked;
}

export async function recomputeRanking(periodId: number) {
  const period = await prisma.rankingPeriod.findUnique({
    where: { id: periodId },
  });

  if (!period) {
    throw new Error("Ranking period not found");
  }

  const [institutions, indicators, scores] = await Promise.all([
    prisma.institution.findMany({
      where: { status: "ACTIVE" },
    }),
    prisma.indicator.findMany({
      orderBy: { id: "asc" },
    }),
    prisma.score.findMany({
      where: { periodId },
      select: {
        institutionId: true,
        indicatorId: true,
        value: true,
      },
    }),
  ]);

  const ranked = computeRanking({ institutions, indicators, scores });

  await prisma.$transaction([
    prisma.rankingResult.deleteMany({ where: { periodId } }),
    prisma.rankingResult.createMany({
      data: ranked.map((item) => ({
        periodId,
        institutionId: item.institutionId,
        totalScore: item.totalScore,
        rank: item.rank,
        calculatedAt: new Date(),
      })),
    }),
  ]);

  return ranked;
}
