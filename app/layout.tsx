import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../scss/main.scss"; // SCSS imports
import LayoutContent from "@/components/layout/LayoutContent";
import { auth } from "@/auth";

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
        <LayoutContent user={session?.user}>
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}
