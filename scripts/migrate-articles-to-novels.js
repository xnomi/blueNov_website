const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("Starting Article -> Novel & Chapter migration...");

  // 1. Ensure Genre exists
  let { data: genre } = await supabase
    .from("genres")
    .select("id")
    .eq("slug", "essays-and-insights")
    .maybeSingle();

  if (!genre) {
    const { data: newGenre, error: gErr } = await supabase
      .from("genres")
      .insert({
        name: "Essays & Insights",
        slug: "essays-and-insights",
        description: "In-depth book reviews, writing guides, and literary news.",
      })
      .select("id")
      .single();

    if (gErr) {
      console.warn("Could not create genre (might already exist):", gErr.message);
      // Fallback: pick any genre
      const { data: anyGenre } = await supabase.from("genres").select("id").limit(1).single();
      genre = anyGenre;
    } else {
      genre = newGenre;
    }
  }

  // 2. Fetch all articles
  const { data: articles, error: aErr } = await supabase.from("articles").select("*");
  if (aErr) {
    console.error("Error fetching articles:", aErr);
    return;
  }

  console.log(`Found ${articles.length} articles to adapt into novels.`);

  let migratedCount = 0;
  for (const article of articles) {
    // Upsert into novels
    const { data: novel, error: nErr } = await supabase
      .from("novels")
      .upsert({
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.excerpt || article.meta_description || "Read this article online at BlueNov.",
        author: article.author || "BlueNov Editor",
        genre_id: genre?.id,
        status: "completed",
        is_published: article.is_published,
        view_count: article.view_count || 0,
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        cover_url: article.cover_url,
        created_at: article.created_at,
        updated_at: article.updated_at,
      }, { onConflict: "slug" })
      .select("id")
      .single();

    if (nErr) {
      console.warn(`Error inserting novel for '${article.title}':`, nErr.message);
      continue;
    }

    const novelId = novel?.id || article.id;

    // Upsert into chapters as chapter 1
    const { error: cErr } = await supabase
      .from("chapters")
      .upsert({
        novel_id: novelId,
        title: article.title,
        slug: "chapter-1",
        content: article.content,
        chapter_number: 1,
        is_published: article.is_published,
        view_count: article.view_count || 0,
        created_at: article.created_at,
        updated_at: article.updated_at,
      }, { onConflict: "novel_id,chapter_number" });

    if (cErr) {
      console.warn(`Error inserting chapter for '${article.title}':`, cErr.message);
    } else {
      migratedCount++;
    }
  }

  console.log(`Successfully migrated ${migratedCount} articles into the novel/chapter system!`);
}

migrate().catch(console.error);
