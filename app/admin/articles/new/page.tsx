import type { Metadata } from "next";
import { AdminPage, AdminTitle } from "@/components/admin/admin-ui";
import { ArticleEditor } from "@/components/admin/article-editor";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Yangi maqola" };

export default function NewArticlePage() {
  return (
    <AdminPage>
      <NewArticle />
    </AdminPage>
  );
}

async function NewArticle() {
  await requireAdmin();
  return (
    <>
      <AdminTitle title="Yangi maqola" />
      <ArticleEditor values={{ title: "", slug: "", excerpt: "", body: "", coverImageUrl: "", status: "DRAFT" }} />
    </>
  );
}
