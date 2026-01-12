import Link from "next/link"
import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"

export const metadata: Metadata = {
  title: "New Arrivals — Alzìa Paris | Latest Beauty Products",
  description: "Discover the latest additions to our luxury beauty collection. Fresh launches and exclusive debuts.",
}

export default function NewArrivalsPage() {
  const newProducts = [
    {
      title: "Advanced Skincare Formulations",
      description: "Cutting-edge formulas with botanical extracts and scientific innovation for visible results.",
      icon: "🧪",
    },
    {
      title: "Limited Edition Fragrances",
      description: "Exclusive scents from renowned perfumers. Available in limited quantities while stocks last.",
      icon: "🌹",
    },
    {
      title: "Innovative Makeup Collections",
      description: "Long-lasting, sustainable formulas designed for all skin tones with premium pigmentation.",
      icon: "🎨",
    },
    {
      title: "Exclusive Gift Sets",
      description: "Thoughtfully curated combinations perfect for gifting or personal indulgence.",
      icon: "🎁",
    },
  ]

  const timeline = [
    { month: "January 2026", launches: "Spring Skincare Line - 8 new products" },
    { month: "February 2026", launches: "Limited Edition Fragrance Series - 3 scents" },
    { month: "March 2026", launches: "Makeup Refresh Collection - 12 shades" },
    { month: "April 2026", launches: "Anniversary Gift Sets - Exclusive bundles" },
  ]

  return (
    <BlogPageLayout
      title="New Arrivals"
      subtitle="Fresh launches and exclusive debuts. Discover the newest innovations and limited-edition products joining the Alzìa Paris family."
      readTime="4 min read"
    >
      <div className="space-y-16">
        {/* Latest Collections Section */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Latest Collections</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            We're constantly innovating and bringing new formulations to life. Our latest arrivals feature cutting-edge
            technology combined with natural ingredients for visible, lasting results.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {newProducts.map((product, idx) => (
              <div
                key={idx}
                className="bg-muted/50 border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <span className="text-4xl mb-4 block">{product.icon}</span>
                <h3 className="font-semibold text-foreground mb-3 text-lg">{product.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Launches Timeline */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Upcoming Launches</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            Stay tuned for exciting new products coming throughout 2026. Sign up for our newsletter to be notified when
            new collections launch.
          </p>

          <div className="space-y-4">
            {timeline.map((event, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-6 flex items-start gap-4"
              >
                <div className="min-w-fit">
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {event.month}
                  </span>
                </div>
                <p className="text-foreground font-medium">{event.launches}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-secondary/5 border border-secondary/20 rounded-2xl p-12">
          <div className="max-w-2xl">
            <h3 className="font-serif text-3xl font-medium text-foreground mb-4">Never Miss a Launch</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Subscribe to our newsletter for early access to new collections, exclusive deals, and beauty inspiration
              delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background border border-border rounded-full px-6 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              />
              <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-3 rounded-full font-medium transition-colors flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* Shop New Arrivals */}
        <div className="text-center bg-muted/30 rounded-2xl p-12 border border-border">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Ready to Shop?</h3>
          <p className="text-muted-foreground mb-8">Browse all new arrivals and find your next beauty obsession.</p>
          <Link
            href="/shop?sort=newest"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>
    </BlogPageLayout>
  )
}
