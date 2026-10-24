"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser, requireUser } from "./dal";
import { hashPassword, verifyPassword } from "./password";
import { createSession, deleteSession } from "./session";

/** `values` echoes non-secret inputs back, since React resets the form after an action. */
export type FormState = { error?: string; fieldErrors?: Record<string, string>; values?: Record<string, string> } | undefined;

/** Only same-site relative paths, so `?next=` cannot send people to another site. */
const safeNext = (value: FormDataEntryValue | null, fallback = "/account") => {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
};

const SignUpSchema = z.object({
  name: z.string().trim().min(2, "Ism kamida 2 ta harf boʻlsin.").max(80, "Ism juda uzun."),
  email: z.string().trim().toLowerCase().email("Email notoʻgʻri koʻrinishda."),
  password: z.string().min(8, "Parol kamida 8 ta belgi boʻlsin.").max(128, "Parol juda uzun."),
  consent: z.literal("on", { message: "Roʻyxatdan oʻtish uchun rozilik kerak." }),
});

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = SignUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { fieldErrors, values: { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? "") } };
  }
  const { name, email, password } = parsed.data;

  if (await db.user.findUnique({ where: { email }, select: { id: true } })) {
    return { fieldErrors: { email: "Bu email bilan hisob allaqachon bor. Kirib koʻring." }, values: { name, email } };
  }
  const user = await db.user.create({
    data: { name, email, passwordHash: await hashPassword(password), consentAt: new Date() },
  });
  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

// Simple in-memory brute-force guard: 5 failures per email lock it for 15 minutes.
// Per server instance only; enough for a single small deployment.
const failures = new Map<string, { count: number; until: number }>();
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const entry = failures.get(email);
  if (entry && entry.count >= MAX_FAILURES && entry.until > Date.now()) {
    return { error: "Juda koʻp urinish. 15 daqiqadan keyin qayta urinib koʻring.", values: { email } };
  }

  const user = await db.user.findUnique({ where: { email } });
  const valid = user?.status === "ACTIVE" && (await verifyPassword(password, user.passwordHash));
  if (!user || !valid) {
    const count = (entry && entry.until > Date.now() ? entry.count : 0) + 1;
    failures.set(email, { count, until: Date.now() + LOCK_MS });
    return { error: "Email yoki parol notoʻgʻri.", values: { email } };
  }

  failures.delete(email);
  await createSession(user.id);
  redirect(safeNext(formData.get("next"), user.role === "ADMIN" ? "/admin" : "/account"));
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

export async function deleteAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  const current = await requireUser();
  const user = await db.user.findUnique({ where: { id: current.id } });
  if (!user || !(await verifyPassword(String(formData.get("password") ?? ""), user.passwordHash))) {
    return { error: "Parol notoʻgʻri." };
  }
  // Sessions, bookmarks and reviews cascade; authored articles keep their text without the author.
  await db.user.delete({ where: { id: user.id } });
  await deleteSession();
  redirect("/?account=deleted");
}

/** Saves or unsaves a university for the signed-in user. */
export async function toggleBookmark(universityId: number): Promise<{ saved: boolean } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "signin" };
  const where = { userId_universityId: { userId: user.id, universityId } };
  const existing = await db.bookmark.findUnique({ where });
  if (existing) await db.bookmark.delete({ where });
  else await db.bookmark.create({ data: { userId: user.id, universityId } });
  revalidatePath("/account");
  return { saved: !existing };
}
