"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLayers, FiUsers, FiSettings, FiExternalLink } from "react-icons/fi";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

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
            <Link
              href="/admin"
              className={`nav-item ${isActive("/admin") ? "active" : ""}`}
            >
              <FiLayers />
              <span>Universities</span>
            </Link>
            <Link
              href="/admin/users"
              className={`nav-item ${isActive("/admin/users") ? "active" : ""}`}
            >
              <FiUsers />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/settings"
              className={`nav-item ${isActive("/admin/settings") ? "active" : ""}`}
            >
              <FiSettings />
              <span>Settings</span>
            </Link>
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
          <div className="header-actions">
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
