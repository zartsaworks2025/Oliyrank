import type { Metadata, Viewport } from "next";
import { Literata, Onest } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { themeInitScript } from "@/components/theme/theme-script";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext", "cyrillic"],
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oliyrank.com"),
  title: {
    default: "OliyRank — Oʻzbekiston universitetlari reytingi",
    template: "%s · OliyRank",
  },
  description:
    "Oʻzbekiston universitetlarining mustaqil, shaffof reytingi. Solishtiring, sharhlarni oʻqing va oʻzingizga mosini tanlang.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4ec" },
    { media: "(prefers-color-scheme: dark)", color: "#15130f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      className={`${literata.variable} ${onest.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
