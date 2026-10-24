import { StarMark } from "@/components/brand/logo";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="container-page flex justify-center py-16 lg:py-24">
      <div className="w-full max-w-md">
        <StarMark className="size-10 text-firuza" />
        <h1 className="mt-6 font-serif text-4xl font-medium">{title}</h1>
        <p className="mt-2 text-ink-soft">{subtitle}</p>
        <div className="mt-8 rounded-3xl border border-line bg-paper-raised p-6 sm:p-8">{children}</div>
      </div>
    </section>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-paper-sunk" />
      ))}
    </div>
  );
}
