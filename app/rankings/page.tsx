"use client";

import { useMemo, useState } from "react";

type RankingItem = {
  rank: number;
  name: string;
  city: string;
  score: number;
  type: string;
};

const universityData: RankingItem[] = [
  {
    rank: 1,
    name: "O'zbekiston Milliy Universiteti",
    city: "Toshkent",
    score: 92.4,
    type: "Davlat universiteti",
  },
  {
    rank: 2,
    name: "Toshkent Axborot Texnologiyalari Universiteti",
    city: "Toshkent",
    score: 90.1,
    type: "Texnika universiteti",
  },
  {
    rank: 3,
    name: "Westminster International University in Tashkent",
    city: "Toshkent",
    score: 88.7,
    type: "Xalqaro universitet",
  },
  {
    rank: 4,
    name: "Samarqand Davlat Universiteti",
    city: "Samarqand",
    score: 87.2,
    type: "Davlat universiteti",
  },
  {
    rank: 5,
    name: "Toshkent Davlat Iqtisodiyot Universiteti",
    city: "Toshkent",
    score: 86.4,
    type: "Iqtisodiyot universiteti",
  },
  {
    rank: 6,
    name: "Farg'ona Davlat Universiteti",
    city: "Farg'ona",
    score: 84.6,
    type: "Davlat universiteti",
  },
  {
    rank: 7,
    name: "Buxoro Davlat Universiteti",
    city: "Buxoro",
    score: 83.1,
    type: "Davlat universiteti",
  },
  {
    rank: 8,
    name: "Nukus Davlat Universiteti",
    city: "Nukus",
    score: 81.5,
    type: "Davlat universiteti",
  },
];

const centerData: RankingItem[] = [
  {
    rank: 1,
    name: "Najot Ta'lim",
    city: "Toshkent",
    score: 91.3,
    type: "Dasturlash kurslari",
  },
  {
    rank: 2,
    name: "Cambridge Learning Center",
    city: "Toshkent",
    score: 88.1,
    type: "Til markazi",
  },
  {
    rank: 3,
    name: "Inha Training Center",
    city: "Toshkent",
    score: 86.4,
    type: "IT kurslari",
  },
  {
    rank: 4,
    name: "PDP Academy",
    city: "Toshkent",
    score: 85.6,
    type: "Dasturlash kurslari",
  },
  {
    rank: 5,
    name: "Registan Learning Center",
    city: "Samarqand",
    score: 84.2,
    type: "Til markazi",
  },
  {
    rank: 6,
    name: "Farg'ona IT Park Training",
    city: "Farg'ona",
    score: 82.8,
    type: "IT kurslari",
  },
  {
    rank: 7,
    name: "Buxoro Skills Hub",
    city: "Buxoro",
    score: 81.9,
    type: "Kasbga tayyorlash",
  },
  {
    rank: 8,
    name: "Urganch EduLab",
    city: "Urganch",
    score: 80.7,
    type: "IT kurslari",
  },
];

const sortOptions = [
  { value: "score-desc", label: "Ball: yuqoridan pastga" },
  { value: "score-asc", label: "Ball: pastdan yuqoriga" },
  { value: "name-asc", label: "Nomi: A-Z" },
  { value: "name-desc", label: "Nomi: Z-A" },
];

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<"unis" | "centers">("unis");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score-desc");

  const data = activeTab === "unis" ? universityData : centerData;

  const cities = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.city)));
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
    const items = [...filteredData];

    switch (sortBy) {
      case "score-asc":
        return items.sort((a, b) => a.score - b.score);
      case "name-asc":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return items.sort((a, b) => b.name.localeCompare(a.name));
      case "score-desc":
      default:
        return items.sort((a, b) => b.score - a.score);
    }
  }, [filteredData, sortBy]);

  const totalCount = data.length;
  const resultsCount = sortedData.length;
  const hasFilters =
    searchTerm.trim().length > 0 || cityFilter !== "all" || sortBy !== "score-desc";

  const clearFilters = () => {
    setSearchTerm("");
    setCityFilter("all");
    setSortBy("score-desc");
  };

  const handleTabChange = (tab: "unis" | "centers") => {
    setActiveTab(tab);
    setCityFilter("all");
  };

  return (
    <main className="page page--rankings">
      <div className="page__bg-glow" />

      <section className="rankings-hero">
        <div className="rankings-hero__content">
          <div className="rankings-hero__text">
            <span className="rankings-hero__eyebrow">2025 yil reytinglari</span>
            <h1>OliyRank reytinglari</h1>
            <p>
              OliyRank universitetlar va o&apos;quv markazlarini bir xil mezonlar asosida
              solishtiradi. Ballar 4 ta asosiy blok va 18 ta indikator bo&apos;yicha
              hisoblanadi.
            </p>
            <div className="rankings-hero__meta">
              <span>Ochiq metodologiya</span>
              <span>Oxirgi yangilanish: 2025-04-18</span>
              <span>Manbalar: rasmiy hisobotlar</span>
            </div>
          </div>

          <div className="rankings-hero__stats">
            <div className="stat-pill">
              <span className="stat-pill__label">Universitetlar</span>
              <span className="stat-pill__val">42</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">O&apos;quv markazlari</span>
              <span className="stat-pill__val">150+</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">Shaharlar</span>
              <span className="stat-pill__val">12</span>
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
                placeholder="Nomi, shahar yoki yo&apos;nalish"
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
              {sortedData.length > 0 ? (
                sortedData.map((item) => {
                  const scoreWidth = Math.min(100, Math.max(0, item.score));

                  return (
                    <div key={`${item.rank}-${item.name}`} className="rank-table__row">
                      <span className="rank-idx">{item.rank}</span>
                      <div className="rank-name-wrap">
                        <span className="rank-name">{item.name}</span>
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

        <p className="page__note">
          * Jadvaldagi ma&apos;lumotlar hozircha dizayn va funksiyani namoyish qilish uchun
          test ma&apos;lumotlari sifatida berilgan.
        </p>
      </section>
    </main>
  );
}
