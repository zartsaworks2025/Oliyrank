"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutContentProps {
    children: React.ReactNode;
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
}

export default function LayoutContent({ children, user }: LayoutContentProps) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    return (
        <>
            {!isAdmin && <Header user={user} />}
            <main className="flex-grow">{children}</main>
            {!isAdmin && <Footer />}
        </>
    );
}
