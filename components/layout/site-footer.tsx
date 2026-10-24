import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const FOOTER_COLUMNS = [
  {
    title: "Platforma",
    links: [
      { href: "/rankings", label: "Reytinglar" },
      { href: "/compare", label: "Taqqoslash" },
      { href: "/methodology", label: "Metodologiya" },
    ],
  },
  {
    title: "OliyRank",
    links: [
      { href: "/about", label: "Biz haqimizda" },
      { href: "/journal", label: "Jurnal" },
      { href: "/contact", label: "Aloqa" },
    ],
  },
  {
    title: "Huquqiy",
    links: [
      { href: "/privacy", label: "Maxfiylik siyosati" },
      { href: "/terms", label: "Foydalanish shartlari" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-paper-sunk">
      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
            Oʻzbekiston universitetlari haqida mustaqil, shaffof va tushunarli maʼlumot.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="text-xs font-semibold tracking-[0.14em] text-ink-faint uppercase">
              {column.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[0.95rem] text-ink-soft transition-colors hover:text-firuza">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 OliyRank</p>
          <p>Toshkentda talabalar uchun yaratildi.</p>
        </div>
      </div>
    </footer>
  );
}
