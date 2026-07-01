import { redirect } from "next/navigation";

// Novel detail pages no longer exist on this articles-only site.
export default function NovelDetailPage() {
  redirect("/articles");
}
