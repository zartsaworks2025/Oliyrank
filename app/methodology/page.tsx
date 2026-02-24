import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodologiya | OliyRank",
  description: "OliyRank reyting metodologiyasi va indikatorlar tuzilmasi.",
};

export default function MethodologyPage() {
  return (
    <main className="page page--methodology">
      <section className="methodology-hero">
        <span className="methodology-hero__eyebrow">Metodologiya</span>
        <h1>OliyRank baholash tizimi</h1>
        <p>
          Reytinglar 4 ta asosiy blok va 18 ta indikatorga asoslanadi. Har bir indikator
          0-100 shkalada baholanadi va og&apos;irliklar bo&apos;yicha yakuniy ball hisoblanadi.
        </p>
      </section>

      <section className="methodology-grid">
        <div className="methodology-card">
          <h2>Akademik sifat (30%)</h2>
          <ul>
            <li>Professor-o&apos;qituvchilar malakasi</li>
            <li>Dasturlar akkreditatsiyasi</li>
            <li>Ilmiy tadqiqotlar</li>
            <li>Talaba-o&apos;qituvchi nisbatlari</li>
          </ul>
        </div>
        <div className="methodology-card">
          <h2>Infratuzilma (20%)</h2>
          <ul>
            <li>Kampus va auditoriyalar</li>
            <li>Biblioteka resurslari</li>
            <li>Laboratoriya jihozlari</li>
            <li>Raqamli infratuzilma</li>
          </ul>
        </div>
        <div className="methodology-card">
          <h2>Bitiruvchilar natijasi (25%)</h2>
          <ul>
            <li>Ishga joylashish ko&apos;rsatkichi</li>
            <li>O&apos;rtacha ish haqi</li>
            <li>Ish beruvchi fikrlari</li>
            <li>Amaliyot dasturlari</li>
          </ul>
        </div>
        <div className="methodology-card">
          <h2>Talaba tajribasi (25%)</h2>
          <ul>
            <li>Talabalar qoniqishi</li>
            <li>Ta&apos;lim sifati</li>
            <li>Karyera xizmatlari</li>
            <li>Xalqaro tajriba</li>
          </ul>
        </div>
      </section>

      <section className="methodology-note">
        <h3>Ma&apos;lumot manbalari</h3>
        <p>
          Reytinglar rasmiy hisobotlar, akkreditatsiya reyestrlari, talabalar va ish
          beruvchilar so&apos;rovlari hamda mustaqil auditlar asosida shakllantiriladi.
        </p>
        <p>Batafsil hujjat: docs/methodology.md faylida mavjud.</p>
      </section>
    </main>
  );
}
