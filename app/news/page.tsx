const newsItems = [
  {
    date: "2025-02-01",
    tag: "Platforma",
    title: "OliyRank beta versiyasi ishga tushdi",
    summary:
      "Talabalar va ota onalar uchun mustaqil reyting platformasining ilk sinov versiyasi ishga tushirildi.",
  },
  {
    date: "2025-03-10",
    tag: "Hamkorlik",
    title: "Universitetlardan dastlabki ma’lumotlar qabul qilinmoqda",
    summary:
      "Oliy ta’lim muassasalari o‘z ko‘rsatkichlarini tizimga kiritish uchun shaxsiy kabinet orqali ma’lumot yuborishi mumkin.",
  },
  {
    date: "2025-04-05",
    tag: "Yangilanish",
    title: "Reyting metodologiyasiga qo‘shimcha ko‘rsatkichlar qo‘shildi",
    summary:
      "Bitiruvchilar natijasi va talaba tajribasi bo‘yicha yangi indikatorlar sinov tariqasida joriy etildi.",
  },
];

export default function NewsPage() {
  return (
    <main className="page page--news">
      <section className="news-hero">
        <h1>Yangiliklar</h1>
        <p>
          Platforma yangilanishlari, reytinglar bo‘yicha e’lonlar va universitetlar bilan hamkorlik
          haqidagi qisqa yangiliklarni shu yerda to‘plashga harakat qilamiz.
        </p>
      </section>

      <section className="news-list">
        {newsItems.map((item) => (
          <article key={item.title} className="news-card">
            <div className="news-card__meta">
              <span className="news-card__date">{item.date}</span>
              <span className="news-card__tag">{item.tag}</span>
            </div>
            <div className="news-card__content">
              <h2 className="news-card__title">{item.title}</h2>
              <p className="news-card__summary">{item.summary}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
