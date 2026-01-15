import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Wholesale Cosmetics Sri Lanka | Bulk Makeup & Cosmetic Supply – Alzìa",
  description:
    "Partner with Alzìa for wholesale cosmetics in Sri Lanka. Bulk makeup, skincare & beauty products at competitive rates. Fast delivery for retailers in Sri Lanka",
}

export default function WholesalePage() {
  const features = [
    {
      title: "Competitive Pricing",
      description: "Attractive bulk rates on luxury cosmetics for Sri Lankan retailers. Maintain healthy margins on makeup and skincare.",
      icon: "💰",
    },
    {
      title: "MOQ Flexibility",
      description: "Minimum order quantities tailored to your business size—from boutiques to large retailers.",
      icon: "📦",
    },
    {
      title: "Dedicated Support",
      description: "Personal account managers to handle orders, inquiries, and support your business growth.",
      icon: "🤝",
    },
    {
      title: "Marketing Assets",
      description: "Professional imagery, descriptions, and marketing materials for your channels.",
      icon: "🎨",
    },
    {
      title: "Inventory Management",
      description: "Real-time stock information and flexible reorder options for consistent availability.",
      icon: "📊",
    },
    {
      title: "Fast Shipping",
      description: "Reliable shipping from Colombo to Kandy, Galle and island‑wide for your wholesale orders.",
      icon: "🚚",
    },
  ]

  return (
    <BlogPageLayout
      title="Wholesale Partnership"
      subtitle="Partner with Alzìa for wholesale cosmetics in Sri Lanka. Bulk makeup, skincare & beauty products at competitive rates. Fast delivery for retailers in Sri Lanka"
      readTime="5 min read"
    >
      <div className="space-y-16">
        {/* Features Grid */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Why Partner with Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border p-6 bg-muted/30 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who We Work With */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Who We Work With</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            We partner with a diverse range of businesses including:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Independent Beauty Boutiques",
              "Department Stores & Retail Chains",
              "Spas & Wellness Centers",
              "Online Retailers & Marketplaces",
              "Hotels & Resort Amenities",
              "Salons & Hair Studios",
            ].map((partner, idx) => (
              <div key={idx} className="flex gap-3 bg-muted/50 p-4 rounded-lg border border-border">
                <span className="text-primary font-semibold flex-shrink-0">✓</span>
                <span className="text-foreground font-medium">{partner}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Tiers */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Wholesale Pricing Tiers</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/30 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Tier 1: Boutique (1-50 units)</h3>
              <p className="text-muted-foreground">
                10-15% discount on retail pricing. Perfect for small shops and starting retailers.
              </p>
            </div>
            <div className="bg-gradient-to-r from-secondary/10 to-transparent border border-secondary/30 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Tier 2: Small Business (51-200 units)</h3>
              <p className="text-muted-foreground">
                20-25% discount on retail pricing. Ideal for growing retail operations.
              </p>
            </div>
            <div className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/30 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Tier 3: Enterprise (200+ units)</h3>
              <p className="text-muted-foreground">
                30-40% discount on retail pricing. Custom terms for large-scale operations.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">How to Get Started</h2>
          <ol className="space-y-6">
            {[
              {
                num: "1",
                title: "Contact Our Team",
                desc: "Reach out to hello@alzianaturals.com with details about your business",
              },
              {
                num: "2",
                title: "Schedule a Consultation",
                desc: "We'll discuss your needs, target market, and wholesale opportunities",
              },
              {
                num: "3",
                title: "Receive Wholesale Pricing",
                desc: "Get access to our wholesale catalog with competitive pricing",
              },
              { num: "4", title: "Place Your First Order", desc: "Start with a trial order and scale from there" },
            ].map((step, idx) => (
              <li key={idx} className="bg-muted/30 border border-border rounded-lg p-6 flex gap-6">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-12 text-center">
          <h3 className="font-serif text-3xl font-medium text-foreground mb-4">Ready to Partner?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's grow together. Contact our wholesale team to explore partnership opportunities.
          </p>
          <Link
            href="/contact?subject=wholesale"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Start Your Partnership
          </Link>
        </div>
      </div>
    </BlogPageLayout>
  )
}
