import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"

export const metadata: Metadata = {
  title: "Shipping Information — Alzìa Paris",
  description: "Learn about our shipping policies, delivery times, and international options for Alzìa cosmetics.",
}

export default function ShippingPage() {
  return (
    <BlogPageLayout
      title="Shipping Information"
      subtitle="We offer fast, secure shipping to ensure your Alzìa products arrive in perfect condition."
      readTime="3 min read"
    >
      <div className="space-y-12 md:space-y-16">
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Delivery Times</h2>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-semibold text-foreground mb-2">🏠 Domestic Orders</h3>
              <p className="text-muted-foreground">3-5 business days</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-secondary">
              <h3 className="font-semibold text-foreground mb-2">🌍 International Orders</h3>
              <p className="text-muted-foreground">7-14 business days</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-accent">
              <h3 className="font-semibold text-foreground mb-2">⚡ Express Shipping</h3>
              <p className="text-muted-foreground">1-2 business days (available for select locations)</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Shipping Costs</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
            We calculate shipping costs based on your location and order weight. Costs are displayed at checkout before
            you complete your purchase.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary font-semibold">✓</span>
              <span className="text-muted-foreground">Free shipping on orders over $75</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">✓</span>
              <span className="text-muted-foreground">Flat rate shipping for most destinations</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">✓</span>
              <span className="text-muted-foreground">Tracking information provided for all orders</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Packaging & Care</h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
            Your Alzìa products are carefully packaged to ensure they arrive in pristine condition. We use eco-friendly
            materials and premium protective packaging.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <p className="text-muted-foreground leading-relaxed">
              All packages are insured and tracked. If you receive a damaged item, please contact us immediately with
              photos, and we'll arrange a replacement.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">International Shipping</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
            We ship to most countries worldwide. Please note that customs fees or import duties may apply depending on
            your location.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-secondary font-semibold">•</span>
              <span className="text-muted-foreground">
                <strong>EU Countries:</strong> Typical delivery 5-10 business days
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-secondary font-semibold">•</span>
              <span className="text-muted-foreground">
                <strong>USA & Canada:</strong> Typical delivery 7-12 business days
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-secondary font-semibold">•</span>
              <span className="text-muted-foreground">
                <strong>Asia-Pacific:</strong> Typical delivery 10-16 business days
              </span>
            </li>
          </ul>
        </section>
      </div>
    </BlogPageLayout>
  )
}
