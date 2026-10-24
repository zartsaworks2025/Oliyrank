import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { CONTACT_EMAIL, mailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aloqa",
  description: "OliyRank bilan bogʻlanish: fikr, taklif, maʼlumotlardagi xatolar va universitetlar uchun tuzatishlar.",
};

const TOPICS = [
  {
    title: "Fikr va takliflar",
    body: "Loyiha foydalimi? Nimani qoʻshish yoki oʻzgartirish kerak? Davom ettirish-ettirmaslikni aynan shu xatlar hal qiladi.",
    subject: "OliyRank: fikr va taklif",
  },
  {
    title: "Maʼlumotdagi xato",
    body: "Universitet nomi, qabul bali yoki boshqa raqam notoʻgʻri boʻlsa, sahifa havolasi va toʻgʻri maʼlumot manbasini yuboring.",
    subject: "OliyRank: maʼlumotdagi xato",
  },
  {
    title: "Universitetlar uchun",
    body: "Universitetingiz maʼlumotlarini tuzatish yoki toʻldirish uchun rasmiy manbaga havola bilan yozing.",
    subject: "OliyRank: universitet maʼlumotlari",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Aloqa" title="Bizga yozing.">
        Eng tez yoʻli — elektron pochta. Har bir xatni oʻqiymiz.
      </PageIntro>

      <div className="container-page py-16">
        <a
          href={mailto()}
          className="group flex flex-col gap-2 rounded-3xl border border-line bg-paper-raised p-8 transition-colors hover:border-firuza sm:flex-row sm:items-center sm:justify-between sm:p-10"
        >
          <div>
            <p className="text-sm text-ink-faint">Elektron pochta</p>
            <p className="mt-1 font-serif text-2xl font-medium break-all group-hover:text-firuza sm:text-4xl">{CONTACT_EMAIL}</p>
          </div>
          <span className="font-medium text-firuza">Xat yozish →</span>
        </a>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {TOPICS.map((topic) => (
            <a
              key={topic.title}
              href={mailto(topic.subject)}
              className="flex flex-col rounded-2xl border border-line bg-paper-raised p-6 transition-colors hover:border-line-strong"
            >
              <h2 className="font-serif text-xl font-medium">{topic.title}</h2>
              <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{topic.body}</p>
              <span className="mt-5 text-sm font-medium text-firuza">Mavzu bilan yozish →</span>
            </a>
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-faint">
          Xatingiz sizning pochta dasturingiz orqali yuboriladi. Yuborgan maʼlumotlaringiz qanday ishlatilishi <Link href="/privacy" className="text-firuza hover:underline">maxfiylik siyosatida</Link>{" "}
          yozilgan.
        </p>
      </div>
    </>
  );
}
