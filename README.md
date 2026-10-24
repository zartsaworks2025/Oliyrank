# OliyRank

Independent, transparent rankings of universities in Uzbekistan.
How the ranking works, with sources: [docs/methodology.md](docs/methodology.md).

**Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript 6 · Tailwind CSS 4 · Prisma 7 + PostgreSQL

## Getting started

```bash
npm install
npm run db:local        # start a local Postgres (no Docker needed)
cp .env.example .env    # paste the postgres:// URL printed above into DATABASE_URL
npm run db:migrate      # create tables
npm run db:seed         # methodology indicators
npm run data:fetch      # download official/open source data (a few minutes)
npm run data:build      # build the curated university list
npm run data:import     # load the edition into the database
npm run dev
```

The local `prisma dev` database is embedded Postgres and handles few connections at once,
so keep `DATABASE_POOL_MAX=1` and `NEXT_BUILD_CPUS=1` in your local `.env` (see
`.env.example`). If it ever stops accepting connections, restart it:
`npx prisma dev stop oliyrank`, then `npm run db:local -- --detach --name oliyrank`.

## Data pipeline

All numbers come from credible public sources; nothing is entered by hand except the
reviewed decisions in `data/curation/`.

| Step | Script | Output |
| --- | --- | --- |
| Download | `data:fetch` | `data/raw/`: official 2025 admission pages (my.uzbmb.uz), ROR and OpenAlex registries, per-paper OpenAlex research data (git-ignored) |
| Build list | `data:build` | `data/universities.json`, plus `data/curation/match-review.tsv` and `ror-candidates.tsv` for review |
| Import | `data:import` | Universities and the edition's raw values in the database |
| Export | `data:export` | `exports/oliyrank-<year>-preview.xlsx`: a formula-driven workbook, checked against the ranking engine |

Manual curation lives in `data/curation/matches.json` (admission list ↔ ROR decisions) and
`data/curation/extra-ror.json` (universities outside the national admission). See
[docs/methodology.md](docs/methodology.md) §7 for the rules.

OpenAlex gives anonymous users a small shared daily budget. Set `OPENALEX_API_KEY` (free at
openalex.org/settings/api) if downloads start failing.

## Project layout

| Path | What lives there |
| --- | --- |
| `app/` | Routes, layouts and global styles |
| `components/` | UI: `brand/`, `layout/`, `theme/` |
| `lib/methodology.ts` | Ranking pillars, indicators, weights and scoring rules (single source of truth) |
| `lib/ranking/compute.ts` | Ranking engine: pure scoring maths, unit-tested |
| `lib/ranking/data.ts` | Loads raw values, runs the engine, caches the result for pages |
| `lib/db.ts` | Prisma client (server only) |
| `docs/methodology.md` | Methodology rationale, research and sources |
| `prisma/` | Schema, migrations and seed script |

## Design

Warm editorial style drawn from Uzbek heritage: paper tones, *firuza* (turquoise),
*anor* (pomegranate) and *oltin* (gold). Colors are CSS variables in `app/globals.css`
exposed as Tailwind colors (`bg-paper`, `text-firuza`, …), with light and dark themes.
Headings use Literata and body text uses Onest; both cover Latin and Cyrillic.

## Scripts

| Script | Does |
| --- | --- |
| `dev` / `build` / `start` | Next.js |
| `lint` / `typecheck` / `test` | ESLint / TypeScript / Vitest |
| `db:local` | Local Prisma Postgres server |
| `db:migrate` / `db:push` | Apply schema changes |
| `db:seed` | Seed methodology indicators |
| `data:fetch` / `data:build` / `data:import` / `data:export` | Data pipeline (see above) |
| `db:studio` | Browse the database |
