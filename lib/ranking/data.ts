import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { ALL_INDICATORS, PILLARS, SCORING, type PillarKey } from "@/lib/methodology";
import { computeRanking, type RankStatus, type RawValues } from "./compute";
import type { Ownership, UniversityProfile } from "@/generated/prisma/client";

export const RANKINGS_TAG = "rankings";

export type UniversitySummary = {
  slug: string;
  name: string;
  shortName: string | null;
  city: string | null;
  region: string | null;
  ownership: Ownership | null;
  profile: UniversityProfile;
  foundedYear: number | null;
  website: string | null;
};

export type RankingRow = {
  status: RankStatus;
  rank: number | null;
  tied: boolean;
  total: number | null;
  coverage: number;
  pillars: Record<PillarKey, number | null>;
  university: UniversitySummary;
};

export type PeriodInfo = { id: number; name: string; year: number; methodologyVersion: string; publishedAt: string | null };

export type PublishedRanking = {
  period: PeriodInfo;
  /** Demo periods hold generated values and must be labelled as such everywhere. */
  isDemo: boolean;
  rows: RankingRow[];
};

export type IndicatorDetail = {
  key: string;
  name: string;
  unit: string;
  pillar: PillarKey;
  weight: number;
  raw: number | null;
  score: number | null;
};

type Snapshot = PublishedRanking & {
  /** Per-university indicator detail and description, keyed by slug. */
  details: Record<string, { description: string | null; indicators: IndicatorDetail[] }>;
};

/** Ranks only these profiles in v1; others are listed but not ranked (docs/methodology.md §2). */
const isEligible = (profile: UniversityProfile) => profile !== "ARTS_SPORT";

/**
 * Computes the latest published edition once. Every page reads from this cached
 * snapshot, so a build or request never recomputes the ranking per university.
 */
async function getSnapshot(): Promise<Snapshot | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(RANKINGS_TAG);

  const period = await db.rankingPeriod.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
  });
  if (!period) return null;

  const universities = await db.university.findMany({ where: { status: "ACTIVE" } });
  const scores = await db.score.findMany({
    where: { periodId: period.id },
    select: { universityId: true, value: true, indicator: { select: { key: true } } },
  });

  const values: RawValues = new Map();
  for (const score of scores) {
    if (!values.has(score.universityId)) values.set(score.universityId, new Map());
    values.get(score.universityId)!.set(score.indicator.key, score.value);
  }

  const results = computeRanking(
    universities.map((university) => ({ id: university.id, eligible: isEligible(university.profile) })),
    ALL_INDICATORS,
    values,
    SCORING,
  );
  const byId = new Map(universities.map((university) => [university.id, university]));

  const rows: RankingRow[] = [];
  const details: Snapshot["details"] = {};
  for (const result of results) {
    const university = byId.get(result.universityId)!;
    rows.push({
      status: result.status,
      rank: result.rank,
      tied: result.tied,
      total: result.total,
      coverage: result.coverage,
      pillars: Object.fromEntries(PILLARS.map((p) => [p.key, result.pillars[p.key] ?? null])) as Record<PillarKey, number | null>,
      university: {
        slug: university.slug,
        name: university.name,
        shortName: university.shortName,
        city: university.city,
        region: university.region,
        ownership: university.ownership,
        profile: university.profile,
        foundedYear: university.foundedYear,
        website: university.website,
      },
    });
    details[university.slug] = {
      description: university.description,
      indicators: ALL_INDICATORS.map((indicator) => ({
        key: indicator.key,
        name: indicator.name,
        unit: indicator.unit,
        pillar: indicator.pillar,
        weight: indicator.weight,
        raw: values.get(university.id)?.get(indicator.key) ?? null,
        score: result.indicators[indicator.key] ?? null,
      })),
    };
  }

  return {
    period: {
      id: period.id,
      name: period.name,
      year: period.year,
      methodologyVersion: period.methodologyVersion,
      publishedAt: period.publishedAt?.toISOString() ?? null,
    },
    isDemo: period.name.startsWith("DEMO"),
    rows,
    details,
  };
}

/** Latest published ranking. Null until something is published. */
export async function getLatestRanking(): Promise<PublishedRanking | null> {
  const snapshot = await getSnapshot();
  if (!snapshot) return null;
  return { period: snapshot.period, isDemo: snapshot.isDemo, rows: snapshot.rows };
}

export type UniversityProfileData = {
  university: UniversitySummary & { description: string | null };
  row: RankingRow;
  rankedCount: number;
  ranking: { period: PeriodInfo; isDemo: boolean };
  indicators: IndicatorDetail[];
  neighbours: RankingRow[];
};

export async function getUniversityProfile(slug: string): Promise<UniversityProfileData | null> {
  const snapshot = await getSnapshot();
  const row = snapshot?.rows.find((r) => r.university.slug === slug);
  if (!snapshot || !row) return null;

  const ranked = snapshot.rows.filter((r) => r.status === "ranked");
  const index = ranked.indexOf(row);
  const detail = snapshot.details[slug];

  return {
    university: { ...row.university, description: detail.description },
    row,
    rankedCount: ranked.length,
    ranking: { period: snapshot.period, isDemo: snapshot.isDemo },
    indicators: detail.indicators,
    neighbours: index >= 0 ? ranked.slice(Math.max(0, index - 2), index + 3) : [],
  };
}

export async function getUniversitySlugs(): Promise<string[]> {
  const snapshot = await getSnapshot();
  return snapshot?.rows.map((row) => row.university.slug) ?? [];
}
