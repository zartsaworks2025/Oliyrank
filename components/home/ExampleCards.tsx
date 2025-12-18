// components/home/ExampleCards.tsx
"use client";

import Image from "next/image";

type InstitutionCard = {
    name: string;
    type: string;
    city: string;
    statLabel: string;
    statValue: string;
    image: string;
};

const institutions: InstitutionCard[] = [
    {
        name: "O‘zbekiston Milliy Universiteti",
        type: "Universitet",
        city: "Toshkent",
        statLabel: "Umumiy reyting",
        statValue: "92.4",
        image: "/universities/nuuz.jpg",
    },
    {
        name: "Toshkent Axborot Texnologiyalari Universiteti",
        type: "Texnika universiteti",
        city: "Toshkent",
        statLabel: "IT yo‘nalishlari",
        statValue: "84.6",
        image: "/universities/tatu.jpg",
    },
    {
        name: "Westminster International University in Tashkent",
        type: "Xalqaro universitet",
        city: "Toshkent",
        statLabel: "Global muhit",
        statValue: "86.2",
        image: "/universities/wiut.jpg",
    },
    {
        name: "Inha University in Tashkent",
        type: "Xalqaro IT universiteti",
        city: "Toshkent",
        statLabel: "IT fokus",
        statValue: "84",
        image: "/universities/inha.jpg",
    },
    {
        name: "Najot Ta’lim",
        type: "O‘quv markazi",
        city: "Toshkent",
        statLabel: "Dasturlash kurslari",
        statValue: "Popular",
        image: "/universities/najot.jpg",
    },
    {
        name: "Cambridge Learning Center",
        type: "Til markazi",
        city: "Toshkent",
        statLabel: "IELTS natijalari",
        statValue: "Popular",
        image: "/universities/cambridge.jpg",
    },
];

export default function ExampleCards() {
    return (
        <section className="cards">
            <div className="cards__inner">
                <div className="cards__header">
                    <p className="cards__eyebrow">Cards</p>
                </div>

                <div className="cards__grid">
                    {institutions.map((inst) => (
                        <article key={inst.name} className="cards__item">
                            <div className="cards__image-wrap">
                                <Image
                                    src={inst.image}
                                    alt={inst.name}
                                    fill
                                    className="cards__image"
                                />
                                <div className="cards__overlay" />
                                <div className="cards__badge">
                                    <span className="cards__type">{inst.type}</span>
                                </div>
                            </div>

                            <div className="cards__content">
                                <h3 className="cards__name">{inst.name}</h3>
                                <div className="cards__row">
                                    <span className="cards__city">{inst.city}</span>
                                    <span className="cards__dot">•</span>
                                    <span className="cards__label">{inst.statLabel}</span>
                                    <span className="cards__value">{inst.statValue}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <p className="cards__disclaimer">
                    * Kartalar vizual namuna sifatida joylashtirilgan. Rasman e’lon
                    qilinadigan reytinglar keyinchalik alohida taqdim etiladi.
                </p>
            </div>
        </section>
    );
}
