import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Alzìa Cosmetics Sri Lanka | Premium Makeup & Skincare",
  description:
    "Alzìa Cosmetics Sri Lanka: premium makeup, skincare & beauty products for Sri Lankan skin types. Fast island wide delivery.",
  openGraph: {
    title: "About Alzìa Cosmetics Sri Lanka",
    description: "Premium cosmetics brand for Sri Lanka – makeup, skincare, island wide delivery",
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <span className="inline-block text-sm font-medium text-secondary mb-4 tracking-widest uppercase">
            Our Story
          </span>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight font-light text-foreground mb-8 text-balance">
            Luxury Beauty Crafted for Sri Lanka
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
            Premium makeup and skincare designed specifically for Sri Lankan skin types, climates, and beauty needs.
            Fast island wide delivery from Colombo.
          </p>
        </div>
      </section>

      <div className="border-b border-border" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="space-y-20 md:space-y-32">
          {/* Premium Cosmetics Section */}
          <section className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div className="space-y-6">
              <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
                Premium Cosmetics Engineered for Tropical Climates
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Alzìa Cosmetics Sri Lanka delivers premium makeup and skincare formulated for Sri Lankan beauty. From
                Colombo to island wide, we bring quality beauty products with 1-5 day delivery.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                High quality ingredients meet Sri Lanka climate needs – humidity-proof formulas, SPF protection, and
                diverse foundation shades for all skin tones.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 border border-primary/20">
              <div className="space-y-4">
                <p className="text-sm font-medium text-secondary tracking-widest uppercase">Key Features</p>
                <ul className="space-y-4">
                  {[
                    "Humidity-resistant formulas",
                    "Broad SPF protection",
                    "Diverse shade ranges",
                    "NMRA compliant",
                    "1-5 day delivery",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex gap-3 text-muted-foreground">
                      <span className="text-primary font-semibold text-lg flex-shrink-0">+</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className="space-y-12">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
                Why Choose Alzìa Sri Lanka
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Sri Lanka Climate",
                  desc: "Humidity-proof makeup, SPF skincare, long-lasting formulas for tropical climate.",
                },
                {
                  title: "Sri Lankan Skin Tones",
                  desc: "Foundation shades for fair to deep Sri Lankan complexions. Inclusive beauty.",
                },
                {
                  title: "Fast Island Wide",
                  desc: "Colombo 1-3 days, Kandy/Galle 2-4 days, nationwide 1-5 business days.",
                },
                { title: "NMRA Compliant", desc: "Sri Lanka cosmetics regulation approved. Safe quality products." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-card border border-border rounded-2xl p-8 md:p-10 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-serif text-2xl font-light text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                  <div className="mt-6 w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>

          {/* Commitment Section */}
          <section className="space-y-8 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl p-12 md:p-16 border border-primary/10">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Our Commitment to Sri Lankan Beauty
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Alzìa Cosmetics Sri Lanka serves diverse beauty needs – from bridal makeup to daily skincare, acne
                solutions, and anti-aging for tropical skin.
              </p>
              <p className="font-light">
                Quality products paired with fast island-wide delivery means confidence for every Sri Lankan woman.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl p-12 md:p-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="relative z-10">
              <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-6">
                Shop Sri Lanka Cosmetics
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Premium makeup and skincare with island wide delivery in 1-5 business days.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full font-medium hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Explore All Products
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
