import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Refund Policy Sri Lanka | Cosmetics Returns – Alzìa",
  description: "Cosmetics refund policy Sri Lanka. Unopened sealed products returnable within 30 days. No refunds on opened beauty products or damaged seals.",
}

export default function RefundPage() {
  return (
    <BlogPageLayout
      title="Refund Policy – Alzìa Cosmetics Sri Lanka"
      subtitle="Returns for unopened cosmetics within 30 days. No refunds on opened products or broken seals."
      readTime="3 min read"
    >
      <div className="space-y-12 md:space-y-16">
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            30-Day Return Policy Sri Lanka (Unopened Only)
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Return <strong>unopened cosmetics with intact seals</strong> within 30 days of Sri Lanka delivery for full refund.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Eligible Returns Sri Lanka
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            Only these cosmetics qualify for refund:
          </p>
          <div className="space-y-4">
            {[
              "Unopened products with intact factory seals",
              "Original packaging & labels complete",
              "Proof of purchase (Alzìa order number)",
              "Within 30 days of island wide delivery",
            ].map((condition, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-4 border-l-4 border-secondary flex gap-3">
                <span className="text-primary font-semibold text-xl flex-shrink-0">✓</span>
                <span className="text-muted-foreground">{condition}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Non-Refundable Cosmetics Sri Lanka
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            No refunds for beauty products that:
          </p>
          <div className="space-y-4">
            {[
              "Opened or used (hygiene regulations)",
              "Broken/damaged seals or packaging",
              "Sale/clearance cosmetics items",
              "Customized/personalized products",
            ].map((condition, idx) => (
              <div key={idx} className="bg-destructive/10 rounded-lg p-4 border-l-4 border-destructive flex gap-3">
                <span className="text-destructive font-semibold text-xl flex-shrink-0">✗</span>
                <span className="text-muted-foreground">{condition}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            How to Return Cosmetics Sri Lanka
          </h2>
          <ol className="space-y-6">
            <li className="bg-muted/30 rounded-lg p-6 border-l-4 border-accent">
              <span className="font-semibold text-foreground block mb-2">1. Contact Support</span>
              <p className="text-muted-foreground text-sm">
                Email hello@alzianaturals.com with order number & photos of unopened seal.
              </p>
            </li>
            <li className="bg-muted/30 rounded-lg p-6 border-l-4 border-accent">
              <span className="font-semibold text-foreground block mb-2">2. Return Label</span>
              <p className="text-muted-foreground text-sm">Prepaid label for island wide return shipping.</p>
            </li>
            <li className="bg-muted/30 rounded-lg p-6 border-l-4 border-accent">
              <span className="font-semibold text-foreground block mb-2">3. Ship Back</span>
              <p className="text-muted-foreground text-sm">Send unopened cosmetics securely within 30 days.</p>
            </li>
            <li className="bg-muted/30 rounded-lg p-6 border-l-4 border-accent">
              <span className="font-semibold text-foreground block mb-2">4. Get Refund</span>
              <p className="text-muted-foreground text-sm">Processed 7-10 business days after inspection.</p>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Refund Timeline Sri Lanka
          </h2>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span className="text-muted-foreground">
                  <strong>Processing:</strong> 7-10 business days after Sri Lanka receipt
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span className="text-muted-foreground">
                  <strong>Method:</strong> Original payment credited
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span className="text-muted-foreground">
                  <strong>Shipping:</strong> Free returns for unopened cosmetics (our prepaid label)
                </span>
              </li>
            </ul>
          </div>
        </section>

        <div className="mt-16 bg-secondary/5 border border-secondary/20 rounded-xl p-8 text-center">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
            Cosmetics Refund Help Sri Lanka?
          </h3>
          <p className="text-muted-foreground mb-6">
            Contact for unopened product returns island wide.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-medium hover:bg-secondary/90 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </BlogPageLayout>
  )
}
