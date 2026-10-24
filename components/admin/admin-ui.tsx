import { Suspense } from "react";

/** Wraps an admin page's content: the admin check reads the session, so it needs Suspense. */
export function AdminPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-paper-sunk" aria-hidden="true" />}>{children}</Suspense>;
}

export function AdminTitle({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-serif text-3xl font-medium sm:text-4xl">{title}</h1>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}

export const buttonClass = {
  primary: "inline-flex items-center rounded-full bg-ink px-5 py-2.5 font-medium text-paper transition-colors hover:bg-firuza disabled:opacity-60",
  secondary: "inline-flex items-center rounded-full border border-line-strong px-5 py-2.5 font-medium transition-colors hover:border-firuza hover:text-firuza disabled:opacity-60",
  danger: "inline-flex items-center rounded-full border border-anor/40 px-5 py-2.5 font-medium text-anor transition-colors hover:bg-anor-soft disabled:opacity-60",
};

export const inputClass =
  "mt-1.5 w-full rounded-xl border border-line-strong bg-paper-raised px-4 py-2.5 outline-none transition-colors focus:border-firuza aria-[invalid=true]:border-anor";
