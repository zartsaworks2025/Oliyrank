/**
 * Gives an existing account admin rights (sign up on the site first).
 *
 *   npm run admin:make -- you@example.com
 *   npm run admin:make -- you@example.com --revoke
 */
import { createScriptDb } from "./lib/db";

const db = createScriptDb();
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
