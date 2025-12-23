import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/signin");
    }

    const { email } = session.user;

    const user = await prisma.user.findUnique({
        where: { email: email! },
    });

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <main className="profile-container">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="profile-header">
                    <h1>Mening Profilim</h1>
                    <p>Shaxsiy ma&apos;lumotlaringizni boshqaring</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="profile-card text-center">
                            <div className="profile-avatar">
                                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                            <p className="text-slate-400 text-sm mb-5">{user.email}</p>
                            <span className="profile-badge">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                {user.role}
                            </span>

                            <div className="mt-8 pt-6 border-t border-slate-700/50">
                                <Link href="/settings" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Sozlamalar
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info & Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Information */}
                        <div className="profile-card">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Hisob Ma&apos;lumotlari
                            </h3>
                            <div className="profile-info-grid">
                                <div className="profile-info-item">
                                    <label>To&apos;liq Ism</label>
                                    <p>{user.name}</p>
                                </div>
                                <div className="profile-info-item">
                                    <label>Elektron Pochta</label>
                                    <p className="truncate">{user.email}</p>
                                </div>
                                <div className="profile-info-item">
                                    <label>Ro&apos;yxatdan O&apos;tgan Sana</label>
                                    <p>
                                        {new Date(user.createdAt).toLocaleDateString("uz-UZ", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="profile-info-item">
                                    <label>Oxirgi Yangilanish</label>
                                    <p>
                                        {new Date(user.updatedAt).toLocaleDateString("uz-UZ", {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Activity Stats */}
                        <div className="profile-card">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Faoliyat
                            </h3>
                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <span className="stat-value">0</span>
                                    <span className="stat-label">Saqlangan</span>
                                </div>
                                <div className="profile-stat">
                                    <span className="stat-value">0</span>
                                    <span className="stat-label">Ko&apos;rishlar</span>
                                </div>
                                <div className="profile-stat">
                                    <span className="stat-value">0</span>
                                    <span className="stat-label">Izohlar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
