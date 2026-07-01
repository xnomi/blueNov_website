import { redirect } from "next/navigation";

// Genre pages no longer exist on this articles-only site.
// Redirected at next.config.ts level, this is a fallback.
export default function GenrePage() {
  redirect("/articles");
}
