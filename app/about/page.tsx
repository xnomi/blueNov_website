import { buildMetadata, SITE_URL } from "@/lib/seo";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { BookOpen, Heart, Globe, Shield, Sparkles, Sliders } from "lucide-react";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "About BlueNov — Premium Web Novel Reading Platform",
  description:
    "Learn about BlueNov — our mission to deliver free, immersive web novel reading with state-of-the-art reader personalization, dark mode, and zero paywalls.",
  path: "/about",
});

const FAQS = [
  {
    question: "What is BlueNov?",
    answer:
      "BlueNov is a modern, free web novel reading platform where you can discover and read stories across Fantasy, Romance, Sci-Fi, Thriller, and Mystery. It includes a distraction-free reader with customizable typography, dark mode, sepia paper themes, and progress tracking.",
  },
  {
    question: "Is reading on BlueNov completely free?",
    answer:
      "Yes, BlueNov is 100% free. There are no paywalls, locked chapters, coins, or mandatory subscriptions. You can start reading immediately without even creating an account.",
  },
  {
    question: "How does the custom reader work?",
    answer:
      "Our reader includes both Scroll Mode and Paged Mode, font family selections (Literata, Merriweather, Atkinson, OpenDyslexic, Noto Nastaliq Urdu), font size and line height sliders, warm blue-light filters, text-to-speech audio, and automatic reading progress tracking.",
  },
  {
    question: "How do I save novels to my library?",
    answer:
      "On any novel's detail page, click 'Add to Library' to place it on your shelf: Currently Reading, Plan to Read, Completed, or Favorites. Your bookshelf is automatically preserved in your browser.",
  },
];

export default function AboutPage() {
  return (
    <>
      <FAQSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
        ]}
      />

      <div className="container-narrow" style={{ padding: "3.5rem 1.25rem 6rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "var(--accent-light)",
              color: "var(--accent)",
              padding: "0.35rem 1rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem",
            }}
          >
            <Sparkles size={14} /> Our Story & Mission
          </div>
          <h1 className="h1" style={{ marginBottom: "0.75rem" }}>About BlueNov</h1>
          <p className="body-lg" style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
            A modern, distraction-free reading haven created for book lovers, web fiction enthusiasts, and avid storytellers.
          </p>
        </div>

        {/* Core Pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "3.5rem" }}>
          {[
            {
              icon: <BookOpen size={24} color="var(--accent)" />,
              title: "Free Unrestricted Stories",
              text: "No coins, chapter paywalls, or forced account walls. Read freely from beginning to end.",
            },
            {
              icon: <Sliders size={24} color="#10B981" />,
              title: "State-of-the-Art Reader",
              text: "Fine-tune font size, serif typography, OLED black, paper sepia, and warm blue-light filters.",
            },
            {
              icon: <Globe size={24} color="#F59E0B" />,
              title: "Cross-Device Reading",
              text: "Responsive layout crafted for mobile, tablet, and desktop with offline PWA support.",
            },
            {
              icon: <Heart size={24} color="#EF4444" />,
              title: "Built for Readers",
              text: "Clean, calm UI designed with generous whitespace and zero disruptive ads in the reading area.",
            },
          ].map((pillar, i) => (
            <div key={i} className="card" style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "0.75rem" }}>{pillar.icon}</div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{pillar.title}</h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {pillar.text}
              </p>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* FAQs */}
        <section style={{ marginTop: "3rem" }}>
          <div className="section-title">
            <div className="section-title-left">
              <div className="section-title-bar" />
              <h2 className="h2" style={{ margin: 0 }}>Frequently Asked Questions</h2>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="card" style={{ padding: "1.25rem 1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--text-primary)" }}>
                  {faq.question}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <Link href="/novels" className="btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "1rem" }}>
            Explore Web Novels Now
          </Link>
        </div>
      </div>
    </>
  );
}
