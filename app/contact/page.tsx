export default function ContactPage() {
    return (
      <main className="page page--contact">
        <section className="contact-hero">
          <h1>Bog‘lanish</h1>
          <p>
            Taklif, savol yoki hamkorlik g‘oyasi bormi? Biz platformani birgalikda yaxshilashga tayyormiz.
            Quyidagi forma orqali yozishingiz yoki elektron pochta orqali murojaat qilishingiz mumkin.
          </p>
        </section>
  
        <section className="contact-grid">
          <div className="contact-grid__info">
            <h2>Aloqa ma’lumotlari</h2>
            <p>Quyidagi kanallar orqali bog‘lanishingiz mumkin.</p>
  
            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="contact-info-label">Elektron pochta</span>
                <span className="contact-info-value">zartsaworks@gmail.com</span>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-label">Telefon</span>
                <span className="contact-info-value">+998 97 790 21 05</span>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-label">Manzil</span>
                <span className="contact-info-value">O‘zbekiston, Xorazm viloyati, Urganch shahri</span>
              </div>
            </div>
  
            <p className="contact-note">
              Universitet yoki o‘quv markazi vakili bo‘lsangiz va reytingda qatnashmoqchi bo‘lsangiz,
              iltimos, qisqacha ma’lumot bilan yozib qoldiring.
            </p>
          </div>
  
          <form className="contact-grid__form">
            <div className="field">
              <label>Ism familiyangiz</label>
              <input type="text" placeholder="To‘liq ism" required />
            </div>
            <div className="field">
              <label>Elektron pochta</label>
              <input type="email" placeholder="example@gmail.com" required />
            </div>
            <div className="field">
              <label>Mavzu</label>
              <input type="text" placeholder="Murojaat mavzusi" />
            </div>
            <div className="field">
              <label>Xabar</label>
              <textarea rows={5} placeholder="Xabaringizni yozing" />
            </div>
            <button type="submit" className="btn btn--primary contact-submit">
              Xabarni yuborish
            </button>
          </form>
        </section>
      </main>
    );
  }
  