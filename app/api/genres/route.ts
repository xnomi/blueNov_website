import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const revalidate = 60; // Cache for 60 seconds

const FALLBACK_GENRES = [
  { id: "6842c3f1-82a9-4761-a11c-3f0dc084ddc9", name: "Adventure", slug: "adventure" },
  { id: "7eed0f86-f54d-49a0-9848-4e0db4d83b12", name: "Drama", slug: "drama" },
  { id: "b666b5aa-2fbf-49a5-ad4b-980afb727db1", name: "Essays & Insights", slug: "essays-and-insights" },
  { id: "dad9e616-fb79-4e15-8919-92af3cb9d100", name: "Fantasy", slug: "fantasy" },
  { id: "7ca6d1ca-a166-4a90-a6fe-f2435a3800e8", name: "Horror", slug: "horror" },
  { id: "c7f2a650-a299-4628-95c0-95c1359883d0", name: "Mystery", slug: "mystery" },
  { id: "e9e1d6a9-7660-4c31-96de-887818db469d", name: "Romance", slug: "romance" },
  { id: "424e8d6c-b997-4bcc-8bcc-22e654a363f1", name: "Sci-Fi", slug: "sci-fi" },
  { id: "2d5e4488-3c9f-4d08-9c43-bbc0cd8a3507", name: "Thriller", slug: "thriller" },
];

export async function GET() {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("genres")
      .select("id, name, slug")
      .order("name");

    if (error || !data || data.length === 0) {
      return NextResponse.json({ genres: FALLBACK_GENRES });
    }

    return NextResponse.json({ genres: data });
  } catch {
    return NextResponse.json({ genres: FALLBACK_GENRES });
  }
}
