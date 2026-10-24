"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ARTICLES_TAG } from "@/lib/articles";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { RANKINGS_TAG } from "@/lib/ranking/data";
import { slugify } from "@/lib/slug";

/** `values` echoes the submitted fields back, since React resets the form after an action. */
export type AdminFormState = { error?: string; fieldErrors?: Record<string, string>; values?: Record<string, string> } | undefined;

const echo = (formData: FormData) =>
  Object.fromEntries([...formData].filter(([key, value]) => !key.startsWith("$") && typeof value === "string")) as Record<string, string>;

const optional = (schema: z.ZodString) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), schema.optional());

const fieldErrorsOf = (error: z.ZodError) => {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
  return fieldErrors;
};

// ─── Universities ───────────────────────────────────────────────────────────

const UniversitySchema = z.object({
  name: z.string().trim().min(3, "Nom kamida 3 ta belgi boʻlsin.").max(200),
  shortName: optional(z.string().trim().max(30)),
  slug: optional(z.string().trim().max(80)),
  region: optional(z.string().trim().max(80)),
  city: optional(z.string().trim().max(80)),
  ownership: z.enum(["STATE", "PRIVATE", "INTERNATIONAL_BRANCH"]),
  profile: z.enum(["MULTIDISCIPLINARY", "TECHNICAL", "MEDICAL", "PEDAGOGICAL", "ECONOMICS_LAW", "LANGUAGES", "AGRICULTURE", "ARTS_SPORT"]),
  website: optional(z.string().trim().url("Toʻliq havola kiriting, masalan https://...").max(200)),
  foundedYear: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().int().min(1800, "Yil notoʻgʻri.").max(new Date().getFullYear(), "Yil notoʻgʻri.").optional(),
  ),
  description: optional(z.string().trim().max(5000)),
});

export async function saveUniversity(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireAdmin();
  const id = Number(formData.get("id")) || null;
  const parsed = UniversitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values: echo(formData) };
  const { slug: rawSlug, ...fields } = parsed.data;
  const slug = slugify(rawSlug || fields.shortName || fields.name);
  if (!slug) return { fieldErrors: { slug: "Manzil (slug) boʻsh boʻlmasin." }, values: echo(formData) };

  const clash = await db.university.findUnique({ where: { slug }, select: { id: true } });
  if (clash && clash.id !== id) return { fieldErrors: { slug: "Bu manzil band. Boshqasini kiriting." }, values: echo(formData) };

  const data = {
    ...fields,
    shortName: fields.shortName ?? null,
    region: fields.region ?? null,
    city: fields.city ?? null,
    website: fields.website ?? null,
    foundedYear: fields.foundedYear ?? null,
    description: fields.description ?? null,
    slug,
    // Manual edits win over future data imports.
    adminLocked: true,
  };
  if (id) await db.university.update({ where: { id }, data });
  else await db.university.create({ data: { ...data, status: "ACTIVE" } });

  updateTag(RANKINGS_TAG);
  redirect(`/admin/universities?saved=${encodeURIComponent(slug)}`);
}

/** Hide from the site (recoverable) or bring back. */
export async function setUniversityVisible(id: number, visible: boolean) {
  await requireAdmin();
  await db.university.update({ where: { id }, data: { status: visible ? "ACTIVE" : "HIDDEN", adminLocked: true } });
  updateTag(RANKINGS_TAG);
}

/** Permanent delete, only for universities added by hand (registry ones would be re-imported). */
export async function deleteUniversity(id: number) {
  await requireAdmin();
  const university = await db.university.findUnique({ where: { id }, select: { uzbmbId: true, rorId: true } });
  if (!university) return;
  if (university.uzbmbId || university.rorId) {
    throw new Error("Rasmiy roʻyxatdagi universitetni butunlay oʻchirib boʻlmaydi — uni yashiring.");
  }
  await db.university.delete({ where: { id } });
  updateTag(RANKINGS_TAG);
}

// ─── Articles ───────────────────────────────────────────────────────────────

const ArticleSchema = z.object({
  title: z.string().trim().min(5, "Sarlavha kamida 5 ta belgi boʻlsin.").max(200),
  slug: optional(z.string().trim().max(80)),
  excerpt: z.string().trim().min(20, "Qisqacha mazmun kamida 20 ta belgi boʻlsin.").max(400, "Qisqacha mazmun 400 belgidan oshmasin."),
  body: z.string().trim().min(50, "Matn juda qisqa."),
  coverImageUrl: optional(z.string().trim().url("Rasm uchun toʻliq havola kiriting.").max(500)),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function saveArticle(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const admin = await requireAdmin();
  const id = Number(formData.get("id")) || null;
  const parsed = ArticleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error) };
  const { slug: rawSlug, coverImageUrl, status, ...fields } = parsed.data;
  const slug = slugify(rawSlug || fields.title);
  if (!slug) return { fieldErrors: { slug: "Manzil (slug) boʻsh boʻlmasin." } };

  const clash = await db.article.findUnique({ where: { slug }, select: { id: true } });
  if (clash && clash.id !== id) return { fieldErrors: { slug: "Bu manzil band. Boshqasini kiriting." } };

  const existing = id ? await db.article.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
  const data = {
    ...fields,
    slug,
    status,
    coverImageUrl: coverImageUrl ?? null,
    // Keep the original publication date when re-saving a published article.
    publishedAt: status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : null,
  };
  const article = id
    ? await db.article.update({ where: { id }, data })
    : await db.article.create({ data: { ...data, authorId: admin.id } });

  updateTag(ARTICLES_TAG);
  redirect(`/admin/articles/${article.id}?saved=1`);
}

export async function deleteArticle(id: number) {
  await requireAdmin();
  await db.article.delete({ where: { id } });
  updateTag(ARTICLES_TAG);
  redirect("/admin/articles");
}
