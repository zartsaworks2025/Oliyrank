import Link from "next/link";
import { StarMark } from "@/components/brand/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderWithAccount } from "@/components/layout/site-chrome";

export default function NotFound() {
  return (
    <>
      <SiteHeaderWithAccount />
      <main className="flex-1">
        <section className="container-page flex flex-col items-center py-28 text-center">
          <StarMark className="size-12 text-oltin" />
          <h1 className="mt-8 font-serif text-4xl font-medium sm:text-5xl">Sahifa topilmadi</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
            Manzil notoʻgʻri kiritilgan yoki sahifa olib tashlangan boʻlishi mumkin.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-full bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-firuza">
              Bosh sahifa
            </Link>
            <Link href="/rankings" className="rounded-full border border-line-strong px-6 py-3 font-medium transition-colors hover:border-firuza hover:text-firuza">
              Reytinglar
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
