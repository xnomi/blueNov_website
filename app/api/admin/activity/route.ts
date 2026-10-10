import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { recordEditorActivity } from "@/lib/auth/rbac";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, targetType, targetId, targetTitle, details } = body;

    if (!action || !targetType) {
      return NextResponse.json({ error: "Missing action or targetType" }, { status: 400 });
    }

    const userName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      (user.email ? user.email.split("@")[0] : "Editor");

    await recordEditorActivity({
      userId: user.id,
      userEmail: user.email || "",
      userName,
      action,
      targetType,
      targetId,
      targetTitle,
      details,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
