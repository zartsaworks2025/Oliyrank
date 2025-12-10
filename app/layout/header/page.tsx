// app/layout/header/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rankings", label: "Rankings" },
  { href: "/news", label: "News" },
  // NOTE: change this to "/faqs" if your folder is app/faqs/page.tsx
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact us" },
];

function Navbar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="header-navbar">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            "header-navbar-items" +
            (pathname === link.href ? " active" : "")
          }
          onClick={onLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // header shadow / bg on scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-wrap">
          <div className="header-logo">
            <Link href="/">OliyRank</Link>
          </div>

          {/* Desktop navbar */}
          <Navbar />

          {/* Desktop auth buttons — now real links */}
          <div className="header-button">
            <Link href="/signin" className="header-signin-btn">
              Sign In
            </Link>
            <Link href="/signup" className="header-signup-btn">
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button (burger -> X) */}
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-inner">
          {/* full-width clickable links */}
          <Navbar onLinkClick={closeMobileMenu} />

          <div className="mobile-auth-buttons">
            <Link
              href="/signin"
              className="mobile-signin-btn"
              onClick={closeMobileMenu}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="mobile-signup-btn"
              onClick={closeMobileMenu}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
