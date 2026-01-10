"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, ShoppingBag, Star } from "lucide-react"
import { ScrollBlurText } from "@/components/scroll-blur-text"
import Link from "next/link"

// Mock featured products - will be replaced with database data
const featuredProducts = [
  {
    id: "p1111111-1111-1111-1111-111111111111",
    name: "Radiance Renewal Serum",
    slug: "radiance-renewal-serum",
    shortDescription: "Brightening vitamin C serum",
    retailPrice: 2450,
    image: "/luxury-serum-bottle-vitamin-c-gold-elegant.jpg",
    category: "Skincare",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
  },
  {
    id: "p2222222-2222-2222-2222-222222222222",
    name: "Hydra-Silk Moisturizer",
    slug: "hydra-silk-moisturizer",
    shortDescription: "72-hour hydrating cream",
    retailPrice: 1850,
    image: "/luxury-moisturizer-cream-jar-elegant-rose.jpg",
    category: "Skincare",
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
  },
  {
    id: "p3333333-3333-3333-3333-333333333333",
    name: "Velvet Rouge Lipstick",
    slug: "velvet-rouge-lipstick",
    shortDescription: "Long-wearing velvet finish",
    retailPrice: 1200,
    image: "/luxury-lipstick-red-velvet-elegant-gold-case.jpg",
    category: "Makeup",
    rating: 4.7,
    reviewCount: 156,
    isNew: true,
  },
  {
    id: "p4444444-4444-4444-4444-444444444444",
    name: "Eau de Rose Parfum",
    slug: "eau-de-rose-parfum",
    shortDescription: "Elegant rose eau de parfum",
    retailPrice: 4500,
    image: "/luxury-perfume-bottle-rose-elegant-parisian.jpg",
    category: "Fragrance",
    rating: 4.9,
    reviewCount: 67,
    isNew: false,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="featured" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 lg:mb-20 gap-6">
          <div>
            <p className="reveal opacity-0 text-sm uppercase tracking-[0.25em] text-secondary font-medium mb-4">
              Bestsellers
            </p>
            <ScrollBlurText
              text="Most loved products"
              className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground text-balance font-light"
            />
          </div>
          <Button
            asChild
            variant="ghost"
            className="reveal opacity-0 animation-delay-400 text-primary hover:text-primary hover:bg-primary/10 group self-start md:self-auto"
          >
            <Link href="/shop">
              View all products
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`reveal opacity-0 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : index === 3 ? "animation-delay-600" : ""} group`}
            >
              <div className="bg-card rounded-2xl lg:rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all duration-500">
                {/* Image */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative block aspect-square overflow-hidden bg-muted"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.isNew && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                      New
                    </span>
                  )}
                  <button
                    className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4 text-foreground" />
                  </button>
                </Link>

                {/* Content */}
                <div className="p-4 lg:p-5">
                  <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-base lg:text-lg text-foreground font-medium mb-1 hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{product.shortDescription}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-xs font-medium text-foreground">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{formatPrice(product.retailPrice)}</span>
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
