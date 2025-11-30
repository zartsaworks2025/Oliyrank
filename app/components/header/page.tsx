"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="header-navbar">
      <Link href="/" className="header-navbar-items">Home</Link>
      <Link href="/rankings" className="header-navbar-items">Rankings</Link>
      <Link href="/news" className="header-navbar-items">News</Link>
      <Link href="/faq" className="header-navbar-items">FAQs</Link>
      <Link href="/contact" className="header-navbar-items">Contact us</Link>
    </nav>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-wrap">
          <div className="header-logo">
            <Link href="/">OliyRank</Link>
          </div>

          <Navbar />

          <div className="header-button">
            <button className="header-signin-btn">
              Sign In
            </button>
            <button className="header-signup-btn">
              Sign Up
            </button>
          </div>

          <button 
            className="mobile-menu-btn" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-items">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/rankings" onClick={() => setIsMobileMenuOpen(false)}>Rankings</Link>
          <Link href="/news" onClick={() => setIsMobileMenuOpen(false)}>News</Link>
          <Link href="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQs</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact us</Link>
        </div>
        <div className="mobile-auth-buttons">
          <button className="mobile-signin-btn">
            Sign In
          </button>
          <button className="mobile-signup-btn">
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
}