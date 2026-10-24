"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { deleteUniversity, setUniversityVisible } from "@/lib/admin/actions";
import { OWNERSHIP_LABELS, PROFILE_LABELS, type OwnershipKey, type ProfileKey } from "@/lib/labels";

export type AdminUniversity = {
  id: number;
  slug: string;
  name: string;
  shortName: string | null;
  city: string | null;
  region: string | null;
  ownership: OwnershipKey | null;
  profile: ProfileKey;
  status: "ACTIVE" | "HIDDEN";
  adminLocked: boolean;
  fromRegistry: boolean;
};

const normalize = (s: string) => s.toLowerCase().replace(/[ʻʼ'`‘’]/g, "");

export function UniversityTable({ universities }: { universities: AdminUniversity[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [show, setShow] = useState<"all" | "ACTIVE" | "HIDDEN">(params.get("show") === "hidden" ? "HIDDEN" : "all");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const saved = params.get("saved");

  const visible = useMemo(() => {
    const needle = normalize(query.trim());
    return universities.filter(
      (u) =>
        (show === "all" || u.status === show) &&
        (!needle || [u.name, u.shortName, u.city, u.region].some((f) => f && normalize(f).includes(needle))),
    );
  }, [universities, query, show]);

  const run = (task: () => Promise<void>) => {
    setError(null);
    startTransition(async () => {
      try {
        await task();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Xatolik yuz berdi.");
      }
    });
  };

  return (
    <div>
      {saved && (
        <p role="status" className="mb-6 rounded-xl bg-firuza-soft px-4 py-3 text-sm text-firuza-strong">
          Saqlandi.{" "}
          <Link href={`/universities/${saved}`} className="font-medium underline" target="_blank">
            Saytda koʻrish ↗
          </Link>
        </p>
      )}
      {error && (
        <p role="alert" className="mb-6 rounded-xl bg-anor-soft px-4 py-3 text-sm">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom, qisqa nom yoki shahar…"
          className="min-w-64 flex-1 rounded-full border border-line-strong bg-paper-raised px-4 py-2.5 outline-none focus:border-firuza"
        />
        <div role="radiogroup" aria-label="Holat" className="flex rounded-full border border-line-strong bg-paper-raised p-1 text-sm">
          {(
            [
              ["all", "Barchasi"],
              ["ACTIVE", "Saytda"],
              ["HIDDEN", "Yashirilgan"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={show === value}
              onClick={() => setShow(value)}
              className={`rounded-full px-3.5 py-1.5 ${show === value ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm text-ink-soft">{visible.length} ta</p>

      <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-paper-raised">
        <table className="w-full min-w-[46rem] border-collapse text-left text-[0.95rem]">
          <thead className="border-b border-line bg-paper-sunk/60 text-xs tracking-wide text-ink-soft uppercase">
            <tr>
              <th className="p-4 font-medium">Universitet</th>
              <th className="p-4 font-medium">Hudud</th>
              <th className="p-4 font-medium">Turi</th>
              <th className="p-4 font-medium">Holat</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {visible.map((u) => (
              <tr key={u.id} className={`border-b border-line last:border-b-0 ${u.status === "HIDDEN" ? "opacity-60" : ""}`}>
                <td className="p-4">
                  <Link href={`/admin/universities/${u.id}`} className="font-medium hover:text-firuza">
                    {u.name}
                  </Link>
                  <p className="text-sm text-ink-faint">
                    {[u.shortName, u.adminLocked ? "qoʻlda tahrirlangan" : null].filter(Boolean).join(" · ")}
                  </p>
                </td>
                <td className="p-4 text-ink-soft">{u.city ?? u.region ?? "—"}</td>
                <td className="p-4 text-sm text-ink-soft">
                  {u.ownership ? OWNERSHIP_LABELS[u.ownership] : "—"}
                  <br />
                  {PROFILE_LABELS[u.profile]}
                </td>
                <td className="p-4 text-sm">{u.status === "ACTIVE" ? "Saytda" : "Yashirilgan"}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2 text-sm">
                    <Link href={`/admin/universities/${u.id}`} className="rounded-full px-3 py-1.5 text-firuza hover:bg-firuza-soft">
                      Tahrirlash
                    </Link>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => run(() => setUniversityVisible(u.id, u.status !== "ACTIVE"))}
                      className="rounded-full px-3 py-1.5 text-ink-soft hover:bg-paper-sunk hover:text-ink"
                    >
                      {u.status === "ACTIVE" ? "Yashirish" : "Qaytarish"}
                    </button>
                    {!u.fromRegistry && (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (confirm(`“${u.name}” butunlay oʻchirilsinmi? Buni qaytarib boʻlmaydi.`)) run(() => deleteUniversity(u.id));
                        }}
                        className="rounded-full px-3 py-1.5 text-anor hover:bg-anor-soft"
                      >
                        Oʻchirish
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-faint">
        “Yashirish” universitetni saytdan olib tashlaydi, lekin qaytarish mumkin. Rasmiy roʻyxatlardan olingan universitetlarni
        faqat yashirish mumkin (aks holda keyingi importda qaytib keladi); qoʻlda qoʻshilganlarni butunlay oʻchirish mumkin.
      </p>
    </div>
  );
}
