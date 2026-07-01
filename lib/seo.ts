import type { Metadata } from "next";

const SITE_NAME = "BlueNov";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bluenov.me";
const SITE_DESCRIPTION =
  "Read free articles, reviews, and insights online at BlueNov. Discover in-depth writing across topics — Reviews, News, Writing Tips, and more.";

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  type = "website",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "book";
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Free Novels & Articles Online`;
  const fullDescription = description || SITE_DESCRIPTION;
  const canonical = `${SITE_URL}${path}`;
  const ogImage = image || `${SITE_URL}/og-default.png`;

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      type: type === "book" || type === "article" ? "article" : "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    other: {
      "theme-color": "#2563eb",
    },
  };
}

export { SITE_NAME, SITE_URL, SITE_DESCRIPTION };
