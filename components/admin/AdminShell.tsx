"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiLayers,
  FiUsers,
  FiSettings,
  FiExternalLink,
  FiMessageSquare,
} from "react-icons/fi";

interface AdminShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

const NAV_ITEMS = [
  { href: "/admin", label: "Institutions", icon: FiLayers },
  { href: "/admin/reviews", label: "Reviews", icon: FiMessageSquare },
  { href: "/admin/users", label: "Users", icon: FiUsers },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1>
            <span>OliyRank</span> Admin
          </h1>
          <p className="subtitle">Ranking Management System</p>
        </div>

        <nav className="nav-section">
          <div className="nav-label">Main Menu</div>
          <div className="nav-links">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-footer">
          <p>
            Admin Access Only <br />
            © {new Date().getFullYear()} Oliyrank
          </p>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-title-area">
            <h2>Admin Dashboard</h2>
            <p>Manage university data and rankings</p>
          </div>
          <div className="header-actions flex items-center gap-4">
            <div className="admin-user">
              <div className="admin-user__meta">
                <span className="admin-user__name">
                  {user.name ?? user.email ?? "Admin"}
                </span>
                <span className="admin-user__role">{user.role ?? "ADMIN"}</span>
              </div>
            </div>
            <form action="/api/auth/signout" method="post">
              <input type="hidden" name="callbackUrl" value="/" />
              <button className="admin-signout" type="submit">
                Sign out
              </button>
            </form>
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-white transition-colors text-sm text-slate-400"
            >
              <FiExternalLink />
              Return to Website
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
