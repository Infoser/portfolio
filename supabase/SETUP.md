# Supabase Setup — `infoser_portfolio`

This portfolio reads section content (about / experience / projects / etc.) from a Supabase Postgres table when credentials are configured. When **no** environment variables are present, the site falls back to the static content bundled in `src/sections-content/` — so the public deploys always work, even before Supabase is wired.

## 1. Create the Supabase project

1. Go to <https://supabase.com> and create a new project.
2. Note the **Project URL** and the **anon public key** from *Settings → API*.
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon public key>
   ```

## 2. Run the schema + seed

In the Supabase **SQL Editor**, paste and run in order:

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_storage.sql`
3. `supabase/seed.sql`

(Or via the Supabase CLI: `supabase db push` then `supabase db execute --file supabase/seed.sql`.)

## 3. Create the admin user

Under *Authentication → Users*, invite the admin user `issuatstudy090@gmail.com`. Set a password only you know. This email is hard-coded into `public.is_admin()` — change that function or unset the user's `raw_app_meta_data.is_admin` flag to revoke admin access without deleting the user.

## 4. Storage (project images)

The `section-images` bucket is created by `0002_storage.sql`. Public read, admin-only write. Upload images via the admin panel once Step 11 lands; until then the static content uses `picsum.photos` placeholder URLs.

## 5. Verify

With `.env.local` populated and the migrations applied, run `npm run dev`. The site should load **identically** to the static build (Step 8 look), but now data is fetched from Postgres. Hard refresh re-fetches.

## Security notes

- The `anon` key is safe to ship to the browser — RLS guards all writes.
- The `service_role` key **must never** appear in the client bundle. It is not read by the frontend.
- `ADMIN_SLUG` is server-only (read by `/api/admin-gate.ts` in Step 11). It is **not** prefixed with `VITE_` so Vite never bundles it.
- The `public.is_admin()` check uses `raw_app_meta_data` (admin-set), never `raw_user_meta_data` (user-editable).
