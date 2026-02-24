// components/layout/Footer.tsx
"use client";

import Link from "next/link";
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-wrap">
                <div className="footer-about">
                    <div className="footer-logo">
                        <Link href="/">OliyRank</Link>
                    </div>
                    <p>
                        OliyRank – O&apos;zbekistondagi universitet va o&apos;quv
                        markazlari reytingi uchun platforma. Biz talabalarga
                        to&apos;g&apos;ri qaror qabul qilishda yordam berish uchun
                        aniq va yangilangan ma&apos;lumotlarni taqdim etamiz.
                    </p>
                    <div className="footer-social">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                <div className="footer-links">
                    <h3>Tezkor havolalar</h3>
                    <ul>
                        <li>
                            <Link href="/about">Biz haqimizda</Link>
                        </li>
                        <li>
                            <Link href="/rankings">Reytinglar</Link>
                        </li>
                        <li>
                            <Link href="/methodology">Metodologiya</Link>
                        </li>
                        <li>
                            <Link href="/blog">Blog</Link>
                        </li>
                        <li>
                            <Link href="/contact">Bog&apos;lanish</Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h3>Kategoriyalar</h3>
                    <ul>
                        <li>
                            <Link href="/rankings/universities">Universitetlar</Link>
                        </li>
                        <li>
                            <Link href="/rankings/colleges">Kollejlar</Link>
                        </li>
                        <li>
                            <Link href="/rankings/schools">Maktablar</Link>
                        </li>
                        <li>
                            <Link href="/rankings/courses">Onlayn kurslar</Link>
                        </li>
                        <li>
                            <Link href="/rankings/scholarships">Grantlar</Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Bog&apos;lanish</h3>
                    <p>
                        <FaMapMarkerAlt /> O&apos;zbekiston, Xorazm viloyati,
                        Urganch shahri
                    </p>
                    <p>
                        <FaPhone /> +998 97 790 21 05 
                    </p>
                    <p>
                        <FaEnvelope /> zartsaworks@gmail.com
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    <span>
                        &copy; {currentYear} OliyRank. Barcha huquqlar
                        himoyalangan.
                    </span>
                    <span className="footer-bottom-links">
                        <Link href="/privacy">Maxfiylik siyosati</Link>
                        <span>•</span>
                        <Link href="/terms">Foydalanish shartlari</Link>
                    </span>
                </p>
            </div>
        </footer>
    );
}
