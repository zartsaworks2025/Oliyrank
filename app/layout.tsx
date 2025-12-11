// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../scss/main.scss"; // 🔹 SCSS shu yerda ulanyapti

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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

import { auth } from "@/auth";

// ... existing imports

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-slate-950 text-slate-100 antialiased flex flex-col min-h-screen">
        <Header user={session?.user} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
