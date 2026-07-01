import { redirect } from "next/navigation";

// This route no longer exists. Redirected at next.config.ts level,
// but this component acts as a fallback.
export default function NovelsPage() {
  redirect("/articles");
}
