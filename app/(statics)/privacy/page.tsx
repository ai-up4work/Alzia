import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy Sri Lanka | Alzìa Cosmetics Data Protection",
  description:
    "Alzìa Cosmetics Sri Lanka privacy policy. How we protect your personal data for online cosmetics shopping & delivery.",
}

export default function PrivacyPage() {
  const sections = [
    {
      title: "Introduction",
      content:
        "Alzìa Cosmetics Sri Lanka ('we,' 'our,' or 'us') protects your privacy. This policy explains data collection, use and protection when shopping cosmetics online in Sri Lanka.",
    },
    {
      title: "Information We Collect",
      subsections: [
        { label: "Personal Data", desc: "Name, email, phone, Sri Lanka shipping address for cosmetics delivery" },
        { label: "Payment Information", desc: "Secure PCI-compliant processing for Sri Lanka payments" },
        { label: "Account Information", desc: "Order history, preferences, wishlists" },
        { label: "Technical Data", desc: "IP address, browser, cookies for site performance" },
      ],
    },
    {
      title: "Data Protection",
      content:
        "Secure technical measures protect your Sri Lanka cosmetics shopping data. No internet transmission is 100% secure, but we use industry standards for personal information protection.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <span className="inline-block text-sm font-medium text-primary mb-4 tracking-widest uppercase">
            Protection & Trust
          </span>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight font-light text-foreground mb-8 text-balance">
            Your Privacy Matters
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
            Your data protection for cosmetics shopping in Sri Lanka. Secure handling of personal information.
          </p>
        </div>
      </section>

      <div className="border-b border-border" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="space-y-20 md:space-y-28">
          {/* How We Use Data */}
          <section className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              How We Use Your Data
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your information processes cosmetics orders and improves Sri Lanka shopping:
            </p>
            <div className="grid gap-4">
              {[
                "Process and deliver cosmetics orders island wide",
                "Send order confirmations and shipping updates",
                "Customer support for Sri Lanka deliveries",
                "Improve cosmetics website experience",
                "Sri Lanka legal compliance and fraud prevention",
                "Marketing communications (with consent/opt-out option)",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                >
                  <span className="text-primary font-semibold text-lg flex-shrink-0">+</span>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Your Data Rights */}
          <section className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Your Data Rights
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sri Lanka customers have these privacy rights:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Access your cosmetics order data",
                "Correct inaccurate personal information",
                "Request data deletion where possible",
                "Opt-out of marketing emails",
                "Data portability request",
                "Privacy complaint assistance",
              ].map((right, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-6 rounded-xl"
                >
                  <p className="text-muted-foreground text-sm">{right}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="relative overflow-hidden rounded-3xl p-12 md:p-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
                Sri Lanka Privacy Contact
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Questions about Alzìa Cosmetics Sri Lanka privacy policy? Contact our data protection team:{" "}
                <a
                  href="mailto:hello@alziagroup.lk"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  hello@alziagroup.lk
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
