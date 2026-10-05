export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncate(text: string, maxLen: number): string {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + "…";
}

export function formatViews(n: number): string {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    ongoing: "Ongoing",
    completed: "Completed",
    hiatus: "On Hiatus",
  };
  return map[status] ?? status;
}

/**
 * Sanitizes and normalizes novel cover URLs.
 * Handles Unsplash webpage links, invalid protocols, or malformed URLs.
 */
export function formatCoverUrl(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return null;

  // If someone entered an unsplash photo page instead of direct image:
  // e.g. https://unsplash.com/photos/a-processor-chip-with-the-letter-ai-printed-on-it-wY9DfURWEiE
  if (trimmed.includes("unsplash.com/photos/")) {
    const parts = trimmed.split("/photos/")[1]?.split(/[\?\#]/)[0]?.split("-");
    const photoId = parts ? parts[parts.length - 1] : null;
    if (photoId) {
      return `https://images.unsplash.com/photo-${photoId}?q=80&w=600`;
    }
  }

  return trimmed;
}
