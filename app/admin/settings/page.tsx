"use client";

import { useEffect, useState } from "react";
import { FiActivity, FiRefreshCcw, FiCheck, FiAlertTriangle } from "react-icons/fi";

type Period = {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
};

type Overview = {
  institutions: number;
  users: number;
  pendingReviews: number;
  reviews: number;
};

export default function AdminSettingsPage() {
  const [health, setHealth] = useState<"up" | "down" | "unknown">("unknown");
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | "">("");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [healthRes, periodsRes, overviewRes] = await Promise.all([
          fetch("/api/health"),
          fetch("/api/admin/periods"),
          fetch("/api/admin/overview"),
        ]);

        if (healthRes.ok) {
          const data = (await healthRes.json()) as { db?: string };
          setHealth(data.db === "up" ? "up" : "down");
        } else {
          setHealth("down");
        }

        if (periodsRes.ok) {
          const data = (await periodsRes.json()) as { periods: Period[] };
          setPeriods(data.periods ?? []);
          if (data.periods?.length) {
            setSelectedPeriod(data.periods[0].id);
          }
        }

        if (overviewRes.ok) {
          const data = (await overviewRes.json()) as Overview;
          setOverview(data);
        }
      } catch {
        setHealth("down");
      }
    };

    void load();
  }, []);

  const recompute = async () => {
    if (!selectedPeriod) {
      setError("Please select a ranking period.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/rankings/recompute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodId: selectedPeriod }),
      });

      if (!response.ok) {
        throw new Error("Failed to recompute ranking");
      }

      setMessage("Ranking successfully recomputed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>System Operations</h1>
        <p>Monitor platform health and manage ranking operations.</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Database</span>
          <strong>{health === "up" ? "Online" : "Offline"}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Institutions</span>
          <strong>{overview?.institutions ?? "—"}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Users</span>
          <strong>{overview?.users ?? "—"}</strong>
        </div>
        <div className="admin-stat-card">
          <span>Pending Reviews</span>
          <strong>{overview?.pendingReviews ?? "—"}</strong>
        </div>
      </div>

      <div className="admin-form">
        <h2>
          <FiActivity /> Ranking operations
        </h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Ranking period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value) || "")}
            >
              <option value="">Select period</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name} ({period.status})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Action</label>
            <button
              type="button"
              className="btn-primary"
              onClick={recompute}
              disabled={loading}
            >
              <FiRefreshCcw />
              {loading ? "Recomputing..." : "Recompute ranking"}
            </button>
          </div>
        </div>
        {message && (
          <p className="success-message">
            <FiCheck /> {message}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-400 mt-3 flex items-center gap-2">
            <FiAlertTriangle /> {error}
          </p>
        )}
      </div>
    </div>
  );
}
