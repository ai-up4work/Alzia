import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronRight, ArrowRight, Sparkles, Flower2, Palette, Gift } from "lucide-react"

export const metadata: Metadata = {
  title: "New Arrivals — Alzìa Paris | Latest Beauty Products",
  description: "Discover the latest additions to our luxury beauty collection. Fresh launches and exclusive debuts.",
}

export default function NewArrivalsPage() {
  const newProducts = [
    {
      title: "Advanced Skincare Formulations",
      description: "Cutting-edge formulas with botanical extracts and scientific innovation for visible results.",
      icon: Sparkles,
    },
    {
      title: "Limited Edition Fragrances",
      description: "Exclusive scents from renowned perfumers. Available in limited quantities while stocks last.",
      icon: Flower2,
    },
    {
      title: "Innovative Makeup Collections",
      description: "Long-lasting, sustainable formulas designed for all skin tones with premium pigmentation.",
      icon: Palette,
    },
    {
      title: "Exclusive Gift Sets",
      description: "Thoughtfully curated combinations perfect for gifting or personal indulgence.",
      icon: Gift,
    },
  ]

  const timeline = [
    { month: "January 2026", launches: "Spring Skincare Line - 8 new products" },
    { month: "February 2026", launches: "Limited Edition Fragrance Series - 3 scents" },
    { month: "March 2026", launches: "Makeup Refresh Collection - 12 shades" },
    { month: "April 2026", launches: "Anniversary Gift Sets - Exclusive bundles" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">New Arrivals</span>
          </nav>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-light mb-4">
              New Arrivals
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
              Discover the latest additions to our luxury beauty collection. Fresh launches and exclusive debuts.
            </p>
          </div>

          {/* Latest Collections Section */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">Latest Collections</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              We're constantly innovating and bringing new formulations to life. Our latest arrivals feature cutting-edge
              technology combined with natural ingredients for visible, lasting results.
            </p>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {newProducts.map((product, idx) => {
                const IconComponent = product.icon
                return (
                  <div
                    key={idx}
                    className="bg-card border border-border/50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 hover:border-primary/30 hover:shadow-lg transition-all duration-500"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl lg:text-2xl font-medium text-foreground mb-3">{product.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Upcoming Launches Timeline */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">Upcoming Launches</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-3xl">
              Stay tuned for exciting new products coming throughout 2026. Sign up for our newsletter to be notified when
              new collections launch.
            </p>

            <div className="space-y-4">
              {timeline.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4"
                >
                  <div className="flex-shrink-0">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full">
                      {event.month}
                    </span>
                  </div>
                  <p className="text-foreground font-medium">{event.launches}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5 border border-border/50 rounded-2xl lg:rounded-3xl p-8 md:p-12 mb-16">
            <div className="max-w-2xl">
              <h3 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">Never Miss a Launch</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Subscribe to our newsletter for early access to new collections, exclusive deals, and beauty inspiration
                delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background border border-border rounded-full px-6 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-all flex-shrink-0">
                  Subscribe
                </button>
              </div>
            </div>
          </section>

          {/* Shop New Arrivals CTA */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-border/50 rounded-2xl lg:rounded-3xl p-8 md:p-12 text-center">
            <h3 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">Ready to Shop?</h3>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Browse all new arrivals and find your next beauty obsession.
            </p>
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all"
            >
              <span>Shop New Arrivals</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}