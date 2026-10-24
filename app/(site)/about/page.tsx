import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, ProseSection } from "@/components/layout/page-intro";
import { mailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Biz haqimizda",
  description: "OliyRank — Oʻzbekiston universitetlarining mustaqil, ochiq maʼlumotlarga asoslangan reytingi. Maqsadimiz va tamoyillarimiz.",
};

const GOALS = [
  {
    title: "Oʻzbekiston universitetlari reytingi",
    body: "Barcha universitetlarni bir xil, oldindan eʼlon qilingan mezonlar boʻyicha baholab, tushunarli reyting tuzish.",
  },
  {
    title: "Har bir raqam tekshiriladi",
    body: "Faqat rasmiy va ishonchli ochiq manbalar. Har bir koʻrsatkichning manbasi va hisoblash usuli ochiq.",
  },
  {
    title: "Abituriyent uchun",
    body: "Reklama va mish-mishlar oʻrniga dalil: qayerga kirish qiyin, qayerda ilm-fan kuchli — raqamlar bilan.",
  },
];

const SOURCES = [
  { name: "Bilim va malakalarni baholash agentligi", detail: "2025-yil qabul natijalari (my.uzbmb.uz)" },
  { name: "OpenAlex", detail: "Ochiq ilmiy maqolalar bazasi (CC0)" },
  { name: "ROR", detail: "Xalqaro tashkilotlar reyestri (CC0)" },
  { name: "Taʼlim sifatini taʼminlash milliy agentligi", detail: "Milliy reyting (eʼlon qilingach)" },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="Biz haqimizda" title="Oʻzbekiston universitetlarining mustaqil reytingi.">
        OliyRank — universitetlarni ochiq maʼlumotlar asosida, oshkora formula bilan baholaydigan mustaqil loyiha.
        Maqsadimiz bitta: abituriyent va ota-onalarga toʻgʻri tanlov qilish uchun ishonchli raqamlar berish.
      </PageIntro>

      <div className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {GOALS.map((goal) => (
            <div key={goal.title} className="rounded-2xl border border-line bg-paper-raised p-6">
              <h2 className="font-serif text-xl font-medium">{goal.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-soft">{goal.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <ProseSection title="Nima uchun OliyRank?">
              <p>
                Global reytinglar (QS, THE) dunyoning ilmiy universitetlarini solishtirish uchun yaratilgan va Oʻzbekistondan
                atigi bir necha universitetni qamrab oladi. Abituriyent esa oʻz shahridagi, oʻz yoʻnalishidagi
                universitetlarni solishtirishi kerak. OliyRank shu boʻshliqni toʻldirishga harakat qiladi.
              </p>
            </ProseSection>
            <ProseSection title="Hozirgi holat">
              <p>
                Loyiha <strong>sinov bosqichida</strong>. 2026-yilgi reyting dastlabki nashr: u faqat hozir ochiq maʼlumoti bor
                koʻrsatkichlarga — qabul raqobati va ilmiy faoliyatga asoslangan. Qolgan ustunlar ishonchli maʼlumot paydo
                boʻlgach qoʻshiladi. <Link href="/methodology">Metodologiya bilan tanishing.</Link>
              </p>
            </ProseSection>
            <ProseSection title="Mustaqillik">
              <p>
                OliyRank hech qaysi universitet, davlat organi yoki tijorat tashkiloti bilan bogʻliq emas va ulardan pul
                olmaydi. Reytingdagi oʻrinni sotib olib boʻlmaydi. Biz rasmiy reyting emasmiz — rasmiy milliy reytingni Taʼlim
                sifatini taʼminlash milliy agentligi yuritadi.
              </p>
            </ProseSection>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-line bg-paper-raised p-6">
              <h2 className="font-serif text-xl font-medium">Maʼlumot manbalari</h2>
              <ul className="mt-4 divide-y divide-line">
                {SOURCES.map((source) => (
                  <li key={source.name} className="py-3">
                    <p className="font-medium">{source.name}</p>
                    <p className="text-sm text-ink-soft">{source.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-firuza p-6 text-on-firuza">
              <h2 className="font-serif text-xl font-medium">Davom ettiraylikmi?</h2>
              <p className="mt-2 leading-relaxed opacity-90">
                OliyRank kerakli loyihami — sizning fikringiz hal qiladi. Taklif, tanqid yoki maqtov — barchasini yozing.
              </p>
              <a href={mailto("OliyRank haqida fikr")} className="mt-5 inline-flex rounded-full bg-paper px-5 py-2.5 font-medium text-ink">
                Fikr yuborish
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
