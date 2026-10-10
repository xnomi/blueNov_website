import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/auth/rbac";
import { getHeroSettings, saveHeroSettings } from "@/lib/heroSettings";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: novels, error } = await supabase
      .from("novels")
      .select("id, title, slug, cover_url, author, status, view_count, created_at, genre:genres(name)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const heroSettings = await getHeroSettings();
    const featuredIds = new Set(heroSettings.featured_novel_ids || []);

    const enriched = (novels || []).map((n) => ({
      ...n,
      is_featured: featuredIds.has(n.id),
    }));

    return NextResponse.json({
      success: true,
      novels: enriched,
      featuredIds: Array.from(featuredIds),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to load novels" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const role = await getCurrentUserRole(user.id, user.email);
    if (role !== "admin" && role !== "editor") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { featured_novel_ids } = body;

    if (!Array.isArray(featured_novel_ids)) {
      return NextResponse.json(
        { success: false, error: "featured_novel_ids must be an array of IDs" },
        { status: 400 }
      );
    }

    // 1. Update hero settings storage
    await saveHeroSettings({ featured_novel_ids });

    // 2. Try updating novels table is_featured column if present
    try {
      const serviceSupabase = await createServiceClient();
      // Reset all to false first
      await serviceSupabase.from("novels").update({ is_featured: false }).neq("id", "00000000-0000-0000-0000-000000000000");
      if (featured_novel_ids.length > 0) {
        await serviceSupabase.from("novels").update({ is_featured: true }).in("id", featured_novel_ids);
      }
    } catch {}

    return NextResponse.json({
      success: true,
      featured_novel_ids,
      message: "Featured novels updated successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
