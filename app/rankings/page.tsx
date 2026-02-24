"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type InstitutionType = "UNIVERSITY" | "LEARNING_CENTER";

type ApiInstitution = {
  id: number;
  name: string;
  type: InstitutionType;
  city: string | null;
  country: string | null;
};

type ApiResult = {
  rank: number;
  totalScore: number;
  institution: ApiInstitution;
};

type ApiPeriod = {
  id: number;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  status: string;
};

type ApiResponse = {
  period: ApiPeriod | null;
  results: ApiResult[];
};

type RankingItem = {
  rank: number;
  name: string;
  city: string;
  score: number;
  type: string;
  institutionId: number;
  category: "unis" | "centers";
};

const sortOptions = [
  { value: "score-desc", label: "Ball: yuqoridan pastga" },
  { value: "score-asc", label: "Ball: pastdan yuqoriga" },
  { value: "name-asc", label: "Nomi: A-Z" },
  { value: "name-desc", label: "Nomi: Z-A" },
];

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 10);
};

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<"unis" | "centers">("unis");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score-desc");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [period, setPeriod] = useState<ApiPeriod | null>(null);
  const [rawResults, setRawResults] = useState<ApiResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/rankings", { cache: "no-store" });
        const data = (await response.json()) as ApiResponse;
        setPeriod(data.period);
        setRawResults(data.results ?? []);
      } catch {
        setPeriod(null);
        setRawResults([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchRankings();
  }, []);

  const items = useMemo<RankingItem[]>(() => {
    return rawResults.map((item) => {
      const category =
        item.institution.type === "UNIVERSITY" ? "unis" : "centers";
      const label =
        item.institution.type === "UNIVERSITY"
          ? "Universitet"
          : "O'quv markazi";

      return {
        rank: item.rank,
        name: item.institution.name,
        city: item.institution.city ?? "—",
        score: item.totalScore,
        type: label,
        institutionId: item.institution.id,
        category,
      };
    });
  }, [rawResults]);

  const data = useMemo(() => {
    return items.filter((item) => item.category === activeTab);
  }, [items, activeTab]);

  const cities = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.city))).filter(
      (city) => city !== "—"
    );
  }, [data]);

  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return data.filter((item) => {
      const matchesQuery = query
        ? [item.name, item.city, item.type].some((value) =>
            value.toLowerCase().includes(query)
          )
        : true;
      const matchesCity = cityFilter === "all" || item.city === cityFilter;

      return matchesQuery && matchesCity;
    });
  }, [data, searchTerm, cityFilter]);

  const sortedData = useMemo(() => {
    const itemsToSort = [...filteredData];

    switch (sortBy) {
      case "score-asc":
        return itemsToSort.sort((a, b) => a.score - b.score);
      case "name-asc":
        return itemsToSort.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return itemsToSort.sort((a, b) => b.name.localeCompare(a.name));
      case "score-desc":
      default:
        return itemsToSort.sort((a, b) => b.score - a.score);
    }
  }, [filteredData, sortBy]);

  const totalCount = data.length;
  const resultsCount = sortedData.length;
  const hasFilters =
    searchTerm.trim().length > 0 ||
    cityFilter !== "all" ||
    sortBy !== "score-desc";

  const clearFilters = () => {
    setSearchTerm("");
    setCityFilter("all");
    setSortBy("score-desc");
  };

  const handleTabChange = (tab: "unis" | "centers") => {
    setActiveTab(tab);
    setCityFilter("all");
  };

  const universityCount = items.filter((item) => item.category === "unis").length;
  const centerCount = items.filter((item) => item.category === "centers").length;
  const cityCount = new Set(
    items.map((item) => item.city).filter((city) => city !== "—")
  ).size;

  return (
    <main className="page page--rankings">
      <div className="page__bg-glow" />

      <section className="rankings-hero">
        <div className="rankings-hero__content">
          <div className="rankings-hero__text">
            <span className="rankings-hero__eyebrow">
              {period?.name ?? "Reyting natijalari"}
            </span>
            <h1>OliyRank reytinglari</h1>
            <p>
              OliyRank universitetlar va o&apos;quv markazlarini bir xil mezonlar asosida
              solishtiradi. Ballar 4 ta asosiy blok va 18 ta indikator bo&apos;yicha
              hisoblanadi.
            </p>
            <div className="rankings-hero__meta">
              <span>Ochiq metodologiya</span>
              <span>Oxirgi yangilanish: {formatDate(period?.endDate)}</span>
              <span>Manbalar: rasmiy hisobotlar</span>
            </div>
          </div>

          <div className="rankings-hero__stats">
            <div className="stat-pill">
              <span className="stat-pill__label">Universitetlar</span>
              <span className="stat-pill__val">{universityCount}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">O&apos;quv markazlari</span>
              <span className="stat-pill__val">{centerCount}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">Shaharlar</span>
              <span className="stat-pill__val">{cityCount}</span>
            </div>
          </div>
        </div>

        <div className="rankings-hero__summary">
          <div className="summary-card">
            <span className="summary-card__label">Metodologiya</span>
            <span className="summary-card__value">
              Akademik sifat, infratuzilma, ishga joylashish, talaba tajribasi.
            </span>
          </div>
          <div className="summary-card">
            <span className="summary-card__label">Tekshiruv</span>
            <span className="summary-card__value">
              Har bir ko&apos;rsatkich bir nechta manba bilan solishtiriladi.
            </span>
          </div>
          <div className="summary-card">
            <span className="summary-card__label">Ochiklik</span>
            <span className="summary-card__value">
              Hisobotlar PDF va jadval ko&apos;rinishida taqdim etiladi.
            </span>
          </div>
        </div>

        <div className="rankings-controls">
          <div className="rankings-controls__left">
            <div className="rank-tabs">
              <button
                type="button"
                onClick={() => handleTabChange("unis")}
                aria-pressed={activeTab === "unis"}
                className={`rank-tab ${activeTab === "unis" ? "rank-tab--active" : ""}`}
              >
                Universitetlar
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("centers")}
                aria-pressed={activeTab === "centers"}
                className={`rank-tab ${activeTab === "centers" ? "rank-tab--active" : ""}`}
              >
                O&apos;quv markazlari
              </button>
            </div>

            <div className="rankings-controls__meta">
              <span>{resultsCount} ta natija</span>
              <span className="rankings-controls__dot" />
              <span>{totalCount} ta muassasa</span>
            </div>
          </div>

          <div className="rankings-controls__right">
            <div className="rank-filter">
              <label htmlFor="rank-search">Qidiruv</label>
              <input
                id="rank-search"
                type="text"
                placeholder="Universitet nomi, shahar yoki yo'nalish"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="rank-filter">
              <label htmlFor="rank-city">Shahar</label>
              <select
                id="rank-city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="all">Barchasi</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="rank-filter">
              <label htmlFor="rank-sort">Saralash</label>
              <select
                id="rank-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="rank-view">
              <button
                type="button"
                className={`rank-view__btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
              >
                Jadval
              </button>
              <button
                type="button"
                className={`rank-view__btn ${viewMode === "cards" ? "active" : ""}`}
                onClick={() => setViewMode("cards")}
              >
                Kartalar
              </button>
            </div>
            <button
              type="button"
              className="rank-clear"
              onClick={clearFilters}
              disabled={!hasFilters}
            >
              Filtrlarni tozalash
            </button>
          </div>
        </div>
      </section>

      <section className="page__content">
        {viewMode === "table" ? (
          <div className="rank-table-wrapper">
            <div className="rank-table">
              <div className="rank-table__head">
                <span>#</span>
                <span>Muassasa</span>
                <span>Shahar</span>
                <span>Yo&apos;nalish</span>
                <span>Ball</span>
              </div>

              <div className="rank-table__body">
                {loading ? (
                  <div className="rank-table__row">
                    <span className="rank-idx">—</span>
                    <div className="rank-name-wrap">
                      <span className="rank-name">Yuklanmoqda...</span>
                      <span className="rank-sub">Ma&apos;lumotlar yangilanmoqda</span>
                    </div>
                    <span className="rank-meta">—</span>
                    <span className="rank-type-badge">—</span>
                    <div className="rank-score">
                      <span className="rank-score__value">—</span>
                      <span className="rank-score__track">
                        <span className="rank-score__fill" style={{ width: "0%" }} />
                      </span>
                    </div>
                  </div>
                ) : sortedData.length > 0 ? (
                  sortedData.map((item) => {
                    const scoreWidth = Math.min(100, Math.max(0, item.score));

                    return (
                      <div key={`${item.rank}-${item.name}`} className="rank-table__row">
                        <span className="rank-idx">{item.rank}</span>
                        <div className="rank-name-wrap">
                          <Link className="rank-name" href={`/institutions/${item.institutionId}`}>
                            {item.name}
                          </Link>
                          <span className="rank-sub">
                            {item.city} - {item.type}
                          </span>
                        </div>
                        <span className="rank-meta">{item.city}</span>
                        <span className="rank-type-badge">{item.type}</span>
                        <div className="rank-score">
                          <span className="rank-score__value">{item.score.toFixed(1)}</span>
                          <span className="rank-score__track">
                            <span
                              className="rank-score__fill"
                              style={{ width: `${scoreWidth}%` }}
                            />
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rank-table__empty empty-state">
                    <div className="empty-state__icon" />
                    <div className="empty-state__title">Natija topilmadi</div>
                    <div className="empty-state__text">
                      Qidiruv so&apos;rovini qisqartiring yoki filtrlarni qayta sozlang.
                    </div>
                    <button
                      type="button"
                      className="btn--ghost empty-state__action"
                      onClick={clearFilters}
                    >
                      Filtrlarni tozalash
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rank-card-grid">
            {loading ? (
              <div className="empty-state">
                <div className="empty-state__title">Yuklanmoqda...</div>
                <div className="empty-state__text">Ma&apos;lumotlar yangilanmoqda</div>
              </div>
            ) : sortedData.length > 0 ? (
              sortedData.map((item) => (
                <article key={`${item.rank}-${item.name}`} className="rank-card">
                  <div className="rank-card__top">
                    <div className="rank-card__rank">#{item.rank}</div>
                    <div className="rank-card__score">{item.score.toFixed(1)}</div>
                  </div>
                  <h3 className="rank-card__title">
                    <Link href={`/institutions/${item.institutionId}`}>{item.name}</Link>
                  </h3>
                  <div className="rank-card__meta">
                    <span>{item.city}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                  </div>
                  <div className="rank-card__progress">
                    <span className="rank-card__progress-fill" style={{ width: `${item.score}%` }} />
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state__icon" />
                <div className="empty-state__title">Natija topilmadi</div>
                <div className="empty-state__text">
                  Qidiruv so&apos;rovini qisqartiring yoki filtrlarni qayta sozlang.
                </div>
                <button
                  type="button"
                  className="btn--ghost empty-state__action"
                  onClick={clearFilters}
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}
          </div>
        )}

        <p className="page__note">
          * Jadvaldagi ma&apos;lumotlar hozirda bazadan olinadi. Agar reytinglar
          ko&apos;rinmasa, PUBLISHED holatidagi period va hisoblangan natijalar mavjud
          ekanini tekshiring.
        </p>
      </section>
    </main>
  );
}
