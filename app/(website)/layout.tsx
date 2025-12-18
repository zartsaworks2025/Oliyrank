import type { Metadata } from "next";
import Header from "../layout/header/page"; // Adjusted path
import Footer from "../layout/footer/page"; // Adjusted path

export const metadata: Metadata = {
    title: "OliyRank",
    description: "Ranking platform for universities in Uzbekistan",
};

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </>
    );
}
