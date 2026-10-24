import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders article Markdown (GitHub-flavoured: tables, task lists, strikethrough).
 * Raw HTML is not rendered, so article bodies cannot inject scripts.
 * A blockquote whose first line starts with "**Eslatma:**" or similar renders as a callout.
 */
export function ArticleMarkdown({ children }: { children: string }) {
  return (
    <div className="article-body text-[1.075rem] leading-[1.8] text-ink">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 className="mt-12 mb-4 font-serif text-[1.75rem] leading-tight font-medium">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-9 mb-3 font-serif text-xl font-medium">{children}</h3>,
          p: ({ children }) => <p className="my-5">{children}</p>,
          a: ({ href, children }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className="text-firuza underline decoration-firuza/40 underline-offset-3 hover:decoration-firuza">
                {children}
              </a>
            );
          },
          ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-oltin">{children}</ul>,
          ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:font-serif marker:text-oltin">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="my-8 rounded-r-2xl border-l-4 border-firuza bg-firuza-soft/60 px-6 py-1 text-ink [&>p]:my-4">{children}</blockquote>
          ),
          hr: () => <hr className="my-12 border-line" />,
          img: ({ src, alt, title }) => (
            <figure className="my-8">
              {/* eslint-disable-next-line @next/next/no-img-element -- author-supplied URLs of unknown size */}
              <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className="w-full rounded-2xl border border-line" loading="lazy" />
              {(title || alt) && <figcaption className="mt-2 text-center text-sm text-ink-faint">{title ?? alt}</figcaption>}
            </figure>
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full border-collapse text-left text-[0.95rem]">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-paper-sunk/70 text-sm text-ink-soft">{children}</thead>,
          th: ({ children }) => <th className="border-b border-line px-4 py-3 font-medium">{children}</th>,
          td: ({ children }) => <td className="border-b border-line px-4 py-3 tabular-nums">{children}</td>,
          code: ({ children }) => <code className="rounded-md bg-paper-sunk px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>,
          pre: ({ children }) => <pre className="my-6 overflow-x-auto rounded-2xl bg-paper-sunk p-5 text-sm [&_code]:bg-transparent [&_code]:p-0">{children}</pre>,
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}

export const readingMinutes = (markdown: string) => Math.max(1, Math.round(markdown.split(/\s+/).length / 180));
