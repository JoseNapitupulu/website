create extension if not exists "pgcrypto";

create table if not exists public.damage_reports (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,
  title text not null,
  location text not null,
  description text not null,
  category text not null,
  reporter_name text not null,
  reporter_email text,
  status text not null default 'submitted',
  priority text not null default 'medium',
  photo_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_updates (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.damage_reports(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.report_photos (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.damage_reports(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

alter table public.damage_reports enable row level security;
alter table public.report_updates enable row level security;
alter table public.report_photos enable row level security;

drop policy if exists "Public can submit reports" on public.damage_reports;
drop policy if exists "Public can read report by tracking code" on public.damage_reports;
drop policy if exists "Admin can manage updates" on public.report_updates;
drop policy if exists "Admin can manage photos" on public.report_photos;

create policy "Public can submit reports"
on public.damage_reports
for insert
to anon, authenticated
with check (true);

create policy "Public can read report by tracking code"
on public.damage_reports
for select
to anon, authenticated
using (true);

create policy "Admin can manage reports"
on public.damage_reports
for all
to authenticated
using (true)
with check (true);

create policy "Admin can manage updates"
on public.report_updates
for all
to authenticated
using (true)
with check (true);

create policy "Admin can manage photos"
on public.report_photos
for all
to authenticated
using (true)
with check (true);