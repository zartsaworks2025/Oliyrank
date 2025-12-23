// components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/rankings", label: "Rankings" },
    { href: "/news", label: "News" },
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

import { logout } from "@/app/lib/actions";

// ... imports

interface HeaderProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function Header({ user }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // ... existing useEffects for scroll and body lock ...
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                    <div className="header-button flex items-center gap-4">
                        {user ? (
                            <div className="relative group">
                                <button
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm"
                                    aria-haspopup="true"
                                >
                                    <div className="relative">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-transparent group-hover:ring-indigo-500/50 transition-all duration-300 shadow-lg shadow-indigo-500/20">
                                            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 shadow-sm"></div>
                                    </div>
                                    <div className="hidden md:flex flex-col items-start">
                                        <span className="text-sm font-semibold text-white max-w-[120px] truncate leading-tight">
                                            {user.name || user.email}
                                        </span>
                                        <span className="text-xs text-slate-400">View Profile</span>
                                    </div>
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-all duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Enhanced Premium Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-slate-900/98 backdrop-blur-2xl border border-slate-700/60 shadow-2xl shadow-black/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-1 transition-all duration-200 transform origin-top-right z-50 overflow-hidden">
                                    {/* User Info Header with Gradient */}
                                    <div className="relative p-6 bg-gradient-to-br from-indigo-600/15 to-purple-600/15 border-b border-slate-700/60">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-indigo-500/20">
                                                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-3 border-slate-900 shadow-sm"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-base font-bold text-white truncate mb-1">{user.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600/25 to-purple-600/25 border border-indigo-500/40 text-indigo-300 rounded-full text-xs font-bold tracking-wide">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                USER
                                            </span>
                                        </div>
                                    </div>

                                    {/* Menu Items with Better Spacing */}
                                    <div className="p-3">
                                        <Link href="/profile" className="flex items-center gap-3.5 px-4 py-3.5 text-sm text-slate-300 rounded-xl hover:bg-gradient-to-r hover:from-indigo-600/10 hover:to-purple-600/10 hover:text-white transition-all duration-200 group/item border border-transparent hover:border-indigo-500/20 mb-1.5">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600/15 to-indigo-600/5 flex items-center justify-center group-hover/item:from-indigo-600/25 group-hover/item:to-indigo-600/10 transition-all">
                                                <svg className="w-4.5 h-4.5 text-indigo-400 group-hover/item:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm mb-0.5">Profil</p>
                                                <p className="text-xs text-slate-500 group-hover/item:text-slate-400 leading-relaxed">Profilingizni ko&apos;rish</p>
                                            </div>
                                            <svg className="w-4 h-4 text-slate-600 group-hover/item:text-indigo-400 transition-all opacity-0 group-hover/item:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>

                                        <Link href="/settings" className="flex items-center gap-3.5 px-4 py-3.5 text-sm text-slate-300 rounded-xl hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-600/10 hover:text-white transition-all duration-200 group/item border border-transparent hover:border-purple-500/20">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/15 to-purple-600/5 flex items-center justify-center group-hover/item:from-purple-600/25 group-hover/item:to-purple-600/10 transition-all">
                                                <svg className="w-4.5 h-4.5 text-purple-400 group-hover/item:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm mb-0.5">Sozlamalar</p>
                                                <p className="text-xs text-slate-500 group-hover/item:text-slate-400 leading-relaxed">Hisob sozlamalari</p>
                                            </div>
                                            <svg className="w-4 h-4 text-slate-600 group-hover/item:text-purple-400 transition-all opacity-0 group-hover/item:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>

                                    {/* Logout Section with Divider */}
                                    <div className="p-2.5 pt-1.5 border-t border-slate-700/60">
                                        <form action={logout}>
                                            <button className="w-full flex items-center gap-3.5 px-4 py-3 text-sm text-red-400 rounded-xl hover:bg-red-600/10 hover:text-red-300 transition-all duration-200 group/item border border-transparent hover:border-red-500/20">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600/15 to-red-600/5 flex items-center justify-center group-hover/item:from-red-600/25 group-hover/item:to-red-600/10 transition-all">
                                                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-sm">Chiqish</p>
                                                    <p className="text-xs text-slate-500 group-hover/item:text-slate-400">Hisobdan chiqish</p>
                                                </div>
                                            </button>
                                        </form>
                                    </div>
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
                        {user ? (
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex items-center gap-3 px-1 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">
                                        {user.name || user.email}
                                    </span>
                                </div>
                                <Link
                                    href="/profile"
                                    className="mobile-signin-btn text-center"
                                    onClick={closeMobileMenu}
                                >
                                    Profil
                                </Link>
                                <form action={logout} className="w-full">
                                    <button className="mobile-signup-btn w-full bg-red-600 hover:bg-red-700 border-none">
                                        Chiqish
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
