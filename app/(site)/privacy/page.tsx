import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, ProseSection } from "@/components/layout/page-intro";
import { CONTACT_EMAIL, LEGAL_UPDATED, mailto } from "@/lib/site";

export const metadata: Metadata = {
  title: "Maxfiylik siyosati",
  description: "OliyRank shaxsga doir maʼlumotlarni qanday yigʻadi, saqlaydi va himoya qiladi.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro eyebrow="Maxfiylik siyosati" title="Shaxsga doir maʼlumotlaringiz qanday ishlatiladi.">
        Qisqasi: faqat hisob uchun zarur boʻlgan minimal maʼlumotni (ism, email) yigʻamiz, hech kimga sotmaymiz va istalgan
        vaqtda oʻzingiz oʻchirishingiz mumkin. Oxirgi yangilanish: {LEGAL_UPDATED}.
      </PageIntro>

      <div className="container-page max-w-3xl py-14">
        <ProseSection title="1. Umumiy qoidalar">
          <p>
            Ushbu siyosat OliyRank veb-sayti (keyingi oʻrinlarda — <strong>Sayt</strong>) foydalanuvchilarining shaxsga doir
            maʼlumotlarini qayta ishlash tartibini belgilaydi. U Oʻzbekiston Respublikasining{" "}
            <strong>“Shaxsga doir maʼlumotlar toʻgʻrisida”gi Qonuni</strong> (2019-yil 2-iyul, OʻRQ-547-son) va boshqa
            qonunchilik hujjatlariga muvofiq tuzilgan.
          </p>
          <p>
            Maʼlumotlar egasi va operatori — OliyRank loyihasi (keyingi oʻrinlarda — <strong>Operator</strong>). Aloqa:{" "}
            <a href={mailto("Shaxsga doir maʼlumotlar")}>{CONTACT_EMAIL}</a>.
          </p>
        </ProseSection>

        <ProseSection title="2. Qanday maʼlumotlar yigʻiladi">
          <p>
            <strong>Hisob ochganingizda:</strong> ismingiz, elektron pochta manzilingiz va parolingiz. Parol ochiq holda
            saqlanmaydi — faqat qaytarib boʻlmaydigan kriptografik xeshi (scrypt) saqlanadi.
          </p>
          <p>
            <strong>Saytdan foydalanganingizda:</strong> siz saqlagan universitetlar roʻyxati va hisobga kirganingizni
            bildiruvchi sessiya.
          </p>
          <p>
            <strong>Tashrif statistikasi:</strong> qaysi sahifalar necha marta ochilgani — umumlashtirilgan holda (mamlakat,
            qurilma va brauzer turi, qaysi saytdan kelingani). Buning uchun xosting provayderimiz Vercelning Web Analytics
            xizmati ishlatiladi: u cookie qoʻymaydi, IP manzilni saqlamaydi va tashrifchini 24 soatdan ortiq taniy olmaydi.
            Bu maʼlumotlar sizni shaxsan aniqlash uchun ishlatilmaydi.
          </p>
          <p>
            <strong>Bizga xat yozganingizda:</strong> xatda oʻzingiz yuborgan maʼlumotlar (email manzil, ism, xat matni).
          </p>
          <p>
            Biz pasport maʼlumotlari, telefon raqami, biometrik, genetik yoki boshqa maxsus toifadagi maʼlumotlarni{" "}
            <strong>yigʻmaymiz</strong>. Saytda reklama xizmatlari ishlatilmaydi.
          </p>
        </ProseSection>

        <ProseSection title="3. Qayta ishlash asosi va maqsadlari">
          <p>
            Maʼlumotlar <strong>sizning roziligingiz</strong> asosida qayta ishlanadi. Rozilik roʻyxatdan oʻtishda tegishli
            belgini qoʻyish orqali elektron shaklda beriladi va uning sanasi saqlanadi. Maʼlumotlar faqat quyidagi maqsadlarda
            ishlatiladi:
          </p>
          <ul>
            <li>hisobingizni yaratish va unga kirishni taʼminlash;</li>
            <li>saqlangan universitetlaringizni koʻrsatish;</li>
            <li>hisob xavfsizligini taʼminlash (masalan, parolni taxmin qilishga urinishlarni cheklash);</li>
            <li>soʻrovlaringizga javob berish.</li>
          </ul>
          <p>Maʼlumotlaringiz reklama uchun ishlatilmaydi va uchinchi shaxslarga sotilmaydi.</p>
        </ProseSection>

        <ProseSection title="4. Uchinchi shaxslarga berish">
          <p>
            Maʼlumotlar uchinchi shaxslarga berilmaydi, qonunchilikda nazarda tutilgan hollar (masalan, sud yoki vakolatli
            davlat organlarining qonuniy talabi) bundan mustasno. Sayt texnik jihatdan xosting provayderi serverlarida
            ishlaydi; provayder maʼlumotlardan oʻz maqsadlarida foydalanish huquqiga ega emas.
          </p>
        </ProseSection>

        <ProseSection title="5. Saqlash joyi va muddati">
          <p>
            Maʼlumotlar Qonunning 27¹-moddasi talablariga (2026-yil martdagi oʻzgartishlarni hisobga olgan holda) muvofiq
            saqlanadi.
          </p>
          <ul>
            <li>Hisob maʼlumotlari — hisobingiz mavjud boʻlgan davrda. Hisob oʻchirilganda darhol oʻchiriladi.</li>
            <li>Sessiya — eng koʻpi bilan 30 kun yoki chiqqaningizgacha.</li>
            <li>Xat yozishmalari — soʻrovingiz hal qilingunga qadar, lekin 1 yildan oshmagan muddatda.</li>
          </ul>
        </ProseSection>

        <ProseSection title="6. Cookie va brauzer xotirasi">
          <ul>
            <li>
              <strong>oliyrank_session</strong> — hisobga kirganingizni bildiruvchi zaruriy cookie. Usiz kirish ishlamaydi.
              Unda tasodifiy kalit saqlanadi; bizning bazada uning faqat xeshi bor.
            </li>
            <li>
              Brauzeringiz xotirasida (localStorage) faqat tanlangan rang mavzusi va yopilgan xabarnoma eslab qolinadi. Bu
              maʼlumotlar bizga yuborilmaydi.
            </li>
            <li>Tashrif statistikasi cookie ham, brauzer xotirasini ham ishlatmaydi.</li>
          </ul>
        </ProseSection>

        <ProseSection title="7. Himoya choralari">
          <p>
            Parollar xeshlangan holda saqlanadi, sessiya kalitlari bazada xeshlanadi, ulanish HTTPS orqali shifrlanadi,
            maʼlumotlar bazasiga kirish cheklangan. Shunga qaramay, internet orqali uzatishning hech bir usuli 100% xavfsiz
            emasligini eslatib oʻtamiz.
          </p>
        </ProseSection>

        <ProseSection title="8. Sizning huquqlaringiz">
          <p>Qonunga muvofiq siz quyidagi huquqlarga egasiz:</p>
          <ul>
            <li>maʼlumotlaringiz qayta ishlanishi haqida bilish va ular bilan tanishish;</li>
            <li>notoʻgʻri maʼlumotlarni tuzattirish;</li>
            <li>
              maʼlumotlaringizni oʻchirish va roziligingizni qaytarib olish —{" "}
              <Link href="/account">Mening sahifam</Link> boʻlimidagi “Hisobni oʻchirish” tugmasi orqali darhol;
            </li>
            <li>huquqlaringiz buzilgan deb hisoblasangiz, vakolatli davlat organiga yoki sudga murojaat qilish.</li>
          </ul>
          <p>
            Boshqa soʻrovlar uchun <a href={mailto("Shaxsga doir maʼlumotlar boʻyicha soʻrov")}>{CONTACT_EMAIL}</a> manziliga
            yozing — qonunchilikda belgilangan muddatlarda javob beramiz.
          </p>
        </ProseSection>

        <ProseSection title="9. Voyaga yetmaganlar">
          <p>
            18 yoshga toʻlmagan foydalanuvchilar roʻyxatdan oʻtishdan oldin ota-onasi yoki qonuniy vakilining roziligini
            olishi kerak. Agar voyaga yetmagan shaxsning maʼlumotlari roziliksiz kiritilganini bilsangiz, bizga yozing — ular
            oʻchiriladi.
          </p>
        </ProseSection>

        <ProseSection title="10. Oʻzgartishlar">
          <p>
            Siyosat oʻzgarganda yangi tahrir shu sahifada eʼlon qilinadi va yuqoridagi sana yangilanadi. Muhim oʻzgarishlar
            haqida roʻyxatdan oʻtgan foydalanuvchilarni xabardor qilamiz.
          </p>
        </ProseSection>
      </div>
    </>
  );
}
