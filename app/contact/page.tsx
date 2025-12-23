const contactChannels = [
  {
    label: "Elektron pochta",
    value: "zartsaworks@gmail.com",
    note: "Asosiy aloqa kanali",
    href: "mailto:zartsaworks@gmail.com",
  },
  {
    label: "Telefon",
    value: "+998 97 790 21 05",
    note: "Du-Ju 09:00-18:00",
    href: "tel:+998977902105",
  },
  {
    label: "Manzil",
    value: "O'zbekiston, Xorazm viloyati, Urganch shahri",
    note: "Oldindan kelishuv orqali",
  },
];

const trustHighlights = [
  {
    label: "O'rtacha javob",
    value: "12-24 soat",
  },
  {
    label: "Ish vaqti",
    value: "Du-Ju 09:00-18:00",
  },
  {
    label: "Hamkorlik bo'limi",
    value: "Reyting va ma'lumotlar",
  },
];

export default function ContactPage() {
  return (
    <main className="page page--contact">
      <section className="contact-hero">
        <span className="contact-hero__eyebrow">Bog&apos;lanish</span>
        <h1>Biz bilan bog&apos;laning</h1>
        <p>
          Taklif, savol yoki hamkorlik g&apos;oyasi bormi? Biz platformani birgalikda
          yaxshilashga tayyormiz. Quyidagi forma orqali yozishingiz yoki asosiy
          kanallar orqali murojaat qilishingiz mumkin.
        </p>

        <div className="contact-hero__highlights">
          {trustHighlights.map((item) => (
            <div key={item.label} className="contact-highlight">
              <span className="contact-highlight__label">{item.label}</span>
              <span className="contact-highlight__value">{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-grid">
        <div className="contact-grid__info">
          <div className="contact-info-header">
            <h2>Aloqa ma&apos;lumotlari</h2>
            <p>Quyidagi kanallar orqali bog&apos;lanishingiz mumkin.</p>
          </div>

          {contactChannels.length > 0 ? (
            <div className="contact-info-list">
              {contactChannels.map((item) => (
                <div key={item.label} className="contact-info-item">
                  <span className="contact-info-label">{item.label}</span>
                  <span className="contact-info-value">
                    {item.href ? <a href={item.href}>{item.value}</a> : item.value}
                  </span>
                  <span className="contact-info-note">{item.note}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon" />
              <div className="empty-state__title">Aloqa ma&apos;lumotlari topilmadi</div>
              <div className="empty-state__text">
                Ma&apos;lumotlar vaqtincha yangilanmoqda, keyinroq qayta urinib ko&apos;ring.
              </div>
            </div>
          )}

          <div className="contact-trust">
            <h3>Jarayon qanday ishlaydi?</h3>
            <ul>
              <li>So&apos;rov qabul qilinadi va ro&apos;yxatga olinadi.</li>
              <li>Mutaxassislar ma&apos;lumotlarni tekshiradi.</li>
              <li>Natija haqida sizga qayta aloqa beriladi.</li>
            </ul>
          </div>
        </div>

        <form className="contact-grid__form">
          <div className="field-row">
            <div className="field">
              <label htmlFor="contact-name">Ism familiyangiz</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="To&apos;liq ism"
                autoComplete="name"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="contact-email">Elektron pochta</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="contact-role">Murojaat turi</label>
              <select id="contact-role" name="role" defaultValue="">
                <option value="" disabled>
                  Tanlang
                </option>
                <option value="student">Talaba yoki abiturient</option>
                <option value="parent">Ota-ona</option>
                <option value="university">Universitet vakili</option>
                <option value="center">O&apos;quv markazi</option>
                <option value="media">Matbuot</option>
                <option value="other">Boshqa</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="contact-phone">Telefon (ixtiyoriy)</label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                placeholder="+998 90 000 00 00"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="contact-topic">Mavzu</label>
            <input
              id="contact-topic"
              name="topic"
              type="text"
              placeholder="Masalan, hamkorlik yoki xatolik"
            />
          </div>

          <div className="field">
            <label htmlFor="contact-message">Xabar</label>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              placeholder="Xabaringizni yozing"
              required
            />
          </div>

          <label className="field field--checkbox">
            <input name="consent" type="checkbox" required />
            <span>Shaxsiy ma&apos;lumotlarni qayta ishlash shartlariga roziman.</span>
          </label>

          <button type="submit" className="btn--primary contact-submit">
            Xabarni yuborish
          </button>
          <p className="contact-form__note">Odatda 24 soat ichida javob beramiz.</p>
        </form>
      </section>

      <section className="contact-footer">
        <div className="contact-footer__card">
          <h3>Tezkor javob kerakmi?</h3>
          <p>Ko&apos;p beriladigan savollar bo&apos;limida asosiy javoblar mavjud.</p>
          <a className="contact-footer__link" href="/faq">FAQ bo&apos;limi</a>
        </div>
      </section>
    </main>
  );
}
