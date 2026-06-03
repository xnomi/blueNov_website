import { buildMetadata } from "@/lib/seo";
import { BookOpen, Heart, Globe, Shield } from "lucide-react";

export const metadata = buildMetadata({
  title: "About BlueNov",
  description: "Learn about BlueNov — your free online novel and article reading platform. Our mission, values, and story.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container-narrow" style={{ padding: "3rem 1.25rem" }}>
      <h1 className="h1" style={{ marginBottom: "0.75rem" }}>About BlueNov</h1>
      <p className="body-lg" style={{ color: "var(--text-secondary)", marginBottom: "2.5rem" }}>
        Your free destination for novels and articles online.
      </p>

      <div className="divider" />

      <div style={{ marginTop: "2.5rem", display: "grid", gap: "2rem" }}>
        {[
          {
            icon: <BookOpen size={24} color="var(--accent)" />,
            title: "Our Mission",
            text: "BlueNov was created with one simple goal: make great stories accessible to everyone, for free. We believe reading should have no barriers — no subscriptions, no paywalls, no registration required.",
          },
          {
            icon: <Heart size={24} color="#ef4444" />,
            title: "For Readers",
            text: "We curate and publish novels and articles across all genres — Fantasy, Romance, Thriller, Sci-Fi, Mystery, and more. Every story is available instantly, on any device, without an account.",
          },
          {
            icon: <Globe size={24} color="var(--accent)" />,
            title: "Always Free",
            text: "BlueNov will always be free to read. We're supported by non-intrusive advertising, which allows us to keep the lights on while giving you uninterrupted reading experiences.",
          },
          {
            icon: <Shield size={24} color="#10b981" />,
            title: "Your Privacy",
            text: "We respect your privacy. We do not require registration, we do not sell your data, and we are fully transparent about how we use information. See our Privacy Policy for details.",
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

      <div className="divider" />
      <p className="body-sm" style={{ color: "var(--text-muted)", textAlign: "center" }}>
        &copy; {new Date().getFullYear()} BlueNov — bluenov.me
      </p>
    </div>
  );
}
