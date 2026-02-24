import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../scss/main.scss"; // SCSS imports
import LayoutContent from "@/components/layout/LayoutContent";
import { auth } from "@/auth";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
  const themeInitScript = `
    (function() {
      try {
        var saved = localStorage.getItem('oliyrank-theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = saved === 'light' || saved === 'dark' ? saved : (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
      } catch (_) {}
    })();
  `;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <ThemeProvider>
          <LayoutContent user={session?.user}>
            {children}
          </LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
