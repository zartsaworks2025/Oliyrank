import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | OliyRank",
  description: "OliyRank blogi: tahlillar, yangiliklar va ta'lim trendleri.",
};

export default function BlogPage() {
  return (
    <main className="page page--blog">
      <section className="blog-hero">
        <h1>Blog va tahlillar</h1>
        <p>
          OliyRank blogi tez orada ishga tushadi. Bu yerda reytinglar, ta&apos;lim trendleri
          va tahliliy maqolalar e&apos;lon qilinadi.
        </p>
      </section>

      <div className="empty-state">
        <div className="empty-state__title">Maqolalar tayyorlanmoqda</div>
        <div className="empty-state__text">Yangiliklar bo&apos;limini kuzatib boring.</div>
      </div>
    </main>
  );
}
