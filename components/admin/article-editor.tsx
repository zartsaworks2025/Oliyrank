"use client";

import Link from "next/link";
import { useActionState, useRef, useState, useTransition } from "react";
import { ArticleMarkdown, readingMinutes } from "@/components/article/markdown";
import { deleteArticle, saveArticle } from "@/lib/admin/actions";
import { slugify } from "@/lib/slug";
import { buttonClass, inputClass } from "./admin-ui";

export type ArticleFormValues = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  status: "DRAFT" | "PUBLISHED";
};

type Mode = "write" | "preview" | "split";

/** Toolbar actions: wrap the selection, or insert a block at the cursor. */
const TOOLS: { label: string; title: string; wrap?: [string, string]; block?: string }[] = [
  { label: "H2", title: "Katta sarlavha", block: "## Sarlavha\n" },
  { label: "H3", title: "Kichik sarlavha", block: "### Kichik sarlavha\n" },
  { label: "B", title: "Qalin", wrap: ["**", "**"] },
  { label: "I", title: "Kursiv", wrap: ["_", "_"] },
  { label: "Havola", title: "Havola", wrap: ["[", "](https://)"] },
  { label: "• Roʻyxat", title: "Roʻyxat", block: "- Birinchi\n- Ikkinchi\n- Uchinchi\n" },
  { label: "1. Roʻyxat", title: "Raqamli roʻyxat", block: "1. Birinchi\n2. Ikkinchi\n3. Uchinchi\n" },
  { label: "❝ Eslatma", title: "Ajratilgan eslatma", block: "> **Eslatma:** muhim fikr shu yerda.\n" },
  { label: "Jadval", title: "Jadval", block: "| Ustun | Qiymat |\n|---|---|\n| Birinchi | 1 |\n| Ikkinchi | 2 |\n" },
  { label: "Rasm", title: "Rasm (havola orqali)", block: "![Rasm tavsifi](https://)\n" },
  { label: "—", title: "Ajratuvchi chiziq", block: "\n---\n" },
];

export function ArticleEditor({ values }: { values: ArticleFormValues }) {
  const [state, action, pending] = useActionState(saveArticle, undefined);
  const [deleting, startDelete] = useTransition();
  const errors = state?.fieldErrors ?? {};
  const [title, setTitle] = useState(values.title);
  const [slug, setSlug] = useState(values.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(values.slug));
  const [excerpt, setExcerpt] = useState(values.excerpt);
  const [body, setBody] = useState(values.body);
  const [status, setStatus] = useState(values.status);
  const [cover, setCover] = useState(values.coverImageUrl);
  const [mode, setMode] = useState<Mode>("split");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const applyTool = (tool: (typeof TOOLS)[number]) => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    let next: string;
    let caret: number;
    if (tool.wrap) {
      const [before, after] = tool.wrap;
      const selected = body.slice(start, end) || "matn";
      next = body.slice(0, start) + before + selected + after + body.slice(end);
      caret = start + before.length + selected.length + after.length;
    } else {
      const atLineStart = start === 0 || body[start - 1] === "\n";
      const insert = `${atLineStart ? "" : "\n\n"}${tool.block}`;
      next = body.slice(0, start) + insert + body.slice(end);
      caret = start + insert.length;
    }
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  const field = (name: string) => (errors[name] ? <span className="mt-1 block text-sm text-anor">{errors[name]}</span> : null);

  return (
    <form action={action} className="space-y-6">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      {state?.error && <p role="alert" className="rounded-xl bg-anor-soft px-4 py-3 text-sm">{state.error}</p>}

      <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium">Sarlavha</span>
            <input
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              aria-invalid={Boolean(errors.title)}
              className={`${inputClass} font-serif text-xl`}
            />
            {field("title")}
          </label>
          <label className="block">
            <span className="flex justify-between text-sm font-medium">
              Qisqacha mazmun
              <span className={`font-normal ${excerpt.length > 400 ? "text-anor" : "text-ink-faint"}`}>{excerpt.length}/400</span>
            </span>
            <textarea name="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} aria-invalid={Boolean(errors.excerpt)} className={inputClass} />
            {field("excerpt")}
          </label>
        </div>

        <div className="space-y-5 rounded-2xl border border-line bg-paper-raised p-5">
          <label className="block">
            <span className="text-sm font-medium">Holat</span>
            <select name="status" value={status} onChange={(e) => setStatus(e.target.value as ArticleFormValues["status"])} className={inputClass}>
              <option value="DRAFT">Qoralama (saytda koʻrinmaydi)</option>
              <option value="PUBLISHED">Chop etilgan</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Manzil (slug)</span>
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              aria-invalid={Boolean(errors.slug)}
              className={`${inputClass} font-mono text-sm`}
            />
            {errors.slug ? field("slug") : <span className="mt-1 block truncate text-xs text-ink-faint">/journal/{slug || "…"}</span>}
          </label>
          <label className="block">
            <span className="text-sm font-medium">Muqova rasmi (havola)</span>
            <input name="coverImageUrl" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://…" aria-invalid={Boolean(errors.coverImageUrl)} className={inputClass} />
            {field("coverImageUrl")}
          </label>
        </div>
      </div>

      {/* Body editor */}
      <div className="rounded-2xl border border-line bg-paper-raised">
        <div className="flex flex-wrap items-center gap-1 border-b border-line p-2">
          {TOOLS.map((tool) => (
            <button
              key={tool.label}
              type="button"
              title={tool.title}
              onClick={() => applyTool(tool)}
              disabled={mode === "preview"}
              className="rounded-lg px-2.5 py-1.5 text-sm text-ink-soft transition-colors hover:bg-paper-sunk hover:text-ink disabled:opacity-40"
            >
              {tool.label}
            </button>
          ))}
          <div className="ml-auto flex rounded-full bg-paper-sunk p-0.5 text-sm">
            {(
              [
                ["write", "Yozish"],
                ["split", "Yonma-yon"],
                ["preview", "Koʻrish"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`rounded-full px-3 py-1 ${mode === value ? "bg-paper-raised font-medium shadow-sm" : "text-ink-soft"} ${value === "split" ? "hidden lg:block" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className={mode === "split" ? "lg:grid lg:grid-cols-2" : ""}>
          <textarea
            ref={bodyRef}
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-invalid={Boolean(errors.body)}
            className={`min-h-[32rem] w-full resize-y bg-transparent p-5 font-mono text-[0.92rem] leading-relaxed outline-none ${mode === "preview" ? "hidden" : ""} ${mode === "split" ? "lg:border-r lg:border-line" : ""}`}
            placeholder={"Matnni Markdown bilan yozing.\n\n## Sarlavha\n\nOddiy paragraf, **qalin** va _kursiv_ matn."}
          />
          {mode !== "write" && (
            <div className={`max-h-[48rem] overflow-y-auto p-5 ${mode === "split" ? "hidden lg:block" : ""}`}>
              {body.trim() ? <ArticleMarkdown>{body}</ArticleMarkdown> : <p className="text-ink-faint">Koʻrish uchun matn yozing.</p>}
            </div>
          )}
        </div>
        <div className="flex justify-between border-t border-line px-5 py-2.5 text-xs text-ink-faint">
          <span>Markdown · jadval, roʻyxat, havola, rasm qoʻllab-quvvatlanadi</span>
          <span>~{readingMinutes(body)} daqiqa oʻqish</span>
        </div>
      </div>
      {field("body")}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass.primary}>
          {pending ? "Saqlanmoqda…" : "Saqlash"}
        </button>
        <Link href="/admin/articles" className={buttonClass.secondary}>
          Roʻyxatga qaytish
        </Link>
        {values.id && values.status === "PUBLISHED" && (
          <Link href={`/journal/${values.slug}`} target="_blank" className="font-medium text-firuza hover:underline">
            Saytda koʻrish ↗
          </Link>
        )}
        {values.id && (
          <button
            type="button"
            disabled={deleting}
            onClick={() => {
              if (confirm(`“${values.title}” maqolasi butunlay oʻchirilsinmi?`)) startDelete(() => deleteArticle(values.id!));
            }}
            className={`${buttonClass.danger} ml-auto`}
          >
            Oʻchirish
          </button>
        )}
      </div>
    </form>
  );
}
