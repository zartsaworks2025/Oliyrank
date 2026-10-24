import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";

export const ARTICLES_TAG = "articles";

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string;
  authorName: string | null;
};

export async function getPublishedArticles(): Promise<ArticleSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(ARTICLES_TAG);
  const articles = await db.article.findMany({
    where: { status: "PUBLISHED", publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
  return articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    coverImageUrl: a.coverImageUrl,
    publishedAt: a.publishedAt!.toISOString(),
    authorName: a.author?.name ?? null,
  }));
}

export async function getPublishedArticle(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(ARTICLES_TAG);
  const article = await db.article.findUnique({ where: { slug }, include: { author: { select: { name: true } } } });
  if (!article || article.status !== "PUBLISHED" || !article.publishedAt) return null;
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    coverImageUrl: article.coverImageUrl,
    publishedAt: article.publishedAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    authorName: article.author?.name ?? null,
  };
}

export { formatArticleDate } from "./dates";
