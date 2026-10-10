import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Review } from "@/types";

// Helper to calculate statistics
function calculateReviewStats(reviews: Review[]) {
  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  for (const r of reviews) {
    const star = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
    distribution[star] = (distribution[star] || 0) + 1;
    sum += r.rating;
  }

  const averageRating = Number((sum / totalReviews).toFixed(1));

  return {
    averageRating,
    totalReviews,
    ratingDistribution: distribution,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let novelId = searchParams.get("novel_id");
    const novelSlug = searchParams.get("novel_slug");

    const supabase = await createClient();

    // If only slug provided, find novel ID
    if (!novelId && novelSlug) {
      const { data: novel } = await supabase
        .from("novels")
        .select("id")
        .eq("slug", novelSlug)
        .single();
      if (novel) {
        novelId = novel.id;
      }
    }

    if (!novelId) {
      return NextResponse.json(
        { success: false, error: "novel_id or novel_slug is required" },
        { status: 400 }
      );
    }

    // 1. Try querying Postgres table 'reviews'
    let reviews: Review[] = [];
    const { data: dbReviews, error: dbError } = await supabase
      .from("reviews")
      .select("*")
      .eq("novel_id", novelId)
      .order("created_at", { ascending: false });

    if (!dbError && dbReviews) {
      reviews = dbReviews as Review[];
    } else {
      // 2. Fallback to Supabase Storage bucket reviews
      try {
        const serviceSupabase = await createServiceClient();
        const { data: fileData } = await serviceSupabase.storage
          .from("bluenov_media")
          .download(`reviews/${novelId}.json`);

        if (fileData) {
          const text = await fileData.text();
          reviews = JSON.parse(text);
        }
      } catch {}
    }

    const stats = calculateReviewStats(reviews);

    return NextResponse.json({
      success: true,
      reviews,
      ...stats,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { novel_id, novel_slug, author_name, rating, content } = body;

    const supabase = await createClient();
    const serviceSupabase = await createServiceClient();

    // Resolve novel_id if novel_slug was supplied
    if (!novel_id && novel_slug) {
      const { data: novel } = await supabase
        .from("novels")
        .select("id")
        .eq("slug", novel_slug)
        .single();
      if (novel) novel_id = novel.id;
    }

    if (!novel_id) {
      return NextResponse.json({ success: false, error: "Novel not found" }, { status: 404 });
    }

    const trimmedAuthor = (author_name || "").trim();
    const trimmedContent = (content || "").trim();
    const numericRating = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));

    if (!trimmedAuthor) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    if (trimmedAuthor.length > 60) {
      return NextResponse.json(
        { success: false, error: "Name cannot exceed 60 characters" },
        { status: 400 }
      );
    }

    if (!trimmedContent || trimmedContent.length < 5) {
      return NextResponse.json(
        { success: false, error: "Review content must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 3000) {
      return NextResponse.json(
        { success: false, error: "Review content cannot exceed 3000 characters" },
        { status: 400 }
      );
    }

    const newReview: Review = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `rev-${Date.now()}`,
      novel_id,
      author_name: trimmedAuthor,
      rating: numericRating,
      content: trimmedContent,
      likes: 0,
      created_at: new Date().toISOString(),
    };

    let saved = false;

    // 1. Try insert into Postgres table
    try {
      const { data, error } = await serviceSupabase
        .from("reviews")
        .insert({
          id: newReview.id,
          novel_id: newReview.novel_id,
          author_name: newReview.author_name,
          rating: newReview.rating,
          content: newReview.content,
          likes: newReview.likes,
          created_at: newReview.created_at,
        })
        .select()
        .single();

      if (!error && data) {
        newReview.id = data.id;
        saved = true;
      }
    } catch {}

    // 2. Storage backup / fallback
    try {
      let existingList: Review[] = [];
      const { data: fileData } = await serviceSupabase.storage
        .from("bluenov_media")
        .download(`reviews/${novel_id}.json`);

      if (fileData) {
        try {
          const text = await fileData.text();
          existingList = JSON.parse(text);
        } catch {}
      }

      const updatedList = [newReview, ...existingList.filter((r) => r.id !== newReview.id)];
      await serviceSupabase.storage
        .from("bluenov_media")
        .upload(`reviews/${novel_id}.json`, JSON.stringify(updatedList, null, 2), {
          contentType: "application/json",
          upsert: true,
        });

      saved = true;
    } catch (storageErr) {
      console.error("Reviews storage fallback error:", storageErr);
    }

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to persist review" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review: newReview,
      message: "Review submitted successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
