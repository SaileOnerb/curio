-- Run once in the SQL Editor of the isolated CURIÓ test project.
-- Requires exactly two users in Authentication > Users. The transaction rolls back.
begin;

do $$
declare
  ids uuid[];
begin
  select array_agg(id order by created_at, id) into ids from auth.users;
  if coalesce(array_length(ids, 1), 0) <> 2 then
    raise exception 'Expected exactly two test users, found %', coalesce(array_length(ids, 1), 0);
  end if;
  perform set_config('curio.test.user_a', ids[1]::text, true);
  perform set_config('curio.test.user_b', ids[2]::text, true);
end $$;

insert into public.figures (owner_id, legacy_id, name)
values (current_setting('curio.test.user_a')::uuid, 'rls-smoke-a', 'RLS test A'),
       (current_setting('curio.test.user_b')::uuid, 'rls-smoke-b', 'RLS test B');
insert into public.collections (owner_id, legacy_id, name)
values (current_setting('curio.test.user_a')::uuid, 'rls-smoke-a', 'RLS collection A'),
       (current_setting('curio.test.user_b')::uuid, 'rls-smoke-b', 'RLS collection B');
insert into public.wishlist (owner_id, legacy_id)
values (current_setting('curio.test.user_a')::uuid, 'rls-smoke-a'),
       (current_setting('curio.test.user_b')::uuid, 'rls-smoke-b');
insert into public.user_settings (owner_id)
values (current_setting('curio.test.user_a')::uuid),
       (current_setting('curio.test.user_b')::uuid);
insert into public.figure_collections (owner_id, figure_id, collection_id)
select f.owner_id, f.id, c.id from public.figures f
join public.collections c on c.owner_id = f.owner_id
where f.legacy_id like 'rls-smoke-%' and c.legacy_id = f.legacy_id;
insert into public.figure_photos (owner_id, figure_id, kind, storage_path)
select owner_id, id, 'cover', owner_id::text || '/rls-smoke.webp'
from public.figures where legacy_id like 'rls-smoke-%';

set local role authenticated;
select set_config('request.jwt.claim.sub', current_setting('curio.test.user_a'), true);

do $$
declare
  own_id uuid := current_setting('curio.test.user_a')::uuid;
  other_id uuid := current_setting('curio.test.user_b')::uuid;
  table_name text;
  own_count integer;
  other_count integer;
  changed integer;
begin
  if auth.uid() is distinct from own_id then
    raise exception 'Auth context failed for user A';
  end if;
  foreach table_name in array array['figures', 'collections', 'wishlist', 'user_settings', 'figure_collections', 'figure_photos'] loop
    execute format('select count(*) from public.%I where owner_id = $1', table_name)
      into own_count using own_id;
    execute format('select count(*) from public.%I where owner_id = $1', table_name)
      into other_count using other_id;
    if own_count <> 1 or other_count <> 0 then
      raise exception 'User A isolation failed on %: own %, other %', table_name, own_count, other_count;
    end if;
  end loop;
  update public.figures set name = 'ILLEGAL UPDATE' where owner_id = other_id;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'User A updated another account'; end if;
  delete from public.wishlist where owner_id = other_id;
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'User A deleted another account'; end if;
  begin
    insert into public.figures (owner_id, name) values (other_id, 'ILLEGAL INSERT');
    raise exception 'User A inserted for another account';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.figure_collections (owner_id, figure_id, collection_id)
    select own_id, f.id, c.id from public.figures f, public.collections c
    where f.owner_id = own_id and c.owner_id = other_id;
    -- RLS hides the other collection, so no row must have been inserted.
    get diagnostics changed = row_count;
    if changed <> 0 then raise exception 'Cross-account collection link succeeded'; end if;
  end;
end $$;

select set_config('request.jwt.claim.sub', current_setting('curio.test.user_b'), true);
do $$
declare
  own_id uuid := current_setting('curio.test.user_b')::uuid;
  other_id uuid := current_setting('curio.test.user_a')::uuid;
  table_name text;
  own_count integer;
  other_count integer;
begin
  if auth.uid() is distinct from own_id then raise exception 'Auth context failed for user B'; end if;
  foreach table_name in array array['figures', 'collections', 'wishlist', 'user_settings', 'figure_collections', 'figure_photos'] loop
    execute format('select count(*) from public.%I where owner_id = $1', table_name)
      into own_count using own_id;
    execute format('select count(*) from public.%I where owner_id = $1', table_name)
      into other_count using other_id;
    if own_count <> 1 or other_count <> 0 then
      raise exception 'User B isolation failed on %: own %, other %', table_name, own_count, other_count;
    end if;
  end loop;
end $$;

reset role;
rollback;
select 'PASS: six tables isolated for both accounts; test data rolled back' as result;
