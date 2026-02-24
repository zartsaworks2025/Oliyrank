import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

export default async function SettingsPage() {
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
        <main className="settings-container">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="profile-header">
                    <h1>Sozlamalar</h1>
                    <p>Hisob sozlamalaringizni boshqaring</p>
                </div>

                <div className="space-y-6">
                    {/* Profile Settings */}
                    <div className="settings-card">
                        <div className="settings-section">
                            <h2>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profil Ma&apos;lumotlari
                            </h2>
                            <div className="settings-field">
                                <label>To&apos;liq Ism</label>
                                <input
                                    type="text"
                                    defaultValue={user.name || ""}
                                    placeholder="Ismingizni kiriting"
                                />
                            </div>
                            <div className="settings-field">
                                <label>Elektron Pochta</label>
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    disabled
                                />
                            </div>
                            <button className="btn-primary">
                                O&apos;zgarishlarni Saqlash
                            </button>
                        </div>
                    </div>

                    {/* Password Settings */}
                    <div className="settings-card">
                        <div className="settings-section">
                            <h2>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Parol Sozlamalari
                            </h2>
                            <div className="settings-field">
                                <label>Joriy Parol</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="settings-field">
                                <label>Yangi Parol</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="settings-field">
                                <label>Parolni Tasdiqlang</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                />
                            </div>
                            <button className="btn-primary">
                                Parolni Yangilash
                            </button>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="settings-card">
                        <div className="settings-section">
                            <h2>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                Bildirishnomalar
                            </h2>
                            <div className="settings-toggle-item">
                                <div className="toggle-info">
                                    <p>Email Bildirishnomalar</p>
                                    <small>Yangiliklar va yangilanishlar haqida xabarnoma</small>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="settings-toggle-item">
                                <div className="toggle-info">
                                    <p>Reytinglar Yangilanishi</p>
                                    <small>Universitet reytinglari yangilanganda xabar berish</small>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="settings-toggle-item">
                                <div className="toggle-info">
                                    <p>Marketing Xabarlari</p>
                                    <small>Maxsus takliflar va yangiliklar</small>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="settings-card">
                        <div className="settings-section">
                            <h2>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Maxfiylik
                            </h2>
                            <div className="settings-toggle-item">
                                <div className="toggle-info">
                                    <p>Profilni Ommaviy Qilish</p>
                                    <small>Boshqalar sizning profilingizni ko&apos;rishi mumkin</small>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            <div className="settings-toggle-item">
                                <div className="toggle-info">
                                    <p>Faoliyatni Ko&apos;rsatish</p>
                                    <small>Oxirgi faoliyatingizni ko&apos;rsatish</small>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="danger-zone">
                        <div className="settings-section">
                            <h2>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Xavfli Zona
                            </h2>
                            <div className="danger-item">
                                <p>Hisobni O&apos;chirish</p>
                                <small>Hisobingizni butunlay o&apos;chirib tashlash. Bu amalni qaytarib bo&apos;lmaydi.</small>
                                <button>
                                    Hisobni O&apos;chirish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
