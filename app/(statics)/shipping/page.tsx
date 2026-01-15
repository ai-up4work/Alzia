import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping Sri Lanka | Cosmetics Delivery 1 to 5 Days Island Wide – Alzìa",
  description:
    "Fast island wide cosmetics delivery in Sri Lanka from Alzìa. Makeup & beauty products delivered 1 to 5 business days nationwide. Free shipping over LKR 10,000.",
}

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <span className="inline-block text-sm font-medium text-primary mb-4 tracking-widest uppercase">Delivery</span>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight font-light text-foreground mb-8 text-balance">
            Fast Island Wide Shipping
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
            Fast cosmetics delivery across Colombo, Kandy, Galle and nationwide for your makeup and skincare orders.
          </p>
        </div>
      </section>

      <div className="border-b border-border" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="space-y-20 md:space-y-28">
          {/* Delivery Times */}
          <section className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Delivery Times Sri Lanka
            </h2>
            <div className="space-y-4">
              {[
                { title: "Island Wide Delivery", desc: "1-5 business days nationwide" },
                { title: "Express Colombo", desc: "1-3 business days" },
                { title: "Kandy & Galle", desc: "2-4 business days" },
                { title: "Outstation", desc: "3-5 business days" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-card border-l-4 border-primary rounded-xl p-8 hover:border-primary/60 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-serif text-2xl font-light text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-lg">{item.desc}</p>
                  <div className="mt-4 w-10 h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Costs */}
          <section className="space-y-8 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-10 md:p-12 border border-secondary/20">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">Shipping Costs</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Affordable rates for cosmetics delivery across Sri Lanka. Shown at checkout.
            </p>
            <ul className="space-y-4">
              {[
                "Free shipping on orders over LKR 10,000 island wide",
                "Flat rates: Colombo LKR 500, Outstation LKR 800-1200",
                "Tracking for all makeup and skincare orders",
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 text-muted-foreground text-lg">
                  <span className="text-primary font-semibold flex-shrink-0">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Packaging & Care */}
          <section className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Packaging & Cosmetics Care
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Premium packaging ensures your Alzìa cosmetics arrive perfect across Sri Lanka. All packages are insured
              with tracking.
            </p>
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 md:p-10">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Damaged items during transit? Contact us immediately for a replacement at no cost to you.
              </p>
            </div>
          </section>

          {/* Sri Lanka Coverage Map */}
          <section className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Coverage Across Sri Lanka
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We deliver to Colombo, Kandy, Galle, Jaffna and every corner of the island.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Colombo", desc: "1-3 business days" },
                { title: "Kandy & Galle", desc: "2-4 business days" },
                { title: "Island Wide", desc: "3-5 business days" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg transition-all"
                >
                  <h3 className="font-serif text-xl font-light text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
