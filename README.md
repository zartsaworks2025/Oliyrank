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
npm run db:seed:demo    # indicators, starter universities, and a DEMO period with fake scores
npm run dev
```

Use `npm run db:seed` (without `:demo`) for reference data only. Demo scores are fake
and must never be loaded into production.

The local `prisma dev` database is embedded Postgres and handles few connections at once,
so keep `DATABASE_POOL_MAX=1` and `NEXT_BUILD_CPUS=1` in your local `.env` (see
`.env.example`). If it ever stops accepting connections, restart it:
`npx prisma dev stop oliyrank`, then `npm run db:local -- --detach --name oliyrank`.

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
| `db:seed` / `db:seed:demo` | Seed reference data (+ demo scores) |
| `db:studio` | Browse the database |
