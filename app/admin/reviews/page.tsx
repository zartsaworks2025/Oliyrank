"use client";

import { useEffect, useMemo, useState } from "react";

const statusOptions = ["ALL", "PENDING", "APPROVED", "REJECTED"] as const;

type ReviewStatus = (typeof statusOptions)[number];

type ReviewItem = {
  id: number;
  title: string;
  body: string;
  rating: number;
  status: string;
  isFlagged: boolean;
  flagReason: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
  institution: { id: number; name: string };
  _count: { reports: number; votes: number };
};

export default function AdminReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>("ALL");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const query = statusFilter !== "ALL" ? `?status=${statusFilter}` : "";
      const response = await fetch(`/api/admin/reviews${query}`, { cache: "no-store" });
      const data = (await response.json()) as { reviews: ReviewItem[] };
      setReviews(data.reviews ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchReviews();
  }, [statusFilter]);

  const updateStatus = async (id: number, status: "APPROVED" | "REJECTED") => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchReviews();
  };

  const filtered = useMemo(() => reviews, [reviews]);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Reviews Moderation</h1>
        <p>Approve or reject student reviews and handle reports.</p>
      </div>

      <div className="admin-controls">
        <div className="search-wrapper">
          <select
            className="w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReviewStatus)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "ALL" ? "All statuses" : status}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={fetchReviews} className="btn-create">
          Refresh
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Institution</th>
              <th>Reviewer</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Status</th>
              <th>Reports</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 opacity-50">
                  Loading reviews...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 opacity-50">
                  No reviews found.
                </td>
              </tr>
            ) : (
              filtered.map((review) => (
                <tr key={review.id}>
                  <td className="col-name">{review.institution.name}</td>
                  <td>
                    {review.user.name ?? "Anonymous"}
                    <div className="text-xs text-slate-400">{review.user.email}</div>
                  </td>
                  <td className="font-mono">{review.rating} / 5</td>
                  <td>
                    <div className="font-semibold">{review.title}</div>
                    <div className="text-xs text-slate-400">{review.body}</div>
                    {review.isFlagged && (
                      <div className="text-xs text-amber-400 mt-1">
                        Flag: {review.flagReason ?? "Manual"}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badges ${
                        review.status === "APPROVED"
                          ? "badge-active"
                          : review.status === "REJECTED"
                          ? "badge-inactive"
                          : "badge-pending"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td>{review._count.reports}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="btn-edit"
                        onClick={() => updateStatus(review.id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => updateStatus(review.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
