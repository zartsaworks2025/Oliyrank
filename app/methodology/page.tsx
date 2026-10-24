import type { Metadata } from "next";
import Link from "next/link";
import { PILLAR_BG } from "@/lib/labels";
import { INDICATOR_COUNT, METHODOLOGY_VERSION, PILLARS, SCORING, pillarWeight } from "@/lib/methodology";

export const metadata: Metadata = {
  title: "Metodologiya",
  description: "OliyRank universitetlarni qanday baholaydi: ustunlar, koʻrsatkichlar, vaznlar, maʼlumot manbalari va hisoblash qoidalari.",
};

const PRINCIPLES = [
  {
    title: "Abituriyent uchun",
    body: "Har bir koʻrsatkich abituriyent beradigan savolga javob beradi: yaxshi oʻqiymanmi, ishga joylashamanmi, kirish qanchalik qiyin, talabalar nima deydi?",
  },
  {
    title: "Natija muhimroq",
    body: "Eng katta vazn — bitiruvchilar natijasida (30%). Xorijiy akademiklar soʻrovnomasiga asoslangan obroʻ koʻrsatkichlari ishlatilmaydi.",
  },
  {
    title: "Tekshirsa boʻladigan raqamlar",
    body: "Har bir koʻrsatkich manbasi koʻrsatilgan. Imkon qadar hamma qayta yuklab olishi mumkin boʻlgan ochiq maʼlumotlar ishlatiladi.",
  },
  {
    title: "Hajm emas, sifat",
    body: "Ilmiy koʻrsatkichlar oʻqituvchi boshiga va soha boʻyicha meʼyorlangan: katta universitet faqat kattaligi uchun yutmaydi.",
  },
];

const COMPARISON = [
  { name: "QS World University Rankings", note: "Obroʻ soʻrovnomalari 45%, iqtiboslar 20%, bitiruvchilar natijasi 5%." },
  { name: "THE World University Rankings", note: "Obroʻ 33%, ilmiy muhit va sifat 59%, bitiruvchilar natijasi yoʻq." },
  { name: "ARWU (Shanghai)", note: "Faqat ilmiy natijalar: Nobel, eng koʻp iqtibos olgan olimlar, Nature/Science." },
  {
    name: "Milliy reyting (Taʼlim sifatini taʼminlash milliy agentligi, 2026)",
    note: "25 koʻrsatkich; bitiruvchilar bloki 30–50 ball. OliyRank undan bitiruvchilar maʼlumotlarini oladi va soha boʻyicha meʼyorlangan iqtibos hamda xalqaro hammualliflikni qoʻshadi.",
  },
];

const SCORING_STEPS = [
  { title: "Oʻzgartirish", body: "Keskin notekis taqsimlangan koʻrsatkichlar (masalan, maqolalar soni) logarifmlanadi." },
  {
    title: "Chetki qiymatlarni cheklash",
    body: `Qiymatlar ${Math.round(SCORING.winsorize[0] * 100)}- va ${Math.round(SCORING.winsorize[1] * 100)}-persentil oraligʻida kesiladi, shunda bitta haddan tashqari qiymat boshqalarni “ezib” yubormaydi.`,
  },
  {
    title: "0–100 shkala",
    body: "100 — shu koʻrsatkich boʻyicha eng kuchli universitetlar darajasi, 0 — eng zaif. “Kamroq — yaxshiroq” koʻrsatkichlarda shkala teskari.",
  },
  { title: "Ustun bali", body: "Ustundagi koʻrsatkichlar ballarining vaznli oʻrtachasi." },
  { title: "Umumiy ball", body: "Barcha ustunlarning vaznli oʻrtachasi, bir xona aniqlikda." },
  {
    title: "Oʻrin",
    body: "Teng ballar bir xil oʻrinni egallaydi (“=5”). Bir xil oʻrindagilar bitiruvchilar natijasi boʻyicha tartiblanadi.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="pb-24">
      <header className="border-b border-line bg-paper-raised">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:py-20">
          <div>
            <p className="text-sm font-semibold tracking-[0.14em] text-anor uppercase">Metodologiya v{METHODOLOGY_VERSION}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight font-medium text-balance sm:text-5xl">
              Qanday baholaymiz — hammasi ochiq.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">
              {PILLARS.length} ta ustun, {INDICATOR_COUNT} ta koʻrsatkich, 100 ball. Har bir vazn, manba va hisoblash
              qoidasi shu sahifada. Reytingdagi har qanday raqamni qayta tekshirishingiz mumkin.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex h-3 overflow-hidden rounded-full" role="img" aria-label={PILLARS.map((p) => `${p.name} ${pillarWeight(p)}%`).join(", ")}>
              {PILLARS.map((pillar) => (
                <span key={pillar.key} className={`${PILLAR_BG[pillar.key]} border-r-2 border-paper last:border-r-0`} style={{ width: `${pillarWeight(pillar)}%` }} />
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {PILLARS.map((pillar) => (
                <li key={pillar.key} className="flex items-center gap-2.5">
                  <span className={`size-2.5 rounded-full ${PILLAR_BG[pillar.key]}`} aria-hidden="true" />
                  <a href={`#${pillar.key}`} className="flex-1 hover:text-firuza">
                    {pillar.name}
                  </a>
                  <span className="font-serif font-medium tabular-nums">{pillarWeight(pillar)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <div className="container-page">
        {/* Principles */}
        <section className="py-16" aria-labelledby="principles">
          <h2 id="principles" className="font-serif text-3xl font-medium">
            Tamoyillar
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="border-t border-line-strong pt-5">
                <h3 className="font-serif text-lg font-medium">{principle.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{principle.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars and indicators */}
        <section aria-labelledby="indicators" className="border-t border-line py-16">
          <h2 id="indicators" className="font-serif text-3xl font-medium">
            Ustunlar va koʻrsatkichlar
          </h2>
          <div className="mt-8 space-y-6">
            {PILLARS.map((pillar) => (
              <article key={pillar.key} id={pillar.key} className="scroll-mt-24 rounded-2xl border border-line bg-paper-raised">
                <div className="flex items-start justify-between gap-4 border-b border-line p-6">
                  <div>
                    <h3 className="flex items-center gap-2.5 font-serif text-2xl font-medium">
                      <span className={`size-3 rounded-full ${PILLAR_BG[pillar.key]}`} aria-hidden="true" />
                      {pillar.name}
                    </h3>
                    <p className="mt-1.5 text-ink-soft">{pillar.summary}</p>
                  </div>
                  <span className="font-serif text-4xl font-medium tabular-nums">
                    {pillarWeight(pillar)}
                    <span className="text-xl text-ink-faint">%</span>
                  </span>
                </div>
                <ul className="divide-y divide-line">
                  {pillar.indicators.map((indicator) => (
                    <li key={indicator.key} className="grid gap-x-8 gap-y-2 p-6 md:grid-cols-[1fr_1.4fr_auto]">
                      <div>
                        <p className="font-medium">{indicator.name}</p>
                        <p className="mt-1 text-sm text-ink-faint">
                          {indicator.unit}
                          {indicator.lowerIsBetter && " · kamroq — yaxshiroq"}
                        </p>
                      </div>
                      <div className="text-[0.95rem] leading-relaxed text-ink-soft">
                        <p>{indicator.description}</p>
                        <p className="mt-1.5 text-sm">
                          <span className="text-ink-faint">Manba:</span> {indicator.source}
                        </p>
                      </div>
                      <p className="font-serif text-2xl font-medium tabular-nums md:text-right">{indicator.weight}%</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Scoring */}
        <section aria-labelledby="scoring" className="border-t border-line py-16">
          <h2 id="scoring" className="font-serif text-3xl font-medium">
            Ball qanday hisoblanadi
          </h2>
          <ol className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {SCORING_STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="font-serif text-4xl font-light text-oltin">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-serif text-lg font-medium">{step.title}</h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Missing data */}
        <section id="missing-data" aria-labelledby="missing-heading" className="scroll-mt-24 border-t border-line py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 id="missing-heading" className="font-serif text-3xl font-medium">
                Maʼlumot yetishmasa
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">
                Yetishmagan maʼlumot hech qachon jimgina nol deb olinmaydi — bu universitetni oʻzi taʼsir qila olmaydigan
                narsa uchun jazolash boʻlardi.
              </p>
            </div>
            <ul className="space-y-5">
              <li className="rounded-2xl border border-line bg-paper-raised p-5">
                <p className="font-medium">Koʻrsatkich yetishmasa</p>
                <p className="mt-1 leading-relaxed text-ink-soft">
                  Uning vazni shu ustundagi boshqa koʻrsatkichlarga oʻtadi — agar ustun vaznining kamida{" "}
                  {Math.round(SCORING.minPillarCoverage * 100)}% i maʼlumot bilan qoplangan boʻlsa. Aks holda butun ustun “maʼlumot yoʻq”
                  deb belgilanadi.
                </p>
              </li>
              <li className="rounded-2xl border border-line bg-paper-raised p-5">
                <p className="font-medium">Umumiy qamrov {Math.round(SCORING.minRankCoverage * 100)}% dan kam boʻlsa</p>
                <p className="mt-1 leading-relaxed text-ink-soft">
                  Universitet reytingga kiritilmaydi va “Maʼlumot yetarli emas” deb koʻrsatiladi. Mavjud ballari profilida
                  koʻrinib turadi.
                </p>
              </li>
              <li className="rounded-2xl border border-line bg-paper-raised p-5">
                <p className="font-medium">Kimlar baholanadi</p>
                <p className="mt-1 leading-relaxed text-ink-soft">
                  Kamida 3 yildan beri faoliyat yuritayotgan va bakalavr bitiruvchilariga ega universitetlar, xorijiy
                  universitetlar filiallari bilan birga. Harbiy oliy taʼlim muassasalari kiritilmaydi. Sanʼat va sport
                  muassasalari roʻyxatda koʻrsatiladi, lekin v1.0 da baholanmaydi.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Comparison */}
        <section aria-labelledby="comparison" className="border-t border-line py-16">
          <h2 id="comparison" className="font-serif text-3xl font-medium">
            Boshqa reytinglardan farqi
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-soft">
            Global reytinglar dunyo ilmiy universitetlarini solishtirish uchun qurilgan. 2026-yilgi QS reytingida
            Oʻzbekistondan atigi 7 ta universitet bor edi. OliyRank esa abituriyent uchun barcha universitetlarni
            solishtiradi.
          </p>
          <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper-raised">
            {COMPARISON.map((item) => (
              <div key={item.name} className="grid gap-2 p-5 md:grid-cols-[1fr_2fr]">
                <dt className="font-medium">{item.name}</dt>
                <dd className="leading-relaxed text-ink-soft">{item.note}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Data availability and the preview edition */}
        <section id="availability" aria-labelledby="availability-heading" className="scroll-mt-24 border-t border-line py-16">
          <h2 id="availability-heading" className="font-serif text-3xl font-medium">
            Maʼlumotlar va dastlabki nashr
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 leading-relaxed text-ink-soft">
              <p>
                Hozircha ochiq va ishonchli maʼlumot faqat ikki ustun uchun bor: <strong className="text-ink">qabul</strong>{" "}
                (Bilim va malakalarni baholash agentligining rasmiy 2025-yil kontrakt oʻtish ballari) va{" "}
                <strong className="text-ink">ilmiy faoliyat</strong> (OpenAlex ochiq ilmiy bazasi). Shuning uchun 2026-yil
                reytingi <em>dastlabki nashr</em> sifatida faqat shu koʻrsatkichlar boʻyicha tuzilgan.
              </p>
              <p>
                Bitiruvchilar natijasi, talabalar fikri va xalqaro aloqalar milliy reyting maʼlumotlari (1-noyabrdan) va
                tasdiqlangan soʻrovnomalar paydo boʻlgach qoʻshiladi.
              </p>
              <p>
                Universitetlar roʻyxati: 2025-yilda davlat test sinovlari orqali talaba qabul qilgan barcha OTMlar hamda oʻz
                imtihonlari bilan qabul qiladigan xususiy universitetlar va xorijiy filiallar (ROR reyestri).
              </p>
            </div>
            <ul className="space-y-4">
              <li className="rounded-2xl border border-line bg-paper-raised p-5">
                <p className="font-medium">Fraksion hisob</p>
                <p className="mt-1 leading-relaxed text-ink-soft">
                  Maqola universitetga mualliflar ulushiga qarab hisoblanadi: 20 muallifdan biri boʻlsa — 1/20. Bu xorijiy
                  maqolalardagi “mehmon” affiliatsiyalar reytingni sunʼiy oshirishining oldini oladi (CWTS Leiden Ranking
                  usuli).
                </p>
              </li>
              <li className="rounded-2xl border border-line bg-paper-raised p-5">
                <p className="font-medium">Oʻrtacha emas, median</p>
                <p className="mt-1 leading-relaxed text-ink-soft">
                  Bir nechta haddan tashqari koʻp iqtibos olgan maqola butun universitet balini koʻtarib yubormasligi uchun
                  iqtibos taʼsiri median boʻyicha olinadi.
                </p>
              </li>
              <li className="rounded-2xl border border-line bg-paper-raised p-5">
                <p className="font-medium">Kamida {SCORING.minCoreWorks} ta maqola</p>
                <p className="mt-1 leading-relaxed text-ink-soft">
                  Soʻnggi 5 yilda {SCORING.minCoreWorks} tadan kam (fraksion) maqola boʻlsa, ilmiy koʻrsatkichlar hisoblanmaydi —
                  bunday kichik namuna ishonchli emas.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Publication */}
        <section aria-labelledby="publication" className="border-t border-line pt-16">
          <h2 id="publication" className="font-serif text-3xl font-medium">
            Nashr va tuzatishlar
          </h2>
          <ul className="mt-6 max-w-3xl space-y-3 leading-relaxed text-ink-soft">
            <li>Reyting har yili dekabrda — milliy reyting (1-noyabr) va qabul natijalaridan keyin eʼlon qilinadi.</li>
            <li>Universitetlar nashrdan oldin 14 kun davomida oʻz maʼlumotlarini koʻrib chiqib, dalil bilan tuzatish yuborishi mumkin.</li>
            <li>Nashrdan keyin topilgan xatolar ochiq tuzatiladi va shu sahifada sana bilan qayd etiladi.</li>
            <li>Metodologiya oʻzgarsa, yangi versiya raqami beriladi.</li>
          </ul>
          <p className="mt-8 text-sm text-ink-faint">
            v1.0 — birinchi metodologiya. v{METHODOLOGY_VERSION} — 2026-yil 24-oktabr: haqiqiy maʼlumotlar asosida aniqlashtirildi (kontrakt ballari, fraksion hisob, median iqtibos, dastlabki nashr).{" "}
            <Link href="/contact" className="text-firuza hover:underline">
              Xato topdingizmi? Bizga yozing.
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
