import Link from "next/link";
import { PILLARS } from "@/lib/methodology";
import type { EditionScope } from "@/lib/ranking/data";

/** Explains that a preview edition ranks on part of the methodology only. */
export function EditionNotice({ scope, className = "" }: { scope: EditionScope; className?: string }) {
  if (!scope.isPreview) return null;
  const included = PILLARS.filter((p) => scope.pillarKeys.includes(p.key)).map((p) => p.name);
  const missing = PILLARS.filter((p) => !scope.pillarKeys.includes(p.key)).map((p) => p.name);

  return (
    <div role="note" className={`rounded-2xl border border-oltin/40 bg-oltin-soft px-5 py-4 text-[0.95rem] leading-relaxed ${className}`}>
      <p>
        <strong className="font-semibold">Dastlabki nashr.</strong> Bu reyting faqat hozir ochiq va ishonchli maʼlumoti
        bor koʻrsatkichlarga asoslangan: <strong className="font-semibold">{included.join(" va ")}</strong> (rasmiy
        2025-yil qabul natijalari va OpenAlex ilmiy bazasi).
      </p>
      <p className="mt-1.5 text-ink-soft">
        {missing.join(", ")} ustunlari milliy reyting maʼlumotlari va tasdiqlangan soʻrovnomalar eʼlon qilingach
        qoʻshiladi.{" "}
        <Link href="/methodology#availability" className="font-medium text-firuza hover:underline">
          Batafsil
        </Link>
      </p>
    </div>
  );
}
