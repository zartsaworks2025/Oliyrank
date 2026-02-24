import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/prisma";
import ReviewSection from "@/components/reviews/ReviewSection";
import BookmarkButton from "@/components/bookmarks/BookmarkButton";

interface InstitutionPageProps {
  params: { id: string };
}

export default async function InstitutionPage({ params }: InstitutionPageProps) {
  const institutionId = Number(params.id);
  if (Number.isNaN(institutionId)) {
    notFound();
  }

  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
  });

  if (!institution) {
    notFound();
  }

  const period = await prisma.rankingPeriod.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { endDate: "desc" },
  });

  const rankingResult = period
    ? await prisma.rankingResult.findUnique({
        where: {
          periodId_institutionId: {
            periodId: period.id,
            institutionId,
          },
        },
      })
    : null;

  const scores = period
    ? await prisma.score.findMany({
        where: { institutionId, periodId: period.id },
        include: { indicator: true },
        orderBy: { indicator: { weight: "desc" } },
      })
    : [];

  const session = await auth();
  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null;

  const bookmark = user
    ? await prisma.bookmark.findUnique({
        where: {
          userId_institutionId: {
            userId: user.id,
            institutionId,
          },
        },
      })
    : null;

  return (
    <main className="page page--institution">
      <section className="institution-hero">
        <div className="institution-hero__content">
          <span className="institution-hero__eyebrow">Muassasa profili</span>
          <h1>{institution.name}</h1>
          <p>
            {institution.city ?? ""}
            {institution.city && institution.country ? " · " : ""}
            {institution.country ?? ""}
          </p>
          <div className="institution-hero__meta">
            {institution.website && (
              <a href={institution.website} target="_blank" rel="noreferrer">
                Rasmiy sayt
              </a>
            )}
            <Link href="/rankings">Reytinglarga qaytish</Link>
          </div>
        </div>

        <div className="institution-hero__actions">
          {session?.user ? (
            <BookmarkButton
              institutionId={institutionId}
              initialBookmarked={Boolean(bookmark)}
            />
          ) : (
            <Link className="bookmark-btn" href="/signin">
              Saqlash uchun kiring
            </Link>
          )}
        </div>
      </section>

      <section className="institution-summary">
        <div className="summary-card">
          <span className="summary-card__label">Reyting davri</span>
          <span className="summary-card__value">
            {period ? period.name : "Ma'lumot yo'q"}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">Umumiy ball</span>
          <span className="summary-card__value">
            {rankingResult ? rankingResult.totalScore.toFixed(1) : "—"}
          </span>
        </div>
        <div className="summary-card">
          <span className="summary-card__label">Reyting o&apos;rni</span>
          <span className="summary-card__value">
            {rankingResult ? `#${rankingResult.rank}` : "—"}
          </span>
        </div>
      </section>

      <section className="institution-details">
        <div className="institution-details__card">
          <h2>Ko&apos;rsatkichlar</h2>
          {scores.length > 0 ? (
            <ul className="indicator-list">
              {scores.map((score) => (
                <li key={score.id}>
                  <span>{score.indicator.name}</span>
                  <span>{score.value.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">Ko&apos;rsatkichlar hali yuklanmagan.</p>
          )}
        </div>

        <div className="institution-details__card">
          <h2>Qisqacha ma&apos;lumot</h2>
          <p>
            {institution.description ??
              "Muassasa haqida qisqacha ma'lumot keyinchalik qo'shiladi."}
          </p>
        </div>
      </section>

      <ReviewSection institutionId={institutionId} canReview={Boolean(session?.user)} />
    </main>
  );
}
