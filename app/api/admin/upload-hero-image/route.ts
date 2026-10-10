import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/auth/rbac";

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

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No image file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WEBP, AVIF, or GIF images are allowed" },
        { status: 400 }
      );
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Image file exceeds 8MB maximum size limit" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    const filename = `hero/hero-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const serviceSupabase = await createServiceClient();

    const { error: uploadError } = await serviceSupabase.storage
      .from("bluenov_media")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage hero upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: uploadError.message || "Failed to upload image to Supabase bucket" },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = serviceSupabase.storage
      .from("bluenov_media")
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filename,
    });
  } catch (err: any) {
    console.error("Hero image upload handler error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
