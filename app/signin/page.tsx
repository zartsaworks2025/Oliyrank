"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";

export default function SignInPage() {
  // Initial state matching the server action signature if needed, 
  // but authenticate returns string | undefined.
  // React 19 useActionState(action, initialState)
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <main className="auth-container">
      <div className="auth-card">
        <h1>Xush kelibsiz</h1>
        <p className="auth-card__subtitle">
          Profilingizga kirib, saqlangan reytinglarni boshqaring
        </p>

        <form className="auth-form" action={dispatch}>
          <div className="auth-field">
            <label>Elektron pochta</label>
            <input type="email" name="email" placeholder="name@company.com" required />
          </div>
          <div className="auth-field">
            <label>Parol</label>
            <input type="password" name="password" placeholder="••••••••" required />
          </div>
          <div className="flex justify-end mb-4">
            <a href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Parolingizni unutdingizmi?
            </a>
          </div>
          <button type="submit" className="auth-submit">
            Kirish
          </button>
          <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        </form>

        <p className="auth-footer">
          Hisobingiz yo‘qmi? <a href="/signup">Ro‘yxatdan o‘tish</a>
        </p>
      </div>
    </main>
  );
}
