import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArticleMarkdown, readingMinutes } from "@/components/article/markdown";
import { getPublishedArticle, getPublishedArticles } from "@/lib/articles";
import { formatArticleDate } from "@/lib/dates";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { type: "article", title: article.title, description: article.excerpt, publishedTime: article.publishedAt, images: article.coverImageUrl ? [article.coverImageUrl] : undefined },
  };
}

// The slug is URL data, so the article streams in behind Suspense for instant navigation.
export default function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<div className="container-page max-w-3xl py-16" aria-busy="true"><div className="h-12 w-3/4 animate-pulse rounded-lg bg-paper-sunk" /></div>}>
      <Article params={params} />
    </Suspense>
  );
}

async function Article({ params }: Pick<PageProps<"/journal/[slug]">, "params">) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  return (
    <article className="pb-20">
      <header className="border-b border-line bg-paper-raised">
        <div className="container-page max-w-3xl py-12 lg:py-16">
          <Link href="/journal" className="text-sm font-medium text-firuza hover:underline">
            ← Jurnal
          </Link>
          <h1 className="mt-6 font-serif text-4xl leading-[1.1] font-medium text-balance sm:text-5xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-ink-soft text-pretty">{article.excerpt}</p>
          <p className="mt-6 text-sm text-ink-faint">
            {[article.authorName, formatArticleDate(article.publishedAt), `${readingMinutes(article.body)} daqiqa oʻqish`].filter(Boolean).join(" · ")}
          </p>
        </div>
      </header>

      {article.coverImageUrl && (
        <div className="container-page max-w-4xl pt-10">
          {/* eslint-disable-next-line @next/next/no-img-element -- author-supplied URL */}
          <img src={article.coverImageUrl} alt="" className="w-full rounded-3xl border border-line" />
        </div>
      )}

      <div className="container-page max-w-3xl pt-6">
        <ArticleMarkdown>{article.body}</ArticleMarkdown>
      </div>
    </article>
  );
}
