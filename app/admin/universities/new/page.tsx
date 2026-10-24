import type { Metadata } from "next";
import { AdminPage, AdminTitle } from "@/components/admin/admin-ui";
import { UniversityForm } from "@/components/admin/university-form";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Universitet qoʻshish" };

export default function NewUniversityPage() {
  return (
    <AdminPage>
      <NewUniversity />
    </AdminPage>
  );
}

async function NewUniversity() {
  await requireAdmin();
  return (
    <>
      <AdminTitle title="Universitet qoʻshish" />
      <UniversityForm
        values={{ name: "", shortName: "", slug: "", region: "", city: "", ownership: "PRIVATE", profile: "MULTIDISCIPLINARY", website: "", foundedYear: "", description: "" }}
      />
    </>
  );
}
