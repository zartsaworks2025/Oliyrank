"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signIn, signUp, type FormState } from "@/lib/auth/actions";

export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  error,
  hint,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        required
        aria-invalid={Boolean(error)}
        className={`mt-1.5 w-full rounded-xl border bg-paper-raised px-4 py-3 outline-none transition-colors focus:border-firuza ${
          error ? "border-anor" : "border-line-strong"
        }`}
      />
      {error ? <span className="mt-1.5 block text-sm text-anor">{error}</span> : hint && <span className="mt-1.5 block text-sm text-ink-faint">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-firuza disabled:opacity-60"
    >
      {pending ? "Kuting…" : children}
    </button>
  );
}

function FormError({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <p role="alert" className="rounded-xl bg-anor-soft px-4 py-3 text-sm text-ink">
      {state.error}
    </p>
  );
}

export function SignInForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <FormError state={state} />
      <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={state?.values?.email} />
      <Field label="Parol" name="password" type="password" autoComplete="current-password" />
      <SubmitButton pending={pending}>Kirish</SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        Hisobingiz yoʻqmi?{" "}
        <Link href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-firuza hover:underline">
          Roʻyxatdan oʻting
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState(signUp, undefined);
  const errors = state?.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <FormError state={state} />
      <Field label="Ismingiz" name="name" autoComplete="name" error={errors.name} defaultValue={state?.values?.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} defaultValue={state?.values?.email} />
      <Field label="Parol" name="password" type="password" autoComplete="new-password" error={errors.password} hint="Kamida 8 ta belgi." />
      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input name="consent" type="checkbox" required className="mt-1 size-4 shrink-0 accent-[var(--firuza)]" />
        <span className={errors.consent ? "text-anor" : "text-ink-soft"}>
          <Link href="/privacy" target="_blank" className="font-medium text-firuza hover:underline">
            Maxfiylik siyosati
          </Link>{" "}
          va{" "}
          <Link href="/terms" target="_blank" className="font-medium text-firuza hover:underline">
            foydalanish shartlari
          </Link>{" "}
          bilan tanishdim. Shaxsiy maʼlumotlarim (ism, email) ushbu siyosatda koʻrsatilgan maqsadlarda qayta ishlanishiga
          roziman. 18 yoshga toʻlmagan boʻlsam, ota-onam yoki qonuniy vakilim roziligini oldim.
        </span>
      </label>
      <SubmitButton pending={pending}>Roʻyxatdan oʻtish</SubmitButton>
      <p className="text-center text-sm text-ink-soft">
        Hisobingiz bormi?{" "}
        <Link href={`/signin${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-firuza hover:underline">
          Kiring
        </Link>
      </p>
    </form>
  );
}
