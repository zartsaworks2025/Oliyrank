"use client";

import { useState } from "react";

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
    name: "O‘zbekiston Milliy Universiteti",
    city: "Toshkent",
    score: 92.4,
    type: "Universitet",
  },
  {
    rank: 2,
    name: "TATU",
    city: "Toshkent",
    score: 88.9,
    type: "Texnika universiteti",
  },
  {
    rank: 3,
    name: "WIUT",
    city: "Toshkent",
    score: 86.2,
    type: "Xalqaro universitet",
  },
];

const centerData: RankingItem[] = [
  {
    rank: 1,
    name: "Najot Ta’lim",
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
    score: 85.7,
    type: "IT kurslari",
  },
];

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<"unis" | "centers">("unis");
  const [searchTerm, setSearchTerm] = useState("");

  const data = activeTab === "unis" ? universityData : centerData;
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="page page--rankings">
      <div className="page__bg-glow" />

      {/* Top info + type buttons */}
      <section className="rankings-hero">
        <div className="rankings-hero__content">
          <div className="rankings-hero__text">
            <h1>Reytinglar</h1>
            <p>
              OliyRank universitetlar va o‘quv markazlarini bir xil mezonlar bo‘yicha solishtirishga yordam
              beradi.
            </p>
          </div>

          <div className="rankings-hero__stats">
            <div className="stat-pill">
              <span className="stat-pill__label">Universitetlar</span>
              <span className="stat-pill__val">42</span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">O‘quv markazlari</span>
              <span className="stat-pill__val">150+</span>
            </div>
          </div>
        </div>

        <div className="rankings-controls">
          <div className="rank-tabs">
            <button
              type="button"
              onClick={() => setActiveTab("unis")}
              className={`rank-tab ${activeTab === "unis" ? "rank-tab--active" : ""}`}
            >
              Universitetlar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("centers")}
              className={`rank-tab ${activeTab === "centers" ? "rank-tab--active" : ""}`}
            >
              O‘quv markazlari
            </button>
          </div>

          <div className="rank-search">
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Table section */}
      <section className="page__content">
        <div className="rank-table-wrapper">
          <div className="rank-table">
            <div className="rank-table__head">
              <span>#</span>
              <span>Nomi</span>
              <span>Shahar</span>
              <span>Yo‘nalish</span>
              <span>Ball</span>
            </div>

            <div className="rank-table__body">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <div key={item.rank + item.name} className="rank-table__row">
                    <span className="rank-idx">{item.rank}</span>
                    <span className="rank-name">{item.name}</span>
                    <span className="rank-meta">{item.city}</span>
                    <span className="rank-type-badge">{item.type}</span>
                    <span className="rank-score">{item.score.toFixed(1)}</span>
                  </div>
                ))
              ) : (
                <div className="rank-table__empty">
                  Ma’lumot topilmadi
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="page__note">
          * Jadvaldagi ma’lumotlar hozircha dizayn va funksiyani namoyish qilish uchun test ma’lumotlari
          sifatida qo‘yilgan.
        </p>
      </section>
    </main>
  );
}
