"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveUniversity } from "@/lib/admin/actions";
import { OWNERSHIP_LABELS, PROFILE_LABELS } from "@/lib/labels";
import { buttonClass, inputClass } from "./admin-ui";

export type UniversityFormValues = {
  id?: number;
  name: string;
  shortName: string;
  slug: string;
  region: string;
  city: string;
  ownership: string;
  profile: string;
  website: string;
  foundedYear: string;
  description: string;
};

export function UniversityForm({ values }: { values: UniversityFormValues }) {
  const [state, action, pending] = useActionState(saveUniversity, undefined);
  const errors = state?.fieldErrors ?? {};
  // After a failed save, show what was submitted rather than the original values.
  const current = (name: keyof UniversityFormValues) => state?.values?.[name] ?? String(values[name] ?? "");

  const text = (name: keyof UniversityFormValues, label: string, hint?: string, type = "text") => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input name={name} type={type} defaultValue={current(name)} aria-invalid={Boolean(errors[name])} className={inputClass} />
      {errors[name] ? <span className="mt-1 block text-sm text-anor">{errors[name]}</span> : hint && <span className="mt-1 block text-sm text-ink-faint">{hint}</span>}
    </label>
  );

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      {state?.error && <p role="alert" className="rounded-xl bg-anor-soft px-4 py-3 text-sm">{state.error}</p>}

      {text("name", "Toʻliq nomi")}
      <div className="grid gap-6 sm:grid-cols-2">
        {text("shortName", "Qisqa nomi", "Masalan: OʻzMU")}
        {text("slug", "Sahifa manzili (slug)", "Boʻsh qolsa, nomdan avtomatik yaratiladi")}
        {text("region", "Hudud", "Masalan: Toshkent shahri")}
        {text("city", "Shahar")}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Mulkchilik</span>
          <select name="ownership" defaultValue={current("ownership")} className={inputClass}>
            {Object.entries(OWNERSHIP_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Yoʻnalish</span>
          <select name="profile" defaultValue={current("profile")} className={inputClass}>
            {Object.entries(PROFILE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        {text("website", "Rasmiy sayt", "https:// bilan")}
        {text("foundedYear", "Tashkil etilgan yil", undefined, "number")}
      </div>
      <label className="block">
        <span className="text-sm font-medium">Qisqacha maʼlumot</span>
        <textarea name="description" rows={5} defaultValue={current("description")} className={inputClass} />
        {errors.description && <span className="mt-1 block text-sm text-anor">{errors.description}</span>}
      </label>

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <button type="submit" disabled={pending} className={buttonClass.primary}>
          {pending ? "Saqlanmoqda…" : "Saqlash"}
        </button>
        <Link href="/admin/universities" className={buttonClass.secondary}>
          Bekor qilish
        </Link>
      </div>
      <p className="text-sm text-ink-faint">
        Saqlangandan keyin bu universitet maʼlumot importi paytida qayta yozilmaydi; reytingdagi koʻrsatkichlari esa
        rasmiy manbalardan yangilanishda davom etadi.
      </p>
    </form>
  );
}
