-- ============================================================
-- BlueNov Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- ── Genres ──────────────────────────────────────────────────
create table if not exists public.genres (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── Novels ──────────────────────────────────────────────────
create table if not exists public.novels (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  description      text,
  cover_url        text,
  author           text,
  genre_id         uuid references public.genres(id) on delete set null,
  status           text not null default 'ongoing' check (status in ('ongoing','completed','hiatus')),
  is_published     boolean not null default true,
  view_count       bigint not null default 0,
  meta_title       text,
  meta_description text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists novels_slug_idx on public.novels(slug);
create index if not exists novels_genre_idx on public.novels(genre_id);
create index if not exists novels_published_idx on public.novels(is_published);

-- ── Chapters ────────────────────────────────────────────────
create table if not exists public.chapters (
  id             uuid primary key default gen_random_uuid(),
  novel_id       uuid not null references public.novels(id) on delete cascade,
  title          text not null,
  slug           text not null,
  content        text not null default '',
  chapter_number integer not null,
  is_published   boolean not null default true,
  view_count     bigint not null default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  unique(novel_id, chapter_number),
  unique(novel_id, slug)
);

create index if not exists chapters_novel_idx on public.chapters(novel_id);
create index if not exists chapters_published_idx on public.chapters(is_published);

-- ── Articles ────────────────────────────────────────────────
create table if not exists public.articles (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  content          text not null default '',
  excerpt          text,
  cover_url        text,
  author           text,
  category         text not null default 'General',
  is_published     boolean not null default true,
  view_count       bigint not null default 0,
  meta_title       text,
  meta_description text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists articles_slug_idx on public.articles(slug);
create index if not exists articles_published_idx on public.articles(is_published);

-- ── Site Settings ────────────────────────────────────────────
create table if not exists public.site_settings (
  id                    integer primary key default 1,
  site_name             text not null default 'BlueNov',
  tagline               text default 'Free Novels & Articles Online',
  adsense_publisher_id  text,
  google_analytics_id   text,
  updated_at            timestamptz default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id, site_name, tagline)
values (1, 'BlueNov', 'Free Novels & Articles Online')
on conflict (id) do nothing;

-- ── View Count Increment Functions ──────────────────────────
create or replace function public.increment_novel_views(novel_id uuid)
returns void language sql security definer as $$
  update public.novels set view_count = view_count + 1 where id = novel_id;
$$;

create or replace function public.increment_chapter_views(chapter_id uuid)
returns void language sql security definer as $$
  update public.chapters set view_count = view_count + 1 where id = chapter_id;
$$;

create or replace function public.increment_article_views(article_id uuid)
returns void language sql security definer as $$
  update public.articles set view_count = view_count + 1 where id = article_id;
$$;

-- ── Row Level Security ───────────────────────────────────────
alter table public.genres enable row level security;
alter table public.novels enable row level security;
alter table public.chapters enable row level security;
alter table public.articles enable row level security;
alter table public.site_settings enable row level security;

-- Public READ policies (anyone can read published content)
create policy "Public can read genres" on public.genres for select using (true);

create policy "Public can read published novels" on public.novels
  for select using (is_published = true);

create policy "Public can read published chapters" on public.chapters
  for select using (is_published = true);

create policy "Public can read published articles" on public.articles
  for select using (is_published = true);

create policy "Public can read site settings" on public.site_settings
  for select using (true);

-- Authenticated admin FULL access
create policy "Admin full access to genres" on public.genres
  for all using (auth.role() = 'authenticated');

create policy "Admin full access to novels" on public.novels
  for all using (auth.role() = 'authenticated');

create policy "Admin full access to chapters" on public.chapters
  for all using (auth.role() = 'authenticated');

create policy "Admin full access to articles" on public.articles
  for all using (auth.role() = 'authenticated');

create policy "Admin full access to settings" on public.site_settings
  for all using (auth.role() = 'authenticated');

-- Allow service role to run increment functions
grant execute on function public.increment_novel_views to anon, authenticated;
grant execute on function public.increment_chapter_views to anon, authenticated;
grant execute on function public.increment_article_views to anon, authenticated;

-- ── Seed: Sample Genres ──────────────────────────────────────
insert into public.genres (name, slug, description) values
  ('Fantasy',   'fantasy',   'Epic worlds, magic systems, and mythical creatures.'),
  ('Romance',   'romance',   'Heartwarming love stories and romantic adventures.'),
  ('Thriller',  'thriller',  'Edge-of-your-seat suspense and gripping mysteries.'),
  ('Sci-Fi',    'sci-fi',    'Futuristic technology, space exploration, and beyond.'),
  ('Mystery',   'mystery',   'Whodunits, detective stories, and hidden secrets.'),
  ('Horror',    'horror',    'Chilling tales that keep you up at night.'),
  ('Adventure', 'adventure', 'Action-packed journeys and daring quests.'),
  ('Drama',     'drama',     'Emotional, character-driven narratives.')
on conflict (slug) do nothing;

-- ── Contact Messages ──────────────────────────────────────────
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz default now()
);

alter table public.contact_messages enable row level security;

-- Public can insert contact messages (anonymous submission allowed)
create policy "Anyone can submit contact messages" on public.contact_messages
  for insert with check (true);

-- Admin has full access to contact messages
create policy "Admin full access to contact messages" on public.contact_messages
  for all using (auth.role() = 'authenticated');

