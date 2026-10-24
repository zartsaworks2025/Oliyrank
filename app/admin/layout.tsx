import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { signOut } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · OliyRank" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Boshqaruv" },
  { href: "/admin/universities", label: "Universitetlar" },
  { href: "/admin/articles", label: "Maqolalar" },
];

// Every page checks admin rights itself (inside Suspense); the shell reads no session.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      <aside className="border-b border-line bg-paper-sunk lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 p-5 lg:block">
          <Logo />
          <span className="rounded-full bg-anor-soft px-2.5 py-1 text-xs font-semibold text-anor lg:mt-3 lg:inline-block">Admin</span>
        </div>
        <nav aria-label="Admin menyusi" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2.5 whitespace-nowrap text-ink-soft transition-colors hover:bg-paper hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden space-y-1 border-t border-line p-3 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <Link href="/" className="block rounded-xl px-3 py-2.5 text-ink-soft hover:bg-paper hover:text-ink">
            ← Saytga qaytish
          </Link>
          <div className="flex items-center justify-between px-1">
            <form action={signOut}>
              <button type="submit" className="rounded-xl px-2 py-2.5 text-ink-soft hover:text-anor">
                Chiqish
              </button>
            </form>
            <ThemeToggle />
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
