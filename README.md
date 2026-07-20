# infoser_portfolio

Code-editor-style portfolio for **Ishan Kumar Sahu** — B.Tech CSE (Data Science) student, ML/DL researcher.

The site mimics a VS Code workspace: section content opens as "files" in an editor shell, with a cursor-reactive 3D particle field in the background and a pixel-art eye cursor in the foreground. A hidden admin route (secret URL + Supabase JWT login) allows in-place editing of all sections.

## Stack

- **Frontend:** React 19 + Vite 8 + TypeScript 6 + Tailwind CSS v4 + shadcn/ui
- **3D:** three.js + @react-three/fiber (cursor-reactive particle field)
- **Cursor:** pixel-art SVG sprite with eye-tracking pupils
- **State:** zustand (theme, tabs, session, content cache)
- **Motion:** framer-motion
- **Data + Auth + Storage:** Supabase (Postgres + RLS, Auth JWT, Storage for images)
- **Editor (admin only):** Monaco Editor for JSON
- **SEO:** react-helmet-async (per-section `<title>` + meta)
- **Deploy:** GitHub → Vercel subdomain

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173/
npm run typecheck  # tsc -b --noEmit
npm run build      # tsc -b && vite build
npm run preview    # serve the production build locally
```

The site works **without** any env vars configured — section content falls back to the bundled static copy in `src/sections-content/`. Supabase is an opt-in live-data upgrade.

## Project layout

One-way import direction is enforced:

```
design-system/  ->  features/  ->  routes/  ->  app/
                              ^
                              |
                  lib/ (cross-feature utilities)
                  store/ (zustand stores)
                  config/ (single source of truth)
                  types/ (shared TS types)
```

See `WORKFLOW.md` for the full build sequence and per-step acceptance bars.

## Environment variables

See `.env.example`. Client-exposed vars use the `VITE_` prefix; server-only secrets (`ADMIN_SLUG`) are never bundled.

```
VITE_SUPABASE_URL=       # public, RLS-gated
VITE_SUPABASE_ANON_KEY=  # public, RLS-gated
ADMIN_SLUG=              # server-only, used by /api/admin-gate.ts
```

## Supabase setup (optional, for live editing)

1. Create a Supabase project; copy the project URL + anon key into `.env.local`.
2. Run `supabase/migrations/0001_init.sql` then `0002_storage.sql` in the SQL editor.
3. Run `supabase/seed.sql` to populate demo section content (or skip — site uses bundled fallback).
4. Invite the admin user `issuatstudy090@gmail.com` under Authentication → Users; that user has admin UPDATE/INSERT rights via `public.is_admin()`.

See `supabase/SETUP.md` for full details.

## Hidden admin route

- Visit `https://<your-vercel-domain>/__admin__/<ADMIN_SLUG>` to reach the admin shell.
- Wrong slug → 404 (served by `api/admin-gate.ts`).
- Correct slug → login page → Supabase `signInWithPassword` → per-section editors with live preview and image upload.

To generate the `ADMIN_SLUG` (40+ chars of randomness):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set it as a Vercel env var (Project → Settings → Environment Variables). It is **server-only** — do not prefix with `VITE_`.

## Deploy

This repo is configured for Vercel:

- **Build command:** `npm run build`
- **Output dir:** `dist`
- **Install command:** `npm install`
- **`vercel.json`** already configures rewrites:
  - `/__admin__/:slug` → `/api/admin-gate` (serverless function for slug gating)
  - every other path → `/index.html` (client-side routing for the SPA)

After connecting the GitHub repo to Vercel:

1. Add the env vars in Project → Settings → Environment Variables.
2. Deploy. Vercel auto-detects the `api/` directory as serverless functions.
3. Generate `ADMIN_SLUG` and add it as a server-only env var.
4. Visit `https://<domain>/__admin__/<ADMIN_SLUG>`.

## Run locally with server-side gate

`npm run dev` (Vite) does not run the `api/admin-gate.ts` function. To test the gate locally, use `vercel dev`:

```bash
npm i -g vercel
vercel dev
```

Then visit `http://localhost:3000/__admin__/<your-local-ADMIN_SLUG>` with `ADMIN_SLUG` set in `.env.local`.

## CV

The `/Curriculum_Vitae_Ishan.pdf` (in repo root) is copied to `public/` at build time so the contact section's "download CV" link resolves.

## License

Personal portfolio. No code reuse without permission.
