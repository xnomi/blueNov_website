-- ============================================================
-- BlueNov Hero Customizer, Featured Novels & Reader Reviews Migration
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zcbvnntslbbopfyfhfsy/sql
-- ============================================================

-- ── 1. Novel Reviews Table ───────────────────────────────────
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  novel_id    uuid not null references public.novels(id) on delete cascade,
  author_name text not null,
  rating      integer not null check (rating >= 1 and rating <= 5),
  content     text not null,
  likes       integer not null default 0,
  created_at  timestamptz default now()
);

create index if not exists reviews_novel_idx on public.reviews(novel_id);
create index if not exists reviews_created_at_idx on public.reviews(created_at desc);

alter table public.reviews enable row level security;

-- Public can read all reviews
drop policy if exists "Public can read reviews" on public.reviews;
create policy "Public can read reviews" on public.reviews
  for select using (true);

-- Anyone can post reader reviews
drop policy if exists "Anyone can submit reviews" on public.reviews;
create policy "Anyone can submit reviews" on public.reviews
  for insert with check (true);

-- Authenticated admins and service role have full access
drop policy if exists "Admin full access to reviews" on public.reviews;
create policy "Admin full access to reviews" on public.reviews
  for all using (auth.role() = 'authenticated');

-- ── 2. Add is_featured Column to Novels ──────────────────────
alter table public.novels add column if not exists is_featured boolean not null default false;
create index if not exists novels_featured_idx on public.novels(is_featured);

-- ── 3. Hero Section Configuration Table ───────────────────────
create table if not exists public.hero_settings (
  id                  integer primary key default 1,
  layout_template     text not null default 'modern-split' check (layout_template in ('modern-split', 'cinematic-banner', 'editorial-spotlight')),
  badge_text          text default 'Premium Web Novel Reader • 100% Free',
  title               text default 'Immerse Yourself in Stories',
  title_highlight     text default 'Without Limits',
  subtitle            text default 'Explore rich fantasy epics, heartwarming romances, sci-fi sagas, and detective thrillers. Read with customizable typography, dark & sepia themes, and zero ads in your reading flow.',
  cta_primary_text    text default 'Browse All Novels',
  cta_primary_link    text default '/novels',
  cta_secondary_text  text default 'My Library',
  cta_secondary_link  text default '/library',
  image_url           text default '',
  featured_novel_ids  jsonb default '[]'::jsonb,
  updated_at          timestamptz default now(),
  constraint single_hero_row check (id = 1)
);

alter table public.hero_settings enable row level security;

-- Public can read hero settings
drop policy if exists "Public can read hero settings" on public.hero_settings;
create policy "Public can read hero settings" on public.hero_settings
  for select using (true);

-- Admins have full access
drop policy if exists "Admin full access to hero settings" on public.hero_settings;
create policy "Admin full access to hero settings" on public.hero_settings
  for all using (auth.role() = 'authenticated');

-- Insert default row if not exists
insert into public.hero_settings (
  id,
  layout_template,
  badge_text,
  title,
  title_highlight,
  subtitle,
  cta_primary_text,
  cta_primary_link,
  cta_secondary_text,
  cta_secondary_link,
  image_url,
  featured_novel_ids
) values (
  1,
  'modern-split',
  'Premium Web Novel Reader • 100% Free',
  'Immerse Yourself in Stories',
  'Without Limits',
  'Explore rich fantasy epics, heartwarming romances, sci-fi sagas, and detective thrillers. Read with customizable typography, dark & sepia themes, and zero ads in your reading flow.',
  'Browse All Novels',
  '/novels',
  'My Library',
  '/library',
  '',
  '[]'::jsonb
) on conflict (id) do nothing;

-- ── 4. View Count Atomic Increment Functions ────────────────
create or replace function public.increment_novel_views(novel_id uuid)
returns void language sql security definer as $$
  update public.novels
  set view_count = coalesce(view_count, 0) + 1
  where id = novel_id;
$$;

create or replace function public.increment_chapter_views(chapter_id uuid)
returns void language sql security definer as $$
  update public.chapters
  set view_count = coalesce(view_count, 0) + 1
  where id = chapter_id;
$$;

grant execute on function public.increment_novel_views to anon, authenticated, service_role;
grant execute on function public.increment_chapter_views to anon, authenticated, service_role;
