import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Shipping Sri Lanka | Cosmetics Delivery 1 to 5 Days Island Wide – Alzìa",
  description: "Fast island wide cosmetics delivery in Sri Lanka from Alzìa. Makeup & beauty products delivered 1 to 5 business days nationwide. Free shipping over LKR 10,000.",
}

export default function ShippingPage() {
  return (
    <BlogPageLayout
      title="Island Wide Shipping Sri Lanka – 1 to 5 Business Days"
      subtitle="Fast cosmetics delivery across Colombo, Kandy, Galle & nationwide for your makeup & skincare orders."
      readTime="3 min read"
    >
      <div className="space-y-12 md:space-y-16">
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Delivery Times Sri Lanka</h2>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-semibold text-foreground mb-2">🏠 Island Wide Delivery</h3>
              <p className="text-muted-foreground">1-5 business days nationwide</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border-l-4 border-secondary">
              <h3 className="font-semibold text-foreground mb-2">⚡ Express Colombo</h3>
              <p className="text-muted-foreground">1-3 business days</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Shipping Costs Sri Lanka</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
            Affordable rates for cosmetics delivery across Sri Lanka. Shown at checkout.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary font-semibold">✓</span>
              <span className="text-muted-foreground">Free shipping on orders over LKR 10,000 island wide</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">✓</span>
              <span className="text-muted-foreground">Flat rates: Colombo LKR 500, Outstation LKR 800-1200</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">✓</span>
              <span className="text-muted-foreground">Tracking for all makeup & skincare orders</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Packaging & Cosmetics Care</h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
            Premium packaging ensures your Alzìa cosmetics arrive perfect across Sri Lanka.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <p className="text-muted-foreground leading-relaxed">
              All packages insured with tracking. Damaged items? Contact us for replacement.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Sri Lanka Coverage</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
            Fast delivery to Colombo, Kandy, Galle, Jaffna & island wide.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-secondary font-semibold">•</span>
              <span className="text-muted-foreground">
                <strong>Colombo:</strong> 1-3 business days
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-secondary font-semibold">•</span>
              <span className="text-muted-foreground">
                <strong>Kandy/Galle:</strong> 2-4 business days
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-secondary font-semibold">•</span>
              <span className="text-muted-foreground">
                <strong>Outstation:</strong> 3-5 business days nationwide
              </span>
            </li>
          </ul>
          <p className="text-center mt-8 text-lg">
            <Link href="/lipstick" className="text-primary hover:underline font-semibold">
              Shop lipsticks →
            </Link>{" "}
            |{" "}
            <Link href="/skincare" className="text-primary hover:underline font-semibold">
              Shop skincare →
            </Link>
          </p>
        </section>
      </div>
    </BlogPageLayout>
  )
}
