import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { readSession } from "./session";

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof readSession>>>;

/** The signed-in user, read once per request. Call only behind a Suspense boundary. */
export const getCurrentUser = cache(readSession);

export async function requireUser(next = "/account"): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/signin?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser("/admin");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
