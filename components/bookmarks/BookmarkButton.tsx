"use client";

import { useState } from "react";

interface BookmarkButtonProps {
  institutionId: number;
  initialBookmarked?: boolean;
}

export default function BookmarkButton({
  institutionId,
  initialBookmarked = false,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const toggleBookmark = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (bookmarked) {
        const response = await fetch(
          `/api/bookmarks?institutionId=${institutionId}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          setBookmarked(false);
        }
      } else {
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ institutionId }),
        });
        if (response.ok) {
          setBookmarked(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`bookmark-btn ${bookmarked ? "bookmark-btn--active" : ""}`}
      onClick={toggleBookmark}
      disabled={loading}
    >
      {bookmarked ? "Saqlangan" : "Saqlash"}
    </button>
  );
}
