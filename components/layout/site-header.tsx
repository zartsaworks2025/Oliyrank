"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NAV_LINKS } from "./nav";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-line bg-paper/90 backdrop-blur-md"
          : "border-transparent bg-paper"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Asosiy menyu" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[0.95rem] transition-colors ${
                isActive(link.href)
                  ? "bg-firuza-soft text-firuza-strong"
                  : "text-ink-soft hover:bg-paper-sunk hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link
            href="/signin"
            className="hidden whitespace-nowrap rounded-full px-4 py-2 text-[0.95rem] text-ink-soft transition-colors hover:text-ink sm:inline-flex"
          >
            Kirish
          </Link>
          <Link
            href="/signup"
            className="hidden whitespace-nowrap rounded-full bg-ink px-4 py-2 text-[0.95rem] font-medium text-paper transition-colors hover:bg-firuza sm:inline-flex"
          >
            Roʻyxatdan oʻtish
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menyuni yopish" : "Menyuni ochish"}
            className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-paper-sunk lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper lg:hidden">
          <nav aria-label="Mobil menyu" className="container-page flex flex-col py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="border-b border-line py-4 font-serif text-2xl text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link
                href="/signin"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-line-strong px-4 py-3 text-center font-medium"
              >
                Kirish
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-ink px-4 py-3 text-center font-medium text-paper"
              >
                Roʻyxatdan oʻtish
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
