-- 0002_storage.sql — image storage bucket for section images.
-- Public read via anon, admin write only.

insert into storage.buckets (id, name, public)
values ('section-images', 'section-images', true)
on conflict (id) do nothing;

-- Public read of any object in section-images.
drop policy if exists "section_images_public_read" on storage.objects;
create policy "section_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'section-images');

-- Admin upload/update/delete only.
drop policy if exists "section_images_admin_insert" on storage.objects;
create policy "section_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'section-images' and public.is_admin());

drop policy if exists "section_images_admin_update" on storage.objects;
create policy "section_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'section-images' and public.is_admin())
  with check (bucket_id = 'section-images' and public.is_admin());

drop policy if exists "section_images_admin_delete" on storage.objects;
create policy "section_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'section-images' and public.is_admin());
