import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "BlueNov Terms of Service — rules and guidelines for using bluenov.me.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="container-narrow" style={{ padding: "3rem 1.25rem" }}>
      <h1 className="h1" style={{ marginBottom: "0.5rem" }}>Terms of Service</h1>
      <p className="body-sm" style={{ color: "var(--text-muted)", marginBottom: "2.5rem" }}>Last updated: June 1, 2025</p>
      <div className="reading-content">
        <p>By accessing and using <strong>BlueNov</strong> (bluenov.me), you agree to these Terms of Service.</p>
        <h2>1. Use of Service</h2>
        <p>BlueNov provides free access to novels and articles for personal, non-commercial reading. You may not:</p>
        <ul>
          <li>Copy, reproduce, or redistribute our content without permission</li>
          <li>Use automated tools to scrape or crawl our site</li>
          <li>Attempt to interfere with site functionality or security</li>
        </ul>
        <h2>2. Intellectual Property</h2>
        <p>All content on BlueNov, including text, images, logos, and design, is owned by or licensed to BlueNov. Unauthorized use is prohibited.</p>
        <h2>3. Disclaimer</h2>
        <p>BlueNov is provided "as is" without warranties of any kind. We do not guarantee uninterrupted availability of the service.</p>
        <h2>4. Limitation of Liability</h2>
        <p>BlueNov shall not be liable for any indirect, incidental, or consequential damages arising from your use of the site.</p>
        <h2>5. Changes</h2>
        <p>We may modify these Terms at any time. Continued use of the site constitutes acceptance of the updated Terms.</p>
        <h2>6. Contact</h2>
        <p>For any questions, please visit our <a href="/contact">contact page</a>.</p>
      </div>
    </div>
  );
}
