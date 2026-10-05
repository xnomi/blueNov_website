-- ============================================================
-- BlueNov Migration: Convert Articles into Novel & Chapter Model
-- Run this in Supabase SQL Editor to adapt existing articles
-- ============================================================

-- 1. Ensure a genre exists for literary articles/essays
insert into public.genres (name, slug, description)
values ('Essays & Insights', 'essays-and-insights', 'In-depth book reviews, writing guides, and literary news.')
on conflict (slug) do nothing;

-- 2. Insert existing articles into novels table as completed standalone stories
insert into public.novels (
  id,
  title,
  slug,
  description,
  author,
  genre_id,
  status,
  is_published,
  view_count,
  meta_title,
  meta_description,
  cover_url,
  created_at,
  updated_at
)
select
  a.id,
  a.title,
  a.slug,
  coalesce(a.excerpt, a.meta_description, 'Read this article online at BlueNov.') as description,
  coalesce(a.author, 'BlueNov Editor') as author,
  (select id from public.genres where slug = 'essays-and-insights' limit 1) as genre_id,
  'completed' as status,
  a.is_published,
  a.view_count,
  a.meta_title,
  a.meta_description,
  a.cover_url,
  a.created_at,
  a.updated_at
from public.articles a
on conflict (slug) do update set
  updated_at = excluded.updated_at;

-- 3. Insert each article content into chapters as Chapter 1
insert into public.chapters (
  novel_id,
  title,
  slug,
  content,
  chapter_number,
  is_published,
  view_count,
  created_at,
  updated_at
)
select
  a.id as novel_id,
  a.title,
  'chapter-1' as slug,
  a.content,
  1 as chapter_number,
  a.is_published,
  a.view_count,
  a.created_at,
  a.updated_at
from public.articles a
on conflict (novel_id, chapter_number) do update set
  content = excluded.content,
  updated_at = excluded.updated_at;
