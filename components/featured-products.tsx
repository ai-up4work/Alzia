"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, ShoppingBag, Star, Check } from "lucide-react"
import { ScrollBlurText } from "@/components/scroll-blur-text"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import Link from "next/link"
import type { Product } from "@/lib/types"

// Mock featured products - will be replaced with database data
const featuredProducts = [
  {
    id: "p1111111-1111-1111-1111-111111111111",
    name: "Radiance Renewal Serum",
    slug: "radiance-renewal-serum",
    short_description: "Brightening vitamin C serum",
    retail_price: 2450,
    image: "/luxury-serum-bottle-vitamin-c-gold-elegant.jpg",
    category: { name: "Skincare", slug: "skincare" },
    rating_avg: 4.8,
    rating_count: 124,
    stock_quantity: 50,
    isNew: true,
  },
  {
    id: "p2222222-2222-2222-2222-222222222222",
    name: "Hydra-Silk Moisturizer",
    slug: "hydra-silk-moisturizer",
    short_description: "72-hour hydrating cream",
    retail_price: 1850,
    image: "/luxury-moisturizer-cream-jar-elegant-rose.jpg",
    category: { name: "Skincare", slug: "skincare" },
    rating_avg: 4.6,
    rating_count: 89,
    stock_quantity: 35,
    isNew: false,
  },
  {
    id: "p3333333-3333-3333-3333-333333333333",
    name: "Velvet Rouge Lipstick",
    slug: "velvet-rouge-lipstick",
    short_description: "Long-wearing velvet finish",
    retail_price: 1200,
    image: "/luxury-lipstick-red-velvet-elegant-gold-case.jpg",
    category: { name: "Makeup", slug: "makeup" },
    rating_avg: 4.7,
    rating_count: 156,
    stock_quantity: 100,
    isNew: true,
  },
  {
    id: "p4444444-4444-4444-4444-444444444444",
    name: "Eau de Rose Parfum",
    slug: "eau-de-rose-parfum",
    short_description: "Elegant rose eau de parfum",
    retail_price: 4500,
    image: "/luxury-perfume-bottle-rose-elegant-parisian.jpg",
    category: { name: "Fragrance", slug: "fragrance" },
    rating_avg: 4.9,
    rating_count: 67,
    stock_quantity: 20,
    isNew: false,
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price)
}

export function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const router = useRouter()
  const { addItem } = useCart()

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

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()

    setAddingToCart(product.id)

    // Convert to Product type for cart
    const cartProduct = {
      ...product,
      images: product.image ? [{ id: 1, image_url: product.image }] : [],
    } as Product

    // Add to cart
    addItem(cartProduct, 1)

    // Show success toast
    toast.success('Added to cart!', {
      description: product.name,
      action: {
        label: "View Cart",
        onClick: () => router.push("/account/cart"),
      },
    })

    // Reset adding state
    setTimeout(() => {
      setAddingToCart(null)
    }, 1000)
  }

  const handleWishlist = (e: React.MouseEvent, productName: string) => {
    e.preventDefault()
    e.stopPropagation()
    toast.info('Wishlist feature coming soon!', {
      description: productName,
    })
  }

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
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                      New
                    </span>
                  )}
                  <button
                    onClick={(e) => handleWishlist(e, product.name)}
                    className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background border border-border/30 shadow-lg"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4 text-foreground" />
                  </button>

                  {/* Stock indicator for low stock */}
                  {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                    <span className="absolute bottom-3 left-3 bg-orange-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                      Only {product.stock_quantity} left
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4 lg:p-5">
                  <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-serif text-base lg:text-lg text-foreground font-medium mb-1 hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{product.short_description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    <span className="text-xs font-medium text-foreground">{product.rating_avg}</span>
                    <span className="text-xs text-muted-foreground">({product.rating_count})</span>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{formatPrice(product.retail_price)}</span>
                    <Button
                      size="sm"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.stock_quantity === 0 || addingToCart === product.id}
                      className="h-8 w-8 p-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                      aria-label="Add to cart"
                    >
                      {addingToCart === product.id ? (
                        <Check className="w-4 h-4 animate-in zoom-in" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
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