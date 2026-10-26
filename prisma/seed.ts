/**
 * Seeds reference data only: the methodology indicators, a draft period for the next
 * full edition, and the starter articles in content/articles/ (created once, never
 * overwritten, so edits made in the admin panel stay). Universities and their values
 * come from real sources through scripts/import-edition.ts (see README "Data pipeline").
 *
 *   npx prisma db seed
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ALL_INDICATORS, METHODOLOGY_VERSION } from "../lib/methodology";
import { createScriptDb } from "../scripts/lib/db";

const db = createScriptDb();

async function main() {
  for (const indicator of ALL_INDICATORS) {
    const data = {
      name: indicator.name,
      pillar: indicator.pillar,
      weight: indicator.weight,
      unit: indicator.unit,
      source: indicator.source,
      description: indicator.description,
    };
    await db.indicator.upsert({ where: { key: indicator.key }, update: data, create: { key: indicator.key, ...data } });
  }

  const name = "2026 · Toʻliq nashr";
  if (!(await db.rankingPeriod.findFirst({ where: { name } }))) {
    await db.rankingPeriod.create({
      data: { name, year: 2026, methodologyVersion: METHODOLOGY_VERSION, status: "DRAFT" },
    });
  }

  const dir = join(import.meta.dirname, "..", "content", "articles");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const slug = file.replace(/\.md$/, "");
    if (await db.article.findUnique({ where: { slug } })) continue;
    const { meta, body } = parseFrontMatter(readFileSync(join(dir, file), "utf8"));
    await db.article.create({
      data: { slug, title: meta.title, excerpt: meta.excerpt, body, status: "PUBLISHED", publishedAt: new Date() },
    });
    console.log(`Article created: ${slug}`);
  }

  console.log("Seed complete.");
}

/** Minimal front matter: `key: "value"` lines between --- markers. */
function parseFrontMatter(text: string) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error("Article is missing front matter");
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (pair) meta[pair[1]] = pair[2];
  }
  return { meta, body: match[2].trim() };
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
