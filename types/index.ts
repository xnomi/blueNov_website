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
  is_featured?: boolean;
  view_count: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  chapters?: Chapter[];
  chapter_count?: number;
}

export interface Review {
  id: string;
  novel_id: string;
  author_name: string;
  rating: number; // 1 to 5
  content: string;
  likes: number;
  created_at: string;
}

export type HeroLayoutTemplate = "modern-split" | "cinematic-banner" | "editorial-spotlight";

export interface HeroSettings {
  id?: number;
  layout_template: HeroLayoutTemplate;
  badge_text: string;
  title: string;
  title_highlight: string;
  subtitle: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
  image_url: string;
  featured_novel_ids?: string[];
  updated_at?: string;
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

export type UserRole = "admin" | "editor" | "user";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface EditorActivity {
  id: string;
  user_id?: string;
  user_email: string;
  user_name?: string;
  action: "created_novel" | "updated_novel" | "deleted_novel" | "created_chapter" | "updated_chapter" | "deleted_chapter" | "created_editor" | "updated_editor" | "reset_password";
  target_type: "novel" | "chapter" | "article" | "editor" | "system";
  target_id?: string;
  target_title?: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface EditorSummary {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  novels_count: number;
  chapters_count: number;
  total_views: number;
  last_active?: string;
  created_at: string;
}

export interface AnalyticsDataPoint {
  date: string;
  visitors: number;
  pageviews: number;
  reads: number;
}
