/**
 * Gives an existing account admin rights (sign up on the site first).
 *
 *   npm run admin:make -- you@example.com
 *   npm run admin:make -- you@example.com --revoke
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

try {
  process.loadEnvFile(".env");
} catch {}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 }) });
const email = process.argv[2]?.trim().toLowerCase();
const revoke = process.argv.includes("--revoke");

async function main() {
  if (!email || email.startsWith("--")) throw new Error("Usage: npm run admin:make -- <email> [--revoke]");
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error(`No account with email ${email}. Sign up on the site first.`);
  await db.user.update({ where: { id: user.id }, data: { role: revoke ? "USER" : "ADMIN" } });
  console.log(`${email} is now ${revoke ? "a regular user" : "an admin"}.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
