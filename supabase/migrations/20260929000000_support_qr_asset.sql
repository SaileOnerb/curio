-- One public, read-only asset. Uploads are performed by project administrators
-- through the Supabase Dashboard; no browser role gets an upload policy.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('curio-assets', 'curio-assets', true, 2097152, array['image/png'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public download needs no SELECT policy. RLS remains in place for writes.
-- Keep this bucket exclusive to the published support/pix.png asset.
