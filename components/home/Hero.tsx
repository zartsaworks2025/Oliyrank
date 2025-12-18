import Link from "next/link";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero__inner">
                {/* LEFT: text */}
                <div className="hero__content">
                    <p className="hero__eyebrow">
                        Universitetlar · O'quv Markazlari
                    </p>

                    <h1 className="hero__title">
                        O‘zingga mos universitetni tanla.
                        <span className="hero__title-highlight">
                            Shunchaki mashhurini emas.
                        </span>
                    </h1>

                    <p className="hero__subtitle">
                        OliyRank universitet va o‘quv markazlarini aniq ma’lumotlar, shaffof mezonlar va ishonchli reytinglar asosida solishtirishga yordam beradi.
                    </p>

                    <div className="hero__actions">
                        <Link href="/rankings" className="btn btn--primary">
                            Reytinglarni ko‘rish
                        </Link>
                        <Link href="/about" className="btn btn--ghost">
                            Qanday ishlashi haqida bilib oling
                        </Link>
                    </div>

                    <div className="hero__meta">
                        <span>🎓 Talabalar uchun yaratilgan</span>
                        <span>📊 Shaffof metodologiya</span>
                        <span>🧠 Mustaqil reyting tizimi</span>
                    </div>
                </div>

                {/* RIGHT: visual mockup */}
                <div className="hero__visual">
                    <div className="hero__card">
                        <p className="hero__card-label">Top universitetlar · 2025</p>
                        <ul className="hero__rank-list">
                            <li>
                                <span>1</span>
                                <span>National University of Uzbekistan (NUUz)</span>
                                <span>92.4</span>
                            </li>
                            <li>
                                <span>2</span>
                                <span>Tashkent Institute of Irrigation and Agricultural Engineers (TIIAME)</span>
                                <span>89.7</span>
                            </li>
                            <li>
                                <span>3</span>
                                <span>Tashkent State Technical University (TSTU)</span>
                                <span>87.9</span>
                            </li>
                            <li>
                                <span>4</span>
                                <span>Westminster International University in Tashkent (WIUT)</span>
                                <span>86.2</span>
                            </li>
                            <li>
                                <span>5</span>
                                <span>Tashkent University of Information Technologies (TUIT)</span>
                                <span>84.6</span>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </section>
    );
}
