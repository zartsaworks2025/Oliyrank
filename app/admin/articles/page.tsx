import type { Metadata } from "next";
import Link from "next/link";
import { AdminPage, AdminTitle, buttonClass } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/dal";
import { formatArticleDate } from "@/lib/dates";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Maqolalar" };

export default function AdminArticlesPage() {
  return (
    <AdminPage>
      <Articles />
    </AdminPage>
  );
}

async function Articles() {
  await requireAdmin();
  const articles = await db.article.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <>
      <AdminTitle title="Maqolalar">
        <Link href="/admin/articles/new" className={buttonClass.primary}>
          Yangi maqola
        </Link>
      </AdminTitle>
      {articles.length === 0 ? (
        <p className="text-ink-soft">Hali maqola yoʻq.</p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
          {articles.map((article) => (
            <li key={article.id}>
              <Link href={`/admin/articles/${article.id}`} className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-paper-sunk/50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{article.title}</p>
                  <p className="mt-0.5 truncate text-sm text-ink-soft">{article.excerpt}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    article.status === "PUBLISHED" ? "bg-firuza-soft text-firuza-strong" : "bg-paper-sunk text-ink-soft"
                  }`}
                >
                  {article.status === "PUBLISHED" ? "Chop etilgan" : "Qoralama"}
                </span>
                <span className="w-32 text-right text-sm text-ink-faint">{formatArticleDate(article.updatedAt.toISOString())}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
