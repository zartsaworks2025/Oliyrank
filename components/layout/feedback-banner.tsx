"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "oliyrank-feedback-banner-dismissed";
const listeners = new Set<() => void>();

const isDismissed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

/**
 * Site-wide note that OliyRank is a test project asking for feedback. Hidden until
 * hydrated (so the server never renders it for someone who dismissed it), then
 * remembered per browser once closed.
 */
export function FeedbackBanner() {
  const dismissed = useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    isDismissed,
    () => true,
  );
  if (dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    listeners.forEach((listener) => listener());
  };

  return (
    <div className="border-b border-oltin/30 bg-oltin-soft">
      <div className="container-page flex items-center gap-3 py-2.5 text-sm">
        <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-oltin" />
        <p className="flex-1 leading-snug">
          <strong className="font-semibold">OliyRank sinov bosqichida.</strong> Loyihani davom ettirishimiz kerakmi? Fikr va
          takliflaringizni{" "}
          <Link href="/contact" className="font-medium underline underline-offset-2 hover:text-firuza">
            bizga yozing
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Xabarni yopish"
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper/60 hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
