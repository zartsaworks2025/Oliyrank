"use client";

import { useMemo, useState } from "react";

type NewsItem = {
  date: string;
  tag: string;
  title: string;
  summary: string;
  readTime: string;
  source: string;
};

const newsItems: NewsItem[] = [
  {
    date: "2025-04-18",
    tag: "Hamkorlik",
    title: "O'quv markazlari uchun yangi kabinet",
    summary:
      "O'quv markazlari endi o'z ko'rsatkichlarini yuklash, ko'rib chiqish va tasdiqlashni tezroq amalga oshiradi.",
    readTime: "3 daqiqa",
    source: "OliyRank jamoasi",
  },
  {
    date: "2025-04-05",
    tag: "Yangilanish",
    title: "Reyting paneli yangilandi",
    summary:
      "Shaxsiy profil orqali reytinglar, shahar kesimidagi tahlillar va grafiklarni ko'rish imkoniyati qo'shildi.",
    readTime: "3 daqiqa",
    source: "Mahsulot jamoasi",
  },
  {
    date: "2025-03-28",
    tag: "So'rovnoma",
    title: "Talabalar tajribasi bo'yicha so'rov ochildi",
    summary:
      "Talabalarning o'qish tajribasi va kampus infratuzilmasi bo'yicha yangi so'rovnomalar to'plami ishga tushdi.",
    readTime: "2 daqiqa",
    source: "Tadqiqot bo'limi",
  },
  {
    date: "2025-03-10",
    tag: "Hamkorlik",
    title: "12 ta universitet ma'lumotlarini tasdiqladi",
    summary:
      "Universitetlar reytingdagi ma'lumotlarni tasdiqlash va yangilash uchun shaxsiy kabinetdan foydalanmoqda.",
    readTime: "3 daqiqa",
    source: "Hamkorlik bo'limi",
  },
  {
    date: "2025-02-20",
    tag: "Metodologiya",
    title: "Metodologiya v2: 18 indikator bilan baholash",
    summary:
      "Akademik sifat, infratuzilma va ishga joylashish bloklari bo'yicha ko'rsatkichlar yangilandi.",
    readTime: "4 daqiqa",
    source: "Tahlil guruhi",
  },
  {
    date: "2025-02-01",
    tag: "Platforma",
    title: "OliyRank beta versiyasi ishga tushdi",
    summary:
      "Talabalar va ota-onalar uchun mustaqil reyting platformasining dastlabki sinovi ishga tushirildi.",
    readTime: "3 daqiqa",
    source: "OliyRank jamoasi",
  },
];

const tags = ["Barchasi", ...Array.from(new Set(newsItems.map((item) => item.tag)))];

export default function NewsPage() {
  const [activeTag, setActiveTag] = useState("Barchasi");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return newsItems.filter((item) => {
      const matchesTag = activeTag === "Barchasi" || item.tag === activeTag;
      const matchesQuery = query
        ? [item.title, item.summary].some((value) =>
            value.toLowerCase().includes(query)
          )
        : true;

      return matchesTag && matchesQuery;
    });
  }, [activeTag, searchTerm]);

  const featured = filteredNews[0];
  const rest = featured ? filteredNews.slice(1) : [];

  const clearFilters = () => {
    setActiveTag("Barchasi");
    setSearchTerm("");
  };

  return (
    <main className="page page--news">
      <section className="news-hero">
        <div className="news-hero__inner">
          <div className="news-hero__content">
            <span className="news-hero__eyebrow">Yangiliklar markazi</span>
            <h1>OliyRank yangiliklari va e&apos;lonlar</h1>
            <p>
              Platforma yangilanishlari, hamkorliklar va metodologiya bo&apos;yicha muhim
              e&apos;lonlarni shu sahifada to&apos;playmiz. Har bir xabar rasmiy manbalar bilan
              tasdiqlanadi.
            </p>
            <div className="news-hero__highlights">
              <div className="news-highlight">
                <span className="news-highlight__label">Oxirgi yangilanish</span>
                <span className="news-highlight__value">2025-04-18</span>
              </div>
              <div className="news-highlight">
                <span className="news-highlight__label">E&apos;lonlar soni</span>
                <span className="news-highlight__value">{newsItems.length}</span>
              </div>
              <div className="news-highlight">
                <span className="news-highlight__label">Tekshiruv</span>
                <span className="news-highlight__value">2 bosqich</span>
              </div>
            </div>
          </div>

          <div className="news-hero__aside">
            <div className="news-hero__panel">
              <h2>Matbuot va hamkorlik</h2>
              <p>
                Press-relizlar, intervyu va hamkorlik bo&apos;yicha so&apos;rovlar uchun
                bog&apos;lanish sahifasidan foydalaning.
              </p>
              <div className="news-hero__panel-list">
                <div className="news-hero__panel-item">
                  <span className="news-hero__panel-label">Email</span>
                  <a
                    className="news-hero__panel-value"
                    href="mailto:zartsaworks@gmail.com"
                  >
                    zartsaworks@gmail.com
                  </a>
                </div>
                <div className="news-hero__panel-item">
                  <span className="news-hero__panel-label">Aloqa</span>
                  <a className="news-hero__panel-value" href="/contact">
                    Bog&apos;lanish sahifasi
                  </a>
                </div>
              </div>
            </div>

            <div className="news-hero__panel news-hero__panel--muted">
              <h3>Hisobot taqvimi</h3>
              <p>
                Yillik reytinglar bahor va kuz faslida e&apos;lon qilinadi. Oraliq
                yangilanishlar oyma-oy beriladi.
              </p>
              <span className="news-hero__panel-chip">Keyingi yangilanish: 2025-05-15</span>
            </div>
          </div>
        </div>
      </section>

      <section className="news-toolbar">
        <div className="news-toolbar__search">
          <label htmlFor="news-search">Qidiruv</label>
          <input
            id="news-search"
            type="text"
            placeholder="Sarlavha yoki mazmun bo&apos;yicha qidiring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="news-toolbar__tags">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`news-tag ${activeTag === tag ? "news-tag--active" : ""}`}
              onClick={() => setActiveTag(tag)}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="news-toolbar__count">{filteredNews.length} ta yangilik</div>
      </section>

      <section className="news-feed">
        {filteredNews.length > 0 ? (
          <>
            {featured && (
              <article className="news-feature">
                <div className="news-feature__meta">
                  <span className="news-tag">{featured.tag}</span>
                  <span className="news-feature__date">{featured.date}</span>
                  <span className="news-feature__read">{featured.readTime}</span>
                </div>
                <h2 className="news-feature__title">{featured.title}</h2>
                <p className="news-feature__summary">{featured.summary}</p>
                <div className="news-feature__footer">
                  <span className="news-feature__source">{featured.source}</span>
                  <span className="news-feature__cta">To&apos;liq yangiliklar tez orada</span>
                </div>
              </article>
            )}

            <div className="news-grid">
              {rest.map((item) => (
                <article key={item.title} className="news-card">
                  <div className="news-card__meta">
                    <span className="news-tag">{item.tag}</span>
                    <span className="news-card__date">{item.date}</span>
                  </div>
                  <h3 className="news-card__title">{item.title}</h3>
                  <p className="news-card__summary">{item.summary}</p>
                  <div className="news-card__footer">
                    <span className="news-card__read">{item.readTime}</span>
                    <span className="news-card__source">{item.source}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="news-empty empty-state">
            <div className="empty-state__icon" />
            <div className="empty-state__title">Yangilik topilmadi</div>
            <div className="empty-state__text">
              Qidiruv so&apos;rovi yoki tanlangan bo&apos;lim bo&apos;yicha yangilik yo&apos;q.
            </div>
            <button type="button" className="btn--ghost empty-state__action" onClick={clearFilters}>
              Filtrlarni tozalash
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
