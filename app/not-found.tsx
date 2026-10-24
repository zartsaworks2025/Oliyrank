import Link from "next/link";
import { StarMark } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <section className="container-page flex flex-col items-center py-28 text-center">
      <StarMark className="size-12 text-oltin" />
      <h1 className="mt-8 font-serif text-4xl font-medium sm:text-5xl">Bu sahifa hali tayyor emas</h1>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
        Yoki manzil notoʻgʻri kiritilgan. Biz platformani qaytadan qurmoqdamiz — tez orada shu yerda boʻladi.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-firuza"
      >
        Bosh sahifaga qaytish
      </Link>
    </section>
  );
}
