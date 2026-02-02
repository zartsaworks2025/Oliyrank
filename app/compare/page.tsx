"use client";

import { useEffect, useMemo, useState } from "react";

type Institution = {
  id: number;
  name: string;
  type: "UNIVERSITY" | "LEARNING_CENTER";
  city: string | null;
  country: string | null;
};

type RankingResult = {
  institution: Institution;
  rank: number;
  totalScore: number;
};

type RankingsResponse = {
  period: { name: string; endDate: string } | null;
  results: RankingResult[];
};

export default function ComparePage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [rankings, setRankings] = useState<RankingResult[]>([]);
  const [leftId, setLeftId] = useState<number | null>(null);
  const [rightId, setRightId] = useState<number | null>(null);
  const [periodLabel, setPeriodLabel] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const [institutionsRes, rankingsRes] = await Promise.all([
        fetch("/api/institutions", { cache: "no-store" }),
        fetch("/api/rankings", { cache: "no-store" }),
      ]);

      const institutionsData = (await institutionsRes.json()) as {
        institutions: Institution[];
      };
      const rankingsData = (await rankingsRes.json()) as RankingsResponse;

      setInstitutions(institutionsData.institutions ?? []);
      setRankings(rankingsData.results ?? []);
      setPeriodLabel(rankingsData.period?.name ?? null);

      if (institutionsData.institutions?.length) {
        setLeftId((current) => current ?? institutionsData.institutions[0]?.id ?? null);
        setRightId((current) =>
          current ?? institutionsData.institutions[1]?.id ?? null
        );
      }
    };

    void fetchAll();
  }, []);

  const rankingMap = useMemo(() => {
    const map = new Map<number, { rank: number; score: number }>();
    for (const item of rankings) {
      map.set(item.institution.id, {
        rank: item.rank,
        score: item.totalScore,
      });
    }
    return map;
  }, [rankings]);

  const left = institutions.find((item) => item.id === leftId) ?? null;
  const right = institutions.find((item) => item.id === rightId) ?? null;

  const leftRank = left ? rankingMap.get(left.id) : null;
  const rightRank = right ? rankingMap.get(right.id) : null;

  return (
    <main className="page page--compare">
      <section className="compare-hero">
        <span className="compare-hero__eyebrow">Taqqoslash</span>
        <h1>Universitetlarni taqqoslang</h1>
        <p>
          Ikki muassasani yonma-yon solishtiring va reyting natijalarini ko&apos;ring.
        </p>
        <div className="compare-hero__meta">
          <span>Reyting davri: {periodLabel ?? "—"}</span>
        </div>
      </section>

      <section className="compare-panel">
        <div className="compare-select">
          <label>1-muassasa</label>
          <select
            value={leftId ?? ""}
            onChange={(e) => setLeftId(Number(e.target.value) || null)}
          >
            <option value="">Tanlang</option>
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>
        </div>
        <div className="compare-select">
          <label>2-muassasa</label>
          <select
            value={rightId ?? ""}
            onChange={(e) => setRightId(Number(e.target.value) || null)}
          >
            <option value="">Tanlang</option>
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>
                {institution.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="compare-grid">
        <div className="compare-card">
          {left ? (
            <>
              <h2>{left.name}</h2>
              <p>
                {left.city ?? ""}
                {left.city && left.country ? " · " : ""}
                {left.country ?? ""}
              </p>
              <div className="compare-metrics">
                <div>
                  <span>Reyting</span>
                  <strong>{leftRank ? `#${leftRank.rank}` : "—"}</strong>
                </div>
                <div>
                  <span>Ball</span>
                  <strong>{leftRank ? leftRank.score.toFixed(1) : "—"}</strong>
                </div>
              </div>
            </>
          ) : (
            <p>Muassasani tanlang.</p>
          )}
        </div>

        <div className="compare-card">
          {right ? (
            <>
              <h2>{right.name}</h2>
              <p>
                {right.city ?? ""}
                {right.city && right.country ? " · " : ""}
                {right.country ?? ""}
              </p>
              <div className="compare-metrics">
                <div>
                  <span>Reyting</span>
                  <strong>{rightRank ? `#${rightRank.rank}` : "—"}</strong>
                </div>
                <div>
                  <span>Ball</span>
                  <strong>{rightRank ? rightRank.score.toFixed(1) : "—"}</strong>
                </div>
              </div>
            </>
          ) : (
            <p>Muassasani tanlang.</p>
          )}
        </div>
      </section>
    </main>
  );
}
