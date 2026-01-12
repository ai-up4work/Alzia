import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Refund & Returns Policy — Alzìa Paris",
  description: "Understand our refund and return policies. Your satisfaction is our priority.",
}

export default function RefundPage() {
  return (
    <BlogPageLayout
      title="Refund & Returns Policy"
      subtitle="We want you to be completely satisfied with your Alzìa purchase. Here's how our returns and refunds work."
      readTime="3 min read"
    >
      <div className="space-y-12 md:space-y-16">
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">30-Day Return Guarantee</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We offer a hassle-free 30-day return policy. If you're not completely satisfied with your purchase, you can
            return it within 30 days of delivery for a full refund, no questions asked.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Return Conditions</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            Items must meet the following conditions to be eligible for return:
          </p>
          <div className="space-y-4">
            {[
              "Unused or unopened in original packaging",
              "All original tags and seals intact",
              "Proof of purchase (order number or receipt)",
              "Returned within 30 days of delivery",
            ].map((condition, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-4 border-l-4 border-secondary flex gap-3">
                <span className="text-primary font-semibold text-xl flex-shrink-0">✓</span>
                <span className="text-muted-foreground">{condition}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">How to Initiate a Return</h2>
          <ol className="space-y-6">
            <li className="bg-muted/30 rounded-lg p-6 border-l-4 border-accent">
              <span className="font-semibold text-foreground block mb-2">1. Contact Our Team</span>
              <p className="text-muted-foreground text-sm">
                Email us at hello@alzianaturals.com with your order number and reason for return.
              </p>
            </li>
            <li className="bg-muted/30 rounded-lg p-6 border-l-4 border-accent">
              <span className="font-semibold text-foreground block mb-2">2. Receive Return Label</span>
              <p className="text-muted-foreground text-sm">We'll provide you with a prepaid return shipping label.</p>
            </li>
            <li className="bg-muted/30 rounded-lg p-6 border-l-4 border-accent">
              <span className="font-semibold text-foreground block mb-2">3. Ship Your Return</span>
              <p className="text-muted-foreground text-sm">
                Package your item securely and ship it using the provided label.
              </p>
            </li>
            <li className="bg-muted/30 rounded-lg p-6 border-l-4 border-accent">
              <span className="font-semibold text-foreground block mb-2">4. Receive Your Refund</span>
              <p className="text-muted-foreground text-sm">
                Once received and inspected, your refund will be processed within 7-10 business days.
              </p>
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Refund Timeline</h2>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span className="text-muted-foreground">
                  <strong>Processing:</strong> 7-10 business days after we receive your return
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span className="text-muted-foreground">
                  <strong>Credit:</strong> Refunds are credited to the original payment method
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span className="text-muted-foreground">
                  <strong>Shipping:</strong> Original shipping costs are non-refundable unless the return is due to our
                  error
                </span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Exceptions & Special Cases
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            Certain items may have different return policies:
          </p>
          <ul className="space-y-3">
            {[
              "Customized or made-to-order products cannot be returned",
              "Gift sets may have restricted return options",
              "Used or damaged products (not due to shipping) are non-returnable",
              "Clearance items are final sale",
            ].map((exception, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-secondary font-semibold flex-shrink-0">▶</span>
                <span className="text-muted-foreground">{exception}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 bg-secondary/5 border border-secondary/20 rounded-xl p-8 text-center">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-3">Have Questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our customer support team is here to help with any return or refund inquiries.
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
