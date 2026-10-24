import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPage, AdminTitle, buttonClass } from "@/components/admin/admin-ui";
import { UniversityForm } from "@/components/admin/university-form";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Universitetni tahrirlash" };

export default function EditUniversityPage({ params }: PageProps<"/admin/universities/[id]">) {
  return (
    <AdminPage>
      <EditUniversity params={params} />
    </AdminPage>
  );
}

async function EditUniversity({ params }: Pick<PageProps<"/admin/universities/[id]">, "params">) {
  await requireAdmin();
  const { id } = await params;
  const university = await db.university.findUnique({ where: { id: Number(id) || 0 } });
  if (!university) notFound();

  return (
    <>
      <AdminTitle title={university.name}>
        <Link href={`/universities/${university.slug}`} target="_blank" className={buttonClass.secondary}>
          Saytda koʻrish ↗
        </Link>
      </AdminTitle>
      {(university.uzbmbId || university.rorId) && (
        <p className="mb-8 max-w-3xl rounded-xl border border-line bg-paper-raised px-4 py-3 text-sm leading-relaxed text-ink-soft">
          Manba: {[university.uzbmbId && `qabul roʻyxati #${university.uzbmbId}`, university.rorId && `ROR ${university.rorId.replace("https://ror.org/", "")}`, university.openalexId && `OpenAlex ${university.openalexId}`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
      <UniversityForm
        values={{
          id: university.id,
          name: university.name,
          shortName: university.shortName ?? "",
          slug: university.slug,
          region: university.region ?? "",
          city: university.city ?? "",
          ownership: university.ownership ?? "STATE",
          profile: university.profile,
          website: university.website ?? "",
          foundedYear: university.foundedYear?.toString() ?? "",
          description: university.description ?? "",
        }}
      />
    </>
  );
}
