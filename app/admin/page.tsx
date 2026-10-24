import Link from "next/link";
import { AdminPage, AdminTitle, buttonClass } from "@/components/admin/admin-ui";
import { requireAdmin } from "@/lib/auth/dal";
import { db } from "@/lib/db";

export default function AdminDashboard() {
  return (
    <AdminPage>
      <Dashboard />
    </AdminPage>
  );
}

async function Dashboard() {
  const admin = await requireAdmin();
  const [active, hidden, published, drafts, users, bookmarks] = await Promise.all([
    db.university.count({ where: { status: "ACTIVE" } }),
    db.university.count({ where: { status: "HIDDEN" } }),
    db.article.count({ where: { status: "PUBLISHED" } }),
    db.article.count({ where: { status: "DRAFT" } }),
    db.user.count(),
    db.bookmark.count(),
  ]);
  const stats = [
    { label: "Saytdagi universitetlar", value: active, href: "/admin/universities" },
    { label: "Yashirilgan", value: hidden, href: "/admin/universities?show=hidden" },
    { label: "Chop etilgan maqolalar", value: published, href: "/admin/articles" },
    { label: "Qoralamalar", value: drafts, href: "/admin/articles" },
    { label: "Foydalanuvchilar", value: users },
    { label: "Saqlanganlar", value: bookmarks },
  ];

  return (
    <>
      <AdminTitle title={`Salom, ${admin.name ?? "admin"}`}>
        <Link href="/admin/articles/new" className={buttonClass.primary}>
          Yangi maqola
        </Link>
        <Link href="/admin/universities/new" className={buttonClass.secondary}>
          Universitet qoʻshish
        </Link>
      </AdminTitle>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const body = (
            <>
              <p className="text-sm text-ink-soft">{stat.label}</p>
              <p className="mt-2 font-serif text-4xl font-medium tabular-nums">{stat.value}</p>
            </>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="rounded-2xl border border-line bg-paper-raised p-6 transition-colors hover:border-firuza">
              {body}
            </Link>
          ) : (
            <div key={stat.label} className="rounded-2xl border border-line bg-paper-raised p-6">
              {body}
            </div>
          );
        })}
      </div>
      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-faint">
        Admin panelda tahrirlangan universitetlar maʼlumot importi (<code>npm run data:import</code>) paytida qayta
        yozilmaydi — faqat ularning koʻrsatkichlari yangilanadi.
      </p>
    </>
  );
}
