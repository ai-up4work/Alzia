"use client"

import { useState, useTransition, useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Search, Grid3X3, LayoutList, Loader2, ChevronDown, X, Filter } from "lucide-react"
import { ProductCard } from "@/components/shop/product-card"
import { Footer } from "./footer"
import { createClient } from "@/lib/supabase/client"

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
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price)
}

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
  pageSize = 24,
}: ShopPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const supabase = createClient()

  // Cache for storing fetched products by filter combination
  const cacheRef = useRef<Map<string, { products: Product[]; totalCount: number }>>(new Map())

  // Cache for filter combinations (category -> brands, brand -> categories)
  const [filterCombinations, setFilterCombinations] = useState<{
    categoryToBrands: Map<string, Set<string>>
    brandToCategories: Map<string, Set<string>>
    allCategoryIds: Set<string>
    allBrandIds: Set<string>
    loaded: boolean
  }>({
    categoryToBrands: new Map(),
    brandToCategories: new Map(),
    allCategoryIds: new Set(),
    allBrandIds: new Set(),
    loaded: false,
  })

  // Debounce timer for search
  const searchDebounceRef = useRef<NodeJS.Timeout>()

  // Popover states
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isBrandOpen, setIsBrandOpen] = useState(false)
  const [isPriceOpen, setIsPriceOpen] = useState(false)

  // Parse URL params for initial state
  const getInitialFiltersFromURL = useCallback(() => {
    const search = searchParams.get("search") || ""
    const categoriesParam = searchParams.get("categories")
    const brandsParam = searchParams.get("brands")
    const minPrice = parseInt(searchParams.get("minPrice") || "0")
    const maxPrice = parseInt(searchParams.get("maxPrice") || "10000")
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
  }, [searchParams])

  const initialFilters = getInitialFiltersFromURL()

  // Products state with pagination support
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [totalProductCount, setTotalProductCount] = useState(totalCount)
  const [currentPageNum, setCurrentPageNum] = useState(currentPage)

  // Filter states (local, not yet applied)
  const [searchQuery, setSearchQuery] = useState(initialFilters.search)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.selectedCategories)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters.selectedBrands)
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange)
  const [sortBy, setSortBy] = useState(initialFilters.sortBy)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // All categories and brands
  const [allCategories, setAllCategories] = useState<Category[]>(categories)
  const [allBrands, setAllBrands] = useState<Brand[]>(brands)

  // Applied filter states (what's currently in the URL)
  const [appliedFilters, setAppliedFilters] = useState({
    search: initialFilters.search,
    categories: initialFilters.selectedCategories,
    brands: initialFilters.selectedBrands,
    minPrice: initialFilters.priceRange[0],
    maxPrice: initialFilters.priceRange[1],
    sortBy: initialFilters.sortBy,
  })

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current)
      }
    }
  }, [])

  // Fetch filter combinations on mount
  useEffect(() => {
    const fetchFilterCombinations = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("category_id, brand_id")
          .eq("status", "published")
          .not("category_id", "is", null)
          .not("brand_id", "is", null)

        if (error) {
          console.error("Error fetching filter combinations:", error)
          return
        }

        const categoryToBrands = new Map<string, Set<string>>()
        const brandToCategories = new Map<string, Set<string>>()
        const allCategoryIds = new Set<string>()
        const allBrandIds = new Set<string>()

        data.forEach((product) => {
          if (product.category_id && product.brand_id) {
            allCategoryIds.add(product.category_id)
            allBrandIds.add(product.brand_id)

            // Category -> Brands mapping
            if (!categoryToBrands.has(product.category_id)) {
              categoryToBrands.set(product.category_id, new Set())
            }
            categoryToBrands.get(product.category_id)!.add(product.brand_id)

            // Brand -> Categories mapping
            if (!brandToCategories.has(product.brand_id)) {
              brandToCategories.set(product.brand_id, new Set())
            }
            brandToCategories.get(product.brand_id)!.add(product.category_id)
          }
        })

        setFilterCombinations({
          categoryToBrands,
          brandToCategories,
          allCategoryIds,
          allBrandIds,
          loaded: true,
        })
      } catch (error) {
        console.error("Error fetching filter combinations:", error)
      }
    }

    fetchFilterCombinations()
  }, [supabase])

  // Fetch categories and brands on mount if not provided
  useEffect(() => {
    const fetchMetadata = async () => {
      if (allCategories.length === 0) {
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("display_order")
        if (categoriesData) setAllCategories(categoriesData)
      }

      if (allBrands.length === 0) {
        const { data: brandsData } = await supabase
          .from("brands")
          .select("*")
          .eq("is_active", true)
          .order("name")
        if (brandsData) setAllBrands(brandsData)
      }
    }

    fetchMetadata()
  }, [supabase, allCategories.length, allBrands.length])

  // Get available brands based on selected categories
  const getAvailableBrands = useCallback(() => {
    if (!filterCombinations.loaded) return allBrands

    if (selectedCategories.length === 0) {
      return allBrands.filter((brand) => filterCombinations.allBrandIds.has(brand.id))
    }

    const availableBrandIds = new Set<string>()
    selectedCategories.forEach((categoryId) => {
      const brandsInCategory = filterCombinations.categoryToBrands.get(categoryId)
      if (brandsInCategory) {
        brandsInCategory.forEach((brandId) => availableBrandIds.add(brandId))
      }
    })

    return allBrands.filter((brand) => availableBrandIds.has(brand.id))
  }, [selectedCategories, filterCombinations, allBrands])

  // Get available categories based on selected brands
  const getAvailableCategories = useCallback(() => {
    if (!filterCombinations.loaded) return allCategories

    if (selectedBrands.length === 0) {
      return allCategories.filter((category) => filterCombinations.allCategoryIds.has(category.id))
    }

    const availableCategoryIds = new Set<string>()
    selectedBrands.forEach((brandId) => {
      const categoriesInBrand = filterCombinations.brandToCategories.get(brandId)
      if (categoriesInBrand) {
        categoriesInBrand.forEach((categoryId) => availableCategoryIds.add(categoryId))
      }
    })

    return allCategories.filter((category) => availableCategoryIds.has(category.id))
  }, [selectedBrands, filterCombinations, allCategories])

  const availableBrands = getAvailableBrands()
  const availableCategories = getAvailableCategories()

  // Generate cache key from filters
  const getCacheKey = (filters: any, page: number) => {
    return JSON.stringify({ ...filters, page })
  }

  // Fetch products from Supabase with advanced search
  const fetchProducts = useCallback(
    async (filters: any, page: number) => {
      const cacheKey = getCacheKey(filters, page)

      // Check cache first
      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!
        return cached
      }

      try {
        let query = supabase
          .from("products")
          .select("*, category:categories(*), brand:brands(*)", { count: "exact" })
          .eq("status", "published")

        // Apply search filter using full-text search if available
        if (filters.search) {
          // Try using textSearch for better results (requires search_vector column)
          try {
            query = query.textSearch('search_vector', filters.search, {
              type: 'plainto',
              config: 'english'
            })
          } catch {
            // Fallback to ilike if textSearch fails (search_vector not set up yet)
            query = query.or(
              `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`
            )
          }
        }

        // Apply category filter
        if (filters.categories.length > 0) {
          query = query.in("category_id", filters.categories)
        }

        // Apply brand filter
        if (filters.brands.length > 0) {
          query = query.in("brand_id", filters.brands)
        }

        // Apply price range filter
        query = query.gte("retail_price", filters.minPrice).lte("retail_price", filters.maxPrice)

        // Apply sorting
        switch (filters.sortBy) {
          case "price-low":
            query = query.order("retail_price", { ascending: true })
            break
          case "price-high":
            query = query.order("retail_price", { ascending: false })
            break
          case "rating":
            query = query.order("rating_avg", { ascending: false })
            break
          case "newest":
          default:
            query = query.order("created_at", { ascending: false })
            break
        }

        // Apply pagination
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to)

        const { data, error, count } = await query

        if (error) {
          console.error("Error fetching products:", error)
          return { products: [], totalCount: 0 }
        }

        const result = {
          products: (data as Product[]) || [],
          totalCount: count || 0,
        }

        // Cache the result
        cacheRef.current.set(cacheKey, result)

        return result
      } catch (error) {
        console.error("Error fetching products:", error)
        return { products: [], totalCount: 0 }
      }
    },
    [supabase, pageSize]
  )

  // Update products when initialProducts change from server
  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts)
      setTotalProductCount(totalCount)
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
      const result = await fetchProducts(
        {
          search: filters.search,
          categories: filters.selectedCategories,
          brands: filters.selectedBrands,
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          sortBy: filters.sortBy,
        },
        filters.page
      )

      setProducts(result.products)
      setTotalProductCount(result.totalCount)
    }

    if (initialProducts.length === 0) {
      loadProducts()
    }
  }, [searchParams, fetchProducts, initialProducts.length, getInitialFiltersFromURL])

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
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString())
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

    // Close all popovers
    setIsCategoryOpen(false)
    setIsBrandOpen(false)
    setIsPriceOpen(false)

    // Navigate to new URL with filters
    startTransition(() => {
      router.push(newURL)
    })
  }

  // Improved debounced search with minimum character requirement
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setIsTyping(true)

    // Clear existing timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    // Don't search if query is too short (less than 2 characters)
    if (value.length > 0 && value.length < 2) {
      setIsTyping(false)
      return
    }

    // Set new timeout for debounced search
    // 1000ms delay - reasonable time to ensure user stopped typing
    searchDebounceRef.current = setTimeout(() => {
      setIsTyping(false)
      
      // Auto-apply search after user stops typing
      if (value !== appliedFilters.search) {
        const params = new URLSearchParams()
        if (value) params.set("search", value)
        if (appliedFilters.categories.length > 0) params.set("categories", appliedFilters.categories.join(","))
        if (appliedFilters.brands.length > 0) params.set("brands", appliedFilters.brands.join(","))
        if (appliedFilters.minPrice > 0) params.set("minPrice", appliedFilters.minPrice.toString())
        if (appliedFilters.maxPrice < 10000) params.set("maxPrice", appliedFilters.maxPrice.toString())
        if (appliedFilters.sortBy !== "newest") params.set("sortBy", appliedFilters.sortBy)

        const queryString = params.toString()
        const newURL = queryString ? `${pathname}?${queryString}` : pathname

        setAppliedFilters({ ...appliedFilters, search: value })
        startTransition(() => {
          router.push(newURL)
        })
      }
    }, 1000) // 1000ms is optimal - not too fast, not too slow
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setIsTyping(false)
    
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }
    
    if (appliedFilters.search) {
      const params = new URLSearchParams()
      if (appliedFilters.categories.length > 0) params.set("categories", appliedFilters.categories.join(","))
      if (appliedFilters.brands.length > 0) params.set("brands", appliedFilters.brands.join(","))
      if (appliedFilters.minPrice > 0) params.set("minPrice", appliedFilters.minPrice.toString())
      if (appliedFilters.maxPrice < 10000) params.set("maxPrice", appliedFilters.maxPrice.toString())
      if (appliedFilters.sortBy !== "newest") params.set("sortBy", appliedFilters.sortBy)

      const queryString = params.toString()
      const newURL = queryString ? `${pathname}?${queryString}` : pathname
      
      setAppliedFilters({ ...appliedFilters, search: "" })
      startTransition(() => {
        router.push(newURL)
      })
    }
  }

  // Handle sort change immediately
  const handleSortChange = (value: string) => {
    setSortBy(value)
    const params = new URLSearchParams()

    if (appliedFilters.search) params.set("search", appliedFilters.search)
    if (appliedFilters.categories.length > 0) params.set("categories", appliedFilters.categories.join(","))
    if (appliedFilters.brands.length > 0) params.set("brands", appliedFilters.brands.join(","))
    if (appliedFilters.minPrice > 0) params.set("minPrice", appliedFilters.minPrice.toString())
    if (appliedFilters.maxPrice < 10000) params.set("maxPrice", appliedFilters.maxPrice.toString())
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
      setProducts((prev) => [...prev, ...result.products])
      setCurrentPageNum(nextPage)

      // Update URL with new page
      const params = new URLSearchParams(window.location.search)
      params.set("page", nextPage.toString())
      const newURL = `${pathname}?${params.toString()}`
      window.history.pushState({}, "", newURL)
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
    setPriceRange([0, 10000])
    setSortBy("newest")
    setAppliedFilters({
      search: "",
      categories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 10000,
      sortBy: "newest",
    })

    startTransition(() => {
      router.push(pathname)
    })
  }

  const removeFilter = (type: "category" | "brand", id: string) => {
    if (type === "category") {
      const newCategories = selectedCategories.filter((c) => c !== id)
      setSelectedCategories(newCategories)

      const params = new URLSearchParams()
      if (appliedFilters.search) params.set("search", appliedFilters.search)
      if (newCategories.length > 0) params.set("categories", newCategories.join(","))
      if (appliedFilters.brands.length > 0) params.set("brands", appliedFilters.brands.join(","))
      if (appliedFilters.minPrice > 0) params.set("minPrice", appliedFilters.minPrice.toString())
      if (appliedFilters.maxPrice < 10000) params.set("maxPrice", appliedFilters.maxPrice.toString())
      if (appliedFilters.sortBy !== "newest") params.set("sortBy", appliedFilters.sortBy)

      const queryString = params.toString()
      const newURL = queryString ? `${pathname}?${queryString}` : pathname

      setAppliedFilters({ ...appliedFilters, categories: newCategories })
      startTransition(() => {
        router.push(newURL)
      })
    } else {
      const newBrands = selectedBrands.filter((b) => b !== id)
      setSelectedBrands(newBrands)

      const params = new URLSearchParams()
      if (appliedFilters.search) params.set("search", appliedFilters.search)
      if (appliedFilters.categories.length > 0) params.set("categories", appliedFilters.categories.join(","))
      if (newBrands.length > 0) params.set("brands", newBrands.join(","))
      if (appliedFilters.minPrice > 0) params.set("minPrice", appliedFilters.minPrice.toString())
      if (appliedFilters.maxPrice < 10000) params.set("maxPrice", appliedFilters.maxPrice.toString())
      if (appliedFilters.sortBy !== "newest") params.set("sortBy", appliedFilters.sortBy)

      const queryString = params.toString()
      const newURL = queryString ? `${pathname}?${queryString}` : pathname

      setAppliedFilters({ ...appliedFilters, brands: newBrands })
      startTransition(() => {
        router.push(newURL)
      })
    }
  }

  const totalPages = Math.ceil(totalProductCount / pageSize)
  const hasMoreProducts = currentPageNum < totalPages

  const activeFilterCount =
    appliedFilters.categories.length +
    appliedFilters.brands.length +
    (appliedFilters.minPrice > 0 || appliedFilters.maxPrice < 10000 ? 1 : 0)

  // Mobile Filter Sidebar
  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Categories</h3>
        <div className="space-y-3">
          {availableCategories.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={selectedCategories.includes(category.id)} onCheckedChange={() => toggleCategory(category.id)} />
              <span className="text-sm text-gray-600">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Brands</h3>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {availableBrands.map((brand) => (
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
        <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} className="mb-4" />
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
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 font-light mb-4">
              Shop Our Products
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our complete collection of luxury cosmetics crafted in Paris
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products... (min 2 characters)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-12 rounded-full pr-24"
              />
              
              {/* Search states */}
              {searchQuery && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {/* Typing indicator */}
                  {isTyping && (
                    <span className="text-xs text-gray-400">Typing...</span>
                  )}
                  
                  {/* Searching indicator */}
                  {!isTyping && searchQuery !== appliedFilters.search && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      <span className="text-xs text-gray-400 hidden sm:inline">Searching...</span>
                    </>
                  )}
                  
                  {/* Clear button */}
                  <button
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Helper text */}
            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Type at least 2 characters to search
              </p>
            )}
          </div>

          {/* Horizontal Filters Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Category Filter */}
              <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 rounded-full border-gray-300">
                    Category
                    {selectedCategories.length > 0 && (
                      <Badge variant="secondary" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                        {selectedCategories.length}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4" side="bottom" align="start">
                  <div className="space-y-3">
                    <div className="font-medium text-sm text-gray-900 mb-3">Select Categories</div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {availableCategories.map((category) => {
                        const isDisabled = selectedBrands.length > 0 && !availableCategories.find((c) => c.id === category.id)
                        return (
                          <label
                            key={category.id}
                            className={`flex items-center gap-2 cursor-pointer py-1 ${
                              isDisabled ? "opacity-50" : ""
                            }`}
                          >
                            <Checkbox
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                              disabled={isDisabled}
                            />
                            <span className="text-sm text-gray-700">{category.name}</span>
                          </label>
                        )
                      })}
                    </div>
                    {hasFilterChanges() && (
                      <Button onClick={() => applyFilters(1)} disabled={isPending} size="sm" className="w-full mt-3">
                        {isPending ? "Applying..." : "Apply"}
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Brand Filter */}
              <Popover open={isBrandOpen} onOpenChange={setIsBrandOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 rounded-full border-gray-300">
                    Brand
                    {selectedBrands.length > 0 && (
                      <Badge variant="secondary" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                        {selectedBrands.length}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4" side="bottom" align="start">
                  <div className="space-y-3">
                    <div className="font-medium text-sm text-gray-900 mb-3">Select Brands</div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {availableBrands.map((brand) => {
                        const isDisabled = selectedCategories.length > 0 && !availableBrands.find((b) => b.id === brand.id)
                        return (
                          <label
                            key={brand.id}
                            className={`flex items-center gap-2 cursor-pointer py-1 ${
                              isDisabled ? "opacity-50" : ""
                            }`}
                          >
                            <Checkbox
                              checked={selectedBrands.includes(brand.id)}
                              onCheckedChange={() => toggleBrand(brand.id)}
                              disabled={isDisabled}
                            />
                            <span className="text-sm text-gray-700">{brand.name}</span>
                          </label>
                        )
                      })}
                    </div>
                    {hasFilterChanges() && (
                      <Button onClick={() => applyFilters(1)} disabled={isPending} size="sm" className="w-full mt-3">
                        {isPending ? "Applying..." : "Apply"}
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Price Filter */}
              <Popover open={isPriceOpen} onOpenChange={setIsPriceOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-10 rounded-full border-gray-300">
                    Price
                    {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                      <Badge variant="secondary" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                        ✓
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4" side="bottom" align="start">
                  <div className="space-y-4">
                    <div className="font-medium text-sm text-gray-900">Price Range</div>
                    <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                    {hasFilterChanges() && (
                      <Button onClick={() => applyFilters(1)} disabled={isPending} size="sm" className="w-full">
                        {isPending ? "Applying..." : "Apply"}
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Mobile All Filters Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-10 rounded-full border-gray-300">
                    <Filter className="w-4 h-4 mr-2" />
                    All Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2 rounded-full px-2 py-0.5 text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>All Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Clear All */}
              {activeFilterCount > 0 && (
                <Button variant="ghost" onClick={clearFilters} className="h-10 rounded-full text-gray-600">
                  Clear all
                </Button>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={handleSortChange} disabled={isPending}>
                <SelectTrigger className="w-[180px] h-10 rounded-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden md:flex border rounded-full overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 ${
                    viewMode === "grid" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:text-gray-900"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 ${
                    viewMode === "list" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:text-gray-900"
                  }`}
                  aria-label="List view"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Pills */}
          {(appliedFilters.categories.length > 0 || appliedFilters.brands.length > 0) && (
            <div className="mb-6 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {appliedFilters.categories.map((categoryId) => {
                const category = allCategories.find((c) => c.id === categoryId)
                return category ? (
                  <Badge key={categoryId} variant="secondary" className="rounded-full pl-3 pr-2 py-1">
                    {category.name}
                    <button
                      onClick={() => removeFilter("category", categoryId)}
                      className="ml-1.5 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null
              })}
              {appliedFilters.brands.map((brandId) => {
                const brand = allBrands.find((b) => b.id === brandId)
                return brand ? (
                  <Badge key={brandId} variant="secondary" className="rounded-full pl-3 pr-2 py-1">
                    {brand.name}
                    <button
                      onClick={() => removeFilter("brand", brandId)}
                      className="ml-1.5 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ) : null
              })}
            </div>
          )}

          {/* Products Grid */}
          <div>
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
                <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" : "space-y-4"}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      image={
                        productImages[product.slug] || "/placeholder.png"
                      }
                    />
                  ))}
                </div>

                {/* Load More / Pagination */}
                {hasMoreProducts && (
                  <div className="mt-12 text-center">
                    <Button onClick={loadMoreProducts} disabled={isLoadingMore} size="lg" variant="outline" className="rounded-full">
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
      <Footer />
    </main>
  )
}