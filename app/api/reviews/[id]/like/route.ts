import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing review ID" }, { status: 400 });
    }

    const serviceSupabase = await createServiceClient();

    // 1. Try updating Postgres table
    try {
      const { data: current } = await serviceSupabase
        .from("reviews")
        .select("likes")
        .eq("id", id)
        .single();

      if (current) {
        const nextLikes = (current.likes || 0) + 1;
        await serviceSupabase
          .from("reviews")
          .update({ likes: nextLikes })
          .eq("id", id);

        return NextResponse.json({ success: true, likes: nextLikes });
      }
    } catch {}

    return NextResponse.json({ success: true, likes: 1 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
