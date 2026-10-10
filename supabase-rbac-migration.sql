-- ============================================================
-- BlueNov RBAC (Role-Based Access Control) & Analytics Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zcbvnntslbbopfyfhfsy/sql
-- ============================================================

-- 1. Ensure User Profiles table & all required columns exist
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  role        text not null default 'editor' check (role in ('admin', 'editor', 'user')),
  created_at  timestamptz default now()
);

-- Safely add columns if profiles already existed previously
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists updated_at timestamptz default now();

alter table public.profiles enable row level security;

-- Policies for profiles
drop policy if exists "Allow authenticated users to view profiles" on public.profiles;
create policy "Allow authenticated users to view profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

drop policy if exists "Allow users to update own profile" on public.profiles;
create policy "Allow users to update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Allow service_role full access to profiles" on public.profiles;
create policy "Allow service_role full access to profiles"
  on public.profiles for all
  using (true);

-- 2. Editor Activities Audit Log
create table if not exists public.editor_activities (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  user_email    text not null,
  user_name     text,
  action        text not null,
  target_type   text not null,
  target_id     text,
  target_title  text,
  details       jsonb default '{}'::jsonb,
  created_at    timestamptz default now()
);

create index if not exists editor_activities_user_idx on public.editor_activities(user_id);
create index if not exists editor_activities_action_idx on public.editor_activities(action);
create index if not exists editor_activities_created_at_idx on public.editor_activities(created_at desc);

alter table public.editor_activities enable row level security;

drop policy if exists "Allow authenticated to read editor activities" on public.editor_activities;
create policy "Allow authenticated to read editor activities"
  on public.editor_activities for select
  using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated to insert editor activities" on public.editor_activities;
create policy "Allow authenticated to insert editor activities"
  on public.editor_activities for insert
  with check (auth.role() = 'authenticated');

-- 3. Automatic Profile Creation Trigger on Auth Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'editor')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = coalesce(excluded.role, profiles.role);
  return new;
exception
  when others then
    -- Fallback to minimal insert so auth signup NEVER fails
    insert into public.profiles (id, email, role)
    values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role', 'editor'))
    on conflict (id) do nothing;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Ensure admin accounts have admin role
update public.profiles
set role = 'admin'
where email in ('admin@bluenov.me', 'xnomi555@gmail.com', 'nomiash1122@gmail.com');

-- 4. Ensure Genres are publicly readable
alter table public.genres enable row level security;
drop policy if exists "Public can read genres" on public.genres;
create policy "Public can read genres" on public.genres for select using (true);

