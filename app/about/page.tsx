import { buildMetadata } from "@/lib/seo";
import { FAQSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";
import { FileText, Heart, Globe, Shield } from "lucide-react";

export const metadata = buildMetadata({
  title: "About BlueNov",
  description:
    "Learn about BlueNov — your free online articles and insights platform. Our mission is to deliver high-quality, free-to-read writing on reviews, news, and writing tips.",
  path: "/about",
});

const FAQS = [
  {
    question: "What is BlueNov?",
    answer:
      "BlueNov is a free online platform where you can read in-depth articles, book reviews, writing tips, and literary news. No account or subscription needed.",
  },
  {
    question: "Is BlueNov free to use?",
    answer:
      "Yes, BlueNov is 100% free. We do not charge for any content and you do not need to register an account to read.",
  },
  {
    question: "What kind of articles does BlueNov publish?",
    answer:
      "BlueNov publishes reviews, literary news, writing tips, recommendations, and general articles related to books, reading, and storytelling.",
  },
  {
    question: "How often is new content published?",
    answer:
      "We publish new articles regularly. Check our Articles page or subscribe to updates to stay informed.",
  },
];

export default function AboutPage() {
  return (
    <>
      <FAQSchema faqs={FAQS} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://bluenov.me" },
          { name: "About", url: "https://bluenov.me/about" },
        ]}
      />

      <div className="container-narrow" style={{ padding: "3rem 1.25rem" }}>
        <h1 className="h1" style={{ marginBottom: "0.75rem" }}>About BlueNov</h1>
        <p className="body-lg" style={{ color: "var(--text-secondary)", marginBottom: "2.5rem" }}>
          Your free destination for articles, reviews, and literary insights.
        </p>

        <div className="divider" />

        <div style={{ marginTop: "2.5rem", display: "grid", gap: "2rem" }}>
          {[
            {
              icon: <FileText size={24} color="var(--accent)" />,
              title: "Our Mission",
              text: "BlueNov was built with one goal: make great writing accessible to everyone, for free. We believe quality reading should have no barriers — no subscriptions, no paywalls, no registration required.",
            },
            {
              icon: <Heart size={24} color="#ef4444" />,
              title: "For Readers",
              text: "We curate and publish articles across all topics — book reviews, writing tips, literary news, and reading recommendations. Every article is available instantly on any device, without an account.",
            },
            {
              icon: <Globe size={24} color="var(--accent)" />,
              title: "Always Free",
              text: "BlueNov will always be free to read. We are supported by non-intrusive advertising, which allows us to keep the lights on while giving you an uninterrupted reading experience.",
            },
            {
              icon: <Shield size={24} color="#10b981" />,
              title: "Your Privacy",
              text: "We respect your privacy. We do not require registration, we do not sell your data, and we are fully transparent about how we use information. See our Privacy Policy for full details.",
            },
          ].map(({ icon, title, text }) => (
            <div key={title} style={{
              display: "flex", gap: "1.25rem",
              padding: "1.5rem",
              background: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
            }}>
              <div style={{ flexShrink: 0, marginTop: "0.15rem" }}>{icon}</div>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{title}</h2>
                <p className="body" style={{ color: "var(--text-secondary)" }}>{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: "3rem" }}>
          <h2 className="h3" style={{ marginBottom: "1.5rem" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {FAQS.map((faq) => (
              <div key={faq.question} style={{
                padding: "1.25rem 1.5rem",
                background: "var(--bg-card)",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
              }}>
                <h3 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                  {faq.question}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.65 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />
        <p className="body-sm" style={{ color: "var(--text-muted)", textAlign: "center" }}>
          &copy; {new Date().getFullYear()} BlueNov — bluenov.me
        </p>
      </div>
    </>
  );
}
