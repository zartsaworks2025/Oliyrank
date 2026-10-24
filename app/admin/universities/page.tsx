import type { Metadata } from "next";
import Link from "next/link";
import { AdminPage, AdminTitle, buttonClass } from "@/components/admin/admin-ui";
import { UniversityTable } from "@/components/admin/university-table";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Universitetlar" };

export default function AdminUniversitiesPage() {
  return (
    <AdminPage>
      <Universities />
    </AdminPage>
  );
}

async function Universities() {
  await requireAdmin();
  const universities = await db.university.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <AdminTitle title="Universitetlar">
        <Link href="/admin/universities/new" className={buttonClass.primary}>
          Universitet qoʻshish
        </Link>
      </AdminTitle>
      <UniversityTable
        universities={universities.map((u) => ({
          id: u.id,
          slug: u.slug,
          name: u.name,
          shortName: u.shortName,
          city: u.city,
          region: u.region,
          ownership: u.ownership,
          profile: u.profile,
          status: u.status,
          adminLocked: u.adminLocked,
          fromRegistry: Boolean(u.uzbmbId || u.rorId),
        }))}
      />
    </>
  );
}
