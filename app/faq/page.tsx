"use client";

import { useMemo, useState } from "react";

const faqs = [
  {
    category: "Metodologiya",
    q: "Reytinglar qanday shakllanadi?",
    a: "Reytinglar 4 blok asosida tuziladi: akademik sifat, infratuzilma, ishga joylashish va talaba tajribasi. Har bir indikatorga vazn berilib, umumiy ball hisoblanadi.",
  },
  {
    category: "Yangilanish",
    q: "Reytinglar qanchalik tez-tez yangilanadi?",
    a: "Yillik hisobotlar yiliga kamida bir marta e'lon qilinadi. Oraliq yangilanishlar chorak yakunlari bo'yicha tayyorlanadi.",
  },
  {
    category: "Hamkorlik",
    q: "Universitetlar ma'lumot yuborishi shartmi?",
    a: "Majburiy emas, ammo ma'lumotlarni tasdiqlash aniqlikni oshiradi. Muassasalar shaxsiy kabinet orqali ma'lumot yuklashi mumkin.",
  },
  {
    category: "Talabalar",
    q: "Talaba sharhlari reytingga ta'sir qiladimi?",
    a: "Talabalar fikri alohida indikator sifatida ko'rib chiqiladi. Subyektiv baho faktlar bilan balanslangan holda ta'sir qiladi.",
  },
  {
    category: "Ma'lumotlar",
    q: "Ma'lumotlarda xato topsam nima qilaman?",
    a: "Kontakt sahifasi orqali xabar qoldiring. Biz ma'lumotni tekshirib, tasdiqlanganidan so'ng yangilaymiz.",
  },
  {
    category: "Platforma",
    q: "Reytingdan foydalanish pullikmi?",
    a: "Reytinglarni ko'rish va ma'lumot yuborish hozircha bepul. Kengaytirilgan tahlillar keyingi bosqichda taqdim etiladi.",
  },
  {
    category: "O'quv markazlari",
    q: "O'quv markazlari qanday baholanadi?",
    a: "Dastur sifati, ustozlar tajribasi, bitiruvchilar natijasi va talabalar fikri asosida ko'rsatkichlar shakllantiriladi.",
  },
];

const categories = ["Barchasi", ...Array.from(new Set(faqs.map((item) => item.category)))];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(faqs[0]?.q ?? null);
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return faqs.filter((item) => {
      const matchesCategory = activeCategory === "Barchasi" || item.category === activeCategory;
      const matchesQuery = query
        ? [item.q, item.a].some((value) => value.toLowerCase().includes(query))
        : true;

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchTerm]);

  const clearFilters = () => {
    setActiveCategory("Barchasi");
    setSearchTerm("");
    setOpenItem(faqs[0]?.q ?? null);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setOpenItem(null);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setOpenItem(null);
  };

  return (
    <main className="page page--faqs">
      <section className="faqs-hero">
        <span className="faqs-hero__eyebrow">Yordam markazi</span>
        <h1>Ko&apos;p beriladigan savollar</h1>
        <p>
          Platforma, metodologiya va hamkorlik bo&apos;yicha asosiy savollarga qisqa
          javoblar jamlangan. Qo&apos;shimcha savollar bo&apos;lsa, bizga yozing.
        </p>
      </section>

      <section className="faq-shell">
        <div className="faq-main">
          <div className="faq-search">
            <label htmlFor="faq-search">Savolni qidiring</label>
            <input
              id="faq-search"
              type="text"
              placeholder="Savol yoki kalit so&apos;zni yozing"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <span className="faq-search__count">{filteredFaqs.length} ta natija</span>
          </div>

          <div className="faq-categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`faq-category ${
                  activeCategory === category ? "faq-category--active" : ""
                }`}
                onClick={() => handleCategoryChange(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>

          <section className="faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, index) => {
                const isOpen = openItem === item.q;

                return (
                  <button
                    type="button"
                    key={item.q}
                    className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                    onClick={() => setOpenItem(isOpen ? null : item.q)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <div className="faq-item__header">
                      <div className="faq-item__heading">
                        <span className="faq-item__tag">{item.category}</span>
                        <span className="faq-item__question">{item.q}</span>
                      </div>
                      <span className="faq-item__icon">+</span>
                    </div>
                    <p
                      id={`faq-panel-${index}`}
                      className="faq-item__body"
                      hidden={!isOpen}
                    >
                      {item.a}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="empty-state">
                <div className="empty-state__icon" />
                <div className="empty-state__title">Savol topilmadi</div>
                <div className="empty-state__text">
                  Kalit so&apos;zni o&apos;zgartiring yoki boshqa bo&apos;limni tanlang.
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
          </section>
        </div>

        <aside className="faq-aside">
          <div className="faq-card">
            <h2>Yordam kerakmi?</h2>
            <p>
              Jamoamiz odatda 24 soat ichida javob qaytaradi. Hamkorlik yoki
              ma&apos;lumotlarni tekshirish bo&apos;yicha so&apos;rov yuborishingiz mumkin.
            </p>
            <div className="faq-card__meta">
              <div className="faq-card__item">
                <span className="faq-card__label">Email</span>
                <span className="faq-card__value">
                  <a href="mailto:zartsaworks@gmail.com">zartsaworks@gmail.com</a>
                </span>
              </div>
              <div className="faq-card__item">
                <span className="faq-card__label">Telefon</span>
                <span className="faq-card__value">
                  <a href="tel:+998977902105">+998 97 790 21 05</a>
                </span>
              </div>
              <div className="faq-card__item">
                <span className="faq-card__label">Javob vaqti</span>
                <span className="faq-card__value">12-24 soat</span>
              </div>
            </div>
            <div className="faq-card__note">
              Reytingga tegishli xatoliklarni bildirganingiz uchun rahmat.
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
