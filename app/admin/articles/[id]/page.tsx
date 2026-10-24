import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPage, AdminTitle } from "@/components/admin/admin-ui";
import { ArticleEditor } from "@/components/admin/article-editor";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Maqolani tahrirlash" };

export default function EditArticlePage({ params, searchParams }: PageProps<"/admin/articles/[id]">) {
  return (
    <AdminPage>
      <EditArticle params={params} searchParams={searchParams} />
    </AdminPage>
  );
}

async function EditArticle({ params, searchParams }: Pick<PageProps<"/admin/articles/[id]">, "params" | "searchParams">) {
  await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const article = await db.article.findUnique({ where: { id: Number(id) || 0 } });
  if (!article) notFound();

  return (
    <>
      <AdminTitle title="Maqolani tahrirlash" />
      {query.saved && (
        <p role="status" className="mb-6 rounded-xl bg-firuza-soft px-4 py-3 text-sm text-firuza-strong">
          Saqlandi{article.status === "PUBLISHED" ? " va saytda chop etildi" : " (qoralama)"}.
        </p>
      )}
      <ArticleEditor
        key={article.updatedAt.toISOString()}
        values={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          body: article.body,
          coverImageUrl: article.coverImageUrl ?? "",
          status: article.status,
        }}
      />
    </>
  );
}
