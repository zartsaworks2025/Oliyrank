"use client";

import { useState } from "react";

const faqs = [
  {
    q: "OliyRank reytinglari qanday shakllanadi?",
    a: "Reytinglar rasmiy ma’lumotlar, ochiq statistika va mustaqil tahlil asosida shakllanadi. Har bir ko‘rsatkich alohida baholanadi, unga vazn beriladi va maxsus formula orqali umumiy ball hisoblanadi.",
  },
  {
    q: "Reytinglar qanchalik tez-tez yangilanadi?",
    a: "Ma’lumotlar bazasi yangilanishiga qarab yil davomida bir necha marta yangilanish rejalashtirilgan. Yirik yangilanishlar yiliga kamida bir marta bo‘ladi.",
  },
  {
    q: "Universitetlar sizga ma’lumot yuborishi shartmi?",
    a: "Kerakli ma’lumotlar ochiq manbalar, rasmiy hisobotlar va universitetlar bilan hamkorlik orqali yig‘iladi. Ma’lumot yuborish jarayoni ularning reytingdagi aniqligini oshiradi.",
  },
  {
    q: "Talabalar sharhi reytingga ta’sir qiladimi?",
    a: "Kelajakda talaba sharhlari alohida ko‘rsatkich sifatida qo‘shiladi, lekin reytinglar faqat subyektiv fikrga emas, balki ma’lumotga asoslangan bo‘lishi uchun balans saqlanadi.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="page page--faqs">
      <section className="faqs-hero">
        <h1>Ko‘p beriladigan savollar</h1>
        <p>
          Quyida eng ko‘p so‘raladigan savollarga qisqa javoblar jamlangan.
        </p>
      </section>

      <div className="faq-search">
        <input type="text" placeholder="Savolingizni yozing..." />
      </div>

      <section className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <button
              key={item.q}
              className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <div className="faq-item__header">
                <span className="faq-item__question">{item.q}</span>
                <span className="faq-item__icon">{isOpen ? "–" : "+"}</span>
              </div>
              {isOpen && <p className="faq-item__body">{item.a}</p>}
            </button>
          );
        })}
      </section>
    </main>
  );
}
