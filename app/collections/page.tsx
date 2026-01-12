import Link from "next/link"
import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"

export const metadata: Metadata = {
  title: "Collections — Alzìa Paris | Curated Beauty Collections",
  description: "Explore our curated beauty collections. From skincare to fragrance, find your perfect products.",
}

const collections = [
  {
    id: "skincare-essentials",
    name: "Skincare Essentials",
    description:
      "The foundation of radiant skin. Our bestselling skincare collection featuring cleansers, serums, and moisturizers.",
    image: "/luxury-skincare.png",
    products: 12,
    href: "/shop?categories=skincare",
    icon: "✨",
  },
  {
    id: "makeup-artistry",
    name: "Makeup Artistry",
    description:
      "Express yourself with our color and beauty collection. From everyday to evening, find your perfect shades.",
    image: "/diverse-makeup-collection.png",
    products: 18,
    href: "/shop?categories=makeup",
    icon: "💄",
  },
  {
    id: "fragrance-journey",
    name: "Fragrance Journey",
    description: "Discover scents that tell your story. Our exclusive fragrance collection for every mood and moment.",
    image: "/perfume-collection.jpg",
    products: 8,
    href: "/shop?categories=fragrance",
    icon: "🌸",
  },
  {
    id: "gift-sets",
    name: "Gift Sets",
    description: "Perfect gifts for the beauty lover. Thoughtfully curated sets with elegant packaging.",
    image: "/luxury-gift-sets.jpg",
    products: 6,
    href: "/shop?categories=gifts",
    icon: "🎁",
  },
  {
    id: "natural-beauty",
    name: "Natural Beauty",
    description: "Pure, natural ingredients. Our collection of botanical and clean beauty products.",
    image: "/natural-beauty-products.png",
    products: 15,
    href: "/shop?search=natural",
    icon: "🌿",
  },
  {
    id: "bestsellers",
    name: "Bestsellers",
    description: "Customer favorites that deliver results. Discover why these products are loved worldwide.",
    image: "/bestselling-beauty-products.jpg",
    products: 20,
    href: "/shop?sort=bestselling",
    icon: "⭐",
  },
]

export default function CollectionsPage() {
  return (
    <BlogPageLayout
      title="Collections"
      subtitle="Curated collections designed to meet every beauty need. Explore our most popular groupings and find products that speak to you."
      readTime="3 min read"
    >
      <div className="space-y-16">
        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={collection.href}
              className="group rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <div className="relative h-64 overflow-hidden bg-muted">
                <img
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              </div>
              <div className="p-6 bg-muted/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-3xl mr-2">{collection.icon}</span>
                    <h3 className="font-serif text-xl font-medium text-foreground">{collection.name}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{collection.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground font-medium">{collection.products} Products</span>
                  <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-2xl p-12 text-center">
          <h3 className="font-serif text-3xl font-medium text-foreground mb-4">Not Sure Where to Start?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our skincare essentials collection is perfect for anyone looking to build a solid beauty foundation with
            timeless, effective products.
          </p>
          <Link
            href="/shop?categories=skincare"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Explore Skincare Essentials
          </Link>
        </div>
      </div>
    </BlogPageLayout>
  )
}
