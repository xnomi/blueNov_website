interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteSchema() {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "BlueNov",
        url: "https://bluenov.me",
        description: "Read free novels and articles online at BlueNov.",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: "https://bluenov.me/search?q={search_term_string}" },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function BookSchema({ novel }: { novel: { title: string; slug: string; description?: string; author?: string; genre?: { name: string }; cover_url?: string } }) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Book",
        name: novel.title,
        url: `https://bluenov.me/novels/${novel.slug}`,
        description: novel.description,
        author: novel.author ? { "@type": "Person", name: novel.author } : undefined,
        genre: novel.genre?.name,
        image: novel.cover_url,
        publisher: { "@type": "Organization", name: "BlueNov", url: "https://bluenov.me" },
        inLanguage: "en",
        isAccessibleForFree: true,
      }}
    />
  );
}

export function ArticleSchema({ article }: { article: { title: string; slug: string; excerpt?: string; author?: string; cover_url?: string; created_at: string; updated_at: string } }) {
  return (
    <StructuredData
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        url: `https://bluenov.me/articles/${article.slug}`,
        description: article.excerpt,
        author: article.author ? { "@type": "Person", name: article.author } : { "@type": "Organization", name: "BlueNov" },
        image: article.cover_url,
        datePublished: article.created_at,
        dateModified: article.updated_at,
        publisher: {
          "@type": "Organization",
          name: "BlueNov",
          url: "https://bluenov.me",
          logo: { "@type": "ImageObject", url: "https://bluenov.me/logo.png" },
        },
        inLanguage: "en",
        isAccessibleForFree: true,
      }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
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
