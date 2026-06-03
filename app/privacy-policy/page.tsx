import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "BlueNov Privacy Policy — how we collect, use, and protect your information on bluenov.me.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const updated = "June 1, 2025";
  return (
    <div className="container-narrow" style={{ padding: "3rem 1.25rem" }}>
      <h1 className="h1" style={{ marginBottom: "0.5rem" }}>Privacy Policy</h1>
      <p className="body-sm" style={{ color: "var(--text-muted)", marginBottom: "2.5rem" }}>Last updated: {updated}</p>
      <div className="reading-content">
        <p>Welcome to <strong>BlueNov</strong> ("we", "us", "our"). This Privacy Policy explains how we handle information when you visit <strong>bluenov.me</strong>.</p>
        <h2>1. Information We Collect</h2>
        <p>BlueNov does not require registration or account creation for readers. We may collect the following non-personally identifiable information automatically:</p>
        <ul>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring URL</li>
          <li>Approximate geographic location (country/city level)</li>
        </ul>
        <h2>2. Cookies</h2>
        <p>We use cookies and similar technologies for the following purposes:</p>
        <ul>
          <li><strong>Essential cookies:</strong> To remember your theme preference (dark/light mode).</li>
          <li><strong>Analytics cookies:</strong> To understand how visitors use our site (via Google Analytics, if enabled).</li>
          <li><strong>Advertising cookies:</strong> We may use Google AdSense to display ads. Google may use cookies to serve relevant ads. You can opt out at <a href="https://optout.aboutads.info" rel="noopener noreferrer">optout.aboutads.info</a>.</li>
        </ul>
        <h2>3. How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Improve our content and user experience</li>
          <li>Display relevant advertisements</li>
          <li>Monitor site performance and fix issues</li>
        </ul>
        <h2>4. Third-Party Services</h2>
        <p>We may use the following third-party services which have their own privacy policies:</p>
        <ul>
          <li><strong>Google Analytics</strong> — usage analytics</li>
          <li><strong>Google AdSense</strong> — advertising</li>
          <li><strong>Supabase</strong> — backend infrastructure</li>
        </ul>
        <h2>5. Children's Privacy</h2>
        <p>BlueNov is not intended for children under 13. We do not knowingly collect personal information from children.</p>
        <h2>6. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>
        <h2>7. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at: <a href="/contact">our contact page</a>.</p>
      </div>
    </div>
  );
}
