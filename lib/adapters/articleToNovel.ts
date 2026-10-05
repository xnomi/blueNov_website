import { Article, Novel, Chapter } from "@/types";

/**
 * Adapter: Transforms an Article model into a Novel + Chapter structure
 * so articles can be consumed seamlessly anywhere in the novel platform.
 */
export function articleToNovelAdapter(article: Article): {
  novel: Novel;
  chapter: Chapter;
} {
  const novel: Novel = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    description: article.excerpt || article.meta_description,
    cover_url: article.cover_url,
    author: article.author || "BlueNov Editor",
    status: "completed",
    is_published: article.is_published,
    view_count: article.view_count,
    meta_title: article.meta_title,
    meta_description: article.meta_description,
    created_at: article.created_at,
    updated_at: article.updated_at,
    chapter_count: 1,
    genre: {
      id: "genre-essays",
      name: article.category || "Essays & Articles",
      slug: (article.category || "essays").toLowerCase().replace(/\s+/g, "-"),
      created_at: article.created_at,
    },
  };

  const chapter: Chapter = {
    id: `ch-${article.id}`,
    novel_id: article.id,
    title: article.title,
    slug: "chapter-1",
    content: article.content,
    chapter_number: 1,
    is_published: article.is_published,
    view_count: article.view_count,
    created_at: article.created_at,
    updated_at: article.updated_at,
  };

  return { novel, chapter };
}
