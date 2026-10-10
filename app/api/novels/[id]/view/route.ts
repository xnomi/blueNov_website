import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing novel ID" }, { status: 400 });
    }

    const serviceSupabase = await createServiceClient();

    // 1. Try running RPC if available
    let updatedViews: number | null = null;
    const { error: rpcError } = await serviceSupabase.rpc("increment_novel_views", {
      novel_id: id,
    });

    if (rpcError) {
      // 2. Direct atomic increment fallback
      const { data: current, error: getErr } = await serviceSupabase
        .from("novels")
        .select("view_count")
        .eq("id", id)
        .single();

      if (getErr || !current) {
        return NextResponse.json({ success: false, error: "Novel not found" }, { status: 404 });
      }

      const nextViews = (current.view_count || 0) + 1;
      const { error: updateErr } = await serviceSupabase
        .from("novels")
        .update({ view_count: nextViews })
        .eq("id", id);

      if (updateErr) {
        return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
      }
      updatedViews = nextViews;
    } else {
      const { data: current } = await serviceSupabase
        .from("novels")
        .select("view_count")
        .eq("id", id)
        .single();
      updatedViews = current?.view_count ?? null;
    }

    return NextResponse.json({ success: true, view_count: updatedViews });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
