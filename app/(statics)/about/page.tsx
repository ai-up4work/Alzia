import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Alzìa Cosmetics Sri Lanka | Premium Makeup & Skincare",
  description: "Alzìa Cosmetics Sri Lanka: premium makeup, skincare & beauty products for Sri Lankan skin types. Fast island wide delivery.",
  openGraph: {
    title: "About Alzìa Cosmetics Sri Lanka",
    description: "Premium cosmetics brand for Sri Lanka – makeup, skincare, island wide delivery",
  },
}

export default function AboutPage() {
  return (
    <BlogPageLayout
      title="About Alzìa Cosmetics Sri Lanka"
      subtitle="Premium makeup & skincare crafted for Sri Lankan beauty. Fast island wide delivery from Colombo."
      publishDate="January 2026"
      readTime="5 min read"
    >
      <div className="space-y-12 md:space-y-16">
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Premium Cosmetics Sri Lanka
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
            Alzìa Cosmetics Sri Lanka delivers premium makeup & skincare for Sri Lankan skin types. From Colombo to 
            island wide, we bring quality beauty products with 1-5 day delivery.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            High quality ingredients meet Sri Lanka climate needs – humidity, sun protection, diverse skin tones.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">
            Why Choose Alzìa Sri Lanka
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/50 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">🌞</span> Sri Lanka Climate
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Humidity-proof makeup, SPF skincare, long-lasting formulas for tropical climate.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">🇱🇰</span> Sri Lankan Skin Tones
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Foundation shades for fair to deep Sri Lankan complexions. Inclusive beauty.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">🚚</span> Fast Island Wide
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Colombo 1-3 days, Kandy/Galle 2-4 days, nationwide 1-5 business days.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">✅</span> NMRA Compliant
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Sri Lanka cosmetics regulation approved. Safe quality products.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
            Our Cosmetics Commitment Sri Lanka
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
            Alzìa Cosmetics Sri Lanka serves diverse beauty needs – bridal makeup, daily skincare, acne solutions, 
            anti-aging for tropical skin.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Fast delivery + quality products = confidence for Sri Lankan women.
          </p>
        </section>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 mt-16">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-4">
            Shop Sri Lanka Cosmetics
          </h3>
          <p className="text-muted-foreground mb-6">
            Premium makeup & skincare with island wide delivery.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Shop All Products
          </Link>
        </div>
      </div>
    </BlogPageLayout>
  )
}
