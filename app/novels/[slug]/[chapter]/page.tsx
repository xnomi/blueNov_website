import { redirect } from "next/navigation";

// Chapter pages no longer exist on this articles-only site.
export default function ChapterPage() {
  redirect("/articles");
}
