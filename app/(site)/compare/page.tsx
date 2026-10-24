import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageIntro } from "@/components/layout/page-intro";
import { CompareView } from "@/components/ranking/compare-view";
import { EditionNotice } from "@/components/ranking/edition-notice";
import { getCompareData } from "@/lib/ranking/data";

export const metadata: Metadata = {
  title: "Taqqoslash",
  description: "Oʻzbekiston universitetlarini yonma-yon solishtiring: reyting, ball tarkibi, qabul va ilmiy koʻrsatkichlar.",
};

export default async function ComparePage() {
  const data = await getCompareData();

  return (
    <>
      <PageIntro eyebrow="Taqqoslash" title="Universitetlarni yonma-yon solishtiring.">
        Uchtagacha universitetni tanlang. Har bir qatorda eng yaxshi qiymat ajratib koʻrsatiladi.
      </PageIntro>
      <div className="container-page py-12">
        {data ? (
          <>
            <EditionNotice scope={data.scope} className="mb-8" />
            <Suspense fallback={<div className="h-16 animate-pulse rounded-2xl bg-paper-sunk" aria-hidden="true" />}>
              <CompareView data={data} />
            </Suspense>
            <p className="mt-6 text-sm text-ink-faint">
              Qiymatlar manbasi va hisoblash usuli —{" "}
              <Link href="/methodology" className="text-firuza hover:underline">
                metodologiyada
              </Link>
              .
            </p>
          </>
        ) : (
          <p className="text-ink-soft">Reyting hali eʼlon qilinmagan.</p>
        )}
      </div>
    </>
  );
}
