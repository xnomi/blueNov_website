import { NextRequest, NextResponse } from "next/server";
import { getHeroSettings, saveHeroSettings } from "@/lib/heroSettings";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/auth/rbac";

export async function GET() {
  try {
    const settings = await getHeroSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch hero settings" },
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
    const result = await saveHeroSettings(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update hero settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, settings: result.settings });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
