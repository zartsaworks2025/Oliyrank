/**
 * OliyRank methodology. Single source of truth for pillars, indicators and scoring
 * rules: the site renders from it, the ranking engine computes from it, and
 * prisma/seed.ts loads it into the database. Rationale and sources: docs/methodology.md.
 * Indicator weights add up to 100.
 */

export const METHODOLOGY_VERSION = "1.0";

export type PillarKey = "teaching" | "research" | "outcomes" | "voice" | "international";

export type IndicatorDef = {
  key: string;
  name: string;
  weight: number;
  /** What the raw value means, shown next to it. */
  unit: string;
  description: string;
  source: string;
  lowerIsBetter?: boolean;
  /** Log-transform before scaling, for skewed count-like values. */
  log?: boolean;
};

export type PillarDef = {
  key: PillarKey;
  /** Short label for narrow places such as table headers. */
  short: string;
  name: string;
  summary: string;
  indicators: IndicatorDef[];
};

export const PILLARS: PillarDef[] = [
  {
    key: "teaching",
    short: "Taʼlim",
    name: "Taʼlim va qabul",
    summary: "Kirish ballari, ilmiy darajali oʻqituvchilar ulushi va guruh hajmi.",
    indicators: [
      {
        key: "admission_score",
        name: "Qabul raqobati",
        weight: 10,
        unit: "ball (189 dan)",
        description: "Kunduzgi bakalavriat yoʻnalishlari boʻyicha grantga oʻtish ballarining medianasi.",
        source: "Bilim va malakalarni baholash agentligi (uzbmb.uz)",
      },
      {
        key: "staff_degree_share",
        name: "Ilmiy darajali oʻqituvchilar",
        weight: 8,
        unit: "%",
        description: "PhD yoki DSc darajasiga ega professor-oʻqituvchilar ulushi.",
        source: "Milliy reyting maʼlumotlari; OTM hisobotlari",
      },
      {
        key: "student_staff_ratio",
        name: "Talaba–oʻqituvchi nisbati",
        weight: 7,
        unit: "talaba / oʻqituvchi",
        description: "Bitta professor-oʻqituvchiga toʻgʻri keladigan talabalar soni. Kamroq — yaxshiroq.",
        source: "Milliy reyting maʼlumotlari; OTM hisobotlari",
        lowerIsBetter: true,
      },
    ],
  },
  {
    key: "research",
    short: "Ilm-fan",
    name: "Ilmiy faoliyat",
    summary: "Soha boʻyicha meʼyorlangan iqtiboslar, unumdorlik va xalqaro hamkorlik.",
    indicators: [
      {
        key: "citation_impact",
        name: "Iqtibos taʼsiri (FWCI)",
        weight: 10,
        unit: "1.0 = dunyo oʻrtachasi",
        description: "Soha va yil boʻyicha meʼyorlangan oʻrtacha iqtibos koʻrsatkichi, soʻnggi 5 yil.",
        source: "OpenAlex",
      },
      {
        key: "output_per_staff",
        name: "Oʻqituvchi boshiga maqolalar",
        weight: 7,
        unit: "maqola / oʻqituvchi",
        description: "Indekslangan jurnallardagi maqolalar soni, oʻqituvchilar soniga boʻlingan, soʻnggi 5 yil.",
        source: "OpenAlex",
        log: true,
      },
      {
        key: "top10_share",
        name: "Eng koʻp iqtibos olgan 10%",
        weight: 4,
        unit: "%",
        description: "Oʻz sohasida dunyodagi eng koʻp iqtibos olgan 10% ga kirgan maqolalar ulushi.",
        source: "OpenAlex",
      },
      {
        key: "intl_coauthorship",
        name: "Xalqaro hammualliflik",
        weight: 4,
        unit: "%",
        description: "Kamida bitta xorijlik hammuallif bilan yozilgan maqolalar ulushi.",
        source: "OpenAlex",
      },
    ],
  },
  {
    key: "outcomes",
    short: "Natija",
    name: "Bitiruvchilar natijasi",
    summary: "Ishga joylashish, maosh va ish beruvchilar bahosi.",
    indicators: [
      {
        key: "employment_rate",
        name: "Ishga joylashish",
        weight: 12,
        unit: "%",
        description: "12 oy ichida ishga joylashgan yoki oʻqishni davom ettirgan bitiruvchilar ulushi.",
        source: "Milliy reyting maʼlumotlari",
      },
      {
        key: "graduate_salary",
        name: "Bitiruvchilar maoshi",
        weight: 10,
        unit: "× oʻrtacha ish haqi",
        description: "Bitiruvchilarning oʻrtacha maoshi, mamlakat boʻyicha oʻrtacha nominal ish haqiga nisbatan.",
        source: "Milliy reyting maʼlumotlari; Statistika agentligi",
      },
      {
        key: "employer_rating",
        name: "Ish beruvchilar bahosi",
        weight: 8,
        unit: "5 dan",
        description: "Ish beruvchilarning bitiruvchilar tayyorgarligiga bergan oʻrtacha bahosi.",
        source: "OliyRank ish beruvchilar soʻrovnomasi",
      },
    ],
  },
  {
    key: "voice",
    short: "Talabalar",
    name: "Talabalar fikri",
    summary: "Tasdiqlangan talabalarning oʻqish va sharoitlarga bergan bahosi.",
    indicators: [
      {
        key: "student_satisfaction",
        name: "Umumiy mamnuniyat",
        weight: 6,
        unit: "5 dan",
        description: "Oʻqitish sifati va umumiy tajribaga berilgan oʻrtacha baho.",
        source: "OliyRank talabalar soʻrovnomasi",
      },
      {
        key: "student_support",
        name: "Sharoit va qoʻllab-quvvatlash",
        weight: 4,
        unit: "5 dan",
        description: "Bino, raqamli xizmatlar va talabalarni qoʻllab-quvvatlashga berilgan oʻrtacha baho.",
        source: "OliyRank talabalar soʻrovnomasi",
      },
    ],
  },
  {
    key: "international",
    short: "Xalqaro",
    name: "Xalqaro aloqalar",
    summary: "Xorijlik talabalar va oʻqituvchilar, almashinuv va qoʻshma dasturlar.",
    indicators: [
      {
        key: "intl_students",
        name: "Xorijlik talabalar",
        weight: 4,
        unit: "%",
        description: "Xorijiy davlat fuqarosi boʻlgan talabalar ulushi.",
        source: "Milliy reyting maʼlumotlari; OTM hisobotlari",
      },
      {
        key: "intl_staff",
        name: "Xalqaro tajribali oʻqituvchilar",
        weight: 3,
        unit: "%",
        description: "Xorijlik yoki TOP-1000 xorijiy universitetda daraja olgan oʻqituvchilar ulushi.",
        source: "Milliy reyting maʼlumotlari; OTM hisobotlari",
      },
      {
        key: "mobility",
        name: "Almashinuv va qoʻshma dasturlar",
        weight: 3,
        unit: "%",
        description: "Akademik almashinuv yoki qoʻshma/ikki diplomli dasturlardagi talabalar ulushi.",
        source: "Milliy reyting maʼlumotlari; OTM hisobotlari",
      },
    ],
  },
];

/** Scoring rules, see docs/methodology.md §4–5. */
export const SCORING = {
  /** Values are clipped to these percentiles before scaling. */
  winsorize: [0.05, 0.95] as const,
  /** A pillar keeps its own weight only if at least this share of it has data. */
  minPillarCoverage: 0.5,
  /** A university is ranked only if at least this share of total weight has data. */
  minRankCoverage: 0.7,
  /** Pillar used to order universities that share a rank. */
  tiebreakPillar: "outcomes" as PillarKey,
};

export const pillarWeight = (pillar: PillarDef) =>
  pillar.indicators.reduce((sum, indicator) => sum + indicator.weight, 0);

export const ALL_INDICATORS = PILLARS.flatMap((pillar) =>
  pillar.indicators.map((indicator) => ({ ...indicator, pillar: pillar.key })),
);

export const INDICATOR_COUNT = ALL_INDICATORS.length;

export const PILLAR_BY_KEY = Object.fromEntries(PILLARS.map((pillar) => [pillar.key, pillar])) as Record<
  PillarKey,
  PillarDef
>;
