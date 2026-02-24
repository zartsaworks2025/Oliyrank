export default function Loading() {
  const fields = Array.from({ length: 5 });

  return (
    <main className="page page--contact">
      <section className="contact-hero">
        <div className="loading-stack">
          <div className="skeleton skeleton-line" style={{ width: "25%" }} />
          <div className="skeleton skeleton-title" style={{ width: "55%" }} />
          <div className="skeleton skeleton-line-lg" style={{ width: "85%" }} />
          <div className="skeleton skeleton-line" style={{ width: "70%" }} />
        </div>
        <div className="contact-hero__highlights">
          <span className="skeleton skeleton-pill" style={{ width: "160px" }} />
          <span className="skeleton skeleton-pill" style={{ width: "160px" }} />
          <span className="skeleton skeleton-pill" style={{ width: "160px" }} />
        </div>
      </section>

      <section className="contact-grid">
        <div className="contact-grid__info">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
        <div className="contact-grid__form">
          <div className="loading-stack">
            {fields.map((_, index) => (
              <div key={index} className="skeleton skeleton-input" style={{ width: "100%" }} />
            ))}
            <div className="skeleton skeleton-block" />
            <div className="skeleton skeleton-input" style={{ width: "100%" }} />
          </div>
        </div>
      </section>
    </main>
  );
}
