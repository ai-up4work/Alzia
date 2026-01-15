"use client"

import { useState, useTransition, useEffect, useCallback, useRef, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  SlidersHorizontal, 
  Search, 
  Grid3X3, 
  LayoutList, 
  Loader2,
  Package,
  TrendingUp,
  Award,
  Leaf,
  Percent,
  Sparkles
} from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string
  brand_id: string
  retail_price: number
  wholesale_price: number
  cost_price: number
  min_wholesale_qty: number
  stock_quantity: number
  low_stock_threshold: number
  ingredients: any
  usage_instructions: any
  tags: string[]
  status: string
  is_featured: boolean
  rating_avg: number
  rating_count: number
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
    slug: string
    description: string | null
    image_url: string | null
    parent_id: string | null
    display_order: number
    is_active: boolean
  }
  brand?: {
    id: string
    name: string
    slug: string
    logo_url: string | null
    is_active: boolean
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  display_order: number
  is_active: boolean
}

interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string | null
  is_active: boolean
}

interface WholesalePageProps {
  initialProducts?: Product[]
  categories?: Category[]
  brands?: Brand[]
  totalCount?: number
  currentPage?: number
  pageSize?: number
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price)
}

function calculateSavings(retail: number, wholesale: number) {
  const savings = retail - wholesale
  const percentage = ((savings / retail) * 100).toFixed(0)
  return { savings, percentage }
}

// Mock data
const mockProducts: Product[] = [
  {
    id: "p1111111-1111-1111-1111-111111111111",
    sku: "LP-SER-001",
    name: "Radiance Renewal Serum",
    slug: "radiance-renewal-serum",
    description: "A luxurious vitamin C serum",
    short_description: "Brightening vitamin C serum",
    category_id: "a1111111-1111-1111-1111-111111111111",
    brand_id: "b1111111-1111-1111-1111-111111111111",
    retail_price: 2450,
    wholesale_price: 1960,
    cost_price: 980,
    min_wholesale_qty: 10,
    stock_quantity: 150,
    low_stock_threshold: 20,
    ingredients: null,
    usage_instructions: null,
    tags: ["vitamin-c", "brightening"],
    status: "published",
    is_featured: true,
    rating_avg: 4.8,
    rating_count: 124,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "a1111111-1111-1111-1111-111111111111",
      name: "Skincare",
      slug: "skincare",
      description: null,
      image_url: null,
      parent_id: null,
      display_order: 1,
      is_active: true,
    },
    brand: {
      id: "b1111111-1111-1111-1111-111111111111",
      name: "Alzìa Naturals",
      slug: "alzia-naturals",
      logo_url: null,
      is_active: true,
    },
  },
  {
    id: "p2222222-2222-2222-2222-222222222222",
    sku: "BN-CRM-001",
    name: "Hydra-Silk Moisturizer",
    slug: "hydra-silk-moisturizer",
    description: "Ultra-rich moisturizer",
    short_description: "72-hour hydrating cream",
    category_id: "a1111111-1111-1111-1111-111111111111",
    brand_id: "b2222222-2222-2222-2222-222222222222",
    retail_price: 1850,
    wholesale_price: 1480,
    cost_price: 740,
    min_wholesale_qty: 10,
    stock_quantity: 200,
    low_stock_threshold: 25,
    ingredients: null,
    usage_instructions: null,
    tags: ["hydrating", "moisturizer"],
    status: "published",
    is_featured: true,
    rating_avg: 4.6,
    rating_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "a1111111-1111-1111-1111-111111111111",
      name: "Skincare",
      slug: "skincare",
      description: null,
      image_url: null,
      parent_id: null,
      display_order: 1,
      is_active: true,
    },
    brand: {
      id: "b2222222-2222-2222-2222-222222222222",
      name: "Belle Naturelle",
      slug: "belle-naturelle",
      logo_url: null,
      is_active: true,
    },
  },
  {
    id: "p3333333-3333-3333-3333-333333333333",
    sku: "ER-LIP-001",
    name: "Velvet Rouge Lipstick",
    slug: "velvet-rouge-lipstick",
    description: "Creamy long-wearing lipstick",
    short_description: "Long-wearing velvet finish",
    category_id: "a2222222-2222-2222-2222-222222222222",
    brand_id: "b3333333-3333-3333-3333-333333333333",
    retail_price: 1200,
    wholesale_price: 960,
    cost_price: 480,
    min_wholesale_qty: 15,
    stock_quantity: 300,
    low_stock_threshold: 30,
    ingredients: null,
    usage_instructions: null,
    tags: ["lipstick", "velvet"],
    status: "published",
    is_featured: true,
    rating_avg: 4.7,
    rating_count: 156,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "a2222222-2222-2222-2222-222222222222",
      name: "Makeup",
      slug: "makeup",
      description: null,
      image_url: null,
      parent_id: null,
      display_order: 2,
      is_active: true,
    },
    brand: {
      id: "b3333333-3333-3333-3333-333333333333",
      name: "Éclat Royal",
      slug: "eclat-royal",
      logo_url: null,
      is_active: true,
    },
  },
  {
    id: "p4444444-4444-4444-4444-444444444444",
    sku: "RM-PRF-001",
    name: "Eau de Rose Parfum",
    slug: "eau-de-rose-parfum",
    description: "Captivating rose fragrance",
    short_description: "Elegant rose eau de parfum",
    category_id: "a4444444-4444-4444-4444-444444444444",
    brand_id: "b4444444-4444-4444-4444-444444444444",
    retail_price: 4500,
    wholesale_price: 3600,
    cost_price: 1800,
    min_wholesale_qty: 5,
    stock_quantity: 80,
    low_stock_threshold: 10,
    ingredients: null,
    usage_instructions: null,
    tags: ["perfume", "rose"],
    status: "published",
    is_featured: true,
    rating_avg: 4.9,
    rating_count: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "a4444444-4444-4444-4444-444444444444",
      name: "Fragrance",
      slug: "fragrance",
      description: null,
      image_url: null,
      parent_id: null,
      display_order: 4,
      is_active: true,
    },
    brand: {
      id: "b4444444-4444-4444-4444-444444444444",
      name: "Rose de Mai",
      slug: "rose-de-mai",
      logo_url: null,
      is_active: true,
    },
  },
  {
    id: "p5555555-5555-5555-5555-555555555555",
    sku: "JS-CLN-001",
    name: "Gentle Foaming Cleanser",
    slug: "gentle-foaming-cleanser",
    description: "Sulfate-free foaming cleanser",
    short_description: "Gentle daily cleanser",
    category_id: "a1111111-1111-1111-1111-111111111111",
    brand_id: "b5555555-5555-5555-5555-555555555555",
    retail_price: 950,
    wholesale_price: 760,
    cost_price: 380,
    min_wholesale_qty: 10,
    stock_quantity: 250,
    low_stock_threshold: 30,
    ingredients: null,
    usage_instructions: null,
    tags: ["cleanser", "gentle"],
    status: "published",
    is_featured: false,
    rating_avg: 4.5,
    rating_count: 203,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "a1111111-1111-1111-1111-111111111111",
      name: "Skincare",
      slug: "skincare",
      description: null,
      image_url: null,
      parent_id: null,
      display_order: 1,
      is_active: true,
    },
    brand: {
      id: "b5555555-5555-5555-5555-555555555555",
      name: "Jardin Secret",
      slug: "jardin-secret",
      logo_url: null,
      is_active: true,
    },
  },
  {
    id: "p6666666-6666-6666-6666-666666666666",
    sku: "LP-FND-001",
    name: "Flawless Finish Foundation",
    slug: "flawless-finish-foundation",
    description: "Buildable foundation",
    short_description: "Satin-finish foundation",
    category_id: "a2222222-2222-2222-2222-222222222222",
    brand_id: "b1111111-1111-1111-1111-111111111111",
    retail_price: 2200,
    wholesale_price: 1760,
    cost_price: 880,
    min_wholesale_qty: 10,
    stock_quantity: 180,
    low_stock_threshold: 20,
    ingredients: null,
    usage_instructions: null,
    tags: ["foundation", "satin"],
    status: "published",
    is_featured: false,
    rating_avg: 4.4,
    rating_count: 178,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: "a2222222-2222-2222-2222-222222222222",
      name: "Makeup",
      slug: "makeup",
      description: null,
      image_url: null,
      parent_id: null,
      display_order: 2,
      is_active: true,
    },
    brand: {
      id: "b1111111-1111-1111-1111-111111111111",
      name: "Alzìa Naturals",
      slug: "alzia-naturals",
      logo_url: null,
      is_active: true,
    },
  },
]

const mockCategories: Category[] = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    name: "Skincare",
    slug: "skincare",
    description: null,
    image_url: null,
    parent_id: null,
    display_order: 1,
    is_active: true,
  },
  {
    id: "a2222222-2222-2222-2222-222222222222",
    name: "Makeup",
    slug: "makeup",
    description: null,
    image_url: null,
    parent_id: null,
    display_order: 2,
    is_active: true,
  },
  {
    id: "a3333333-3333-3333-3333-333333333333",
    name: "Haircare",
    slug: "haircare",
    description: null,
    image_url: null,
    parent_id: null,
    display_order: 3,
    is_active: true,
  },
  {
    id: "a4444444-4444-4444-4444-444444444444",
    name: "Fragrance",
    slug: "fragrance",
    description: null,
    image_url: null,
    parent_id: null,
    display_order: 4,
    is_active: true,
  },
]

const mockBrands: Brand[] = [
  {
    id: "b1111111-1111-1111-1111-111111111111",
    name: "Alzìa Naturals",
    slug: "alzia-naturals",
    logo_url: null,
    is_active: true,
  },
  {
    id: "b2222222-2222-2222-2222-222222222222",
    name: "Belle Naturelle",
    slug: "belle-naturelle",
    logo_url: null,
    is_active: true,
  },
  {
    id: "b3333333-3333-3333-3333-333333333333",
    name: "Éclat Royal",
    slug: "eclat-royal",
    logo_url: null,
    is_active: true,
  },
  {
    id: "b4444444-4444-4444-4444-444444444444",
    name: "Rose de Mai",
    slug: "rose-de-mai",
    logo_url: null,
    is_active: true,
  },
  {
    id: "b5555555-5555-5555-5555-555555555555",
    name: "Jardin Secret",
    slug: "jardin-secret",
    logo_url: null,
    is_active: true,
  },
]

const productImages: Record<string, string> = {
  "radiance-renewal-serum": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
  "hydra-silk-moisturizer": "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500",
  "velvet-rouge-lipstick": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500",
  "eau-de-rose-parfum": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
  "gentle-foaming-cleanser": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
  "flawless-finish-foundation": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

function WholesalePageContent({ 
  initialProducts = [], 
  categories = [], 
  brands = [],
  totalCount = 0,
  currentPage = 1,
  pageSize = 24
}: WholesalePageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const allCategories = categories.length > 0 ? categories : mockCategories
  const allBrands = brands.length > 0 ? brands : mockBrands

  const cacheRef = useRef<Map<string, { products: Product[], totalCount: number }>>(new Map())
  const searchDebounceRef = useRef<NodeJS.Timeout>()

  const getInitialFiltersFromURL = () => {
    const search = searchParams.get("search") || ""
    const categoriesParam = searchParams.get("categories")
    const brandsParam = searchParams.get("brands")
    const minPrice = parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = parseInt(searchParams.get("maxPrice") || "5000")
    const sortBy = searchParams.get("sortBy") || "newest"
    const page = parseInt(searchParams.get("page") || "1")

    return {
      search,
      selectedCategories: categoriesParam ? categoriesParam.split(",") : [],
      selectedBrands: brandsParam ? brandsParam.split(",") : [],
      priceRange: [minPrice, maxPrice] as [number, number],
      sortBy,
      page,
    }
  }

  const initialFilters = getInitialFiltersFromURL()

  const [products, setProducts] = useState<Product[]>(initialProducts.length > 0 ? initialProducts : mockProducts)
  const [totalProductCount, setTotalProductCount] = useState(totalCount || mockProducts.length)
  const [currentPageNum, setCurrentPageNum] = useState(currentPage)
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({})

  const [searchQuery, setSearchQuery] = useState(initialFilters.search)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.selectedCategories)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters.selectedBrands)
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange)
  const [sortBy, setSortBy] = useState(initialFilters.sortBy)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [appliedFilters, setAppliedFilters] = useState({
    search: initialFilters.search,
    categories: initialFilters.selectedCategories,
    brands: initialFilters.selectedBrands,
    minPrice: initialFilters.priceRange[0],
    maxPrice: initialFilters.priceRange[1],
    sortBy: initialFilters.sortBy,
  })

  const getCacheKey = (filters: any, page: number) => {
    return JSON.stringify({ ...filters, page })
  }

  const fetchProducts = useCallback(async (filters: any, page: number) => {
    const cacheKey = getCacheKey(filters, page)
    
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey)!
      return cached
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filtered = [...mockProducts]

    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search) ||
          p.short_description?.toLowerCase().includes(search) ||
          p.category?.name.toLowerCase().includes(search) ||
          p.brand?.name.toLowerCase().includes(search)
      )
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) => filters.categories.includes(p.category_id))
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) => filters.brands.includes(p.brand_id))
    }

    filtered = filtered.filter(
      (p) => p.wholesale_price >= filters.minPrice && p.wholesale_price <= filters.maxPrice
    )

    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.wholesale_price - b.wholesale_price)
        break
      case "price-high":
        filtered.sort((a, b) => b.wholesale_price - a.wholesale_price)
        break
      case "moq-low":
        filtered.sort((a, b) => a.min_wholesale_qty - b.min_wholesale_qty)
        break
      case "margin-high":
        filtered.sort((a, b) => {
          const marginA = ((a.retail_price - a.wholesale_price) / a.retail_price) * 100
          const marginB = ((b.retail_price - b.wholesale_price) / b.retail_price) * 100
          return marginB - marginA
        })
        break
      case "rating":
        filtered.sort((a, b) => b.rating_avg - a.rating_avg)
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    const result = {
      products: filtered.slice((page - 1) * pageSize, page * pageSize),
      totalCount: filtered.length
    }

    cacheRef.current.set(cacheKey, result)
    return result
  }, [pageSize])

  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts)
      setTotalProductCount(totalCount || initialProducts.length)
      setCurrentPageNum(currentPage)
    }
  }, [])

  useEffect(() => {
    const filters = getInitialFiltersFromURL()
    setSearchQuery(filters.search)
    setSelectedCategories(filters.selectedCategories)
    setSelectedBrands(filters.selectedBrands)
    setPriceRange(filters.priceRange)
    setSortBy(filters.sortBy)
    setCurrentPageNum(filters.page)
    setAppliedFilters({
      search: filters.search,
      categories: filters.selectedCategories,
      brands: filters.selectedBrands,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      sortBy: filters.sortBy,
    })

    const loadProducts = async () => {
      const result = await fetchProducts({
        search: filters.search,
        categories: filters.selectedCategories,
        brands: filters.selectedBrands,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sortBy: filters.sortBy,
      }, filters.page)
      
      setProducts(result.products)
      setTotalProductCount(result.totalCount)
    }

    if (initialProducts.length === 0) {
      loadProducts()
    }
  }, [searchParams, fetchProducts])

  const hasFilterChanges = () => {
    return (
      searchQuery !== appliedFilters.search ||
      JSON.stringify(selectedCategories.sort()) !== JSON.stringify(appliedFilters.categories.sort()) ||
      JSON.stringify(selectedBrands.sort()) !== JSON.stringify(appliedFilters.brands.sort()) ||
      priceRange[0] !== appliedFilters.minPrice ||
      priceRange[1] !== appliedFilters.maxPrice ||
      sortBy !== appliedFilters.sortBy
    )
  }

  const applyFilters = (page = 1) => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("search", searchQuery)
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","))
    if (selectedBrands.length > 0) params.set("brands", selectedBrands.join(","))
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 5000) params.set("maxPrice", priceRange[1].toString())
    if (sortBy !== "newest") params.set("sortBy", sortBy)
    if (page > 1) params.set("page", page.toString())

    const queryString = params.toString()
    const newURL = queryString ? `${pathname}?${queryString}` : pathname

    setAppliedFilters({
      search: searchQuery,
      categories: selectedCategories,
      brands: selectedBrands,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortBy,
    })

    startTransition(() => {
      router.push(newURL)
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    searchDebounceRef.current = setTimeout(() => {
      if (value !== appliedFilters.search) {
        const params = new URLSearchParams()
        if (value) params.set("search", value)
        if (appliedFilters.categories.length > 0) params.set("categories", appliedFilters.categories.join(","))
        if (appliedFilters.brands.length > 0) params.set("brands", appliedFilters.brands.join(","))
        if (appliedFilters.minPrice > 0) params.set("minPrice", appliedFilters.minPrice.toString())
        if (appliedFilters.maxPrice < 5000) params.set("maxPrice", appliedFilters.maxPrice.toString())
        if (appliedFilters.sortBy !== "newest") params.set("sortBy", appliedFilters.sortBy)

        const queryString = params.toString()
        const newURL = queryString ? `${pathname}?${queryString}` : pathname

        setAppliedFilters({ ...appliedFilters, search: value })
        startTransition(() => {
          router.push(newURL)
        })
      }
    }, 500)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const params = new URLSearchParams()

    if (appliedFilters.search) params.set("search", appliedFilters.search)
    if (appliedFilters.categories.length > 0) params.set("categories", appliedFilters.categories.join(","))
    if (appliedFilters.brands.length > 0) params.set("brands", appliedFilters.brands.join(","))
    if (appliedFilters.minPrice > 0) params.set("minPrice", appliedFilters.minPrice.toString())
    if (appliedFilters.maxPrice < 5000) params.set("maxPrice", appliedFilters.maxPrice.toString())
    if (value !== "newest") params.set("sortBy", value)

    const queryString = params.toString()
    const newURL = queryString ? `${pathname}?${queryString}` : pathname

    setAppliedFilters({ ...appliedFilters, sortBy: value })

    startTransition(() => {
      router.push(newURL)
    })
  }

  const loadMoreProducts = async () => {
    setIsLoadingMore(true)
    const nextPage = currentPageNum + 1
    
    try {
      const result = await fetchProducts(appliedFilters, nextPage)
      setProducts(prev => [...prev, ...result.products])
      setCurrentPageNum(nextPage)
      
      const params = new URLSearchParams(window.location.search)
      params.set("page", nextPage.toString())
      const newURL = `${pathname}?${params.toString()}`
      window.history.pushState({}, '', newURL)
    } catch (error) {
      console.error("Error loading more products:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    )
  }

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 5000])
    setSortBy("newest")
    setAppliedFilters({
      search: "",
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 5000,
      sortBy: "newest",
    })

    startTransition(() => {
      router.push(pathname)
    })
  }

  const updateQuantity = (productId: string, qty: number, minQty: number) => {
    const roundedQty = Math.max(minQty, Math.ceil(qty / minQty) * minQty)
    setSelectedQuantities(prev => ({ ...prev, [productId]: roundedQty }))
  }

  const totalPages = Math.ceil(totalProductCount / pageSize)
  const hasMoreProducts = currentPageNum < totalPages

  const FilterSidebar = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <Header />
        <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-secondary" />
          Categories
        </h3>
        <div className="space-y-3">
          {allCategories.map((category, i) => (
            <motion.label 
              key={category.id} 
              className="flex items-center gap-3 cursor-pointer group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-4">Brands</h3>
        <div className="space-y-3">
          {allBrands.map((brand, i) => (
            <motion.label 
              key={brand.id} 
              className="flex items-center gap-3 cursor-pointer group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Checkbox 
                checked={selectedBrands.includes(brand.id)} 
                onCheckedChange={() => toggleBrand(brand.id)}
                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-4">Wholesale Price Range</h3>
        <Slider 
          value={priceRange} 
          onValueChange={setPriceRange} 
          max={5000} 
          step={100} 
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <AnimatePresence>
        {hasFilterChanges() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Button 
              onClick={() => applyFilters(1)} 
              disabled={isPending} 
              className="w-full bg-secondary hover:bg-secondary/90 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply Filters
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button 
        variant="outline" 
        className="w-full border-border hover:bg-muted" 
        onClick={clearFilters} 
        disabled={isPending}
      >
        Clear All Filters
      </Button>
    </motion.div>
  )

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden pt-32 pb-16">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-12"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20 px-4 py-1.5">
                <Leaf className="w-3 h-3 mr-1.5" />
                Wholesale Portal
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Partner with <span className="text-primary">Excellence</span>
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Exclusive wholesale pricing for authorized retailers and distributors
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Package, value: "500+", label: "Products", delay: 0 },
              { icon: Percent, value: "20-40%", label: "Margins", delay: 1 },
              { icon: TrendingUp, value: "Fast", label: "Shipping", delay: 2 },
              { icon: Award, value: "24/7", label: "Support", delay: 3 },
            ].map((stat, i) => (
              <motion.div
                key={i}
                custom={stat.delay}
                variants={statsVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-secondary" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or brand..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-12 rounded-full border-border focus:border-primary transition-colors"
              />
              {searchQuery && searchQuery !== appliedFilters.search && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-12 px-4 rounded-full border-border hover:bg-muted">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                    {hasFilterChanges() && (
                      <motion.span 
                        className="ml-2 w-2 h-2 bg-secondary rounded-full" 
                        aria-label="Unsaved changes"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={handleSortChange} disabled={isPending}>
                <SelectTrigger className="w-[200px] h-12 rounded-full border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="moq-low">Lowest MOQ</SelectItem>
                  <SelectItem value="margin-high">Highest Margin</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex border rounded-full overflow-hidden border-border">
                <motion.button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${viewMode === "grid" ? "bg-secondary text-white" : "bg-background text-muted-foreground hover:text-foreground"}`}
                  aria-label="Grid view"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid3X3 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${viewMode === "list" ? "bg-secondary text-white" : "bg-background text-muted-foreground hover:text-foreground"}`}
                  aria-label="List view"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LayoutList className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            <div className="flex-1">
              <motion.div 
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{products.length}</span> of{" "}
                  <span className="font-medium text-foreground">{totalProductCount}</span> product
                  {totalProductCount !== 1 ? "s" : ""}
                </p>
                <AnimatePresence>
                  {isPending && (
                    <motion.div 
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Loading...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence mode="wait">
                {products.length === 0 ? (
                  <motion.div 
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted" />
                    <p className="text-lg text-muted-foreground mb-4">No products found</p>
                    <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90">
                      Clear filters
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div 
                      className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      key={products.map(p => p.id).join(',')}
                    >
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          variants={itemVariants}
                          custom={index}
                        >
                          <WholesaleProductCard
                            product={product}
                            viewMode={viewMode}
                            image={productImages[product.slug] || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500"}
                            quantity={selectedQuantities[product.id] || product.min_wholesale_qty}
                            onQuantityChange={(qty) => updateQuantity(product.id, qty, product.min_wholesale_qty)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {hasMoreProducts && (
                      <motion.div 
                        className="mt-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button 
                          onClick={loadMoreProducts} 
                          disabled={isLoadingMore}
                          size="lg"
                          variant="outline"
                          className="rounded-full border-border hover:bg-muted"
                        >
                          {isLoadingMore ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading more...
                            </>
                          ) : (
                            `Load More (${totalProductCount - products.length} remaining)`
                          )}
                        </Button>
                      </motion.div>
                    )}

                    <div className="mt-8 text-center text-sm text-muted-foreground">
                      Page {currentPageNum} of {totalPages}
                    </div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function WholesaleProductCard({
  product,
  viewMode,
  image,
  quantity,
  onQuantityChange,
}: {
  product: Product
  viewMode: "grid" | "list"
  image: string
  quantity: number
  onQuantityChange: (qty: number) => void
}) {
  const { savings, percentage } = calculateSavings(product.retail_price, product.wholesale_price)
  const totalPrice = product.wholesale_price * quantity

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        <Card className="overflow-hidden hover:shadow-xl transition-shadow border-border">
          <div className="flex">
            <Link href={`/wholesale/product/${product.slug}`} className="w-48 aspect-square flex-shrink-0 relative overflow-hidden group">
              <motion.img 
                src={image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <CardContent className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                        SKU: {product.sku}
                      </Badge>
                      <Badge className="text-xs bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {percentage}% margin
                      </Badge>
                    </div>
                    <Link href={`/wholesale/product/${product.slug}`}>
                      <h3 className="font-serif text-xl text-foreground font-medium mb-1 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{product.short_description}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-foreground">{product.rating_avg}</span>
                      <span className="text-sm text-muted-foreground">({product.rating_count})</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-y border-border">
                  <div>
                    <div className="text-xs text-muted-foreground">Wholesale</div>
                    <div className="text-lg font-bold text-secondary">{formatPrice(product.wholesale_price)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Retail</div>
                    <div className="text-sm text-muted-foreground line-through">{formatPrice(product.retail_price)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">MOQ</div>
                    <div className="text-sm font-medium text-foreground">{product.min_wholesale_qty} units</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center border rounded-lg border-border">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onQuantityChange(quantity - product.min_wholesale_qty)}
                    disabled={quantity <= product.min_wholesale_qty}
                    className="px-3 hover:bg-muted"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => onQuantityChange(parseInt(e.target.value) || product.min_wholesale_qty)}
                    className="w-20 text-center border-0 focus-visible:ring-0"
                    min={product.min_wholesale_qty}
                    step={product.min_wholesale_qty}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onQuantityChange(quantity + product.min_wholesale_qty)}
                    className="px-3 hover:bg-muted"
                  >
                    +
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Total</div>
                  <div className="text-lg font-bold text-foreground">{formatPrice(totalPrice)}</div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-secondary hover:bg-secondary/90 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-border">
        <Link
          href={`/wholesale/product/${product.slug}`}
          className="relative block aspect-square overflow-hidden bg-muted"
        >
          <motion.img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Badge className="absolute top-3 left-3 bg-secondary/90 text-white backdrop-blur-sm hover:bg-secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            {percentage}% margin
          </Badge>
          {product.is_featured && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="absolute top-3 right-3 bg-primary text-white">
                Bestseller
              </Badge>
            </motion.div>
          )}
          
          <motion.button
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="w-5 h-5 text-primary" />
          </motion.button>
        </Link>

        <CardContent className="p-5">
          <div className="mb-3">
            <Badge variant="secondary" className="text-xs mb-2 bg-muted text-muted-foreground">
              SKU: {product.sku}
            </Badge>
            <Link href={`/wholesale/product/${product.slug}`}>
              <h3 className="font-serif text-lg text-foreground font-medium mb-1 hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{product.short_description}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-foreground">{product.rating_avg}</span>
              <span className="text-xs text-muted-foreground">({product.rating_count})</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 py-3 border-y border-border mb-3">
            <div>
              <div className="text-xs text-muted-foreground">Wholesale</div>
              <div className="text-lg font-bold text-secondary">{formatPrice(product.wholesale_price)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Retail</div>
              <div className="text-sm text-muted-foreground line-through">{formatPrice(product.retail_price)}</div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>MOQ: {product.min_wholesale_qty} units</span>
              <span className="text-secondary font-medium">Save {formatPrice(savings)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center border rounded-lg border-border">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onQuantityChange(quantity - product.min_wholesale_qty)}
                disabled={quantity <= product.min_wholesale_qty}
                className="px-2 hover:bg-muted"
              >
                -
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => onQuantityChange(parseInt(e.target.value) || product.min_wholesale_qty)}
                className="flex-1 text-center border-0 focus-visible:ring-0 text-sm"
                min={product.min_wholesale_qty}
                step={product.min_wholesale_qty}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onQuantityChange(quantity + product.min_wholesale_qty)}
                className="px-2 hover:bg-muted"
              >
                +
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="font-bold text-foreground">{formatPrice(totalPrice)}</div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-secondary hover:bg-secondary/90 text-white" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Wrapper component with Suspense boundary
export default function WholesalePage(props: WholesalePageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading wholesale products...</p>
        </div>
      </div>
    }>
      <WholesalePageContent {...props} />
    </Suspense>
  )
}