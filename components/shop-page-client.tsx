"use client"

import { useState, useTransition, useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Heart, ShoppingBag, Star, SlidersHorizontal, Search, Grid3X3, LayoutList, Loader2 } from "lucide-react"
import { ProductCard } from "@/components/shop/product-card"
import { Footer } from "./footer"

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

interface ShopPageClientProps {
  initialProducts?: Product[]
  categories?: Category[]
  brands?: Brand[]
  totalCount?: number
  currentPage?: number
  pageSize?: number
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
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
      name: "Alzìa Paris",
      slug: "lumiere-paris",
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
      name: "Alzìa Paris",
      slug: "lumiere-paris",
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
    name: "Alzìa Paris",
    slug: "lumiere-paris",
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

export default function ShopPageClient({ 
  initialProducts = [], 
  categories = [], 
  brands = [],
  totalCount = 0,
  currentPage = 1,
  pageSize = 24
}: ShopPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const allCategories = categories.length > 0 ? categories : mockCategories
  const allBrands = brands.length > 0 ? brands : mockBrands

  // Cache for storing fetched products by filter combination
  const cacheRef = useRef<Map<string, { products: Product[], totalCount: number }>>(new Map())
  
  // Debounce timer for search
  const searchDebounceRef = useRef<NodeJS.Timeout>()

  // Parse URL params for initial state
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

  // Products state with pagination support
  const [products, setProducts] = useState<Product[]>(initialProducts.length > 0 ? initialProducts : mockProducts)
  const [totalProductCount, setTotalProductCount] = useState(totalCount || mockProducts.length)
  const [currentPageNum, setCurrentPageNum] = useState(currentPage)

  // Filter states (local, not yet applied)
  const [searchQuery, setSearchQuery] = useState(initialFilters.search)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.selectedCategories)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters.selectedBrands)
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange)
  const [sortBy, setSortBy] = useState(initialFilters.sortBy)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Applied filter states (what's currently in the URL)
  const [appliedFilters, setAppliedFilters] = useState({
    search: initialFilters.search,
    categories: initialFilters.selectedCategories,
    brands: initialFilters.selectedBrands,
    minPrice: initialFilters.priceRange[0],
    maxPrice: initialFilters.priceRange[1],
    sortBy: initialFilters.sortBy,
  })

  // Generate cache key from filters
  const getCacheKey = (filters: any, page: number) => {
    return JSON.stringify({ ...filters, page })
  }

  // Fetch products from API (replace with your actual API call)
  const fetchProducts = useCallback(async (filters: any, page: number) => {
    const cacheKey = getCacheKey(filters, page)
    
    // Check cache first
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey)!
      return cached
    }

    // TODO: Replace with actual API call
    // Example: const response = await fetch(`/api/products?${new URLSearchParams({...filters, page: page.toString()})}`)
    // const data = await response.json()
    
    // For now, simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filtered = [...mockProducts]

    // Apply filters (client-side simulation - this would be server-side in production)
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
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
      (p) => p.retail_price >= filters.minPrice && p.retail_price <= filters.maxPrice
    )

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.retail_price - b.retail_price)
        break
      case "price-high":
        filtered.sort((a, b) => b.retail_price - a.retail_price)
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

    // Cache the result
    cacheRef.current.set(cacheKey, result)

    return result
  }, [pageSize])

  // Update products when initialProducts change from server
  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts)
      setTotalProductCount(totalCount || initialProducts.length)
      setCurrentPageNum(currentPage)
    }
  }, [initialProducts, totalCount, currentPage])

  // Sync filters with URL params on mount and URL changes
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

    // Fetch products with current filters
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
  }, [searchParams, fetchProducts, initialProducts])

  // Check if filters have changed
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

  // Apply filters and update URL
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

    // Update applied filters state
    setAppliedFilters({
      search: searchQuery,
      categories: selectedCategories,
      brands: selectedBrands,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy: sortBy,
    })

    // Navigate to new URL with filters
    startTransition(() => {
      router.push(newURL)
    })
  }

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    
    // Clear existing timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    // Set new timeout for debounced search
    searchDebounceRef.current = setTimeout(() => {
      // Auto-apply search after 500ms of no typing
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

  // Handle sort change immediately
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

  // Load more products (pagination)
  const loadMoreProducts = async () => {
    setIsLoadingMore(true)
    const nextPage = currentPageNum + 1
    
    try {
      const result = await fetchProducts(appliedFilters, nextPage)
      setProducts(prev => [...prev, ...result.products])
      setCurrentPageNum(nextPage)
      
      // Update URL with new page
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

  const totalPages = Math.ceil(totalProductCount / pageSize)
  const hasMoreProducts = currentPageNum < totalPages

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
        <div className="space-y-3">
          {allCategories.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <span className="text-sm text-gray-600">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Brands</h3>
        <div className="space-y-3">
          {allBrands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={selectedBrands.includes(brand.id)} onCheckedChange={() => toggleBrand(brand.id)} />
              <span className="text-sm text-gray-600">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={5000} step={100} className="mb-4" />
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Apply Filters Button */}
      {hasFilterChanges() && (
        <Button onClick={() => applyFilters(1)} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : (
            "Apply Filters"
          )}
        </Button>
      )}

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={clearFilters} disabled={isPending}>
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 font-light mb-4">Shop Our Products</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of luxury cosmetics crafted in Paris
            </p>
          </div>

          {/* Search & Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-12 rounded-full"
              />
              {searchQuery && searchQuery !== appliedFilters.search && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-12 px-4 rounded-full">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                    {hasFilterChanges() && (
                      <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full" aria-label="Unsaved changes" />
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
                <SelectTrigger className="w-[180px] h-12 rounded-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex border rounded-full overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:text-gray-900"}`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:text-gray-900"}`}
                  aria-label="List view"
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                  Showing {products.length} of {totalProductCount} product{totalProductCount !== 1 ? "s" : ""}
                </p>
                {isPending && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                )}
              </div>

              {products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-lg text-gray-600 mb-4">No products found</p>
                  <Button onClick={clearFilters}>Clear filters</Button>
                </div>
              ) : (
                <>
                  <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6" : "space-y-4"}>
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={viewMode}
                        image={productImages[product.slug] || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500"}
                      />
                    ))}
                  </div>

                  {/* Load More / Pagination */}
                  {hasMoreProducts && (
                    <div className="mt-12 text-center">
                      <Button 
                        onClick={loadMoreProducts} 
                        disabled={isLoadingMore}
                        size="lg"
                        variant="outline"
                        className="rounded-full"
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
                    </div>
                  )}

                  {/* Pagination Info */}
                  <div className="mt-8 text-center text-sm text-gray-500">
                    Page {currentPageNum} of {totalPages}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
