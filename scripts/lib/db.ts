import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

/**
 * Prisma client for standalone scripts. They do not get Prisma's config loading, so
 * .env is read here, and one connection is enough (the local `prisma dev` server
 * handles few at once).
 */
export function createScriptDb() {
  try {
    process.loadEnvFile(".env");
  } catch {}
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 }) });
}
