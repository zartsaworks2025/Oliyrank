export default function Loading() {
  const items = Array.from({ length: 5 });

  return (
    <main className="page page--faqs">
      <section className="faqs-hero">
        <div className="loading-stack">
          <div className="skeleton skeleton-line" style={{ width: "30%" }} />
          <div className="skeleton skeleton-title" style={{ width: "60%" }} />
          <div className="skeleton skeleton-line-lg" style={{ width: "90%" }} />
          <div className="skeleton skeleton-line" style={{ width: "75%" }} />
        </div>
      </section>

      <section className="faq-shell">
        <div className="faq-main">
          <div className="faq-search">
            <span className="skeleton skeleton-input" style={{ width: "100%" }} />
            <span className="skeleton skeleton-line" style={{ width: "120px" }} />
          </div>
          <div className="faq-categories">
            <span className="skeleton skeleton-pill" style={{ width: "110px" }} />
            <span className="skeleton skeleton-pill" style={{ width: "110px" }} />
            <span className="skeleton skeleton-pill" style={{ width: "110px" }} />
          </div>
          <section className="faq-list">
            {items.map((_, index) => (
              <div key={index} className="skeleton skeleton-block" />
            ))}
          </section>
        </div>
        <aside className="faq-aside">
          <div className="skeleton skeleton-card" />
        </aside>
      </section>
    </main>
  );
}
