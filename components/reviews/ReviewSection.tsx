"use client";

import { useCallback, useEffect, useState } from "react";

type ReviewItem = {
  id: number;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  user: { name: string };
  votes: { up: number; down: number };
  myVote: number;
};

interface ReviewSectionProps {
  institutionId: number;
  canReview: boolean;
}

export default function ReviewSection({ institutionId, canReview }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?institutionId=${institutionId}`);
      const data = (await response.json()) as { reviews: ReviewItem[] };
      setReviews(data.reviews ?? []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  useEffect(() => {
    void fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institutionId,
        rating,
        title,
        body,
      }),
    });

    if (response.ok) {
      setTitle("");
      setBody("");
      setMessage("Sharhingiz qabul qilindi. Moderatsiyadan so'ng chiqadi.");
    } else {
      setMessage("Sharh yuborishda xatolik yuz berdi.");
    }
  };

  const vote = async (reviewId: number, value: number) => {
    await fetch(`/api/reviews/${reviewId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    await fetchReviews();
  };

  const report = async (reviewId: number) => {
    const reason = window.prompt("Sababni qisqacha yozing");
    if (!reason) return;

    await fetch(`/api/reviews/${reviewId}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    setMessage("Sharh haqida xabar yuborildi. Rahmat!");
  };

  return (
    <section className="reviews">
      <div className="reviews__header">
        <h2>Talabalar sharhlari</h2>
        <p>Haqiqiy tajriba va fikrlar asosida baho bering.</p>
      </div>

      {canReview ? (
        <form className="reviews__form" onSubmit={handleSubmit}>
          <div className="reviews__form-row">
            <div className="reviews__field">
              <label>Baholash</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} / 5
                  </option>
                ))}
              </select>
            </div>
            <div className="reviews__field">
              <label>Sarlavha</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Qisqa xulosa"
                required
              />
            </div>
          </div>

          <div className="reviews__field">
            <label>Sharh</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Tajribangizni yozib qoldiring"
              rows={4}
              required
            />
          </div>

          <button type="submit" className="btn--primary">
            Sharh yuborish
          </button>

          {message && <p className="reviews__message">{message}</p>}
        </form>
      ) : (
        <div className="reviews__notice">
          Sharh qoldirish uchun tizimga kirish kerak.
        </div>
      )}

      <div className="reviews__list">
        {loading ? (
          <div className="reviews__empty">Yuklanmoqda...</div>
        ) : reviews.length === 0 ? (
          <div className="reviews__empty">Hozircha sharhlar yo&apos;q.</div>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="review-card">
              <header className="review-card__header">
                <div>
                  <h3>{review.title}</h3>
                  <span className="review-card__meta">
                    {review.user.name} · {new Date(review.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
                <span className="review-card__rating">{review.rating} / 5</span>
              </header>
              <p className="review-card__body">{review.body}</p>
              <div className="review-card__actions">
                <button
                  type="button"
                  className={`vote-btn ${review.myVote === 1 ? "active" : ""}`}
                  onClick={() => vote(review.id, review.myVote === 1 ? 0 : 1)}
                >
                  ▲ {review.votes.up}
                </button>
                <button
                  type="button"
                  className={`vote-btn ${review.myVote === -1 ? "active" : ""}`}
                  onClick={() => vote(review.id, review.myVote === -1 ? 0 : -1)}
                >
                  ▼ {review.votes.down}
                </button>
                <button type="button" className="report-btn" onClick={() => report(review.id)}>
                  Xabar berish
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
