export default function Loading() {
  const rows = Array.from({ length: 6 });

  return (
    <main className="page page--rankings">
      <div className="page__bg-glow" />

      <section className="rankings-hero">
        <div className="rankings-hero__content">
          <div className="rankings-hero__text">
            <div className="loading-stack">
              <div className="skeleton skeleton-line" style={{ width: "30%" }} />
              <div className="skeleton skeleton-title" style={{ width: "60%" }} />
              <div className="skeleton skeleton-line-lg" style={{ width: "90%" }} />
              <div className="skeleton skeleton-line" style={{ width: "70%" }} />
            </div>
            <div className="rankings-hero__meta">
              <span className="skeleton skeleton-line" style={{ width: "140px" }} />
              <span className="skeleton skeleton-line" style={{ width: "180px" }} />
              <span className="skeleton skeleton-line" style={{ width: "160px" }} />
            </div>
          </div>

          <div className="rankings-hero__stats">
            <span className="skeleton skeleton-pill" style={{ width: "140px" }} />
            <span className="skeleton skeleton-pill" style={{ width: "140px" }} />
            <span className="skeleton skeleton-pill" style={{ width: "140px" }} />
          </div>
        </div>

        <div className="rankings-hero__summary">
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>

        <div className="rankings-controls">
          <div className="rankings-controls__left">
            <div className="rank-tabs">
              <span className="skeleton skeleton-pill" style={{ width: "120px" }} />
              <span className="skeleton skeleton-pill" style={{ width: "160px" }} />
            </div>
            <div className="rankings-controls__meta">
              <span className="skeleton skeleton-line" style={{ width: "120px" }} />
            </div>
          </div>
          <div className="rankings-controls__right">
            <span className="skeleton skeleton-input" style={{ width: "220px" }} />
            <span className="skeleton skeleton-input" style={{ width: "160px" }} />
            <span className="skeleton skeleton-input" style={{ width: "160px" }} />
            <span className="skeleton skeleton-input" style={{ width: "160px" }} />
          </div>
        </div>
      </section>

      <section className="page__content">
        <div className="rank-table-wrapper">
          <div className="rank-table">
            <div className="rank-table__head">
              <span>#</span>
              <span>Muassasa</span>
              <span>Shahar</span>
              <span>Yo&apos;nalish</span>
              <span>Ball</span>
            </div>
            <div className="rank-table__body">
              {rows.map((_, index) => (
                <div key={index} className="rank-table__row">
                  <span className="skeleton skeleton-line" style={{ width: "32px" }} />
                  <span className="skeleton skeleton-line" style={{ width: "220px" }} />
                  <span className="skeleton skeleton-line" style={{ width: "120px" }} />
                  <span className="skeleton skeleton-line" style={{ width: "140px" }} />
                  <span className="skeleton skeleton-line" style={{ width: "70px" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
