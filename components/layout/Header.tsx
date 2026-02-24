"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/lib/actions";
import ThemeToggle from "@/components/theme/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rankings", label: "Rankings" },
  { href: "/compare", label: "Compare" },
  { href: "/blog", label: "Blog" },
  { href: "/methodology", label: "Methodology" },
  { href: "/contact", label: "Contact" },
];

function Navbar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="header-navbar" aria-label="Main navigation">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`header-navbar-items${pathname === link.href ? " active" : ""}`}
          onClick={onLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const displayName = user?.name || user?.email || "Profile";
  const avatar = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <>
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <div className="header-wrap">
          <div className="header-logo">
            <Link href="/">OliyRank</Link>
          </div>

          <Navbar />

          <div className="header-button">
            <ThemeToggle />

            {user ? (
              <div className="user-menu">
                <button
                  type="button"
                  className="user-menu__trigger"
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  aria-expanded={isUserMenuOpen}
                >
                  <span className="user-menu__avatar">{avatar}</span>
                  <span className="user-menu__name">{displayName}</span>
                </button>

                <div className={`user-menu__dropdown${isUserMenuOpen ? " open" : ""}`}>
                  <Link href="/profile" onClick={() => setIsUserMenuOpen(false)}>
                    Profil
                  </Link>
                  <Link href="/bookmarks" onClick={() => setIsUserMenuOpen(false)}>
                    Saqlanganlar
                  </Link>
                  <Link href="/settings" onClick={() => setIsUserMenuOpen(false)}>
                    Sozlamalar
                  </Link>
                  <form action={logout}>
                    <button type="submit">Chiqish</button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                <Link href="/signin" className="header-signin-btn">
                  Sign In
                </Link>
                <Link href="/signup" className="header-signup-btn">
                  Sign Up
                </Link>
              </>
            )}

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? "X" : "?"}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${isMobileMenuOpen ? " active" : ""}`}>
        <div className="mobile-menu-inner">
          <Navbar onLinkClick={() => setIsMobileMenuOpen(false)} />

          <div className="mobile-auth-buttons">
            <ThemeToggle compact />

            {user ? (
              <>
                <Link href="/profile" className="mobile-signin-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  Profil
                </Link>
                <Link href="/bookmarks" className="mobile-signin-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  Saqlanganlar
                </Link>
                <Link href="/settings" className="mobile-signin-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  Sozlamalar
                </Link>
                <form action={logout}>
                  <button type="submit" className="mobile-signup-btn">
                    Chiqish
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/signin" className="mobile-signin-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/signup" className="mobile-signup-btn" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
