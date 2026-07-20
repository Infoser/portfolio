# Ishan.dev — Build Workflow

> Code-editor-style portfolio for Ishan Kumar Sahu.
> Stack: React + Vite + TS + Tailwind v4 + shadcn/ui + three.js (R3F) + Supabase + Vercel.

This document describes the exact order of work, which steps are **sequential** (must wait for the previous), which steps are **asynchronous / parallelisable**, and the acceptance bar for each.

---

## Locked-in Decisions (per user)

| Variable | Value |
|----------|-------|
| Package manager | `pnpm` (default) |
| Node version | Vercel auto-detect (no `.nvmrc` pin) |
| Resume PDF | Served from `public/Curriculum_Vitae_Ishan.pdf`; linked from `contact.toml` as "Download CV" |
| Favicon | Pixel-eye SVG designed in Step 12 (browser tab + small favicon) |
| OG image | v1: static SVG only (Twitter renders, Facebook may suppress). Optional upgrade later via admin image upload → site meta panel. |
| About copy | Placeholder — `[Paste your bio here]`-style stub; user fills via admin post-deploy |
| Project thumbnails | `picsum.photos/seed/<projectId>/640/360` placeholders; user swaps via admin later |
| Portfolio repo | Private; no visible "view source" link from the site |
| Vercel project name | `infoser_portfolio` |
| GitHub remote | User provides after Step 1; continuous prod-side check after each subsequent step |
| Supabase region | Auto-pick (Supabase default) |
| Bug-counter speed | Slow — ~1 bug per 2s of hover |
| Debug terminal flavour | Random "AI hallucination" strings — no real data exposed |
| Non-technical-friendly UX | Terminal-style skin, human-readable content (see Guiding Principles) |

---

## Guiding Principles (apply to every step)

- **Modular by construction.** Every feature lives in its own folder under `src/features/<name>/` and exposes only an `index.ts` barrel. Internals are private.
- **Import direction rule (enforced):**
  - `design-system/` ← depends on nothing but tokens & primitives.
  - `features/*` ← depends on `design-system/`, `lib/`, `store/`, `config/`. Never on `routes/`.
  - `routes/` ← wires features. Never imported by features.
  - `lib/` ← cross-feature utilities only (supabase, hooks, cn, guards).
- **Single-responsibility files.** Hard cap ~250 lines per file. Split by concern, not by whim.
- **No magic strings.** Section keys, theme modes, route paths live in `config/*` constants.
- **Type-driven.** Section content shapes live in `types/sections.ts`; both renderers and editors import the same types — no drift.
- **Each step ends with `pnpm run dev` working AND a Vercel preview deploy URL.** Continuous prod-side check after every step, per the user's request. No "broken mid-flight" states between steps.
- **No comments in code unless requested.** Self-documenting names, small functions, clear types.
- **Terminal aesthetic is skin, never friction.** The terminal/IDE aesthetic is the *vibe* (monospace chrome, status bar, blinking cursor in inputs, syntax-coloured accents, pixel cursor). It must never become a barrier for non-technical visitors. Enforced rules:
  - Section **display labels** are plain English ("About", "Experience", "Projects", "Achievements", "Skills", "Education", "Leadership", "Contact"). The `.md`/`.tsx` extension is visual flavour in the file-tree explorer only; the tab title shows the plain name.
  - No raw terminal command prompts as section headers (no `$ cd ~/experience` etc).
  - Body content is prose, not bash. Projects' structured renderer leads with a one-line plain-English summary before bullets.
  - Every interactive element has a textual affordance or aria-label — not just a glyph. Theme toggle has tooltip. Hamburger drawer has a "Browse Sections" text label.
  - First-visit `sonner` toast hint (once per session): "Use the file tree on the left to explore sections." Dismissible.
  - Mobile UX: explorer drawer slides in with an obvious text button labelled "Browse Sections".

---

## Sequential vs Asynchronous — At a Glance

```
Step 1  ─ Foundation & Design System          [SEQUENTIAL — everything depends on this]
Step 2  ─ Core Layout Primitives              [SEQUENTIAL — shadcn install + motion presets]
   │
   └──> Step 3  ─ 3D Particle Background      [ASYNC track A]
   └──> Step 4  ─ Pixel Eye Cursor            [ASYNC track B]
   └──> Step 5  ─ Editor Shell (VS Code UI)   [ASYNC track C]
              (Steps 3, 4, 5 are independent — can be done in parallel tracks)
                            │
                            v
Step 6  ─ Section Renderer System + About    [SEQUENTIAL — needs Editor Shell from Step 5]
Step 7  ─ Remaining Prose Sections            [SEQUENTIAL — needs Section Renderer from Step 6]
Step 8  ─ Projects Section (showpiece)        [SEQUENTIAL — extends structured renderer from Step 7]
Step 9  ─ Easter Eggs                         [ASYNC — can be slotted in after Step 5]
                            │
                            v
Step 10 — Supabase Data Layer                 [SEQUENTIAL — schema, RLS, seed, swap static → live]
Step 11 — Hidden Admin (login + editors)     [SEQUENTIAL — needs live data layer from Step 10]
Step 12 — Polish & Deploy                     [SEQUENTIAL — needs everything above]
```

---

## Step 1 — Foundation & Design System  *(sequential)*

**Goal:** A themed, blazingly-clean shell you can `npm run dev` and see the tone of the site.

**Why first:** Every later feature inherits tokens, motion presets, theme state and the `cn()` helper. Landing this first means no retroactive theming passes later. `design-system/typography.ts` is the single source of truth for fonts (display + body + mono roles) — to swap a font, edit exactly that file, nothing else.

**Work:**
- `pnpm create vite@latest . --template react-ts`.
- `package.json` name set to `infoser_portfolio`.
- Install deps: `tailwindcss @tailwindcss/vite zustand framer-motion lucide-react clsx tailwind-merge`.
- `pnpm dlx shadcn@latest init` (using `shadcn` skill for correct v4 + Vite setup).
- `tsconfig.json` + `tsconfig.app.json` `@/*` → `./src/*` path alias.
- `vite.config.ts` with `@tailwindcss/vite` plugin and `@` alias.
- Copy `Curriculum_Vitae_Ishan.pdf` (existing at repo root) → `public/Curriculum_Vitae_Ishan.pdf` so it's served statically and linkable from `contact.toml`.
- Folder skeleton:
  ```
  src/
    app/                # composition root (App.tsx, main.tsx, providers)
    config/             # site config, sections-manifest, features flags
    design-system/      # tokens.ts, ThemeProvider, primitives, motion.ts
    features/           # (populated in later steps)
    lib/                # cn.ts, hooks/
    store/              # theme.ts, session.ts, content.ts, ui.ts
    sections-content/   # (populated in later steps)
    types/              # sections.ts
    routes/             # public.tsx, admin.tsx (stubs)
    index.css
  ```
- `design-system/tokens.ts` — dark-default + light colour tokens (jade / amber / magenta accents on slate), spacing, radius, motion curves. CSS variables exposed to Tailwind v4 `@theme`.
- `design-system/ThemeProvider.tsx` + `store/theme.ts` (zustand, persisted to localStorage, respects `prefers-color-scheme` first visit).
- `design-system/motion.ts` — shared framer-motion variants (`fade`, `slide`, `tabSwitch`).
- `lib/cn.ts` — `clsx` + `tailwind-merge`.
- `app/App.tsx` shows a single themed card with the toggle and a token swatch grid.
- First-visit `sonner` toast hint wired in (Step 2 brings the toaster; skeleton placeholder here).
- User creates GitHub remote after this step + deploys preview to Vercel.

**Acceptance bar:**
- `pnpm run dev` runs cleanly; `pnpm run typecheck` (new script) passes.
- Toggle button switches light/dark and persists on reload; tooltip + aria-label present.
- No console warnings.
- Produces a screenshot-worthy demo card that visibly proves design-system is operational.

---

## Step 2 — Core Layout Primitives  *(sequential)*

**Goal:** All shadcn primitives we'll need are in-repo (owned source, themeable). Shared motion variants sealed.

**Work:** Add shadcn components using `shadcn` skill guidance:
- `button`, `dialog`, `tabs`, `tooltip`, `scroll-area`, `input`, `textarea`, `dropdown-menu`, `resizable`, `separator`, `badge`, `card`, `sonner` (toaster), `avatar`.
- Verify `components.json` path aliases; outputs land in `src/design-system/components/`.
- Wire the first-visit sonner toast here: "Use the file tree on the left to explore sections." (Once per session; dismissible.)
- `/playground` route renders one of each primitive with both themes — manual visual audit.

**Acceptance bar:** Playground route renders all primitives in both themes without errors; sonner toast fires on first visit only.

---

## Step 3 — 3D Particle Background  *(async track A)*

**Goal:** Calm 800-particle field flowing toward the cursor, sits behind everything.

**Why async from 4 & 5:** Pure presentational feature; doesn't touch editor chrome or cursor logic. Can be built in parallel with tracks B and C.

**Work:**
- `features/three-background/` — self-contained feature folder:
  - `ParticleField.tsx` — R3F `<Canvas>` host (`fixed inset-0 -z-10 pointer-events-none`, lazy-loaded in `App.tsx` so three.js never enters the main bundle).
  - `Particles.tsx` — instanced `<points>` + custom `ShaderMaterial` (round particles, additive blending, per-instance size).
  - `particleData.ts` — Particle buffer builder + simulation constants (800 points, tri-color jade/amber/magenta in roughly equal thirds).
  - `useMousePointer.ts` — window pointer → NDC target with active/idle state.
- Lerp toward pointer NDC; damping 0.94 per frame; restoring force pulls each particle back to its base position + a slow `sin/cos` drift, so particles "settle" when idle.
- **Tri-color mix**: per-instance `color` attribute, particle `i % 3` picks jade / amber / magenta.
- **Code-split**: `React.lazy(() => import('@/features/three-background'))` in `App.tsx`; reduced-motion users never download the ~235 KB gzip chunk.
- Renders behind everything via `fixed inset-0 -z-10 pointer-events-none` + `aria-hidden="true"`.
- `useReducedMotion` hook gates the entire lazy mount: returns `null` under `prefers-reduced-motion`, so background is not rendered at all.
- Use `vercel-react-best-practices` skill for the `useFrame` rule — animation lives entirely inside `useFrame` (mutating `attribute.array` + `needsUpdate`), zero per-frame React state updates.

**Acceptance bar:** Background renders on the site; cursor movement visibly displaces particles (calm drift toward pointer); reduced-motion users see a plain background, no `three` chunk loaded; theme reload re-themes correctly; Vercel preview deploy URL requested for prod-side check.

---

## Step 4 — Pixel Eye Cursor  *(async track B)*

**Goal:** Pixel-art arrow sprite with two black eye-dots that track the mouse vector; blinks when idle.

**Why async from 3 & 5:** Owns document-level pointer listeners and the cursor DOM; isolated feature.

**Work:**
- `features/cursor/EyeCursor.tsx` — hides system cursor, renders an SVG sprite at pointer location.
- Eyes: small black discs whose pupils shift toward `mouseVelocityVector` with lerp; saccade on rapid moves.
- Blink animation when `lastMoveAt > 3s ago`.
- Disabled on touch / reduced-motion (system cursor restored).
- Use `vercel-react-best-practices` for rAF-based update (no React state, direct DOM mutation in effect).

**Acceptance bar:** Cursor visible on playground; eyes follow movement; blinks on idle 3s; restored to system cursor on mobile.

---

## Step 5 — Editor Shell (VS Code chrome)  *(async track C)*

**Goal:** Empty VS Code shell — activity bar, explorer, tab strip, editor area, status bar.

**Why async from 3 & 4:** Pure layout chrome; doesn't need cursor or 3D to ship.

**Work:**
- `features/editor-shell/`:
  - `ActivityBar.tsx` — left rail with section icons (lucide).
  - `Explorer.tsx` — collapsible file tree driven by `config/sections-manifest.ts` (metadata only, no content yet).
  - `TabStrip.tsx` — closable tabs, framer-motion enter/exit.
  - `EditorArea.tsx` — pane container that will host section content.
  - `StatusBar.tsx` — bottom bar: branch (`main`), bug-count slot, session-count slot, theme toggle, contact links.
- All five compose into `<EditorShell/>`; route `/` renders it with `EditorArea` showing "Open a file from the explorer" placeholder.
- Mobile: explorer collapses into a shadcn `Sheet` drawer; activity bar becomes a bottom tab strip.
- Use `vercel-composition-patterns` skill — compound component pattern for tab strip (Tabs.List / Tabs.Tab / Tabs.Panel).

**Acceptance bar:** Desktop layout looks like a convincing IDE; mobile collapses gracefully; no console errors.

---

## Step 6 — Section Renderer System + About  *(sequential after 5)*

**Goal:** Renderer dispatch system + first real section (`about.md`) wired and visible.

**Work:**
- `features/section/SectionRenderer.tsx` — dispatch by `SectionKind` to per-type renderer:
  - `markdown` → `react-markdown` + `rehype-highlight` + `remark-gfm`.
  - `json` → `react-syntax-highlighter` (later swapped to Monaco in admin).
  - `toml` → simple parser for `contact`.
  - `structured` → list of entries (for `experience`, `projects`, `achievements`).
- `features/section/renderers/MarkdownRenderer.tsx`, `JsonRenderer.tsx`, `TomlRenderer.tsx`, `StructuredListRenderer.tsx`.
- `types/sections.ts` — `Section`, `SectionKind`, `AboutContent`, `ExperienceContent`, etc.
- `sections-content/about/` — **placeholder stub content** (`[Paste your bio here — fill via admin post-deploy]`), not a first draft, per user's request.
- `config/sections-manifest.ts` — `about` shows in tree with **plain-English label** "About" (extension `.md` is visual flavour only) and opens by default in a tab.

**Acceptance bar:** Clicking "About" in explorer opens a tab titled "About"; markdown placeholder renders with syntax-highlighted code blocks; framer-motion transition.

---

## Step 7 — Remaining Prose Sections  *(sequential after 6)*

**Goal:** All 8 top-level sections visible with **one demo entry each** per your request.

**Work:** One module each in `sections-content/`:
- `experience/ExperienceDemo.tsx` — single entry (demo, e.g. Mist Lab stub).
- `education/EducationDemo.tsx` — single entry (BIT Durg).
- `leadership/LeadershipDemo.tsx` — single entry (CSEA).
- `achievements/AchievementsDemo.tsx` — single entry (SIH 2025).
- `skills/SkillsDemo.tsx` — single JSON entry (one language + one lib per category).
- `contact/ContactDemo.tsx` — toml with email / phone / linkden / github / huggingface.
- Register all in `sections-manifest.ts`; tests if any.
- Mobile: structured-list renderer collapses entries into cards.

**Acceptance bar:** All 8 sections openable; tabs closable; mobile-friendly; no console errors.

---

## Step 8 — Projects Section (Showpiece)  *(sequential after 7)*

**Goal:** The hero section — ShrutiAI / BinSense / AksharDhara as beautifully-rendered project "documents".

**Work:**
- `features/section/renderers/ProjectRenderer.tsx` — extended structured renderer with:
  - title, tech-stack badges (shadcn `badge`).
  - bullet list (your CV bullets, re-tightened in your voice — plain English, not bash).
  - demo/site/github link icons (lucide external-link / github / play) WITH textual aria-labels.
  - image thumbnail from `picsum.photos/seed/<projectId>/640/360` (user swaps via admin later).
  - "open in new tab" affordance.
- `sections-content/projects/` — three entries from your CV with tech stacks and bullets.
- Use `frontend-design` + `high-end-visual-design` skills — this is the section that justifies "best AI-built portfolio".

**Acceptance bar:** Projects folder expands to three files; each opens as a polished project doc; transitions smooth; mobile stack vertical.

---

## Step 9 — Easter Eggs  *(async — can be slotted any time after Step 5)*

**Goal:** Three small modules composed into the status bar / global keyboard hook.

- `features/easter-eggs/` with three sub-modules:
- `BugCounter.tsx` — subscribes to a global hover-stream; increments a counter in the Status Bar. **Slow cadence: ~1 bug per 2 seconds of hover movement.** Pure flavour.
- `DebugTerminal.tsx` — global `keydown` sequence detector for `"debug"`; opens a shadcn `dialog` styled as a terminal; commands `help` / `whoami` / `ls /sections` / `exit` return **random "AI hallucination" strings** (no real data exposed, just comedic fictional output like `"traceback: semantic overflow at line 42"`).
- `SessionTracker.tsx` — increments a "session-time" stat in status bar (visual nod to long multi-session debugging grind).
- All gated behind `config/features.ts` flags so each can be toggled independently.

**Acceptance bar:** All three trigger visibly; no perf regression; each can be disabled via config without code changes; no real user data is surfaced in the terminal.

---

## Step 10 — Supabase Data Layer  *(sequential)*

**Goal:** Swap hardcoded section data for live Supabase reads. Site looks identical; data now loads from Postgres.

**Work:**
- Use `supabase` + `supabase-postgres-best-practices` skills for schema and RLS.
- `supabase/migrations/0001_init.sql` — `sections` table, RLS policies (public SELECT, admin UUID-gated UPDATE), index on `section_key`.
- `supabase/seed.sql` — demo row per section (mirrors Step 7+8 demo entries).
- Supabase Storage bucket `section-images` (private) with storage policies (anon read via signed URL, admin write).
- `lib/supabase.ts` — single client, lazy-init per request to avoid fluid-compute session bleed.
- `lib/auth.ts` — `signIn`, `signOut`, `getSession` wrappers.
- `lib/storage.ts` — `uploadSectionImage(file, sectionKey)`, returns public URL.
- `lib/hooks/useSection.ts` — fetch + zustand cache.
- Replace static imports in renderers with `useSection(key)` calls.
- Document Supabase project setup in `supabase/SETUP.md` (SQL editor steps, env vars, anon key vs service role key handling).

**Acceptance bar:** After running migrations + seed and setting `.env.local` with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`, site loads identically to Step 8 but from live DB; hard refresh re-fetches.

---

## Step 11 — Hidden Admin  *(sequential after 10)*

**Goal:** Secret URL → Supabase login → per-section editors → image upload → live preview → save.

**Work:**
- `vercel.json`:
  ```json
  { "rewrites": [
    { "source": "/__admin__/:slug", "destination": "/api/admin-gate" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]}
  ```
- `api/admin-gate.ts` — Vercel serverless fn comparing `:slug` to `process.env.ADMIN_SLUG`; mismatch returns 404, match serves `index.html?admin=1`.
- `features/admin/`:
  - `AdminGate.tsx` route component at `/__admin__/:slug`; validates slug client-side too (defensive) then mounts login.
  - `AdminLogin.tsx` — Supabase `signInWithPassword` (email `issuatstudy090@gmail.com`, password you'll set on first Supabase setup).
  - `AdminShell.tsx` — same VS Code chrome but editor area swaps per-section editor based on `SectionKind`.
  - Editors (one file per SectionKind):
    - `MarkdownEditor.tsx` — split textarea + live preview (uses the same `MarkdownRenderer` as public site).
    - `StructuredListEditor.tsx` — add/remove rows, per-field inputs, tech-stack chip input, link-array inputs, image picker.
    - `JsonEditor.tsx` — `@monaco-editor/react` for the `skills` section (your CV appreciates real IDEs; Monaco loaded only in admin chunk to keep public bundle thin).
    - `TomlEditor.tsx` — textarea + parse-and-validate preview for `contact`.
  - `ImageUploader.tsx` — browser → Supabase Storage → public URL embedded in section content JSON.
  - `LivePreviewPane.tsx` — reuses `SectionRenderer` (visual parity guaranteed).
- All admin code in `features/admin/` + lazy-loaded only at the admin route (`React.lazy` + `Suspense`).
- `routes/admin.tsx` uses `lib/guards.ts` (session check + slug check).
- Use `security-and-hardening` skill — no `ADMIN_SLUG` in client bundle (server-only), no service role key in client, RLS is the real gate even if login is bypassed.

**Acceptance bar:** Hitting `/__admin__/<random-40-char-slug>` on deployed Vercel URL → login form; wrong slug → 404; correct login → editable sessions; saving reflects on public site on refresh.

---

## Step 12 — Polish & Deploy  *(sequential after 11)*

**Goal:** Production-ready Vercel deploy.

**Work:**
- Custom favicon — pixel-eye SVG designed here, planted in `public/` (used inline in `<head>` for the browser tab).
- `react-helmet-async` for per-section SEO meta.
- OG image: v1 uses the same SVG (Twitter renders it; Facebook may suppress — documented as a known v1 tradeoff; user may upload a 1200×630 PNG via admin image uploader later).
- "Download CV" link wired from `public/Curriculum_Vitae_Ishan.pdf` (copied in Step 1) into the contact section.
- 404 page styled as a "file not found in workspace" editor screen — **with plain-English text, not a `command not found` glyph**, so non-technical visitors understand the error.
- Lighthouse pass in both themes (`performance-optimization` + `vercel-react-best-practices` skills): lazy Monaco, lazy R3F, code-split admin chunk, image `loading="lazy"`.
- `.env.example` documents all Vars (VITE_ prefix hint for client vars).
- Optional GitHub Action: typecheck + build on PR (no deploy automation — Vercel handles).
- First deploy to Vercel subdomain (e.g. `ishan-portfolio.vercel.app`).
- I hand you the `ADMIN_SLUG` value (I'll generate ~40 char random).
- You create the Supabase Auth user (`issuatstudy090@gmail.com`) with a password only you know.

**Acceptance bar:** Deployed URL loads; admin path gated; Lighthouse ≥ 90 across all four axes (both themes); favicon + OG image correct; resume PDF linked from contact.

---

## Asynchronous Tracks Summary

| Track | Steps | Can run in parallel with | Blocking reason |
|------|-------|--------------------------|------------------|
| A — 3D background | Step 3 | B, C | None (pure presentation) |
| B — Cursor | Step 4 | A, C | None (owns document pointer) |
| C — Editor shell | Step 5 | A, B | None (own layout chrome) |
| D — Easter eggs | Step 9 | anything after Step 5 | Needs StatusBar slot from Step 5 |

After steps 3, 4, 5 converge, work **strictly sequential** again (steps 6 → 7 → 8 → 10 → 11 → 12) because each step's content extends the previous. Step 9 can be inserted at any point after Step 5 without blocking the main sequence.

---

## Skills Loaded per Step

| Step | Skills invoked |
|------|----------------|
| 1 | `frontend-ui-engineering`, `frontend-design`, `tailwind-design-system`, `shadcn` |
| 2 | `shadcn`, `frontend-ui-engineering` |
| 3 | `frontend-ui-engineering`, `vercel-react-best-practices`, `performance-optimization` |
| 4 | `frontend-ui-engineering`, `vercel-react-best-practices` |
| 5 | `frontend-ui-engineering`, `frontend-design`, `vercel-composition-patterns` |
| 6 | `frontend-ui-engineering`, `frontend-design`, `api-and-interface-design` |
| 7 | `frontend-ui-engineering`, `frontend-design` |
| 8 | `frontend-ui-engineering`, `frontend-design`, `vercel-composition-patterns` |
| 9 | `frontend-ui-engineering`, `code-simplification` |
| 10 | `supabase`, `supabase-postgres-best-practices`, `security-and-hardening`, `api-and-interface-design` |
| 11 | `supabase`, `security-and-hardening`, `frontend-ui-engineering`, `vercel-composition-patterns` |
| 12 | `deploy-to-vercel`, `performance-optimization`, `frontend-design`, `code-review-and-quality` |

Cross-cutting (every step): `code-review-and-quality` at end; `debugging-and-error-recovery` on any failure; `test-driven-development` for `lib/` logic only.

---

## Acceptance Bar (constant across steps)

1. `npm run dev` runs cleanly with no console warnings.
2. `tsc --noEmit` passes (we'll add this script).
3. Mobile + desktop visually inspected for the work in the step.
4. No file > ~250 lines; no god components; import direction respected.
5. New modules export via barrel `index.ts` only.

---

## Out of Scope (deliberately)

- Custom domain (you'll add later if wanted).
- Blog / post content type (only the 8 CV sections).
- Public contact form (contact details shown; no inbound mail).
- Comments / analytics dashboard.
- Multi-admin support (single Supabase user).
- Custom OG image generation (static OG image only for v1).
