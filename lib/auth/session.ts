import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { db } from "@/lib/db";

const COOKIE = "oliyrank_session";
const LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

/** Only a hash of the token is stored, so a database leak cannot be replayed as cookies. */
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + LIFETIME_MS);
  await db.session.create({ data: { id: hashToken(token), userId, expiresAt } });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** The signed-in user for this request, or null. Expired sessions are cleaned up. */
export async function readSession() {
  // Request-time only: the expiry check below compares against the current time.
  await connection();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { id: hashToken(token) },
    include: { user: { select: { id: true, email: true, name: true, role: true, status: true } } },
  });
  if (!session) return null;
  if (session.expiresAt < new Date() || session.user.status !== "ACTIVE") {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session.user;
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { id: hashToken(token) } });
  store.delete(COOKIE);
}
