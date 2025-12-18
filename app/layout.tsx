```
"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../scss/main.scss"; // 🔹 SCSS shu yerda ulanyapti

import Header from "./layout/header/page";
import Footer from "./layout/footer/page";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OliyRank",
  description: "Ranking platform for universities in Uzbekistan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <html
      lang="en"
      className={`${ geistSans.variable } ${ geistMono.variable } `}
    >
      <body className="bg-slate-950 text-slate-100 antialiased flex flex-col min-h-screen">
        {!isAdmin && <Header />}
        <main className="flex-grow">{children}</main>
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
```
