import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DemoNotice } from "@/components/ranking/demo-notice";
import { EditionNotice } from "@/components/ranking/edition-notice";
import { RankingsExplorer } from "@/components/ranking/rankings-explorer";
import { PILLAR_BG } from "@/lib/labels";
import { METHODOLOGY_VERSION, PILLARS } from "@/lib/methodology";
import { getLatestRanking } from "@/lib/ranking/data";

export const metadata: Metadata = {
  title: "Universitetlar reytingi",
  description: "Oʻzbekiston universitetlarining ochiq metodologiya asosidagi reytingi: taʼlim, ilmiy faoliyat, bitiruvchilar natijasi va boshqalar.",
};

export default async function RankingsPage() {
  const ranking = await getLatestRanking();

  if (!ranking) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="font-serif text-4xl font-medium">Reyting tez orada eʼlon qilinadi</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">
          Birinchi nashr uchun maʼlumotlar yigʻilmoqda.{" "}
          <Link href="/methodology" className="text-firuza hover:underline">
            Metodologiya bilan tanishing.
          </Link>
        </p>
      </section>
    );
  }

  const ranked = ranking.rows.filter((row) => row.status === "ranked");
  const leader = ranked[0];
  const regions = new Set(ranking.rows.map((row) => row.university.region).filter(Boolean)).size;
  const pillars = PILLARS.filter((pillar) => ranking.scope.pillarKeys.includes(pillar.key));
  // Weight each pillar actually carries in this edition, as a share of the edition's total.
  const editionWeight = (pillar: (typeof PILLARS)[number]) =>
    pillar.indicators.filter((i) => ranking.scope.indicatorKeys.includes(i.key)).reduce((sum, i) => sum + i.weight, 0);
  const editionTotal = pillars.reduce((sum, pillar) => sum + editionWeight(pillar), 0);

  return (
    <div className="container-page pt-10 pb-24 lg:pt-14">
      <header className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold tracking-[0.14em] text-anor uppercase">Reyting · {ranking.period.year}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight font-medium text-balance sm:text-5xl">
            Oʻzbekiston universitetlari reytingi
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
            {ranking.rows.length} ta universitet roʻyxatda, {ranked.length} tasi baholandi. Ustun nomini bosib
            saralang, qatorni ochib ball tarkibini koʻring.
          </p>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-paper-raised">
          <Stat label="Baholandi" value={`${ranked.length}`} />
          <Stat label="Hudud" value={`${regions}`} />
          <Stat label="Metodologiya" value={`v${METHODOLOGY_VERSION}`} href="/methodology" />
        </dl>
      </header>

      {ranking.isDemo && <DemoNotice className="mt-8" />}
      <EditionNotice scope={ranking.scope} className="mt-8" />

      {/* Pillar legend: what each column means and how much it weighs */}
      <section aria-label="Ustunlar" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-y border-line py-4 text-sm">
        {pillars.map((pillar) => (
          <span key={pillar.key} className="inline-flex items-center gap-2" title={pillar.summary}>
            <span className={`size-2.5 rounded-full ${PILLAR_BG[pillar.key]}`} aria-hidden="true" />
            <span>{pillar.name}</span>
            <span className="font-medium tabular-nums text-ink-faint">{Math.round((100 * editionWeight(pillar)) / editionTotal)}%</span>
          </span>
        ))}
        {leader && (
          <span className="ml-auto text-ink-soft">
            Birinchi oʻrin:{" "}
            <Link href={`/universities/${leader.university.slug}`} className="font-medium text-ink hover:text-firuza">
              {leader.university.shortName ?? leader.university.name}
            </Link>
          </span>
        )}
      </section>

      <div className="mt-8">
        <Suspense fallback={<ExplorerFallback />}>
          <RankingsExplorer rows={ranking.rows} pillarKeys={ranking.scope.pillarKeys} />
        </Suspense>
      </div>

      <p className="mt-8 text-sm leading-relaxed text-ink-faint">
        Nashr: {ranking.period.name}. OliyRank mustaqil loyiha, rasmiy reyting emas.{" "}
        <Link href="/terms#disclaimer" className="text-firuza hover:underline">
          Disclaimer
        </Link>
        . Ballar 0–100 oraligʻida: 100 — shu koʻrsatkich boʻyicha eng kuchli universitetlar
        darajasi. Teng ballar bir xil oʻrinni egallaydi (masalan, “=5”).{" "}
        <Link href="/methodology" className="text-firuza hover:underline">
          Qanday hisoblanadi →
        </Link>
      </p>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="px-5 py-4">
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-1 font-serif text-2xl font-medium tabular-nums">
        {href ? (
          <Link href={href} className="decoration-firuza decoration-2 underline-offset-4 hover:text-firuza hover:underline">
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function ExplorerFallback() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="h-12 animate-pulse rounded-full bg-paper-sunk" />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-paper-sunk/70" />
      ))}
    </div>
  );
}
