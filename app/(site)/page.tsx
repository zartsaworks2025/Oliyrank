import Link from "next/link";
import { StarMark } from "@/components/brand/logo";
import { TilePattern } from "@/components/brand/tile-pattern";
import { ScoreBar } from "@/components/ranking/score-bar";
import { PILLAR_BG } from "@/lib/labels";
import { INDICATOR_COUNT, PILLARS, pillarWeight } from "@/lib/methodology";
import { formatRank } from "@/lib/ranking/compute";
import { getLatestRanking } from "@/lib/ranking/data";

const QUICK_SEARCHES = ["Toshkent", "Samarqand", "Buxoro", "Fargʻona", "Texnika", "Xorijiy filial"];

const STEPS = [
  {
    title: "Ochiq maʼlumot yigʻamiz",
    body: "OpenAlex ilmiy bazasi, qabul ballari, milliy reyting maʼlumotlari hamda tasdiqlangan talabalar va ish beruvchilar soʻrovnomalari.",
  },
  {
    title: "Oshkora formula bilan baholaymiz",
    body: `${INDICATOR_COUNT} ta koʻrsatkich, har biri 0–100 ball. Vaznlar oldindan eʼlon qilingan va hamma uchun bir xil.`,
  },
  {
    title: "Har bir ballni koʻrsatamiz",
    body: "Faqat oʻrin emas: qaysi koʻrsatkich qanchalik taʼsir qilgani va xom qiymati ham koʻrinadi.",
  },
];

const FEATURES = [
  { title: "Yonma-yon taqqoslash", body: "Ikki-uch universitetni koʻrsatkichma-koʻrsatkich solishtiring." },
  { title: "Har bir raqamning manbasi", body: "Profilda xom qiymat, 0–100 ball va maʼlumot manbasi birga koʻrsatiladi." },
  { title: "Jurnal", body: "Reyting, qabul va oliy taʼlim haqida tushunarli maqolalar." },
];

export default async function HomePage() {
  const ranking = await getLatestRanking();
  const top = ranking?.rows.filter((row) => row.status === "ranked").slice(0, 5) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <TilePattern className="pointer-events-none absolute inset-0 text-line opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]" />
        <div className="container-page relative grid items-center gap-14 pt-14 pb-20 lg:grid-cols-[1.15fr_1fr] lg:pt-24 lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-raised px-3 py-1 text-sm text-ink-soft">
              <span className="size-1.5 rounded-full bg-anor" />
              Oʻzbekiston universitetlari · 2026
            </p>

            <h1 className="mt-6 font-serif text-[2.6rem] leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]">
              Universitetni reklamaga emas,{" "}
              <em className="text-firuza italic">dalillarga</em> qarab tanlang.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft text-pretty">
              OliyRank Oʻzbekiston universitetlarini ochiq mezonlar asosida baholaydi. Har bir ball qayerdan kelganini
              koʻrasiz.
            </p>

            <form action="/rankings" className="mt-9 max-w-xl">
              <label htmlFor="hero-search" className="sr-only">
                Universitet yoki shahar boʻyicha qidirish
              </label>
              <div className="flex items-center gap-2 rounded-full border border-line-strong bg-paper-raised p-1.5 pl-5 shadow-[0_1px_0_var(--line),0_12px_32px_-18px_rgba(29,26,22,0.35)] transition-colors focus-within:border-firuza">
                <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  id="hero-search"
                  name="q"
                  type="search"
                  placeholder="Universitet yoki shahar…"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-ink-faint"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-firuza px-5 py-2.5 font-medium text-on-firuza transition-colors hover:bg-firuza-strong"
                >
                  Qidirish
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {QUICK_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/rankings?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-firuza hover:text-firuza"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <TopCard ranking={ranking} top={top} />
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-paper-raised">
        <div className="container-page py-20 lg:py-24">
          <SectionHeading
            eyebrow="Qanday ishlaydi"
            title="Reyting — bu xulosa emas, hisob-kitob."
            body="Biz qaysi universitet yaxshi ekanini aytmaymiz. Raqamlarni koʻrsatamiz va qarorni sizga qoldiramiz."
          />
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative border-t border-line-strong pt-6">
                <span className="font-serif text-5xl font-light text-oltin">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 font-serif text-xl font-medium">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-page py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow={`${PILLARS.length} ustun`} title="Nimani oʻlchaymiz va qancha vazn beramiz." />
          <Link href="/methodology" className="group inline-flex shrink-0 items-center gap-1.5 font-medium text-firuza">
            Toʻliq metodologiya
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        <div className="mt-10 flex h-3 overflow-hidden rounded-full" role="img" aria-label={PILLARS.map((p) => `${p.name} ${pillarWeight(p)}%`).join(", ")}>
          {PILLARS.map((pillar) => (
            <span key={pillar.key} className={`${PILLAR_BG[pillar.key]} border-r-2 border-paper last:border-r-0`} style={{ width: `${pillarWeight(pillar)}%` }} />
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.key}
              href={`/methodology#${pillar.key}`}
              className="group flex flex-col rounded-2xl border border-line bg-paper-raised p-6 transition-colors hover:border-line-strong"
            >
              <div className="flex items-center justify-between">
                <span className={`size-2.5 rounded-full ${PILLAR_BG[pillar.key]}`} />
                <span className="font-serif text-3xl font-medium tabular-nums">
                  {pillarWeight(pillar)}
                  <span className="text-lg text-ink-faint">%</span>
                </span>
              </div>
              <h3 className="mt-8 font-serif text-xl font-medium group-hover:text-firuza">{pillar.name}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{pillar.summary}</p>
              <p className="mt-auto pt-6 text-sm text-ink-faint">{pillar.indicators.length} ta koʻrsatkich</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-page pb-20 lg:pb-24">
        <div className="grid gap-12 rounded-3xl bg-paper-sunk p-8 sm:p-12 lg:grid-cols-[1fr_1.4fr] lg:p-16">
          <SectionHeading
            eyebrow="Abituriyentlar uchun"
            title="Tanlovni oson qiladigan vositalar."
            body="Abituriyent, ota-ona yoki magistraturaga tayyorlanayotgan boʻlsangiz ham — hammasi bir joyda."
          />
          <ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex gap-4">
                <StarMark className="mt-1 size-5 shrink-0 text-firuza" />
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink-soft">{feature.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-firuza text-on-firuza">
        <TilePattern className="pointer-events-none absolute inset-0 text-on-firuza opacity-[0.08]" />
        <div className="container-page relative flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center lg:py-20">
          <div>
            <h2 className="max-w-2xl font-serif text-3xl font-medium text-balance sm:text-4xl">
              OliyRank sinov bosqichida. Davom ettiraylikmi?
            </h2>
            <p className="mt-3 max-w-xl opacity-80">
              Taklif, tanqid yoki xato topgan boʻlsangiz — yozing. Sizning fikringiz loyihaning kelajagini hal qiladi.
            </p>
          </div>
          <Link href="/contact" className="shrink-0 rounded-full bg-paper px-6 py-3 font-medium text-ink transition-transform hover:-translate-y-0.5">
            Fikr bildirish
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold tracking-[0.14em] text-anor uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl leading-tight font-medium text-balance sm:text-[2.6rem]">{title}</h2>
      {body && <p className="mt-4 text-lg leading-relaxed text-ink-soft text-pretty">{body}</p>}
    </div>
  );
}

/** Live top five from the latest published edition, with a link to the full table. */
function TopCard({
  ranking,
  top,
}: {
  ranking: Awaited<ReturnType<typeof getLatestRanking>>;
  top: NonNullable<Awaited<ReturnType<typeof getLatestRanking>>>["rows"];
}) {
  return (
    <div className="relative min-w-0">
      <div className="absolute -inset-4 -z-10 rotate-2 rounded-[2rem] bg-oltin-soft" aria-hidden="true" />
      <figure className="rounded-3xl border border-line bg-paper-raised p-6 shadow-[0_24px_60px_-30px_rgba(29,26,22,0.45)] sm:p-8">
        <figcaption className="flex items-baseline justify-between gap-4">
          <span className="font-serif text-xl font-medium">Eng yaxshi 5 universitet</span>
          {ranking && (
            <span className={`text-xs ${ranking.isDemo ? "rounded-full bg-anor-soft px-2 py-0.5 font-medium text-anor" : "text-ink-faint"}`}>
              {ranking.isDemo ? "Namuna maʼlumot" : ranking.period.name}
            </span>
          )}
        </figcaption>

        {top.length > 0 ? (
          <ol className="mt-5 divide-y divide-line">
            {top.map((row) => (
              <li key={row.university.slug}>
                <Link href={`/universities/${row.university.slug}`} className="group flex items-center gap-4 py-3.5">
                  <span className="w-7 font-serif text-2xl font-medium tabular-nums">{formatRank(row)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium group-hover:text-firuza">{row.university.name}</span>
                    <span className="mt-1.5 block">
                      <ScoreBar value={row.total ?? 0} size="sm" />
                    </span>
                  </span>
                  <span className="w-12 text-right font-serif text-lg font-semibold tabular-nums">{row.total?.toFixed(1)}</span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-6 leading-relaxed text-ink-soft">Birinchi reyting tez orada eʼlon qilinadi.</p>
        )}

        <Link
          href="/rankings"
          className="mt-5 flex items-center justify-center gap-1.5 rounded-full border border-line-strong px-4 py-3 font-medium transition-colors hover:border-firuza hover:text-firuza"
        >
          Toʻliq reytingni koʻrish <span aria-hidden="true">→</span>
        </Link>
      </figure>
    </div>
  );
}
