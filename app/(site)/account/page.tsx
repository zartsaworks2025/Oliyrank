import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookmarkButton, DeleteAccountForm } from "@/components/auth/account-forms";
import { signOut } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { PROFILE_LABELS } from "@/lib/labels";

export const metadata: Metadata = { title: "Mening sahifam", robots: { index: false } };

export default function AccountPage() {
  return (
    <section className="container-page py-12 lg:py-16">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-paper-sunk" aria-hidden="true" />}>
        <Account />
      </Suspense>
    </section>
  );
}

async function Account() {
  const user = await requireUser("/account");
  const [profile, bookmarks] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { id: user.id }, select: { createdAt: true, consentAt: true } }),
    db.bookmark.findMany({
      where: { userId: user.id, university: { status: "ACTIVE" } },
      include: { university: { select: { id: true, slug: true, name: true, city: true, profile: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const date = (d: Date) => d.toISOString().slice(0, 10);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <p className="text-sm font-semibold tracking-[0.14em] text-anor uppercase">Mening sahifam</p>
        <h1 className="mt-3 font-serif text-4xl font-medium">Salom, {user.name ?? "doʻstim"}!</h1>

        <h2 className="mt-12 font-serif text-2xl font-medium">Saqlangan universitetlar</h2>
        {bookmarks.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line-strong p-8 text-center">
            <p className="text-ink-soft">Hali hech narsa saqlanmagan.</p>
            <Link href="/rankings" className="mt-3 inline-block font-medium text-firuza hover:underline">
              Reytingdan universitet tanlang →
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
              {bookmarks.map(({ university }) => (
                <li key={university.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <Link href={`/universities/${university.slug}`} className="font-medium hover:text-firuza">
                      {university.name}
                    </Link>
                    <p className="text-sm text-ink-soft">
                      {[university.city, PROFILE_LABELS[university.profile]].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <BookmarkButton universityId={university.id} initialSaved signedIn returnTo="/account" compact />
                </li>
              ))}
            </ul>
            {bookmarks.length >= 2 && (
              <Link
                href={`/compare?u=${bookmarks.slice(0, 3).map((b) => b.university.slug).join(",")}`}
                className="mt-4 inline-flex rounded-full bg-ink px-5 py-2.5 font-medium text-paper hover:bg-firuza"
              >
                Saqlanganlarni taqqoslash
              </Link>
            )}
          </>
        )}
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-line bg-paper-raised p-6">
          <h2 className="font-serif text-xl font-medium">Hisob</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-ink-faint">Email</dt>
              <dd className="font-medium break-all">{user.email}</dd>
            </div>
            <div>
              <dt className="text-ink-faint">Roʻyxatdan oʻtgan</dt>
              <dd className="font-medium">{date(profile.createdAt)}</dd>
            </div>
            {profile.consentAt && (
              <div>
                <dt className="text-ink-faint">Maʼlumotlarni qayta ishlashga rozilik</dt>
                <dd className="font-medium">{date(profile.consentAt)}</dd>
              </div>
            )}
          </dl>
          <form action={signOut} className="mt-6">
            <button type="submit" className="w-full rounded-full border border-line-strong px-5 py-2.5 font-medium hover:border-firuza hover:text-firuza">
              Chiqish
            </button>
          </form>
        </div>
        <div className="rounded-2xl border border-line bg-paper-raised p-6">
          <h2 className="font-serif text-xl font-medium">Maʼlumotlaringiz</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Biz faqat ismingiz, emailingiz va saqlangan universitetlaringizni saqlaymiz.{" "}
            <Link href="/privacy" className="text-firuza hover:underline">
              Maxfiylik siyosati
            </Link>
          </p>
          <div className="mt-4">
            <DeleteAccountForm />
          </div>
        </div>
      </aside>
    </div>
  );
}
