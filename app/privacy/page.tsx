import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maxfiylik siyosati | OliyRank",
  description: "OliyRank platformasining maxfiylik siyosati va ma'lumotlar himoyasi.",
};

export default function PrivacyPage() {
  return (
    <main className="page page--legal">
      <section className="legal-hero">
        <h1>Maxfiylik siyosati</h1>
        <p>
          OliyRank foydalanuvchilar ma&apos;lumotlarini himoya qilishga jiddiy yondashadi.
          Bu sahifa MVP davrida qisqacha ma&apos;lumot beradi va rasmiy versiya keyinroq
          yangilanadi.
        </p>
      </section>

      <section className="legal-content">
        <h2>Qanday ma&apos;lumotlar yig&apos;iladi</h2>
        <p>
          Ro&apos;yxatdan o&apos;tishda email va ism kabi asosiy ma&apos;lumotlar, shuningdek platforma
          foydalanish statistikasi yig&apos;iladi.
        </p>

        <h2>Ma&apos;lumotlardan foydalanish</h2>
        <p>
          Ma&apos;lumotlar xizmat sifatini oshirish, reytinglarni shakllantirish va foydalanuvchi
          tajribasini yaxshilash uchun ishlatiladi.
        </p>

        <h2>Aloqa</h2>
        <p>Maxfiylik bo&apos;yicha savollar uchun: zartsaworks@gmail.com</p>
      </section>
    </main>
  );
}
