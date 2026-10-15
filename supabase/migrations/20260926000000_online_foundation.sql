-- Execute in a dedicated Supabase project. Never run against the browser's local data.
create extension if not exists pgcrypto;

create table public.figures (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  legacy_id text,
  name text not null check (length(btrim(name)) > 0),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, legacy_id),
  unique (id, owner_id)
);
create index figures_owner_idx on public.figures (owner_id, created_at desc);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  legacy_id text,
  name text not null check (length(btrim(name)) > 0),
  created_at timestamptz not null default now(),
  unique (owner_id, legacy_id),
  unique (id, owner_id)
);
create index collections_owner_idx on public.collections (owner_id);

create table public.figure_collections (
  owner_id uuid not null references auth.users(id) on delete cascade,
  figure_id uuid not null,
  collection_id uuid not null,
  primary key (figure_id, collection_id),
  foreign key (figure_id, owner_id) references public.figures(id, owner_id) on delete cascade,
  foreign key (collection_id, owner_id) references public.collections(id, owner_id) on delete cascade
);
create index figure_collections_owner_idx on public.figure_collections (owner_id);

create table public.wishlist (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  legacy_id text,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, legacy_id)
);
create index wishlist_owner_idx on public.wishlist (owner_id);

create table public.user_settings (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  updated_at timestamptz not null default now()
);

create table public.figure_photos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  figure_id uuid not null,
  kind text not null check (kind in ('cover', 'original', 'gallery')),
  position integer not null default 0 check (position >= 0),
  storage_path text not null,
  created_at timestamptz not null default now(),
  check (split_part(storage_path, '/', 1) = owner_id::text),
  unique (owner_id, storage_path),
  unique (figure_id, kind, position),
  foreign key (figure_id, owner_id) references public.figures(id, owner_id) on delete cascade
);
create index figure_photos_owner_idx on public.figure_photos (owner_id, figure_id);

alter table public.figures enable row level security;
alter table public.collections enable row level security;
alter table public.figure_collections enable row level security;
alter table public.wishlist enable row level security;
alter table public.user_settings enable row level security;
alter table public.figure_photos enable row level security;

create policy figures_own on public.figures for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy collections_own on public.collections for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy figure_collections_own on public.figure_collections for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy wishlist_own on public.wishlist for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy user_settings_own on public.user_settings for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy figure_photos_own on public.figure_photos for all to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);

-- The bucket is private. Object paths must start with the authenticated user's UUID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('figure-photos', 'figure-photos', false, 10485760,
        array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy figure_photos_storage_read on storage.objects for select to authenticated
  using (bucket_id = 'figure-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy figure_photos_storage_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'figure-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy figure_photos_storage_update on storage.objects for update to authenticated
  using (bucket_id = 'figure-photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'figure-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy figure_photos_storage_delete on storage.objects for delete to authenticated
  using (bucket_id = 'figure-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
