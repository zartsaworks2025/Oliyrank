import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foydalanish shartlari | OliyRank",
  description: "OliyRank platformasidan foydalanish shartlari va qoidalari.",
};

export default function TermsPage() {
  return (
    <main className="page page--legal">
      <section className="legal-hero">
        <h1>Foydalanish shartlari</h1>
        <p>
          Platformadan foydalanish orqali siz OliyRank qoidalari va xizmat shartlariga rozi
          bo&apos;lasiz. MVP davrida bu ma&apos;lumotlar qisqacha beriladi.
        </p>
      </section>

      <section className="legal-content">
        <h2>Mas&apos;uliyat</h2>
        <p>
          Reytinglar ochiq manbalar va tasdiqlangan ma&apos;lumotlarga asoslanadi, ammo barcha
          ma&apos;lumotlar doimiy ravishda yangilanib boradi.
        </p>

        <h2>Foydalanuvchi majburiyatlari</h2>
        <p>
          Sharhlar va fikrlar haqiqiy tajribaga asoslangan bo&apos;lishi kerak. Noto&apos;g&apos;ri yoki
          zararli kontent moderatsiya orqali olib tashlanadi.
        </p>
      </section>
    </main>
  );
}
