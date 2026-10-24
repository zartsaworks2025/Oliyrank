import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { getPublishedArticles } from "@/lib/articles";
import { formatArticleDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Jurnal",
  description: "Oʻzbekiston universitetlari, qabul va reytinglar haqida maqolalar.",
};

export default async function JournalPage() {
  const articles = await getPublishedArticles();
  const [lead, ...rest] = articles;

  return (
    <>
      <PageIntro eyebrow="Jurnal" title="Reyting, qabul va oliy taʼlim haqida.">
        Raqamlar ortidagi hikoyalar: qanday hisoblaymiz, nimani topdik va abituriyent nimani bilishi kerak.
      </PageIntro>

      <div className="container-page py-14">
        {!lead ? (
          <p className="text-ink-soft">Hozircha maqolalar yoʻq.</p>
        ) : (
          <>
            <Link href={`/journal/${lead.slug}`} className="group grid gap-8 rounded-3xl border border-line bg-paper-raised p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              {lead.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- author-supplied URL
                <img src={lead.coverImageUrl} alt="" className="aspect-[16/10] w-full rounded-2xl object-cover" />
              ) : (
                <div className="grid aspect-[16/10] place-items-center rounded-2xl bg-firuza text-on-firuza">
                  <span className="px-8 text-center font-serif text-3xl leading-tight">{lead.title}</span>
                </div>
              )}
              <div>
                <p className="text-sm text-ink-faint">{formatArticleDate(lead.publishedAt)}</p>
                <h2 className="mt-3 font-serif text-3xl leading-tight font-medium text-balance group-hover:text-firuza">{lead.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lead.excerpt}</p>
                <span className="mt-6 inline-block font-medium text-firuza">Oʻqish →</span>
              </div>
            </Link>

            {rest.length > 0 && (
              <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <li key={article.slug}>
                    <Link href={`/journal/${article.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-paper-raised p-6 transition-colors hover:border-line-strong">
                      <p className="text-sm text-ink-faint">{formatArticleDate(article.publishedAt)}</p>
                      <h2 className="mt-3 font-serif text-xl leading-snug font-medium group-hover:text-firuza">{article.title}</h2>
                      <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{article.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
