export interface Genre {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Novel {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_url?: string;
  author?: string;
  genre_id?: string;
  genre?: Genre;
  status: "ongoing" | "completed" | "hiatus";
  is_published: boolean;
  view_count: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  chapters?: Chapter[];
  chapter_count?: number;
}

export interface Chapter {
  id: string;
  novel_id: string;
  novel?: Novel;
  title: string;
  slug: string;
  content: string;
  chapter_number: number;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_url?: string;
  author?: string;
  category: string;
  is_published: boolean;
  view_count: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  tagline?: string;
  adsense_publisher_id?: string;
  google_analytics_id?: string;
  updated_at: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
