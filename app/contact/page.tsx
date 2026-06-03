import { buildMetadata } from "@/lib/seo";
import { Mail, Globe } from "lucide-react";
import ContactForm from "@/components/common/ContactForm";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with BlueNov. Send us a message for content requests, partnerships, or feedback.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-narrow" style={{ padding: "3rem 1.25rem" }}>
      <h1 className="h1" style={{ marginBottom: "0.5rem" }}>Contact Us</h1>
      <p className="body-lg" style={{ color: "var(--text-secondary)", marginBottom: "2.5rem" }}>
        Have a question or suggestion? We'd love to hear from you.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {[
          { icon: <Mail size={22} color="var(--accent)" />, title: "Email Us", value: "contact@bluenov.me", link: "mailto:contact@bluenov.me" },
          { icon: <Globe size={22} color="var(--accent)" />, title: "Website", value: "bluenov.me", link: "https://bluenov.me" },
        ].map(({ icon, title, value, link }) => (
          <a key={title} href={link} style={{
            display: "flex", alignItems: "flex-start", gap: "1rem",
            padding: "1.25rem",
            background: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}>
            {icon}
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{title}</p>
              <p style={{ color: "var(--accent)", fontSize: "0.875rem" }}>{value}</p>
            </div>
          </a>
        ))}
      </div>

      <div style={{
        padding: "2rem",
        background: "var(--bg-card)",
        borderRadius: "16px",
        border: "1px solid var(--border-color)",
      }}>
        <h2 className="h3" style={{ marginBottom: "1.5rem" }}>Send a Message</h2>
        <ContactForm />
      </div>

      <style>{`@media (max-width: 500px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

