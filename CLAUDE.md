@AGENTS.md

# OliyRank — notes for Claude

Read this first in every new session. `README.md` is the human-facing guide (setup,
data pipeline, layout); this file is the project's state and where work left off.
Update the "Status" and "Next steps" sections whenever they change.

## What this is

Independent ranking of universities in Uzbekistan. Rebuilt from scratch (Oct 2026);
the previous team codebase lives in `_legacy/` (git-ignored, has its own `.git`, kept
for reference only — never edit or upload it).

Ground rules from the owner:
- Universities only, Uzbek-first UI (Latin script, correct `oʻ`/`gʻ`/`ʼ`).
- Data must come from credible public sources; anything demo/preview stays labelled.
- Use the newest stable dependency versions; explain anything held back.
- Methodology sources: national rating regulation 3783, OpenAlex, my.uzbmb.uz
  admission scores, QS (via browser). Rationale in `docs/methodology.md`.

Stack: Next.js 16 (App Router, Cache Components), React 19, TypeScript 6, Tailwind 4,
Prisma 7 + PostgreSQL (`@prisma/adapter-pg`), Vitest. Auth is custom: database sessions
with a hashed cookie token (`lib/auth/`), not Auth.js.

## Status (2026-10-26)

Done and committed on local `main`:
- Site: home, rankings (search/filters), university profiles, compare, journal,
  methodology, about/contact/privacy/terms, sign up/in, account with bookmarks.
- Admin panel (`/admin`): universities and articles CRUD.
- Real data: 166 universities, "2026 · Dastlabki nashr" preview edition, methodology
  v1.1, Excel export (`npm run data:export`).
- Cleanup pass: shared helpers in `lib/search.ts`, `formatRawValue` in
  `lib/ranking/compute.ts`, `scripts/lib/db.ts`, `scripts/lib/http.mjs`.
- Typecheck, lint and 22 tests pass.

- **GitHub** (2026-10-28): remote `origin` = github.com/zartsaworks2025/Oliyrank
  (public, owner has admin) now has the rebuild on `main`. A ruleset ("protect main")
  blocks force-pushes, so the old team version (0fb0503) was joined with a
  `merge -s ours` commit (e173d5a): the tree is the rebuild, old commits stay in
  history. Push normally from now on. Other remote branches (`Rajabboy`, `sultonboy`,
  `zayniddin`, `vercel/...`) are old code; leave them unless asked.

Not done yet:
- **Deployment**: not started (see Next steps).

## Next steps (deployment plan)

1. ~~Push `main` to GitHub~~ (done).
2. Database: Supabase (connector is connected). Project `jelzzissqofhhneznlcg`
   ("zartsaworks2025's Project", region ap-southeast-1, Postgres 17) exists and is
   EMPTY. Use the pooled connection string for the site (`DATABASE_URL` on Vercel)
   and the direct one for migrations/import. Ask before creating or changing anything.
3. Fill it from this machine (raw data in `data/raw/` is local only), with `.env`
   pointed at Supabase: `npx prisma migrate deploy`, `npm run db:seed`,
   `npm run data:import`; then after the owner signs up on the live site,
   `npm run admin:make -- <email>`. Switch `.env` back to the local DB afterwards.
4. Hosting: Vercel. The Vercel connector is read-only (projects, deployments, logs),
   so create/link the project and set env vars with the Vercel CLI after the owner
   runs `vercel login`. Only env var needed: `DATABASE_URL` (the build reads the DB).
   Do not set `DATABASE_POOL_MAX`/`NEXT_BUILD_CPUS` there; they are local-only.
5. Optional: custom domain; remove the unused `AUTH_SECRET` line from `.env.example`.

## Local environment gotchas (Windows)

- Local DB: `npx prisma dev --detach --name oliyrank` (embedded Postgres). If pages
  500 with `ECONNREFUSED`, it has simply stopped; restart it. Keep
  `DATABASE_POOL_MAX=1` and `NEXT_BUILD_CPUS=1` in local `.env`.
- Dev server: `.claude/launch.json` config `oliyrank-dev` (port 3000).
- GitHub CLI is installed at `C:\Program Files\GitHub CLI\gh.exe` but may not be on
  PATH in older shells; the owner is logged in (`gh auth login`).
- Plain `git fetch` from the Bash tool hung on credentials and later failed with
  "fetch-pack: invalid index-pack output". Passing the gh helper works for
  auth: `git -c credential.helper= -c 'credential.https://github.com/.helper=!"/c/Program Files/GitHub CLI/gh.exe" auth git-credential' <cmd>`.
- Two `slugify` functions (`lib/slug.ts` for admin, `scripts/lib/names.mjs` for the
  data build) are intentionally different; merging them would change public URLs.
- Contact email shown on the site: `lib/site.ts`.
