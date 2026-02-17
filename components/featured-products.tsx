"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, ShoppingBag, Star, Check, AlertCircle, TrendingUp, Flame } from "lucide-react"
import { ScrollBlurText } from "@/components/scroll-blur-text"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { toast } from "sonner"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})

interface ProductImage {
  id: string
  image_url: string
  is_primary?: boolean
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Brand {
  id: string
  name: string
  slug: string
}

interface OrderStats {
  product_id: string
  order_count: number
  total_quantity_sold: number
  total_revenue: number
  quantity_sold_last_30d?: number
}

interface ProductWithRelations extends Product {
  images?: ProductImage[]
  category?: Category
  brand?: Brand
  isNew?: boolean
  orderStats?: OrderStats
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price)
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

export function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null)
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [useMatView, setUseMatView] = useState(true)
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  useEffect(() => {
    if (!loading) {
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
    }
  }, [loading])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      if (useMatView) {
        try {
          await fetchWithMaterializedView()
          return
        } catch (err: any) {
          console.warn('Materialized view not available, falling back:', err)
          setUseMatView(false)
        }
      }

      await fetchWithDirectQuery()

    } catch (err: any) {
      console.error('Error fetching featured products:', err)
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchWithMaterializedView = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        sku,
        name,
        slug,
        short_description,
        retail_price,
        stock_quantity,
        rating_avg,
        rating_count,
        is_featured,
        created_at,
        category:categories (
          id,
          name,
          slug
        ),
        brand:brands (
          id,
          name,
          slug
        ),
        images:product_images (
          id,
          image_url,
          is_primary
        )
      `)
      .eq('status', 'published')
      .gte('stock_quantity', 1)

    if (error) throw error

    const productIds = data?.map(p => p.id) || []
    
    const { data: statsData, error: statsError } = await supabase
      .from('product_order_stats')
      .select('*')
      .in('product_id', productIds)

    if (statsError) throw statsError

    const processedProducts = processProducts(data || [], statsData || [])
    setProducts(processedProducts.slice(0, 8))
  }

  const fetchWithDirectQuery = async () => {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        sku,
        name,
        slug,
        short_description,
        retail_price,
        stock_quantity,
        rating_avg,
        rating_count,
        is_featured,
        created_at,
        category:categories (
          id,
          name,
          slug
        ),
        brand:brands (
          id,
          name,
          slug
        ),
        images:product_images (
          id,
          image_url,
          is_primary
        )
      `)
      .eq('status', 'published')
      .gte('stock_quantity', 1)
      .limit(50)

    if (productsError) throw productsError

    const { data: orderItems, error: orderError } = await supabase
      .from('order_items')
      .select('product_id, quantity')
      .not('product_id', 'is', null)

    if (orderError) throw orderError

    const statsMap = new Map<string, any>()
    orderItems?.forEach(item => {
      if (!item.product_id) return
      const existing = statsMap.get(item.product_id) || {
        product_id: item.product_id,
        order_count: 0,
        total_quantity_sold: 0,
      }
      statsMap.set(item.product_id, {
        ...existing,
        order_count: existing.order_count + 1,
        total_quantity_sold: existing.total_quantity_sold + (item.quantity || 0),
      })
    })

    const statsArray = Array.from(statsMap.values())
    const processedProducts = processProducts(productsData || [], statsArray)
    setProducts(processedProducts.slice(0, 8))
  }

  const processProducts = (
    productsData: any[], 
    statsData: any[]
  ): ProductWithRelations[] => {
    const orderStatsMap = new Map<string, OrderStats>()
    statsData.forEach(stat => {
      orderStatsMap.set(stat.product_id, stat as OrderStats)
    })

    const processed = productsData.map(product => {
      const createdDate = new Date(product.created_at)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
      const isNew = daysDiff <= 30

      const sortedImages = product.images?.sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return 0
      })

      const orderStats = orderStatsMap.get(product.id)

      return {
        ...product,
        images: sortedImages,
        isNew,
        orderStats,
      } as ProductWithRelations
    })

    return processed.sort((a, b) => {
      const aSales = a.orderStats?.total_quantity_sold || 0
      const bSales = b.orderStats?.total_quantity_sold || 0
      
      if (bSales !== aSales) return bSales - aSales
      
      if (aSales === 0 && bSales === 0) {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
      }
      
      if (b.rating_avg !== a.rating_avg) return b.rating_avg - a.rating_avg
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  const getProductImage = (product: ProductWithRelations): string => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.is_primary)
      return primaryImage?.image_url || product.images[0].image_url
    }
    return '/placeholder.png'
  }

  const handleAddToCart = (e: React.MouseEvent, product: ProductWithRelations) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock_quantity === 0) {
      toast.error('Out of stock', {
        description: 'This product is currently unavailable'
      })
      return
    }

    setAddingToCart(product.id)
    addItem(product as Product, 1)

    toast.success('Added to cart!', {
      description: product.name,
      action: {
        label: "View Cart",
        onClick: () => router.push("/account/cart"),
      },
    })

    setTimeout(() => {
      setAddingToCart(null)
    }, 1000)
  }

  const handleWishlist = (e: React.MouseEvent, product: ProductWithRelations) => {
    e.preventDefault()
    e.stopPropagation()
    
    const inWishlist = isInWishlist(product.id)
    toggleItem(product as Product)
    
    if (inWishlist) {
      toast.success('Removed from wishlist', {
        description: product.name
      })
    } else {
      toast.success('Added to wishlist!', {
        description: product.name
      })
    }
  }

  const hasBestsellers = products.some(p => p.orderStats && p.orderStats.total_quantity_sold > 0)

  if (loading) {
    return (
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 lg:mb-20 gap-6">
            <div>
              <div className="h-4 w-24 bg-muted rounded mb-4 animate-pulse" />
              <div className="h-12 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-10 w-40 bg-muted rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border/50">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="flex justify-between">
                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-serif text-2xl text-foreground font-light mb-3">
            Unable to Load Products
          </h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchFeaturedProducts} variant="outline">
            Try Again
          </Button>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="font-serif text-2xl text-foreground font-light mb-3">
            No Featured Products Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Check back soon for our curated selection!
          </p>
          <Button asChild>
            <Link href="/shop">Browse All Products</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="featured" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 lg:mb-20 gap-6">
          <div>
            <p className="reveal opacity-0 text-sm uppercase tracking-[0.25em] text-secondary font-medium mb-4 flex items-center gap-2">
              {hasBestsellers && <TrendingUp className="w-3.5 h-3.5" />}
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.slice(0, 4).map((product, index) => {
            const isBestseller = product.orderStats && product.orderStats.total_quantity_sold > 10
            const soldCount = product.orderStats?.total_quantity_sold || 0
            const inWishlist = isInWishlist(product.id)

            return (
              <div
                key={product.id}
                className={`reveal opacity-0 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : index === 3 ? "animation-delay-600" : ""} group`}
              >
                <div className="bg-card rounded-2xl lg:rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all duration-500">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative block aspect-square overflow-hidden bg-muted"
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {isBestseller ? (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Bestseller
                      </span>
                    ) : product.isNew ? (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                        New
                      </span>
                    ) : product.is_featured ? (
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                        Featured
                      </span>
                    ) : null}

                    <button
                      onClick={(e) => handleWishlist(e, product)}
                      className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background border border-border/30 shadow-lg"
                      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
                    </button>

                    {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                      <span className="absolute bottom-3 left-3 bg-orange-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                        Only {product.stock_quantity} left
                      </span>
                    )}
                  </Link>

                  <div className="p-4 lg:p-5">
                    {/* {product.category && (
                      <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
                    )} */}
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-serif text-base lg:text-lg text-foreground font-medium mb-1 hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    {product.short_description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                        {product.short_description}
                      </p>
                    )}

                    {product.rating_count > 0 && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                        <span className="text-xs font-medium text-foreground">{product.rating_avg.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({product.rating_count})</span>
                      </div>
                    )}

                    {soldCount > 5 && (
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                          🔥 {formatNumber(soldCount)}+ sold
                        </span>
                      </div>
                    )}

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
            )
          })}
        </div>
      </div>
    </section>
  )
}