/**
 * Seeds reference data only: the methodology indicators and a draft period for the next
 * full edition. Universities and their values come from real sources through
 * scripts/import-edition.ts (see README "Data pipeline").
 *
 *   npx prisma db seed
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { ALL_INDICATORS, METHODOLOGY_VERSION } from "../lib/methodology";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 }),
});

async function main() {
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

  const name = "2026 · Toʻliq nashr";
  if (!(await db.rankingPeriod.findFirst({ where: { name } }))) {
    await db.rankingPeriod.create({
      data: { name, year: 2026, methodologyVersion: METHODOLOGY_VERSION, status: "DRAFT" },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
