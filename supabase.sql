-- Run in Supabase: SQL Editor. Replace YOUR_EMAIL with the email of your admin account.
create table if not exists portfolio (
  id text primary key check (id in ('public','admin')),
  data jsonb not null check (jsonb_typeof(data)='object'),
  updated_at timestamptz not null default now());
alter table portfolio enable row level security;
create policy "anyone reads published content" on portfolio for select using (id='public');
create policy "admin full access" on portfolio for all to authenticated
  using (auth.jwt()->>'email'='YOUR_EMAIL') with check (auth.jwt()->>'email'='YOUR_EMAIL');
