"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { OWNERSHIP_LABELS, PILLAR_BG, PROFILE_LABELS, STATUS_LABELS, type OwnershipKey, type ProfileKey } from "@/lib/labels";
import { INDICATOR_COUNT, PILLARS, pillarWeight, type PillarDef, type PillarKey } from "@/lib/methodology";
import { formatRank } from "@/lib/ranking/compute";
import type { RankingRow } from "@/lib/ranking/data";
import { normalizeSearch as normalize } from "@/lib/search";
import { ScoreBar } from "./score-bar";

type SortKey = "rank" | "name" | PillarKey;

const OWNERSHIP_FILTERS: { value: "all" | OwnershipKey; label: string }[] = [
  { value: "all", label: "Barchasi" },
  { value: "STATE", label: OWNERSHIP_LABELS.STATE },
  { value: "PRIVATE", label: OWNERSHIP_LABELS.PRIVATE },
  { value: "INTERNATIONAL_BRANCH", label: OWNERSHIP_LABELS.INTERNATIONAL_BRANCH },
];

const fmt = (value: number | null) => (value === null ? "—" : value.toFixed(1));

export function RankingsExplorer({ rows, pillarKeys }: { rows: RankingRow[]; pillarKeys: PillarKey[] }) {
  // Only the pillars this edition measures get columns.
  const pillars = PILLARS.filter((pillar) => pillarKeys.includes(pillar.key));
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [city, setCity] = useState("all");
  const [profile, setProfile] = useState<"all" | ProfileKey>("all");
  const [ownership, setOwnership] = useState<"all" | OwnershipKey>("all");
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "rank", desc: false });
  const [expanded, setExpanded] = useState<string | null>(null);

  const cities = useMemo(
    // Plain code-point sort: locale collation differs between Node and browsers, which
    // would make the server and client render the options in different orders.
    () => [...new Set(rows.map((row) => row.university.city).filter((c): c is string => Boolean(c)))].sort(),
    [rows],
  );
  const profiles = useMemo(() => [...new Set(rows.map((row) => row.university.profile))], [rows]);

  const visible = useMemo(() => {
    const needle = normalize(query.trim());
    const filtered = rows.filter((row) => {
      const { name, shortName, city: rowCity, region } = row.university;
      const matchesQuery =
        !needle || [name, shortName, rowCity, region].some((field) => field && normalize(field).includes(needle));
      return (
        matchesQuery &&
        (city === "all" || rowCity === city) &&
        (profile === "all" || row.university.profile === profile) &&
        (ownership === "all" || row.university.ownership === ownership)
      );
    });

    // Unranked universities always sit below ranked ones, whatever the sort.
    const direction = sort.desc ? -1 : 1;
    const rankOrder = (row: RankingRow) => row.rank ?? Number.MAX_SAFE_INTEGER;
    return [...filtered].sort((a, b) => {
      const rankedFirst = Number(b.status === "ranked") - Number(a.status === "ranked");
      if (rankedFirst) return rankedFirst;
      if (sort.key === "rank") return (rankOrder(a) - rankOrder(b)) * direction;
      if (sort.key === "name") return a.university.name.localeCompare(b.university.name, "uz") * direction;
      return ((a.pillars[sort.key] ?? -1) - (b.pillars[sort.key] ?? -1)) * direction;
    });
  }, [rows, query, city, profile, ownership, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key ? { key, desc: !current.desc } : { key, desc: key !== "rank" && key !== "name" },
    );

  const resetFilters = () => {
    setQuery("");
    setCity("all");
    setProfile("all");
    setOwnership("all");
  };

  const filtersActive = query !== "" || city !== "all" || profile !== "all" || ownership !== "all";
  const firstUnranked = visible.findIndex((row) => row.status !== "ranked");

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Universitet nomi yoki shahar</span>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Universitet nomi yoki shahar…"
            className="w-full rounded-full border border-line-strong bg-paper-raised py-3 pr-4 pl-12 outline-none transition-colors placeholder:text-ink-faint focus:border-firuza"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <Select label="Shahar" value={city} onChange={setCity}>
            <option value="all">Barcha shaharlar</option>
            {cities.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>

          <Select label="Yoʻnalish" value={profile} onChange={(value) => setProfile(value as "all" | ProfileKey)}>
            <option value="all">Barcha yoʻnalishlar</option>
            {profiles.map((key) => (
              <option key={key} value={key}>
                {PROFILE_LABELS[key]}
              </option>
            ))}
          </Select>

          <div role="radiogroup" aria-label="Mulkchilik shakli" className="flex max-w-full overflow-x-auto rounded-full border border-line-strong bg-paper-raised p-1">
            {OWNERSHIP_FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={ownership === option.value}
                onClick={() => setOwnership(option.value)}
                className={`rounded-full px-3.5 py-2 text-sm whitespace-nowrap transition-colors ${
                  ownership === option.value ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-ink-soft" aria-live="polite">
        <p>
          {filtersActive ? (
            <>
              <strong className="font-semibold text-ink">{visible.length}</strong> ta natija · jami {rows.length}
            </>
          ) : (
            <>
              <strong className="font-semibold text-ink">{rows.length}</strong> ta universitet
            </>
          )}
        </p>
        {filtersActive && (
          <button type="button" onClick={resetFilters} className="font-medium text-firuza hover:underline">
            Filtrlarni tozalash
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="font-serif text-2xl">Hech narsa topilmadi</p>
          <p className="mt-2 text-ink-soft">Boshqa nom, shahar yoki yoʻnalishni sinab koʻring.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-4 hidden overflow-hidden rounded-2xl border border-line bg-paper-raised lg:block">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-line bg-paper-sunk/60 text-xs tracking-wide text-ink-soft uppercase">
                <tr>
                  <SortHeader label="Oʻrin" sortKey="rank" sort={sort} onSort={toggleSort} className="w-20 pl-6" />
                  <SortHeader label="Universitet" sortKey="name" sort={sort} onSort={toggleSort} />
                  <SortHeader label="Umumiy" sortKey="rank" sort={sort} onSort={toggleSort} className="w-40" />
                  {pillars.map((pillar) => (
                    <SortHeader
                      key={pillar.key}
                      label={pillar.short}
                      hint={`${pillar.name} — ${pillarWeight(pillar)}%. ${pillar.summary}`}
                      sortKey={pillar.key}
                      sort={sort}
                      onSort={toggleSort}
                      className="w-24"
                      dot={PILLAR_BG[pillar.key]}
                    />
                  ))}
                  <th className="w-14 pr-4">
                    <span className="sr-only">Batafsil</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row, index) => {
                  const isOpen = expanded === row.university.slug;
                  const muted = row.status !== "ranked";
                  return (
                    <Fragment key={row.university.slug}>
                      {index === firstUnranked && <UnrankedDivider colSpan={pillars.length + 4} />}
                      <tr className={`border-b border-line transition-colors last:border-b-0 ${isOpen ? "bg-paper-sunk/50" : "hover:bg-paper-sunk/40"}`}>
                        <td className="py-5 pl-6 align-middle font-serif text-2xl font-medium tabular-nums">
                          {muted ? <span className="text-ink-faint">—</span> : formatRank(row)}
                        </td>
                        <td className="py-5 pr-6">
                          <Link href={`/universities/${row.university.slug}`} className="font-medium leading-snug decoration-firuza decoration-2 underline-offset-4 hover:underline">
                            {row.university.name}
                          </Link>
                          <UniversityMeta row={row} />
                        </td>
                        <td className="py-5 pr-6">
                          {muted ? (
                            <span className="text-sm text-ink-faint">{STATUS_LABELS[row.status]}</span>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="w-11 font-serif text-xl font-semibold tabular-nums">{fmt(row.total)}</span>
                              <ScoreBar value={row.total ?? 0} />
                            </div>
                          )}
                        </td>
                        {pillars.map((pillar) => (
                          <td
                            key={pillar.key}
                            className={`py-5 pr-4 tabular-nums ${row.pillars[pillar.key] === null ? "text-ink-faint" : sort.key === pillar.key ? "font-semibold text-ink" : "text-ink-soft"}`}
                          >
                            {fmt(row.pillars[pillar.key])}
                          </td>
                        ))}
                        <td className="py-5 pr-4 text-right">
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : row.university.slug)}
                            aria-expanded={isOpen}
                            aria-label={`${row.university.name}: ball tarkibi`}
                            className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper-sunk hover:text-ink"
                          >
                            <svg viewBox="0 0 24 24" className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="border-b border-line bg-paper-sunk/50">
                          <td />
                          <td colSpan={pillars.length + 3} className="pr-6 pb-6">
                            <Breakdown row={row} pillars={pillars} />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ol className="mt-4 space-y-3 lg:hidden">
            {visible.map((row, index) => (
              <Fragment key={row.university.slug}>
                {index === firstUnranked && (
                  <li className="px-1 pt-4 pb-1 text-sm font-medium text-ink-soft">Reytingga kiritilmaganlar</li>
                )}
                <li className="rounded-2xl border border-line bg-paper-raised p-5">
                  <div className="flex items-start gap-4">
                    <span className={`min-w-10 font-serif text-3xl leading-none font-medium tabular-nums ${row.status !== "ranked" ? "text-ink-faint" : ""}`}>
                      {formatRank(row)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link href={`/universities/${row.university.slug}`} className="font-medium leading-snug">
                        {row.university.name}
                      </Link>
                      <UniversityMeta row={row} />
                    </div>
                    {row.status === "ranked" && (
                      <div className="text-right">
                        <p className="font-serif text-2xl leading-none font-semibold tabular-nums">{fmt(row.total)}</p>
                        <p className="mt-1 text-xs text-ink-faint">ball</p>
                      </div>
                    )}
                  </div>
                  {row.status !== "ranked" && <p className="mt-3 text-sm text-ink-faint">{STATUS_LABELS[row.status]}</p>}
                  <div className="mt-5">
                    <Breakdown row={row} pillars={pillars} compact />
                  </div>
                </li>
              </Fragment>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-full border border-line-strong bg-paper-raised py-3 pr-10 pl-4 outline-none transition-colors focus:border-firuza"
      >
        {children}
      </select>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-faint" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}

function UnrankedDivider({ colSpan }: { colSpan: number }) {
  return (
    <tr className="border-b border-line bg-paper-sunk/70">
      <td colSpan={colSpan} className="px-6 py-3 text-sm text-ink-soft">
        <span className="font-medium text-ink">Reytingga kiritilmaganlar.</span> Maʼlumot yetarli emas (70% dan kam) yoki
        bu turdagi muassasalar hozircha baholanmaydi.{" "}
        <Link href="/methodology#missing-data" className="text-firuza hover:underline">
          Nega?
        </Link>
      </td>
    </tr>
  );
}

function UniversityMeta({ row }: { row: RankingRow }) {
  const { shortName, city, ownership, profile } = row.university;
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
      {shortName && <span className="font-medium text-ink-faint">{shortName}</span>}
      {shortName && city && <span aria-hidden="true">·</span>}
      {city && <span>{city}</span>}
      <span className="rounded-full border border-line px-2 py-0.5 text-xs">{PROFILE_LABELS[profile]}</span>
      {ownership && ownership !== "STATE" && (
        <span className="rounded-full bg-lojuvard-soft px-2 py-0.5 text-xs text-lojuvard">{OWNERSHIP_LABELS[ownership]}</span>
      )}
    </p>
  );
}

function Breakdown({ row, pillars, compact = false }: { row: RankingRow; pillars: PillarDef[]; compact?: boolean }) {
  return (
    <div
      className={compact ? "grid grid-cols-2 gap-x-5 gap-y-3" : "grid gap-6 pt-1"}
      style={compact ? undefined : { gridTemplateColumns: `repeat(${Math.max(pillars.length, 2)}, minmax(0, 1fr))` }}
    >
      {pillars.map((pillar) => {
        const value = row.pillars[pillar.key];
        return (
          <div key={pillar.key}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
              <span className="truncate text-ink-soft">{compact ? pillar.short : pillar.name}</span>
              <span className={`font-medium tabular-nums ${value === null ? "text-ink-faint" : ""}`}>{fmt(value)}</span>
            </div>
            {value === null ? (
              <p className="text-xs text-ink-faint">Maʼlumot yoʻq</p>
            ) : (
              <ScoreBar value={value} className={PILLAR_BG[pillar.key]} size="sm" />
            )}
          </div>
        );
      })}
      {!compact && (
        <Link href={`/universities/${row.university.slug}`} className="col-span-full inline-flex items-center gap-1.5 text-sm font-medium text-firuza hover:underline">
          Toʻliq profil va barcha {INDICATOR_COUNT} koʻrsatkich <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

function SortHeader({
  label,
  hint,
  sortKey,
  sort,
  onSort,
  className = "",
  dot,
}: {
  label: string;
  hint?: string;
  sortKey: SortKey;
  sort: { key: SortKey; desc: boolean };
  onSort: (key: SortKey) => void;
  className?: string;
  dot?: string;
}) {
  const active = sort.key === sortKey;
  return (
    <th
      scope="col"
      aria-sort={active ? (sort.desc ? "descending" : "ascending") : "none"}
      className={`py-3.5 pr-4 font-medium ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        title={hint}
        className={`inline-flex items-start gap-1.5 text-left uppercase transition-colors hover:text-ink ${active ? "text-ink" : ""}`}
      >
        {dot && <span className={`mt-1 size-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />}
        <span className="leading-tight">{label}</span>
        <span aria-hidden="true" className={`text-[0.7rem] ${active ? "opacity-100" : "opacity-30"}`}>
          {active && sort.desc ? "↓" : "↑"}
        </span>
      </button>
    </th>
  );
}
