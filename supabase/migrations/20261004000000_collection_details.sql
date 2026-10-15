-- Metadados por coleção; RLS existente continua protegendo cada conta.
alter table public.collections
  add column if not exists data jsonb not null default '{}'::jsonb;
notify pgrst, 'reload schema';
