import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Refund Policy Sri Lanka | Cosmetics Returns – Alzìa",
  description:
    "Cosmetics refund policy Sri Lanka. Unopened sealed products returnable within 30 days. No refunds on opened beauty products or damaged seals.",
}

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <span className="inline-block text-sm font-medium text-secondary mb-4 tracking-widest uppercase">
            Peace of Mind
          </span>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight font-light text-foreground mb-8 text-balance">
            Refund Policy
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
            Returns for unopened cosmetics within 30 days. No refunds on opened products or broken seals.
          </p>
        </div>
      </section>

      <div className="border-b border-border" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="space-y-20 md:space-y-28">
          {/* 30-Day Return Policy */}
          <section className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              30-Day Return Policy
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Return unopened cosmetics with intact seals within 30 days of Sri Lanka delivery for full refund.
            </p>
          </section>

          {/* Eligible Returns */}
          <section className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Eligible Returns
            </h2>
            <div className="space-y-4">
              {[
                "Unopened products with intact factory seals",
                "Original packaging and labels complete",
                "Proof of purchase with Alzìa order number",
                "Within 30 days of island wide delivery",
              ].map((condition, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-secondary/10 to-transparent border-l-4 border-secondary rounded-xl p-6 flex gap-4"
                >
                  <span className="text-secondary font-semibold text-2xl flex-shrink-0">+</span>
                  <span className="text-muted-foreground text-lg">{condition}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Non-Refundable Items */}
          <section className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Non-Refundable Cosmetics
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">No refunds for beauty products that:</p>
            <div className="space-y-4">
              {[
                "Opened or used (hygiene regulations)",
                "Have broken or damaged seals or packaging",
                "Are sale or clearance cosmetics items",
                "Are customized or personalized products",
              ].map((condition, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-destructive/10 to-transparent border-l-4 border-destructive rounded-xl p-6 flex gap-4"
                >
                  <span className="text-destructive font-semibold text-2xl flex-shrink-0">−</span>
                  <span className="text-muted-foreground text-lg">{condition}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How to Return */}
          <section className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              How to Return Cosmetics
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: "Step 1",
                  title: "Contact Support",
                  desc: "Email hello@alziagroup.lk with order number and photos of unopened seal.",
                },
                {
                  step: "Step 2",
                  title: "Return Label",
                  desc: "We'll send you a prepaid label for island wide return shipping.",
                },
                {
                  step: "Step 3",
                  title: "Ship Back",
                  desc: "Send unopened cosmetics securely within 30 days of purchase.",
                },
                { step: "Step 4", title: "Get Refund", desc: "Processed 7-10 business days after our inspection." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card border-l-4 border-primary rounded-xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 items-start">
                    <span className="text-primary font-serif text-3xl font-light flex-shrink-0">{item.step}</span>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Refund Timeline */}
          <section className="space-y-6 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-10 md:p-12 border border-primary/20">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">Refund Timeline</h2>
            <div className="space-y-4">
              {[
                { label: "Processing", value: "7-10 business days after Sri Lanka receipt" },
                { label: "Method", value: "Original payment method credited" },
                { label: "Shipping", value: "Free returns for unopened cosmetics with our prepaid label" },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-primary/10 last:border-0">
                  <span className="text-primary font-semibold flex-shrink-0">•</span>
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">{item.label}:</strong> {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="relative overflow-hidden rounded-3xl p-12 md:p-16 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-4">
                Need Help With a Return?
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Contact our support team for unopened product returns island wide.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-secondary text-secondary-foreground px-10 py-4 rounded-full font-medium hover:bg-secondary/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Contact Support
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
