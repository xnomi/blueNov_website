-- ============================================================
-- BlueNov Mock Test Data
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- ── Seed Novels ─────────────────────────────────────────────
-- Retrieve genre IDs dynamically using SELECT
insert into public.novels (title, slug, description, author, genre_id, status, is_published, cover_url)
values
  (
    'The Shadow Chronicles', 
    'the-shadow-chronicles', 
    'A thrilling fantasy novel about a young mage who uncovers ancient dark secrets that could destroy the kingdom of Eldoria.', 
    'Arthur Pendragon', 
    (select id from public.genres where name = 'Fantasy' limit 1), 
    'ongoing', 
    true, 
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600'
  ),
  (
    'Love in the Nebula', 
    'love-in-the-nebula', 
    'An epic sci-fi romance set on a remote space station orbiting a beautiful but dangerous dying star.', 
    'Elena Vance', 
    (select id from public.genres where name = 'Romance' limit 1), 
    'completed', 
    true, 
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600'
  ),
  (
    'Secrets of the Whisperer', 
    'secrets-of-the-whisperer', 
    'A gripping mystery about a detective hunting a serial killer known only as the Whisperer in a fog-shrouded Victorian city.', 
    'Sherlock Holmes', 
    (select id from public.genres where name = 'Mystery' limit 1), 
    'ongoing', 
    true, 
    'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600'
  ),
  (
    'Echoes of the Abyss', 
    'echoes-of-the-abyss', 
    'An ancient artifact is discovered at the bottom of the Mariana Trench, unleashing entities that predate human history.', 
    'H.P. Lovecraft', 
    (select id from public.genres where name = 'Horror' limit 1), 
    'hiatus', 
    true, 
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600'
  )
on conflict (slug) do nothing;

-- ── Seed Chapters ────────────────────────────────────────────
-- Insert chapters for novels dynamically by querying their novel_id
insert into public.chapters (novel_id, title, slug, content, chapter_number, is_published)
values
  -- The Shadow Chronicles Chapters
  (
    (select id from public.novels where slug = 'the-shadow-chronicles' limit 1), 
    'The Awakening', 
    'chapter-1', 
    '<p>The shadows were longer today, thought Alistair as he walked through the ruins. He could feel the ancient magic humming beneath his boots, a quiet vibration that whispered secrets only a scholar could decipher.</p><p>As he reached the central altar, he noticed a glowing sigil he had never seen before.</p>', 
    1, 
    true
  ),
  (
    (select id from public.novels where slug = 'the-shadow-chronicles' limit 1), 
    'The Forbidden Tome', 
    'chapter-2', 
    '<p>Under the floorboards of the grand library lay a book bound in black leather. Alistair held his breath as he opened it. The page crackled like dry leaves, revealing runes that seemed to squirm and shift under his gaze.</p><p>"You shouldn''t have opened that," a voice whispered from the doorway.</p>', 
    2, 
    true
  ),
  -- Love in the Nebula Chapters
  (
    (select id from public.novels where slug = 'love-in-the-nebula' limit 1), 
    'Star Crossed', 
    'chapter-1', 
    '<p>The ship shook as it entered the outer rings of the nebula. Captain Aurelia held onto her seat, staring at the main display screen. The colors were majestic—hues of deep purple and electric cyan—but they hid a deadly radiation storm.</p><p>"Power levels are dropping," Jax warned from the copilot station, his cybernetic eye flashing yellow.</p>', 
    1, 
    true
  ),
  (
    (select id from public.novels where slug = 'love-in-the-nebula' limit 1), 
    'The Escape Pod', 
    'chapter-2', 
    '<p>With the primary thrusters offline, there was only one choice. They had to abandon ship. Aurelia looked at Jax, knowing that if they launched now, they would be drifting in the nebula for months.</p><p>"I''m not leaving without you," Jax said, his voice unusually soft.</p>', 
    2, 
    true
  ),
  -- Secrets of the Whisperer Chapters
  (
    (select id from public.novels where slug = 'secrets-of-the-whisperer' limit 1), 
    'The First Clue', 
    'chapter-1', 
    '<p>Rain pattered against the windowpane of Baker Street. Detective Ryan stared at the letter left on his desk. It was written in a elegant, flowing script, yet the content was chilling: a riddle detailing the location of the next victim.</p><p>"We have three hours," Ryan murmured, grabbing his coat.</p>', 
    1, 
    true
  ),
  -- Echoes of the Abyss Chapters
  (
    (select id from public.novels where slug = 'echoes-of-the-abyss' limit 1), 
    'Deep Dive', 
    'chapter-1', 
    '<p>The submarine descended into the eternal dark of the trench. Outside, the pressure was enough to crush a tank like a soda can. Inside, the team watched the sonar screen. A massive, structured anomaly sat on the seabed.</p><p>"That''s not a natural rock formation," Dr. Hayes whispered.</p>', 
    1, 
    true
  )
on conflict (novel_id, chapter_number) do nothing;

-- ── Seed Articles ────────────────────────────────────────────
insert into public.articles (title, slug, excerpt, content, author, category, is_published, cover_url)
values
  (
    'Top 10 Fantasy Novels of 2026', 
    'top-10-fantasy-novels-of-2026', 
    'Discover the best epic fantasy books that released this year and why they are worth reading.', 
    '<p>This year has been extraordinary for fantasy lovers. From dark fantasy grids to rich magic systems, independent authors have delivered masterpiece after masterpiece.</p><h3>1. The Shadow Chronicles</h3><p>Leading our list is a masterpiece of world-building and character dynamics...</p>', 
    'BlueNov Editor', 
    'Recommendations', 
    true, 
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600'
  ),
  (
    'How to Write Compelling Characters', 
    'how-to-write-compelling-characters', 
    'Learn the essential techniques to construct deep, relatable, and unforgettable characters.', 
    '<p>Every great story begins with great characters. In this guide, we break down character arcs, motivations, flaws, and backstories to help you write heroes and villains that readers will love (or love to hate).</p><h3>Give Them A Goal</h3><p>Every character must want something, even if it is just a glass of water...</p>', 
    'BlueNov Editor', 
    'Writing Tips', 
    true, 
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600'
  ),
  (
    'The Future of Web Novel Platforms', 
    'the-future-of-web-novel-platforms', 
    'An analysis of how online reading platforms are changing and what the future holds for independent authors.', 
    '<p>The digital reading landscape is evolving rapidly. Free reading sites, subscription models, and interactive storytelling are taking center stage, giving power back to the authors.</p><p>We examine the trends that will shape the industry in the coming decade...</p>', 
    'BlueNov Editor', 
    'News', 
    true, 
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600'
  )
on conflict (slug) do nothing;
