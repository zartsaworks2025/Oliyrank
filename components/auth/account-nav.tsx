import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/dal";

/** Header buttons: sign in / sign up, or the signed-in user's account link. Render inside Suspense. */
export async function AccountNav({ mobile = false }: { mobile?: boolean }) {
  const user = await getCurrentUser();

  if (user) {
    const initial = (user.name ?? user.email).trim().charAt(0).toUpperCase();
    return (
      <div className={mobile ? "mt-8 grid gap-3" : "hidden items-center gap-1.5 sm:flex"}>
        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className={mobile ? "rounded-full border border-line-strong px-4 py-3 text-center font-medium" : "rounded-full px-3.5 py-2 text-[0.95rem] text-ink-soft hover:text-ink"}
          >
            Admin
          </Link>
        )}
        <Link
          href="/account"
          className={
            mobile
              ? "rounded-full bg-ink px-4 py-3 text-center font-medium text-paper"
              : "inline-flex items-center gap-2 rounded-full border border-line-strong py-1 pr-4 pl-1 text-[0.95rem] transition-colors hover:border-firuza"
          }
        >
          {!mobile && <span className="grid size-8 place-items-center rounded-full bg-firuza font-medium text-on-firuza">{initial}</span>}
          Mening sahifam
        </Link>
      </div>
    );
  }

  return (
    <div className={mobile ? "mt-8 grid grid-cols-2 gap-3" : "hidden items-center gap-1.5 sm:flex"}>
      <Link
        href="/signin"
        className={mobile ? "rounded-full border border-line-strong px-4 py-3 text-center font-medium" : "whitespace-nowrap rounded-full px-4 py-2 text-[0.95rem] text-ink-soft transition-colors hover:text-ink"}
      >
        Kirish
      </Link>
      <Link
        href="/signup"
        className={
          mobile
            ? "rounded-full bg-ink px-4 py-3 text-center font-medium text-paper"
            : "whitespace-nowrap rounded-full bg-ink px-4 py-2 text-[0.95rem] font-medium text-paper transition-colors hover:bg-firuza"
        }
      >
        Roʻyxatdan oʻtish
      </Link>
    </div>
  );
}
