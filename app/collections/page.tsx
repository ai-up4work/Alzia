import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, ChevronRight } from "lucide-react"

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
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Collections</span>
          </nav>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-light mb-4">
              Collections
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-3xl">
              Curated collections designed to meet every beauty need. Explore our most popular groupings and find products that speak to you.
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={collection.href}
                className="group bg-card rounded-2xl lg:rounded-3xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden bg-muted">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-lg">
                    {collection.icon}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="font-serif text-xl lg:text-2xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-2">
                    {collection.description}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {collection.products} Products
                    </span>
                    <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Featured CTA Section */}
          <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-border/50 rounded-2xl lg:rounded-3xl p-8 md:p-12 lg:p-16 mb-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                <span className="text-3xl">✨</span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">
                Not Sure Where to Start?
              </h2>
              
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                Our skincare essentials collection is perfect for anyone looking to build a solid beauty foundation with
                timeless, effective products.
              </p>
              
              <Link
                href="/shop?categories=skincare"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all"
              >
                <span>Explore Skincare Essentials</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-medium text-foreground mb-2">Curated Selection</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Each collection is thoughtfully curated by our beauty experts
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h4 className="font-medium text-foreground mb-2">Premium Quality</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Only the finest ingredients and formulations make it to our collections
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h4 className="font-medium text-foreground mb-2">Proven Results</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Customer-tested and loved by thousands worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}