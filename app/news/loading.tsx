export default function Loading() {
  const cards = Array.from({ length: 6 });

  return (
    <main className="page page--news">
      <section className="news-hero">
        <div className="news-hero__inner">
          <div className="news-hero__content">
            <div className="loading-stack">
              <div className="skeleton skeleton-line" style={{ width: "35%" }} />
              <div className="skeleton skeleton-title" style={{ width: "70%" }} />
              <div className="skeleton skeleton-line-lg" style={{ width: "90%" }} />
              <div className="skeleton skeleton-line" style={{ width: "80%" }} />
            </div>
            <div className="news-hero__highlights">
              <span className="skeleton skeleton-pill" style={{ width: "160px" }} />
              <span className="skeleton skeleton-pill" style={{ width: "140px" }} />
              <span className="skeleton skeleton-pill" style={{ width: "120px" }} />
            </div>
          </div>

          <div className="news-hero__aside">
            <div className="skeleton skeleton-card" />
            <div className="skeleton skeleton-card" />
          </div>
        </div>
      </section>

      <section className="news-toolbar">
        <span className="skeleton skeleton-input" style={{ width: "260px" }} />
        <div className="news-toolbar__tags">
          <span className="skeleton skeleton-pill" style={{ width: "90px" }} />
          <span className="skeleton skeleton-pill" style={{ width: "90px" }} />
          <span className="skeleton skeleton-pill" style={{ width: "90px" }} />
          <span className="skeleton skeleton-pill" style={{ width: "90px" }} />
        </div>
        <span className="skeleton skeleton-line" style={{ width: "120px" }} />
      </section>

      <section className="news-feed">
        <div className="skeleton skeleton-card" style={{ height: "220px" }} />
        <div className="news-grid">
          {cards.map((_, index) => (
            <div key={index} className="skeleton skeleton-card" />
          ))}
        </div>
      </section>
    </main>
  );
}
