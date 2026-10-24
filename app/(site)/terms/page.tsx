import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, ProseSection } from "@/components/layout/page-intro";
import { CONTACT_EMAIL, LEGAL_UPDATED, mailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Foydalanish shartlari",
  description: "OliyRank saytidan foydalanish shartlari va masʼuliyatni cheklash (disclaimer).",
};

export default function TermsPage() {
  return (
    <>
      <PageIntro eyebrow="Foydalanish shartlari" title="Saytdan foydalanish qoidalari.">
        Saytdan foydalanish orqali siz ushbu shartlarga rozilik bildirasiz. Oxirgi yangilanish: {LEGAL_UPDATED}.
      </PageIntro>

      <div className="container-page max-w-3xl py-14">
        <ProseSection id="disclaimer" title="1. Masʼuliyatni cheklash (disclaimer)">
          <p>
            <strong>OliyRank — mustaqil loyiha va rasmiy reyting emas.</strong> U Oʻzbekiston Respublikasi Oliy taʼlim, fan
            va innovatsiyalar vazirligi, Taʼlim sifatini taʼminlash milliy agentligi, Bilim va malakalarni baholash agentligi,
            boshqa davlat organlari yoki biror universitet bilan bogʻliq emas va ular tomonidan tasdiqlanmagan.
          </p>
          <p>
            Reyting va baholar eʼlon qilingan <Link href="/methodology">metodologiya</Link> asosida ochiq manbalardagi
            maʼlumotlardan hisoblanadi. Ular universitetlar sifati haqidagi yakuniy hukm emas, balki tanlangan koʻrsatkichlar
            boʻyicha hisob-kitob natijasidir. Boshqa metodologiya boshqa natija berishi mumkin.
          </p>
          <p>
            Maʼlumotlar “boricha” (as is) taqdim etiladi. Biz ularning toʻliqligi, aniqligi va dolzarbligiga kafolat
            bermaymiz: manbalarda xato boʻlishi, maʼlumot eskirishi yoki biz uni notoʻgʻri qayta ishlagan boʻlishimiz mumkin.
            Qabul ballari va boshqa raqamlar oʻtgan yillarga tegishli va kelgusi qabul natijalarini kafolatlamaydi.
          </p>
          <p>
            <strong>Muhim qarorlarni</strong> (universitet tanlash, hujjat topshirish va h.k.) faqat Saytga tayanib qabul
            qilmang — rasmiy manbalarni (universitet sayti, my.uzbmb.uz, rasmiy eʼlonlar) tekshiring. Sayt maʼlumotlaridan
            foydalanish natijasida kelib chiqqan har qanday zarar uchun OliyRank qonunchilikda ruxsat etilgan doirada javob
            bermaydi.
          </p>
        </ProseSection>

        <ProseSection title="2. Xatolarni tuzatish">
          <p>
            Xato topsangiz yoki universitetingiz haqidagi maʼlumotni tuzatmoqchi boʻlsangiz, manbaga havola bilan{" "}
            <a href={mailto("Maʼlumotdagi xato")}>{CONTACT_EMAIL}</a> manziliga yozing. Asosli tuzatishlar imkon qadar tez
            kiritiladi va metodologiya sahifasida qayd etiladi.
          </p>
        </ProseSection>

        <ProseSection title="3. Hisob">
          <ul>
            <li>Roʻyxatdan oʻtishda haqiqiy maʼlumot kiriting; bir kishi — bitta hisob.</li>
            <li>Parolingiz xavfsizligi uchun oʻzingiz javobgarsiz; hisobingizga begona kirganini sezsangiz, bizga xabar bering.</li>
            <li>
              Shartlarni buzgan, Sayt ishiga xalaqit bergan yoki uni suiisteʼmol qilgan hisoblar ogohlantirishsiz bloklanishi
              yoki oʻchirilishi mumkin.
            </li>
            <li>
              Hisobingizni istalgan vaqtda <Link href="/account">Mening sahifam</Link> boʻlimida oʻchirishingiz mumkin.
            </li>
          </ul>
        </ProseSection>

        <ProseSection title="4. Taqiqlangan harakatlar">
          <ul>
            <li>Saytga ruxsatsiz kirishga, uning himoyasini chetlab oʻtishga yoki ishini buzishga urinish;</li>
            <li>Saytdan avtomatlashtirilgan vositalar bilan ommaviy maʼlumot yigʻish (serverga ortiqcha yuk tushiradigan darajada);</li>
            <li>boshqa shaxs nomidan roʻyxatdan oʻtish yoki yolgʻon maʼlumot tarqatish.</li>
          </ul>
        </ProseSection>

        <ProseSection title="5. Intellektual mulk va manbalar">
          <p>
            Sayt dizayni, matnlari, maqolalari va metodologiyasi OliyRank mulki hisoblanadi. Ulardan manbani (OliyRank va
            sahifa havolasi) koʻrsatgan holda notijorat maqsadlarda iqtibos keltirish mumkin.
          </p>
          <p>
            Reytingda ishlatilgan maʼlumotlar ularning egalariga tegishli: qabul natijalari — Bilim va malakalarni baholash
            agentligi (my.uzbmb.uz); ilmiy maqolalar — OpenAlex (CC0); tashkilotlar reyestri — ROR (CC0). Universitet nomlari
            ularni aniqlash maqsadida ishlatiladi va ularning egalariga tegishli.
          </p>
        </ProseSection>

        <ProseSection title="6. Shaxsga doir maʼlumotlar">
          <p>
            Shaxsga doir maʼlumotlaringiz <Link href="/privacy">Maxfiylik siyosati</Link>ga muvofiq qayta ishlanadi.
          </p>
        </ProseSection>

        <ProseSection title="7. Amaldagi qonunchilik">
          <p>
            Ushbu shartlar Oʻzbekiston Respublikasi qonunchiligiga muvofiq tartibga solinadi. Nizolar avvalo muzokara yoʻli
            bilan, kelishuvga erishilmasa — Oʻzbekiston Respublikasi sudlarida hal qilinadi.
          </p>
        </ProseSection>

        <ProseSection title="8. Oʻzgartishlar">
          <p>
            Shartlar oʻzgarishi mumkin; yangi tahrir shu sahifada eʼlon qilingan paytdan kuchga kiradi. Savollar boʻlsa:{" "}
            <a href={mailto("Foydalanish shartlari")}>{CONTACT_EMAIL}</a>.
          </p>
        </ProseSection>
      </div>
    </>
  );
}
