"use client";

import { useActionState } from "react";
import { register, State } from "@/app/lib/actions";

export default function SignUpPage() {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch] = useActionState(register, initialState);

  return (
    <main className="auth-container">
      <div className="auth-card">
        <h1>Ro‘yxatdan o‘tish</h1>
        <p className="auth-card__subtitle">
          OliyRank platformasida shaxsiy kabinetingizni yarating
        </p>

        <form className="auth-form" action={dispatch}>
          <div className="auth-field">
            <label>Ism</label>
            <input type="text" name="name" placeholder="Ismingiz" required />
            {state.errors?.name &&
              <p className="text-sm text-red-500 mt-1">{state.errors.name}</p>
            }
          </div>
          <div className="auth-field">
            <label>Elektron pochta</label>
            <input type="email" name="email" placeholder="name@company.com" required />
            {state.errors?.email &&
              <p className="text-sm text-red-500 mt-1">{state.errors.email}</p>
            }
          </div>
          <div className="auth-field">
            <label>Parol</label>
            <input type="password" name="password" placeholder="Kamida 8 ta belgi" required />
            {state.errors?.password &&
              <p className="text-sm text-red-500 mt-1">{state.errors.password}</p>
            }
          </div>
          <button type="submit" className="auth-submit">
            Hisob yaratish
          </button>
          <div className="mt-4" aria-live="polite" aria-atomic="true">
            {state.message && (
              <p className="text-sm text-green-500 font-medium">{state.message}</p>
            )}
          </div>
        </form>

        <p className="auth-footer">
          Allaqachon hisobingiz bormi? <a href="/signin">Kirish</a>
        </p>
      </div>
    </main>
  );
}
