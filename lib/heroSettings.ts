import { HeroSettings } from "@/types";
import { DEFAULT_HERO_SETTINGS_FALLBACK } from "@/lib/constants/hero";
import { createClient as createServerSupabase, createServiceClient } from "@/lib/supabase/server";

export async function getHeroSettings(): Promise<HeroSettings> {
  // 1. Try Supabase Postgres Table
  try {
    const supabase = await createServerSupabase();
    const { data: dbData, error: dbErr } = await supabase
      .from("hero_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (!dbErr && dbData) {
      return {
        ...DEFAULT_HERO_SETTINGS_FALLBACK,
        ...dbData,
        featured_novel_ids: Array.isArray(dbData.featured_novel_ids)
          ? dbData.featured_novel_ids
          : [],
      };
    }
  } catch {}

  // 2. Try Supabase Storage (bluenov_media/site-config/hero-settings.json)
  try {
    const serviceSupabase = await createServiceClient();
    const { data: fileData, error: fileErr } = await serviceSupabase.storage
      .from("bluenov_media")
      .download("site-config/hero-settings.json");

    if (!fileErr && fileData) {
      const text = await fileData.text();
      const parsed = JSON.parse(text);
      return {
        ...DEFAULT_HERO_SETTINGS_FALLBACK,
        ...parsed,
        featured_novel_ids: Array.isArray(parsed.featured_novel_ids)
          ? parsed.featured_novel_ids
          : [],
      };
    }
  } catch {}

  return DEFAULT_HERO_SETTINGS_FALLBACK;
}

export async function saveHeroSettings(settings: Partial<HeroSettings>): Promise<{
  success: boolean;
  settings: HeroSettings;
  error?: string;
}> {
  try {
    const current = await getHeroSettings();
    const merged: HeroSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };

    const serviceSupabase = await createServiceClient();

    // 1. Try saving to Supabase table if it exists
    try {
      await serviceSupabase.from("hero_settings").upsert({
        id: 1,
        layout_template: merged.layout_template,
        badge_text: merged.badge_text,
        title: merged.title,
        title_highlight: merged.title_highlight,
        subtitle: merged.subtitle,
        cta_primary_text: merged.cta_primary_text,
        cta_primary_link: merged.cta_primary_link,
        cta_secondary_text: merged.cta_secondary_text,
        cta_secondary_link: merged.cta_secondary_link,
        image_url: merged.image_url,
        featured_novel_ids: merged.featured_novel_ids || [],
        updated_at: merged.updated_at,
      });
    } catch {}

    // 2. Persist to Supabase Storage bucket (bluenov_media/site-config/hero-settings.json)
    const { error: storageErr } = await serviceSupabase.storage
      .from("bluenov_media")
      .upload("site-config/hero-settings.json", JSON.stringify(merged, null, 2), {
        contentType: "application/json",
        upsert: true,
      });

    if (storageErr) {
      console.error("Failed to save hero settings to storage:", storageErr);
    }

    return { success: true, settings: merged };
  } catch (err: any) {
    return {
      success: false,
      settings: DEFAULT_HERO_SETTINGS_FALLBACK,
      error: err?.message || "Failed to save hero settings",
    };
  }
}
