export default function AboutPage() {
    return (
      <main className="page page--about">
        {/* Intro */}
        <section className="about-hero">
          <div className="about-hero__badge">Biz haqimizda</div>
          <h1 className="about-hero__title">
            OliyRank talabalarga universitet va o‘quv markazlarini tanlashda
            shunchaki nom emas, haqiqiy natijalarni ko‘rishga yordam beradi.
          </h1>
          <p className="about-hero__subtitle">
            Maqsadimiz oddiy. Har bir talaba o‘z maqsadi, byudjeti va qiziqishiga mos ta’lim maskanini
            topa oladigan shaffof ekotizim yaratish.
          </p>
        </section>
  
        {/* Mission */}
        <section className="about-section">
          <div className="about-section__title-wrap">
            <h2>Missiyamiz</h2>
            <p>OliyRank nimani o‘zgartirmoqchi.</p>
          </div>
  
          <div className="about-grid">
            <div className="about-card">
              <h3>Talaba uchun aniq manzara</h3>
              <p>
                Abituriyentlar ko‘pincha fragmentar ma’lumotlarga qarab qaror qilishadi. Biz esa reytinglar,
                sharhlar, natijalar va mezonlarni bir joyda ko‘rsatib, tanlovni ongli qilishni istaymiz.
              </p>
            </div>
            <div className="about-card">
              <h3>Shaffof reyting tizimi</h3>
              <p>
                Reytinglar faqat “prestij”ga emas, balki ta’lim sifati, bitiruvchilar natijasi, infratuzilma
                va talaba tajribasi kabi real ko‘rsatkichlarga tayangan bo‘ladi.
              </p>
            </div>
            <div className="about-card">
              <h3>Hamkorlikka ochiq platforma</h3>
              <p>
                OliyRank talabalar, ota onalar va ta’lim muassasalari o‘rtasida muloqotni kuchaytiradigan,
                ma’lumotga asoslangan qarorlarni qo‘llab quvvatlaydigan tizim bo‘lishini maqsad qiladi.
              </p>
            </div>
          </div>
        </section>
  
        {/* Why OliyRank */}
        <section className="about-section">
          <div className="about-section__title-wrap">
            <h2>Nega aynan OliyRank?</h2>
            <p>Oddiy ro‘yxat emas, qaror qabul qilish vositasi.</p>
          </div>
  
          <div className="about-list">
            <div className="about-list__item">
              <h3>Ma’lumotga tayangan yondashuv</h3>
              <p>
                Reytinglar rasmiy hisobotlar, ochiq statistika va mustaqil tahlil asosida shakllanadi. Har bir
                ball subyektiv fikr emas, ma’lumotga tayangan natija bo‘lishi kerak.
              </p>
            </div>
            <div className="about-list__item">
              <h3>Talaba tajribasi markazda</h3>
              <p>
                Kelajakda talaba sharhlari, bitiruvchilar fikri va real tajriba asosidagi ko‘rsatkichlar ham
                qo‘shilib boradi. Universitetlar faqat reklama bilan emas, amaliy natija bilan baholanadi.
              </p>
            </div>
            <div className="about-list__item">
              <h3>Universitetlar uchun ko‘zgudek</h3>
              <p>
                Ta’lim muassasalari o‘z ko‘rsatkichlarini kuzatishi, raqobatchilarni tahlil qilishi va ta’lim
                sifatini oshirish bo‘yicha strategik qarorlar qabul qilishi mumkin bo‘ladi.
              </p>
            </div>
          </div>
        </section>
  
        {/* Roadmap */}
        <section className="about-section">
          <div className="about-section__title-wrap">
            <h2>Keyingi qadamlar</h2>
            <p>Bu faqat boshlanishi.</p>
          </div>
  
          <div className="about-roadmap">
            <div className="about-roadmap__item">
              <span className="about-roadmap__tag">2025</span>
              <h3>O‘zbekiston bo‘yicha pilot reytinglar</h3>
              <p>
                Universitetlar va o‘quv markazlari bo‘yicha dastlabki reytinglarni e’lon qilish, metodologiyani
                sinovdan o‘tkazish va foydalanuvchilar fikrini yig‘ish.
              </p>
            </div>
            <div className="about-roadmap__item">
              <span className="about-roadmap__tag">Keyingi bosqich</span>
              <h3>Shaxsiy profil va taqqoslash vositalari</h3>
              <p>
                Talabalar o‘z maqsadi, byudjeti va yo‘nalishiga mos variantlarni avtomatik taqqoslay oladigan
                interaktiv vositalar qo‘shish.
              </p>
            </div>
            <div className="about-roadmap__item">
              <span className="about-roadmap__tag">Kelajak</span>
              <h3>Global ta’lim xaritasi</h3>
              <p>
                O‘zbekiston tajribasi asosida mintaqaviy va xalqaro reytinglarga kengayish, chet eldagi
                universitet va o‘quv markazlarini ham qamrab olish.
              </p>
            </div>
          </div>
        </section>
  
        {/* Closing */}
        <section className="about-end">
          <p>
            OliyRank reklama loyihasi emas. Bu o‘z ta’limi va kelajagi ustidan ongli qaror qabul qilmoqchi
            bo‘lgan talabalar uchun yaratilgan vosita. Agar sizda taklif yoki konstruktiv tanqid bo‘lsa,
            biz bilan bemalol bog‘laning.
          </p>
        </section>
      </main>
    );
  }
  