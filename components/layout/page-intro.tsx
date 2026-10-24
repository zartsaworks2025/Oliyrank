export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line bg-paper-raised">
      <div className="container-page py-14 lg:py-20">
        <p className="text-sm font-semibold tracking-[0.14em] text-anor uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight font-medium text-balance sm:text-5xl">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">{children}</div>}
      </div>
    </header>
  );
}

/** Long-form text section used by the legal and about pages. */
export function ProseSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-10 first:border-t-0 first:pt-0">
      <h2 className="font-serif text-2xl font-medium">{title}</h2>
      <div className="mt-4 space-y-3 leading-relaxed text-ink-soft [&_a]:text-firuza [&_a]:underline-offset-2 hover:[&_a]:underline [&_li]:pl-1 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
