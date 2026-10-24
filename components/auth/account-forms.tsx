"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import { deleteAccount, toggleBookmark } from "@/lib/auth/actions";
import { Field, SubmitButton } from "./auth-forms";

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteAccount, undefined);
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-medium text-anor hover:underline">
        Hisobni oʻchirish
      </button>
    );
  }
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-anor/40 bg-anor-soft p-5">
      <p className="text-sm leading-relaxed">
        Hisobingiz, saqlangan universitetlar va barcha shaxsiy maʼlumotlaringiz butunlay oʻchiriladi. Buni qaytarib boʻlmaydi.
      </p>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-anor">
          {state.error}
        </p>
      )}
      <Field label="Tasdiqlash uchun parolingiz" name="password" type="password" autoComplete="current-password" />
      <div className="flex flex-wrap gap-3">
        <div className="min-w-48 flex-1">
          <SubmitButton pending={pending}>Ha, oʻchirilsin</SubmitButton>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-line-strong px-6 py-3 font-medium">
          Bekor qilish
        </button>
      </div>
    </form>
  );
}

/** Save/unsave a university. Signed-out visitors are sent to sign in first. */
export function BookmarkButton({
  universityId,
  initialSaved,
  signedIn,
  returnTo,
  compact = false,
}: {
  universityId: number;
  initialSaved: boolean;
  signedIn: boolean;
  returnTo: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    if (!signedIn) {
      router.push(`/signin?next=${encodeURIComponent(returnTo)}`);
      return;
    }
    startTransition(async () => {
      const result = await toggleBookmark(universityId);
      if ("saved" in result) setSaved(result.saved);
      else router.push(`/signin?next=${encodeURIComponent(returnTo)}`);
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 rounded-full border font-medium transition-colors disabled:opacity-60 ${
        compact ? "px-3 py-1.5 text-sm" : "px-5 py-2.5"
      } ${saved ? "border-firuza bg-firuza-soft text-firuza-strong" : "border-line-strong hover:border-firuza hover:text-firuza"}`}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
      {saved ? "Saqlangan" : "Saqlash"}
    </button>
  );
}
