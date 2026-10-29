# OliyRank

An independent ranking of universities in Uzbekistan, built on public data.

Live at **[oliyrank.com](https://oliyrank.com)**. The site is in Uzbek.

Students choosing a university usually have little to compare beyond reputation and word
of mouth. OliyRank puts the numbers that already exist in public sources (admission
scores, research output, official registries) side by side, explains how each score is
calculated, and lets you compare universities directly.

The current edition, *2026 · Dastlabki nashr*, is a preview: it covers 166 universities
and ranks those with enough data. The full method, its sources and its limits are in
[docs/methodology.md](docs/methodology.md).

## What's on the site

- Rankings with search and filters
- A profile page for every university
- Side-by-side comparison
- A journal with articles about the ranking and higher education
- Accounts, so visitors can save universities
- An admin panel for editing universities and publishing articles

## Where the data comes from

| Source | Used for |
| --- | --- |
| [my.uzbmb.uz](https://my.uzbmb.uz) | Official 2025 admission scores |
| [ROR](https://ror.org) | Matching universities to a global registry |
| [OpenAlex](https://openalex.org) | Research papers and citations |

Nothing is typed in by hand except the matching decisions in `data/curation/`, and those
are reviewed one by one. `data/curation/match-review.tsv` shows how every university was
matched.

## Running it locally

You need Node.js 22.12 or newer. No Docker is required; Prisma runs a local Postgres for you.

```bash
npm install
npm run db:local -- --detach --name oliyrank
cp .env.example .env      # put the postgres:// URL printed above into DATABASE_URL
npm run db:migrate
npm run db:seed
npm run data:fetch        # downloads the source data, takes a few minutes
npm run data:build
npm run data:import
npm run dev               # http://localhost:3000
```

To use the admin panel, sign up on your local site, then run
`npm run admin:make -- you@example.com`.

The local database only handles a few connections at once, so keep
`DATABASE_POOL_MAX=1` and `NEXT_BUILD_CPUS=1` in `.env`. If pages start failing with
`ECONNREFUSED`, the database has stopped; run the `db:local` command again.

If `data:fetch` fails on OpenAlex, you have used up the shared daily limit. Get a free
key at openalex.org/settings/api and set it as `OPENALEX_API_KEY`.

## Updating the data

| Command | What it does |
| --- | --- |
| `npm run data:fetch` | Downloads admission pages, registries and research data into `data/raw/` (not committed) |
| `npm run data:build` | Builds `data/universities.json` and the matching review files |
| `npm run data:import` | Loads universities and the edition into the database. Universities edited in the admin panel are left alone |
| `npm run data:export` | Writes an Excel workbook of the ranking to `exports/`, with live formulas |

## How the code is organised

- `app/` pages and layouts
- `components/` UI pieces
- `lib/methodology.ts` indicators, weights and scoring rules
- `lib/ranking/` the ranking engine and the code that feeds it data
- `lib/auth/`, `lib/admin/` accounts, sessions and admin actions
- `prisma/` database schema, migrations and seed
- `scripts/` the data pipeline and admin scripts
- `content/articles/` starter journal articles
- `docs/methodology.md` the methodology in full

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma 7 and PostgreSQL.
Tests run with `npm test`; `npm run lint` and `npm run typecheck` check the rest.

## Hosting

The site runs on Vercel, with the database on Supabase. The only setting Vercel needs is
`DATABASE_URL`, pointing at Supabase's connection pooler. Deploys are made from the command
line with `npx vercel deploy --prod`; pushing to GitHub does not deploy on its own.

## Design

The look borrows from Uzbek heritage: warm paper tones with *firuza* (turquoise),
*anor* (pomegranate) and *oltin* (gold). Colours live in `app/globals.css`, and there are
light and dark themes. Headings are set in Literata and body text in Onest.

## Contact

Corrections to the data are welcome. The contact address is on the site's
[contact page](https://oliyrank.com/contact).
