export function DemoNotice({ className = "" }: { className?: string }) {
  return (
    <p
      role="note"
      className={`flex items-start gap-2.5 rounded-xl border border-anor/30 bg-anor-soft px-4 py-3 text-sm leading-relaxed text-ink ${className}`}
    >
      <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-anor" />
      <span>
        <strong className="font-semibold">Namuna maʼlumot.</strong> Bu raqamlar dizaynni sinash uchun avtomatik
        yaratilgan va haqiqiy reyting emas.
      </span>
    </p>
  );
}
