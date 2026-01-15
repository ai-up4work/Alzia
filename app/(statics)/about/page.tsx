import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Our Story — Alzìa Paris | Luxury Beauty Brand",
  description:
    "Discover the heritage, values, and commitment behind Alzìa Paris luxury cosmetics. Crafted in Paris with passion for timeless elegance.",
  openGraph: {
    title: "Our Story — Alzìa Paris",
    description: "Heritage and values behind Alzìa Paris luxury cosmetics",
  },
}

export default function AboutPage() {
  return (
    <BlogPageLayout
      title="Our Story"
      subtitle="From the heart of Paris, we crafted a beauty philosophy rooted in elegance, authenticity, and timeless sophistication."
      publishDate="2024"
      readTime="5 min read"
    >
      <div className="space-y-12 md:space-y-16">
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Heritage & Craftsmanship</h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
            Alzìa Paris was founded on the belief that beauty is not merely appearance—it's a reflection of self-care,
            confidence, and personal expression. Our founders, inspired by Parisian elegance and botanical wisdom,
            created a collection that honors both tradition and innovation.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Every product is meticulously crafted using the finest ingredients, combining centuries of beauty knowledge
            with modern scientific research. We source botanicals from sustainable suppliers worldwide, ensuring quality
            without compromise.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/50 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">✨</span> Authenticity
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe in transparency. Every ingredient, every formula, every promise is backed by rigorous testing
                and genuine commitment to your beauty journey.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">🌿</span> Sustainability
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our packaging is eco-conscious, our sourcing is ethical, and our production respects both people and the
                planet.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">💎</span> Elegance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Beauty should be sophisticated yet accessible. Our products deliver luxury without pretense, performance
                without compromise.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 border border-border hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="text-2xl">🔬</span> Innovation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We continuously evolve, combining traditional beauty wisdom with cutting-edge research to deliver
                exceptional results.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Our Commitment</h2>
          <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
            At Alzìa Paris, we're committed to helping you feel confident and beautiful. Whether you're starting a
            skincare routine or refining your signature look, our products are designed to work with your unique beauty.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            We celebrate diversity, support self-care as self-love, and believe that true beauty comes from feeling
            comfortable in your own skin.
          </p>
        </section>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 mt-16">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Experience Alzìa</h3>
          <p className="text-muted-foreground mb-6">
            Discover our complete collection and find products that celebrate your unique beauty.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </BlogPageLayout>
  )
}
