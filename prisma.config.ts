import { defineConfig } from "prisma/config";

// Prisma 7 no longer reads .env on its own; Node can load it natively.
try {
  process.loadEnvFile(".env");
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Optional so `prisma generate` works before a database exists.
    url: process.env.DATABASE_URL,
  },
});
