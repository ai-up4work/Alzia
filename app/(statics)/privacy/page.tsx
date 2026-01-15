import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"

export const metadata: Metadata = {
  title: "Privacy Policy Sri Lanka | Alzìa Cosmetics Data Protection",
  description: "Alzìa Cosmetics Sri Lanka privacy policy. How we protect your personal data for online cosmetics shopping & delivery.",
}

export default function PrivacyPage() {
  return (
    <BlogPageLayout
      title="Privacy Policy – Alzìa Cosmetics Sri Lanka"
      subtitle="Your data protection for cosmetics shopping in Sri Lanka. Secure handling of personal information."
      publishDate="January 2026"
      readTime="4 min read"
    >
      <div className="space-y-12 md:space-y-16">
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Introduction – Sri Lanka Privacy
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Alzìa Cosmetics Sri Lanka ("we," "our," or "us") protects your privacy. This policy explains data collection, 
            use and protection when shopping cosmetics online in Sri Lanka.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Information We Collect Sri Lanka
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            For cosmetics orders & delivery in Sri Lanka we collect:
          </p>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-semibold text-foreground mb-2">Personal Data</h3>
              <p className="text-muted-foreground text-sm">
                Name, email, phone, Sri Lanka shipping address for cosmetics delivery
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-secondary">
              <h3 className="font-semibold text-foreground mb-2">Payment Information</h3>
              <p className="text-muted-foreground text-sm">
                Secure PCI-compliant processing for Sri Lanka payments
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-accent">
              <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
              <p className="text-muted-foreground text-sm">Order history, preferences, wishlists</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-semibold text-foreground mb-2">Technical Data</h3>
              <p className="text-muted-foreground text-sm">IP address, browser, cookies for site performance</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            How We Use Your Data Sri Lanka
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            Your information processes cosmetics orders & improves Sri Lanka shopping:
          </p>
          <ul className="space-y-3">
            {[
              "Process & deliver cosmetics orders island wide",
              "Send order confirmations & shipping updates",
              "Customer support for Sri Lanka deliveries",
              "Improve cosmetics website experience",
              "Sri Lanka legal compliance & fraud prevention",
              "Marketing (with consent/opt-out option)",
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary font-semibold flex-shrink-0">✓</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Cosmetics Data Protection Sri Lanka
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Secure technical measures protect your Sri Lanka cosmetics shopping data. No internet transmission is 100% 
            secure, but we use industry standards for personal information protection.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Your Data Rights Sri Lanka
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            Sri Lanka customers have these rights:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Access your cosmetics order data",
              "Correct inaccurate personal information",
              "Request data deletion (where possible)",
              "Opt-out of marketing emails",
              "Data portability request",
              "Privacy complaint assistance",
            ].map((right, idx) => (
              <div key={idx} className="flex gap-3 bg-muted/30 p-4 rounded-lg">
                <span className="text-secondary font-semibold flex-shrink-0">•</span>
                <span className="text-muted-foreground text-sm">{right}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Sri Lanka Privacy Contact
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Questions about Alzìa Cosmetics Sri Lanka privacy? Contact:{" "}
            <a href="mailto:hello@alziagroup.lk" className="text-primary hover:text-primary/80 font-semibold">
              hello@alziagroup.lk
            </a>
          </p>
        </section>
      </div>
    </BlogPageLayout>
  )
}
