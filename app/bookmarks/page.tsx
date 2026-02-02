import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import BookmarkButton from "@/components/bookmarks/BookmarkButton";

export const metadata: Metadata = {
  title: "Saqlanganlar | OliyRank",
  description: "Foydalanuvchi saqlagan universitet va markazlar ro'yxati.",
  robots: { index: false, follow: false },
};

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? "" },
    select: { id: true },
  });

  if (!user) {
    redirect("/signin");
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: { institution: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="page page--bookmarks">
      <section className="bookmarks-hero">
        <h1>Saqlangan muassasalar</h1>
        <p>O&apos;zingiz uchun belgilangan universitet va markazlar.</p>
      </section>

      <section className="bookmarks-list">
        {bookmarks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__title">Saqlanganlar yo&apos;q</div>
            <div className="empty-state__text">
              Reytinglar bo&apos;limida muassasalarni saqlab qo&apos;ying.
            </div>
            <Link href="/rankings" className="btn--primary">
              Reytinglarga o&apos;tish
            </Link>
          </div>
        ) : (
          bookmarks.map((bookmark) => (
            <article key={bookmark.id} className="bookmark-card">
              <div>
                <h2>{bookmark.institution.name}</h2>
                <p>
                  {bookmark.institution.city ?? ""}
                  {bookmark.institution.city && bookmark.institution.country ? " · " : ""}
                  {bookmark.institution.country ?? ""}
                </p>
                <Link href={`/institutions/${bookmark.institutionId}`}>Batafsil</Link>
              </div>
              <BookmarkButton institutionId={bookmark.institutionId} initialBookmarked />
            </article>
          ))
        )}
      </section>
    </main>
  );
}
