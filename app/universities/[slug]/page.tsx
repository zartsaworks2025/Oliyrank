import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DemoNotice } from "@/components/ranking/demo-notice";
import { EditionNotice } from "@/components/ranking/edition-notice";
import { ScoreBar } from "@/components/ranking/score-bar";
import { OWNERSHIP_LABELS, PILLAR_BG, PROFILE_LABELS, STATUS_LABELS } from "@/lib/labels";
import { PILLARS, pillarWeight } from "@/lib/methodology";
import { formatRank } from "@/lib/ranking/compute";
import { getUniversityProfile, getUniversitySlugs, type IndicatorDetail } from "@/lib/ranking/data";

export async function generateStaticParams() {
  const slugs = await getUniversitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/universities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getUniversityProfile(slug);
  if (!profile) return {};
  const { university, row } = profile;
  return {
    title: university.name,
    description: row?.rank
      ? `${university.name}: OliyRank reytingida ${formatRank(row)}-oʻrin, umumiy ball ${row.total?.toFixed(1)}.`
      : `${university.name}: OliyRank profili, koʻrsatkichlar va ball tarkibi.`,
  };
}

const formatRaw = (indicator: IndicatorDetail) => {
  if (indicator.raw === null) return null;
  const digits = Math.abs(indicator.raw) < 10 ? 2 : 1;
  const value = indicator.raw.toFixed(digits).replace(/\.?0+$/, "");
  return indicator.unit === "%" ? `${value}%` : `${value} ${indicator.unit}`;
};

// The slug is URL data, so the profile streams in behind Suspense and navigation
// shows the skeleton instantly instead of blocking.
export default function UniversityPage({ params }: PageProps<"/universities/[slug]">) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UniversityProfile params={params} />
    </Suspense>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container-page pt-8 pb-24 lg:pt-12" aria-busy="true" aria-label="Yuklanmoqda">
      <div className="h-4 w-40 animate-pulse rounded bg-paper-sunk" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="h-7 w-28 animate-pulse rounded-full bg-paper-sunk" />
          <div className="h-12 w-4/5 animate-pulse rounded-lg bg-paper-sunk" />
          <div className="h-12 w-3/5 animate-pulse rounded-lg bg-paper-sunk" />
        </div>
        <div className="h-56 animate-pulse rounded-3xl bg-paper-sunk" />
      </div>
      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-paper-sunk/70" />
        ))}
      </div>
    </div>
  );
}

async function UniversityProfile({ params }: Pick<PageProps<"/universities/[slug]">, "params">) {
  const { slug } = await params;
  const profile = await getUniversityProfile(slug);
  if (!profile) notFound();

  const { university, row, rankedCount, ranking, indicators, neighbours } = profile;
  const facts = [
    university.city && { label: "Shahar", value: university.region ? `${university.city}, ${university.region}` : university.city },
    university.ownership && { label: "Mulkchilik", value: OWNERSHIP_LABELS[university.ownership] },
    { label: "Yoʻnalish", value: PROFILE_LABELS[university.profile] },
    university.foundedYear && { label: "Tashkil etilgan", value: `${university.foundedYear}` },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <div className="container-page pt-8 pb-24 lg:pt-12">
      <nav aria-label="Navigatsiya" className="text-sm text-ink-soft">
        <Link href="/rankings" className="hover:text-firuza">
          Reyting
        </Link>
        <span aria-hidden="true" className="mx-2 text-ink-faint">
          /
        </span>
        <span className="text-ink">{university.shortName ?? university.name}</span>
      </nav>

      {/* Hero */}
      <header className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div>
          <p className="inline-flex rounded-full bg-firuza-soft px-3 py-1 text-sm font-medium text-firuza-strong">
            {PROFILE_LABELS[university.profile]}
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-tight font-medium text-balance sm:text-[2.75rem]">
            {university.name}
          </h1>
          <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-xs text-ink-faint">{fact.label}</dt>
                <dd className="mt-0.5 font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
          {university.website && (
            <a
              href={university.website}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-1.5 font-medium text-firuza hover:underline"
            >
              Rasmiy sayt <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        <aside className="rounded-3xl border border-line bg-paper-raised p-6 sm:p-7">
          {row?.status === "ranked" ? (
            <>
              <p className="text-sm text-ink-soft">OliyRank reytingida</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-6xl font-medium tabular-nums">{formatRank(row)}</span>
                <span className="text-ink-faint">/ {rankedCount}</span>
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="font-serif text-2xl font-semibold tabular-nums">{row.total?.toFixed(1)}</span>
                <ScoreBar value={row.total ?? 0} />
              </div>
              <p className="mt-2 text-sm text-ink-faint">Umumiy ball, 100 dan</p>
            </>
          ) : (
            <>
              <p className="font-serif text-2xl font-medium">Reytingda emas</p>
              <p className="mt-2 text-ink-soft">{row ? STATUS_LABELS[row.status] : "Bu nashrda maʼlumot yoʻq"}.</p>
            </>
          )}
          {row && (
            <p className="mt-5 border-t border-line pt-4 text-sm text-ink-soft">
              Maʼlumotlar qamrovi: <strong className="font-semibold text-ink">{Math.round(row.coverage * 100)}%</strong>
              {ranking && <> · {ranking.period.name}</>}
            </p>
          )}
        </aside>
      </header>

      {ranking?.isDemo && <DemoNotice className="mt-8" />}
      {ranking && <EditionNotice scope={ranking.scope} className="mt-8" />}

      {/* Breakdown */}
      <section className="mt-14" aria-labelledby="breakdown-heading">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <h2 id="breakdown-heading" className="font-serif text-3xl font-medium">
            Ball tarkibi
          </h2>
          <Link href="/methodology" className="text-sm font-medium text-firuza hover:underline">
            Har bir koʻrsatkich qanday hisoblanadi →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {PILLARS.map((pillar) => {
            const score = row?.pillars[pillar.key] ?? null;
            const measured = ranking?.scope.pillarKeys.includes(pillar.key) ?? false;
            return (
              <article
                key={pillar.key}
                className={`rounded-2xl border p-6 ${measured ? "border-line bg-paper-raised" : "border-dashed border-line-strong bg-transparent"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="flex items-center gap-2 font-serif text-xl font-medium">
                      <span className={`size-2.5 rounded-full ${PILLAR_BG[pillar.key]}`} aria-hidden="true" />
                      {pillar.name}
                    </h3>
                    <p className="mt-1 text-sm text-ink-faint">Vazni {pillarWeight(pillar)}%</p>
                  </div>
                  <span className={`font-serif text-3xl font-medium tabular-nums ${score === null ? "text-ink-faint" : ""}`}>
                    {score === null ? "—" : score.toFixed(1)}
                  </span>
                </div>
                {!measured && <p className="mt-3 text-sm text-ink-soft">Bu nashrda hali oʻlchanmagan.</p>}
                {score !== null && (
                  <div className="mt-4">
                    <ScoreBar value={score} className={PILLAR_BG[pillar.key]} />
                  </div>
                )}

                <ul className="mt-5 divide-y divide-line">
                  {indicators
                    .filter((indicator) => indicator.pillar === pillar.key)
                    .map((indicator) => (
                      <li key={indicator.key} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 py-3">
                        <span className="text-[0.95rem]">
                          {indicator.name}
                          <span className="ml-1.5 text-xs text-ink-faint">{indicator.weight}%</span>
                        </span>
                        <span className={`text-right text-sm tabular-nums ${indicator.score === null ? "text-ink-faint" : "font-medium"}`}>
                          {indicator.score !== null ? indicator.score.toFixed(0) : indicator.inEdition ? "Maʼlumot yoʻq" : "—"}
                        </span>
                        {indicator.score !== null && (
                          <>
                            <span className="text-xs text-ink-faint">
                              {formatRaw(indicator)}
                              {indicator.note && <span className="block">{indicator.note}</span>}
                            </span>
                            <span className="w-24">
                              <ScoreBar value={indicator.score} className={PILLAR_BG[pillar.key]} size="sm" />
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {neighbours.length > 1 && (
        <section className="mt-14" aria-labelledby="neighbours-heading">
          <h2 id="neighbours-heading" className="font-serif text-3xl font-medium">
            Reytingda yonma-yon
          </h2>
          <ol className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised">
            {neighbours.map((neighbour) => {
              const current = neighbour.university.slug === university.slug;
              return (
                <li key={neighbour.university.slug} className={current ? "bg-firuza-soft/60" : ""}>
                  <Link
                    href={`/universities/${neighbour.university.slug}`}
                    aria-current={current ? "page" : undefined}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-sunk/50"
                  >
                    <span className="w-10 font-serif text-xl font-medium tabular-nums">{formatRank(neighbour)}</span>
                    <span className={`flex-1 ${current ? "font-semibold" : ""}`}>{neighbour.university.name}</span>
                    <span className="font-serif text-lg font-semibold tabular-nums">{neighbour.total?.toFixed(1)}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
