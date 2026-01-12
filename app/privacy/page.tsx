import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"

export const metadata: Metadata = {
  title: "Privacy Policy — Alzìa Paris",
  description: "Our commitment to protecting your privacy and personal information at Alzìa Paris.",
}

export default function PrivacyPage() {
  return (
    <BlogPageLayout
      title="Privacy Policy"
      subtitle="Your privacy is important to us. Learn how we collect, use, and protect your personal information."
      publishDate="January 2026"
      readTime="4 min read"
    >
      <div className="space-y-12 md:space-y-16">
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Introduction</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            At Alzìa Paris ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our website and use
            our services.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            We may collect information about you in a variety of ways:
          </p>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-semibold text-foreground mb-2">Personal Data</h3>
              <p className="text-muted-foreground text-sm">Name, email address, phone number, shipping address</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-secondary">
              <h3 className="font-semibold text-foreground mb-2">Payment Information</h3>
              <p className="text-muted-foreground text-sm">
                Credit card details (processed securely via PCI-compliant systems)
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-accent">
              <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
              <p className="text-muted-foreground text-sm">Preferences, order history, wishlists</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-semibold text-foreground mb-2">Technical Data</h3>
              <p className="text-muted-foreground text-sm">IP address, browser type, device information, cookies</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            How We Use Your Information
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">We use the information we collect to:</p>
          <ul className="space-y-3">
            {[
              "Process and fulfill your orders",
              "Send promotional content and marketing materials (with your consent)",
              "Respond to your inquiries and provide customer support",
              "Improve our website and services",
              "Comply with legal obligations",
              "Detect and prevent fraud",
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary font-semibold flex-shrink-0">✓</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Data Protection</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We implement appropriate technical and organizational measures to protect your personal data against
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
            Internet is 100% secure. While we strive to use commercially acceptable means to protect your information,
            we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            Depending on your location, you may have the following rights:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Right to access your personal data",
              "Right to correct inaccurate data",
              "Right to request deletion of your data",
              "Right to opt-out of marketing communications",
              "Right to data portability",
              "Right to lodge a complaint",
            ].map((right, idx) => (
              <div key={idx} className="flex gap-3 bg-muted/30 p-4 rounded-lg">
                <span className="text-secondary font-semibold flex-shrink-0">•</span>
                <span className="text-muted-foreground text-sm">{right}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at{" "}
            <a href="mailto:hello@alzianaturals.com" className="text-primary hover:text-primary/80 font-semibold">
              hello@alzianaturals.com
            </a>
          </p>
        </section>
      </div>
    </BlogPageLayout>
  )
}
