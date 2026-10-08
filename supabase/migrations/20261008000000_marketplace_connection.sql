-- Server-only connection. No account data or credentials are available to app users.
create table if not exists public.curio_marketplace_connections (
 provider text primary key check (provider = 'mercadolivre'),
 encrypted_token text not null,
 expires_at timestamptz not null,
 lease_id uuid,
 lease_until timestamptz,
 updated_at timestamptz not null default now()
);
alter table public.curio_marketplace_connections enable row level security;
revoke all on public.curio_marketplace_connections from public, anon, authenticated;
grant select, insert, update, delete on public.curio_marketplace_connections to service_role;
