"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ScrollBlurText } from "@/components/scroll-blur-text"
import { AlertCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
})

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  display_order: number
  is_active: boolean
  order_stats?: {
    total_quantity_sold: number
    order_count: number
    total_revenue: number
  }
}

export function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMatView, setUseMatView] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!loading && categories.length > 0) {
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
  }, [loading, categories])

  const fetchCategories = async () => {
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
      console.error('Error fetching categories:', err)
      setError(err.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  /**
   * APPROACH 1: Use materialized view (FASTEST)
   * Uses product_order_stats to get category sales data
   */
  const fetchWithMaterializedView = async () => {
    // Fetch active top-level categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)

    if (categoriesError) throw categoriesError
    if (!categoriesData || categoriesData.length === 0) {
      setCategories([])
      return
    }

    // Get products with their order stats
    const { data: productsWithStats, error: productsError } = await supabase
      .from('products')
      .select(`
        category_id,
        id
      `)
      .eq('status', 'published')
      .gte('stock_quantity', 1)
      .in('category_id', categoriesData.map(c => c.id))

    if (productsError) throw productsError

    // Get order stats from materialized view
    const productIds = productsWithStats?.map(p => p.id) || []
    
    const { data: orderStats, error: statsError } = await supabase
      .from('product_order_stats')
      .select('product_id, total_quantity_sold, order_count, total_revenue')
      .in('product_id', productIds)

    if (statsError) throw statsError

    // Map products to categories and aggregate stats
    const categoryStatsMap = new Map<string, {
      total_quantity_sold: number
      order_count: number
      total_revenue: number
    }>()

    productsWithStats?.forEach(product => {
      const stats = orderStats?.find(s => s.product_id === product.id)
      if (!stats) return

      const existing = categoryStatsMap.get(product.category_id) || {
        total_quantity_sold: 0,
        order_count: 0,
        total_revenue: 0
      }

      categoryStatsMap.set(product.category_id, {
        total_quantity_sold: existing.total_quantity_sold + (stats.total_quantity_sold || 0),
        order_count: existing.order_count + (stats.order_count || 0),
        total_revenue: existing.total_revenue + parseFloat(stats.total_revenue || '0')
      })
    })

    const processedCategories = processCategories(categoriesData, categoryStatsMap)
    setCategories(processedCategories)
  }

  /**
   * APPROACH 2: Direct query (FALLBACK)
   * Queries order_items directly to calculate category sales
   */
  const fetchWithDirectQuery = async () => {
    // Fetch active top-level categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)

    if (categoriesError) throw categoriesError
    if (!categoriesData || categoriesData.length === 0) {
      setCategories([])
      return
    }

    // Get products for these categories
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, category_id')
      .eq('status', 'published')
      .gte('stock_quantity', 1)
      .in('category_id', categoriesData.map(c => c.id))

    if (productsError) throw productsError

    const productIds = productsData?.map(p => p.id) || []

    // Get order items for these products
    const { data: orderItems, error: orderError } = await supabase
      .from('order_items')
      .select('product_id, quantity, total_price')
      .in('product_id', productIds)
      .not('product_id', 'is', null)

    if (orderError) throw orderError

    // Calculate stats per product
    const productStatsMap = new Map<string, {
      total_quantity_sold: number
      order_count: number
      total_revenue: number
    }>()

    orderItems?.forEach(item => {
      if (!item.product_id) return
      
      const existing = productStatsMap.get(item.product_id) || {
        total_quantity_sold: 0,
        order_count: 0,
        total_revenue: 0
      }

      productStatsMap.set(item.product_id, {
        total_quantity_sold: existing.total_quantity_sold + (item.quantity || 0),
        order_count: existing.order_count + 1,
        total_revenue: existing.total_revenue + parseFloat(item.total_price || '0')
      })
    })

    // Aggregate stats per category
    const categoryStatsMap = new Map<string, {
      total_quantity_sold: number
      order_count: number
      total_revenue: number
    }>()

    productsData?.forEach(product => {
      const productStats = productStatsMap.get(product.id)
      if (!productStats) return

      const existing = categoryStatsMap.get(product.category_id) || {
        total_quantity_sold: 0,
        order_count: 0,
        total_revenue: 0
      }

      categoryStatsMap.set(product.category_id, {
        total_quantity_sold: existing.total_quantity_sold + productStats.total_quantity_sold,
        order_count: existing.order_count + productStats.order_count,
        total_revenue: existing.total_revenue + productStats.total_revenue
      })
    })

    const processedCategories = processCategories(categoriesData, categoryStatsMap)
    setCategories(processedCategories)
  }

  /**
   * Common processing logic
   * Adds order stats and sorts categories
   */
  const processCategories = (
    categoriesData: any[],
    categoryStatsMap: Map<string, any>
  ): Category[] => {
    return categoriesData
      .map(category => ({
        ...category,
        order_stats: categoryStatsMap.get(category.id) || {
          total_quantity_sold: 0,
          order_count: 0,
          total_revenue: 0
        }
      }))
      // Sort by sales performance, then display_order, then name
      .sort((a, b) => {
        const aSales = a.order_stats?.total_quantity_sold || 0
        const bSales = b.order_stats?.total_quantity_sold || 0
        
        // Primary: Most sold categories first
        if (bSales !== aSales) return bSales - aSales
        
        // Secondary: Display order
        if (a.display_order !== b.display_order) {
          return a.display_order - b.display_order
        }
        
        // Tertiary: Name
        return a.name.localeCompare(b.name)
      })
      // Only show categories that have orders OR are featured (display_order <= 4)
      .filter(cat => 
        (cat.order_stats?.total_quantity_sold || 0) > 0 || 
        cat.display_order <= 4
      )
      .slice(0, 8) // Limit to 8 categories
  }

  // Loading skeleton
  if (loading) {
    return (
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <div className="h-4 w-32 bg-muted rounded mx-auto mb-4 animate-pulse" />
            <div className="h-12 w-64 bg-muted rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl lg:rounded-3xl aspect-[3/4] bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-serif text-2xl text-foreground font-light mb-3">
            Unable to Load Categories
          </h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchCategories} variant="outline">
            Try Again
          </Button>
        </div>
      </section>
    )
  }

  // No categories state
  if (categories.length === 0) {
    return null // Don't show the section if no categories exist
  }

  const hasOrderData = categories.some(c => c.order_stats && c.order_stats.total_quantity_sold > 0)

  return (
    <section ref={sectionRef} id="categories" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.25em] text-secondary font-medium mb-4 flex items-center justify-center gap-2">
            {hasOrderData && <TrendingUp className="w-3.5 h-3.5" />}
            Shop by Category
          </p>
          <ScrollBlurText
            text="Curated for you"
            className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground text-balance mb-6 font-light"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.slice(0, 4).map((category, index) => {
            const isPopular = category.order_stats && category.order_stats.total_quantity_sold > 50

            return (
              <Link
                key={category.id}
                href={`/shop?categories=${category.id}`}
                className={`reveal opacity-0 ${
                  index === 1 
                    ? "animation-delay-200" 
                    : index === 2 
                    ? "animation-delay-400" 
                    : index === 3 
                    ? "animation-delay-600" 
                    : ""
                } group relative overflow-hidden rounded-2xl lg:rounded-3xl aspect-[3/4]`}
              >
                <img
                  src={category.image_url || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
                
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-sm">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <h3 className="font-serif text-xl lg:text-2xl text-background font-medium mb-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-background/80">
                      {category.description}
                    </p>
                  )}
                  {/* Optional: Show sales count */}
                  {category.order_stats && category.order_stats.total_quantity_sold > 0 && (
                    <p className="text-xs text-background/70 mt-1">
                      {category.order_stats.total_quantity_sold}+ sold
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}