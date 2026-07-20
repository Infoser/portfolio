-- 0001_init.sql — portfolio section content storage
-- Public read (anon), admin-write gated by RLS using an is_admin() helper.

create extension if not exists "pgcrypto";

-- Stored content for each CV section. One row per (section_key).
-- `content` is a JSONB blob matching the SectionContent union in the frontend.
-- `updated_by` references auth.users(id) for the admin who last saved.
create table if not exists public.sections (
  section_key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Helper: returns true iff the calling JWT belongs to the configured admin user.
-- Bound to raw_app_meta_data (admin-set), NOT raw_user_meta_data (user-editable).
-- Fallback: also accept a specific admin email allowlist stored in auth.users.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.users u
    where u.id = (select auth.uid())
      and (
        u.email = 'issuatstudy090@gmail.com'
        or (u.raw_app_meta_data ->> 'is_admin') = 'true'
      )
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Enable RLS on the sections table.
alter table public.sections enable row level security;

-- Public read: any anon visitor can SELECT published section content.
drop policy if exists "sections_public_read" on public.sections;
create policy "sections_public_read"
  on public.sections for select
  to anon, authenticated
  using (true);

-- Admin write: only is_admin() can INSERT / UPDATE / DELETE.
drop policy if exists "sections_admin_insert" on public.sections;
create policy "sections_admin_insert"
  on public.sections for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "sections_admin_update" on public.sections;
create policy "sections_admin_update"
  on public.sections for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "sections_admin_delete" on public.sections;
create policy "sections_admin_delete"
  on public.sections for delete
  to authenticated
  using (public.is_admin());

-- Index on updated_at for admin dashboard ordering (whole-table scan is fine
-- for a single-digit-row table, but index is cheap insurance).
create index if not exists sections_updated_at_idx
  on public.sections (updated_at desc);
