/**
 * Seeds reference data: methodology indicators, a starter list of universities and a
 * draft ranking period. No real scores are created, because those must come from real
 * sources (see docs/methodology.md §7).
 *
 *   npx prisma db seed            reference data only
 *   npx prisma db seed -- --demo  also adds a clearly labelled demo period with
 *                                 generated raw values, for building the UI locally
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Ownership, type UniversityProfile } from "../generated/prisma/client";
import { ALL_INDICATORS, METHODOLOGY_VERSION } from "../lib/methodology";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type SeedUniversity = {
  slug: string;
  name: string;
  shortName?: string;
  ownership: Ownership;
  profile: UniversityProfile;
  city: string;
  region: string;
  website?: string;
  foundedYear?: number;
};

// Starter list. Founded years and websites only where well established;
// verify and extend through the admin panel.
const UNIVERSITIES: SeedUniversity[] = [
  { slug: "nuu", name: "Mirzo Ulugʻbek nomidagi Oʻzbekiston Milliy universiteti", shortName: "OʻzMU", ownership: "STATE", profile: "MULTIDISCIPLINARY", city: "Toshkent", region: "Toshkent shahri", website: "https://nuu.uz", foundedYear: 1918 },
  { slug: "tdtu", name: "Islom Karimov nomidagi Toshkent davlat texnika universiteti", shortName: "TDTU", ownership: "STATE", profile: "TECHNICAL", city: "Toshkent", region: "Toshkent shahri", website: "https://tdtu.uz" },
  { slug: "tuit", name: "Muhammad al-Xorazmiy nomidagi Toshkent axborot texnologiyalari universiteti", shortName: "TATU", ownership: "STATE", profile: "TECHNICAL", city: "Toshkent", region: "Toshkent shahri", website: "https://tuit.uz", foundedYear: 1955 },
  { slug: "tiiame", name: "“Toshkent irrigatsiya va qishloq xoʻjaligini mexanizatsiyalash muhandislari instituti” milliy tadqiqot universiteti", shortName: "TIQXMMI", ownership: "STATE", profile: "AGRICULTURE", city: "Toshkent", region: "Toshkent shahri", website: "https://tiiame.uz", foundedYear: 1934 },
  { slug: "tsue", name: "Toshkent davlat iqtisodiyot universiteti", shortName: "TDIU", ownership: "STATE", profile: "ECONOMICS_LAW", city: "Toshkent", region: "Toshkent shahri", website: "https://tsue.uz", foundedYear: 1931 },
  { slug: "uwed", name: "Jahon iqtisodiyoti va diplomatiya universiteti", shortName: "JIDU", ownership: "STATE", profile: "ECONOMICS_LAW", city: "Toshkent", region: "Toshkent shahri", website: "https://uwed.uz", foundedYear: 1992 },
  { slug: "tma", name: "Toshkent tibbiyot akademiyasi", shortName: "TTA", ownership: "STATE", profile: "MEDICAL", city: "Toshkent", region: "Toshkent shahri", website: "https://tma.uz" },
  { slug: "tdpu", name: "Nizomiy nomidagi Oʻzbekiston milliy pedagogika universiteti", shortName: "OʻzMPU", ownership: "STATE", profile: "PEDAGOGICAL", city: "Toshkent", region: "Toshkent shahri", website: "https://tdpu.uz" },
  { slug: "uzswlu", name: "Oʻzbekiston davlat jahon tillari universiteti", shortName: "OʻzDJTU", ownership: "STATE", profile: "LANGUAGES", city: "Toshkent", region: "Toshkent shahri", website: "https://uzswlu.uz" },
  { slug: "wiut", name: "Toshkent shahridagi Vestminster xalqaro universiteti", shortName: "WIUT", ownership: "INTERNATIONAL_BRANCH", profile: "MULTIDISCIPLINARY", city: "Toshkent", region: "Toshkent shahri", website: "https://wiut.uz", foundedYear: 2002 },
  { slug: "inha", name: "Toshkent shahridagi Inha universiteti", shortName: "IUT", ownership: "INTERNATIONAL_BRANCH", profile: "TECHNICAL", city: "Toshkent", region: "Toshkent shahri", website: "https://inha.uz", foundedYear: 2014 },
  { slug: "polito", name: "Toshkent shahridagi Turin politexnika universiteti", shortName: "TTPU", ownership: "INTERNATIONAL_BRANCH", profile: "TECHNICAL", city: "Toshkent", region: "Toshkent shahri", website: "https://polito.uz", foundedYear: 2009 },
  { slug: "webster", name: "Toshkent shahridagi Webster universiteti", shortName: "Webster", ownership: "INTERNATIONAL_BRANCH", profile: "MULTIDISCIPLINARY", city: "Toshkent", region: "Toshkent shahri", website: "https://webster.uz" },
  { slug: "samdu", name: "Sharof Rashidov nomidagi Samarqand davlat universiteti", shortName: "SamDU", ownership: "STATE", profile: "MULTIDISCIPLINARY", city: "Samarqand", region: "Samarqand viloyati", website: "https://samdu.uz", foundedYear: 1927 },
  { slug: "buxdu", name: "Buxoro davlat universiteti", shortName: "BuxDU", ownership: "STATE", profile: "MULTIDISCIPLINARY", city: "Buxoro", region: "Buxoro viloyati", website: "https://buxdu.uz" },
  { slug: "urdu", name: "Urganch davlat universiteti", shortName: "UrDU", ownership: "STATE", profile: "MULTIDISCIPLINARY", city: "Urganch", region: "Xorazm viloyati", website: "https://urdu.uz" },
  { slug: "fdu", name: "Fargʻona davlat universiteti", shortName: "FarDU", ownership: "STATE", profile: "MULTIDISCIPLINARY", city: "Fargʻona", region: "Fargʻona viloyati", website: "https://fdu.uz" },
  { slug: "namdu", name: "Namangan davlat universiteti", shortName: "NamDU", ownership: "STATE", profile: "MULTIDISCIPLINARY", city: "Namangan", region: "Namangan viloyati", website: "https://namdu.uz" },
  { slug: "adu", name: "Andijon davlat universiteti", shortName: "ADU", ownership: "STATE", profile: "MULTIDISCIPLINARY", city: "Andijon", region: "Andijon viloyati", website: "https://adu.uz" },
  { slug: "tersu", name: "Termiz davlat universiteti", shortName: "TerDU", ownership: "STATE", profile: "MULTIDISCIPLINARY", city: "Termiz", region: "Surxondaryo viloyati" },
  { slug: "dsmi", name: "Oʻzbekiston davlat sanʼat va madaniyat instituti", shortName: "OʻzDSMI", ownership: "STATE", profile: "ARTS_SPORT", city: "Toshkent", region: "Toshkent shahri" },
];

async function seedIndicators() {
  for (const indicator of ALL_INDICATORS) {
    const data = {
      name: indicator.name,
      pillar: indicator.pillar,
      weight: indicator.weight,
      unit: indicator.unit,
      source: indicator.source,
      description: indicator.description,
    };
    await db.indicator.upsert({ where: { key: indicator.key }, update: data, create: { key: indicator.key, ...data } });
  }
  // Remove indicators that are no longer part of the methodology.
  await db.indicator.deleteMany({ where: { key: { notIn: ALL_INDICATORS.map((i) => i.key) } } });
}

async function seedUniversities() {
  for (const { slug, ...data } of UNIVERSITIES) {
    await db.university.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  }
}

async function seedDraftPeriod() {
  const name = "2026 reytingi";
  const existing = await db.rankingPeriod.findFirst({ where: { name } });
  if (!existing) {
    await db.rankingPeriod.create({
      data: { name, year: 2026, methodologyVersion: METHODOLOGY_VERSION, status: "DRAFT" },
    });
  }
}

/** Deterministic pseudo-random numbers so demo data is stable between runs. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Plausible raw ranges per indicator, [worst, best] in the indicator's own unit. */
const DEMO_RANGES: Record<string, [number, number]> = {
  admission_score: [95, 182],
  staff_degree_share: [22, 68],
  student_staff_ratio: [30, 11],
  citation_impact: [0.1, 2.1],
  output_per_staff: [0.2, 3.8],
  top10_share: [0.5, 11],
  intl_coauthorship: [4, 45],
  employment_rate: [55, 93],
  graduate_salary: [0.8, 2.4],
  employer_rating: [2.9, 4.6],
  student_satisfaction: [3.0, 4.6],
  student_support: [2.8, 4.5],
  intl_students: [0.2, 14],
  intl_staff: [2, 32],
  mobility: [0.5, 8],
};

async function seedDemoPeriod() {
  const name = "DEMO — soxta maʼlumot";
  const period =
    (await db.rankingPeriod.findFirst({ where: { name } })) ??
    (await db.rankingPeriod.create({
      data: { name, year: 2026, methodologyVersion: METHODOLOGY_VERSION, status: "PUBLISHED", publishedAt: new Date() },
    }));
  await db.rankingPeriod.update({ where: { id: period.id }, data: { methodologyVersion: METHODOLOGY_VERSION } });

  const [universities, indicators] = await Promise.all([
    db.university.findMany({ orderBy: { id: "asc" } }),
    db.indicator.findMany(),
  ]);
  const random = mulberry32(2026);

  const rows = universities.flatMap((university, index) => {
    // A latent "strength" makes indicators correlate, as they do in reality.
    const strength = 0.25 + random() * 0.6;
    const hasStudentSurvey = random() > 0.3;
    const sparse = index === universities.length - 2; // one university with too little data
    return indicators.flatMap((indicator) => {
      if (sparse && !["citation_impact", "output_per_staff", "top10_share", "intl_coauthorship", "admission_score"].includes(indicator.key)) return [];
      if (indicator.pillar === "voice" && !hasStudentSurvey) return [];
      if (indicator.key === "employer_rating" && random() < 0.25) return [];
      const [worst, best] = DEMO_RANGES[indicator.key];
      const position = Math.min(1, Math.max(0, strength + (random() - 0.5) * 0.45));
      const value = Math.round((worst + (best - worst) * position) * 100) / 100;
      return [{ universityId: university.id, indicatorId: indicator.id, periodId: period.id, value, note: "Demo" }];
    });
  });

  await db.score.deleteMany({ where: { periodId: period.id } });
  await db.score.createMany({ data: rows });
  console.log(`Demo period #${period.id}: ${rows.length} generated raw values.`);
}

async function main() {
  const withDemo = process.argv.includes("--demo");
  if (withDemo && process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed demo scores in production.");
  }

  await seedIndicators();
  await seedUniversities();
  await seedDraftPeriod();
  if (withDemo) await seedDemoPeriod();

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
