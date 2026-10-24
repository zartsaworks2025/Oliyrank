import Link from "next/link";

/** Eight-pointed star (girih) mark, a motif found across Samarkand and Bukhara tilework. */
export function StarMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect x="7" y="7" width="18" height="18" rx="2.5" fill="currentColor" />
      <rect
        x="7"
        y="7"
        width="18"
        height="18"
        rx="2.5"
        fill="currentColor"
        transform="rotate(45 16 16)"
      />
      <circle cx="16" cy="16" r="4.2" fill="var(--paper)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 rounded-md"
      aria-label="OliyRank bosh sahifa"
    >
      <StarMark className="size-7 text-firuza transition-transform duration-500 group-hover:rotate-45" />
      <span className="font-serif text-[1.35rem] font-semibold tracking-tight">
        Oliy<span className="text-firuza">Rank</span>
      </span>
    </Link>
  );
}
