"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OWNERSHIP_LABELS, PILLAR_BG, PROFILE_LABELS, STATUS_LABELS } from "@/lib/labels";
import { PILLARS } from "@/lib/methodology";
import { formatRank } from "@/lib/ranking/compute";
import type { CompareData, RankingRow } from "@/lib/ranking/data";
import { ScoreBar } from "./score-bar";

const MAX = 3;

const formatRaw = (raw: number | null, unit: string) => {
  if (raw === null) return "—";
  const value = raw.toFixed(Math.abs(raw) < 10 ? 2 : 1).replace(/\.?0+$/, "");
  return unit === "%" ? `${value}%` : value;
};

export function CompareView({ data }: { data: CompareData }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const bySlug = new Map(data.rows.map((row) => [row.university.slug, row]));
  const selected = (params.get("u") ?? "")
    .split(",")
    .filter((slug) => bySlug.has(slug))
    .slice(0, MAX);
  const rows = selected.map((slug) => bySlug.get(slug)!);

  const setSelected = (slugs: string[]) => {
    const query = slugs.length ? `?u=${slugs.join(",")}` : "";
    router.replace(`${pathname}${query}`, { scroll: false });
  };

  // Code-point order: locale collation differs between Node and browsers (hydration mismatch).
  const options = [...data.rows].sort((a, b) => (a.university.name < b.university.name ? -1 : 1));
  const pillars = PILLARS.filter((pillar) => data.scope.pillarKeys.includes(pillar.key));
  const indicators = PILLARS.flatMap((pillar) => pillar.indicators.filter((i) => data.scope.indicatorKeys.includes(i.key)));

  /** Highlights the best numeric value in a row (highest unless lowerIsBetter). */
  const best = (values: (number | null)[], lowerIsBetter = false) => {
    const numbers = values.filter((v): v is number => v !== null);
    if (numbers.length < 2) return null;
    return lowerIsBetter ? Math.min(...numbers) : Math.max(...numbers);
  };

  return (
    <div>
      {/* Pickers */}
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: MAX }, (_, i) => {
          const current = selected[i] ?? "";
          return (
            <label key={i} className="relative block">
              <span className="sr-only">{i + 1}-universitet</span>
              <select
                value={current}
                onChange={(event) => {
                  const next = [...selected];
                  if (event.target.value) next[i] = event.target.value;
                  else next.splice(i, 1);
                  setSelected([...new Set(next.filter(Boolean))]);
                }}
                disabled={i > selected.length}
                className="w-full appearance-none rounded-2xl border border-line-strong bg-paper-raised py-3.5 pr-10 pl-4 outline-none transition-colors focus:border-firuza disabled:opacity-50"
              >
                <option value="">{i === 0 ? "Universitet tanlang…" : "+ Yana birini qoʻshish"}</option>
                {options.map((row) => (
                  <option key={row.university.slug} value={row.university.slug} disabled={selected.includes(row.university.slug) && row.university.slug !== current}>
                    {row.university.name}
                  </option>
                ))}
              </select>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </label>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="font-serif text-2xl">Solishtirish uchun universitet tanlang</p>
          <p className="mt-2 text-ink-soft">Ikki yoki uchta universitetni yonma-yon koʻrish mumkin.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-paper-raised">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="w-56 p-5" />
                {rows.map((row) => (
                  <th key={row.university.slug} className="p-5 align-top font-normal">
                    <Link href={`/universities/${row.university.slug}`} className="font-serif text-lg leading-snug font-medium hover:text-firuza">
                      {row.university.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelected(selected.filter((slug) => slug !== row.university.slug))}
                      className="mt-2 block text-sm text-ink-faint hover:text-anor"
                    >
                      Olib tashlash
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_td]:p-5 [&_th]:p-5 [&_tr]:border-b [&_tr]:border-line [&_tr:last-child]:border-b-0">
              <Row label="Oʻrin" rows={rows} render={(row) => (
                <span className="font-serif text-3xl font-medium">{row.status === "ranked" ? formatRank(row) : "—"}</span>
              )} />
              <Row label="Umumiy ball" rows={rows} render={(row) => row.total !== null && row.status === "ranked" ? (
                <Score value={row.total} highlight={row.total === best(rows.map((r) => (r.status === "ranked" ? r.total : null)))} />
              ) : (
                <span className="text-sm text-ink-faint">{STATUS_LABELS[row.status]}</span>
              )} />
              {pillars.map((pillar) => (
                <Row key={pillar.key} label={pillar.name} dot={PILLAR_BG[pillar.key]} rows={rows} render={(row) => {
                  const value = row.pillars[pillar.key];
                  return value === null ? <span className="text-ink-faint">—</span> : (
                    <Score value={value} bar={PILLAR_BG[pillar.key]} highlight={value === best(rows.map((r) => r.pillars[pillar.key]))} />
                  );
                }} />
              ))}
              {indicators.map((indicator) => {
                const values = rows.map((row) => data.indicators[row.university.slug]?.find((i) => i.key === indicator.key)?.raw ?? null);
                const top = best(values, indicator.lowerIsBetter);
                return (
                  <Row key={indicator.key} label={indicator.name} sub={indicator.unit} rows={rows} render={(_, i) => (
                    <span className={`tabular-nums ${values[i] !== null && values[i] === top ? "font-semibold text-firuza" : ""}`}>
                      {formatRaw(values[i], indicator.unit)}
                    </span>
                  )} />
                );
              })}
              <Row label="Shahar" rows={rows} render={(row) => row.university.city ?? row.university.region ?? "—"} />
              <Row label="Mulkchilik" rows={rows} render={(row) => (row.university.ownership ? OWNERSHIP_LABELS[row.university.ownership] : "—")} />
              <Row label="Yoʻnalish" rows={rows} render={(row) => PROFILE_LABELS[row.university.profile]} />
              <Row label="Tashkil etilgan" rows={rows} render={(row) => row.university.foundedYear ?? "—"} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  sub,
  dot,
  rows,
  render,
}: {
  label: string;
  sub?: string;
  dot?: string;
  rows: RankingRow[];
  render: (row: RankingRow, index: number) => React.ReactNode;
}) {
  return (
    <tr>
      <th scope="row" className="align-top text-sm font-medium text-ink-soft">
        <span className="flex items-center gap-2">
          {dot && <span className={`size-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />}
          {label}
        </span>
        {sub && <span className="mt-0.5 block text-xs font-normal text-ink-faint">{sub}</span>}
      </th>
      {rows.map((row, i) => (
        <td key={row.university.slug} className="align-top">
          {render(row, i)}
        </td>
      ))}
    </tr>
  );
}

function Score({ value, bar = "bg-firuza", highlight }: { value: number; bar?: string; highlight: boolean }) {
  return (
    <div className="max-w-48">
      <span className={`font-serif text-xl tabular-nums ${highlight ? "font-semibold text-firuza" : "font-medium"}`}>{value.toFixed(1)}</span>
      <div className="mt-1.5">
        <ScoreBar value={value} className={bar} size="sm" />
      </div>
    </div>
  );
}
