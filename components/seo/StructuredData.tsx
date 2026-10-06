const SITE_URL = "https://bluenov.me";
const SITE_NAME = "BlueNov";
const LOGO_URL = `${SITE_URL}/favicon.svg`;

interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── WebSite + Sitelinks Search Box ────────────────────────────────────────────
export function WebSiteSchema() {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "Read free articles, reviews, writing tips, and literary insights at BlueNov.",
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

// ── Organization Schema (emit on every page via layout ideally) ────────────────
export function OrganizationSchema() {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-default.png`,
          width: 1200,
          height: 630,
        },
        sameAs: [
          // Add your social profile URLs here when ready
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: `${SITE_URL}/contact`,
        },
      }}
    />
  );
}

// ── Breadcrumb Schema ─────────────────────────────────────────────────────────
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

// ── FAQ Schema (use on About/Contact pages) ────────────────────────────────────
export function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}

// ── CollectionPage Schema (for /articles listing) ─────────────────────────────
export function CollectionPageSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${url}/#collectionpage`,
        name,
        description,
        url,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      }}
    />
  );
}

// ── Book Schema ──────────────────────────────────────────────────────────────
export function BookSchema({
  novel,
}: {
  novel: {
    title: string;
    slug: string;
    description?: string;
    author?: string;
    genre?: { name: string };
    cover_url?: string;
    chapter_count?: number;
  };
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Book",
        "@id": `${SITE_URL}/novels/${novel.slug}/#book`,
        name: novel.title,
        url: `${SITE_URL}/novels/${novel.slug}`,
        description: novel.description,
        genre: novel.genre?.name,
        author: {
          "@type": "Person",
          name: novel.author || "Unknown",
        },
        image: novel.cover_url || `${SITE_URL}/og-default.png`,
        inLanguage: "en-US",
        numberOfPages: novel.chapter_count || 1,
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: SITE_NAME,
        },
      }}
    />
  );
}

// ── Chapter Schema ───────────────────────────────────────────────────────────
export function ChapterSchema({
  novel,
  chapter,
}: {
  novel: { title: string; slug: string };
  chapter: { title: string; slug: string; chapter_number: number };
}) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Chapter",
        name: chapter.title,
        position: chapter.chapter_number,
        url: `${SITE_URL}/novels/${novel.slug}/${chapter.slug}`,
        isPartOf: {
          "@type": "Book",
          name: novel.title,
          url: `${SITE_URL}/novels/${novel.slug}`,
        },
      }}
    />
  );
}

