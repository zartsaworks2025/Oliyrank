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

## Status (2026-10-30)

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

- **Live** (2026-10-30): https://oliyrank.com (and www) serves the rebuild from Vercel
  project `oliyrank` (team flivnels-projects, reused from the old team version; the
  domain was already attached, DNS on Cloudflare). Vercel Web Analytics is on.

Not done yet:
- Make the owner admin once they sign up on the live site (see Next steps 3).
- Legal: privacy page section 5 cites the data-localisation article 27¹, but user
  data sits in Supabase Singapore. Owner was told; wording unchanged pending their call.

## Next steps (deployment plan)

1. ~~Push `main` to GitHub~~ (done).
2. ~~Database~~ (done 2026-10-30). Supabase project `ocpjlvuuidsjtjxbrblf`
   ("oliyrank_database", ap-southeast-1, Postgres 17). The older empty project
   `jelzzissqofhhneznlcg` is unused. Connection strings live in git-ignored
   `.env.supabase` (`DIRECT_URL`, `POOLED_URL`). Ask before changing anything there.
   - The direct host is IPv6-only and this machine has no IPv6: run migrations and
     scripts through the session pooler (`POOLED_URL` with port 6543 → 5432). Scripts
     honour a `DATABASE_URL` already in the environment, so `.env` need not change.
   - RLS is enabled on every table (migration `enable_rls`) to close Supabase's
     public REST API; Prisma connects as owner and is unaffected. New tables need
     `ENABLE ROW LEVEL SECURITY` in their migration.
3. ~~Fill it~~ (done): migrated, seeded, imported (166 universities, 179 scores).
   Still to do: after the owner signs up on the live site, `npm run admin:make -- <email>`
   against Supabase.
4. ~~Hosting~~ (done). Deploy from this folder with the Vercel CLI (`.vercel/` links it;
   the project is not Git-connected, so pushing does not deploy): `npx vercel deploy`
   for a preview (behind Vercel login; check with `npx vercel curl <url>/path`), then
   `npx vercel deploy --prod`. In the owner's PowerShell use `npx.cmd` (script
   execution policy blocks `npx.ps1`). Only env var: `DATABASE_URL` = `POOLED_URL`
   (Production + Preview). Do not set `DATABASE_POOL_MAX`/`NEXT_BUILD_CPUS` there.
5. Optional: remove the unused `AUTH_SECRET` line from `.env.example`.

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
