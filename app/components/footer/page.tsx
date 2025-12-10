"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

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
            OliyRank - O'zbekistondagi universitet va o'quv markazlari reytingi uchun yetakchi platforma. 
            Biz talabalarga to'g'ri qaror qabul qilishda yordam berish uchun aniq va yangilangan ma'lumotlarni taqdim etamiz.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Tezkor havolalar</h3>
          <ul>
            <li><Link href="/about">Biz haqimizda</Link></li>
            <li><Link href="/rankings">Reytinglar</Link></li>
            <li><Link href="/methodology">Metodologiya</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Bog'lanish</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Kategoriyalar</h3>
          <ul>
            <li><Link href="/rankings/universities">Universitetlar</Link></li>
            <li><Link href="/rankings/colleges">Kollejlar</Link></li>
            <li><Link href="/rankings/schools">Maktablar</Link></li>
            <li><Link href="/rankings/courses">Onlayn kurslar</Link></li>
            <li><Link href="/rankings/scholarships">Grantlar</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Bog'lanish</h3>
          <p><FaMapMarkerAlt /> O'zbekiston, Toshkent sh., Universitet ko'chasi, 123</p>
          <p><FaPhone /> +998 90 123 45 67</p>
          <p><FaEnvelope /> zartsaworks@gmail.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} ZartsaWorks. Barcha huquqlar himoyalangan. | <Link href="/privacy">Maxfiylik siyosati</Link> | <Link href="/terms">Foydalanish shartlari</Link></p>
      </div>
    </footer>
  );
}
