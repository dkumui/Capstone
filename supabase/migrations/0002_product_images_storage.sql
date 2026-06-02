insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "product images admin insert" on storage.objects;
create policy "product images admin insert"
on storage.objects
for insert
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update"
on storage.objects
for update
using (
  bucket_id = 'product-images'
  and public.is_admin()
)
with check (
  bucket_id = 'product-images'
  and public.is_admin()
);

drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete"
on storage.objects
for delete
using (
  bucket_id = 'product-images'
  and public.is_admin()
);