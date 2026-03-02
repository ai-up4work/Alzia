"use client"

import { useState, useTransition, useRef, Suspense, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
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
import { Footer } from "@/components/footer"
import WholesaleProductCard, { type Product, formatPrice } from "@/components/wholesale-product-card"
import {
  Search,
  Grid3X3,
  LayoutList,
  Loader2,
  Package,
  TrendingUp,
  Award,
  Leaf,
  Percent,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string
  name: string
  slug: string
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

interface InitialFilters {
  search: string
  selectedCategories: string[]
  selectedBrands: string[]
  priceRange: [number, number]
  sortBy: string
}

interface WholesalePageClientProps {
  initialProducts: Product[]
  categories: Category[]
  brands: Brand[]
  initialFilters: InitialFilters
}

// ── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden bg-muted rounded-md ${className ?? ""}`} style={style}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}

function ProductCardGridSkeleton() {
  return (
    <div className="rounded-xl border border-border overflow-hidden flex flex-col bg-card">
      <Shimmer className="h-52 w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <Shimmer className="h-4 w-16 rounded-full" />
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
        <div className="rounded-xl bg-muted/50 p-3 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-1.5">
              <Shimmer className="h-3 w-16" />
              <Shimmer className="h-6 w-24" />
            </div>
            <Shimmer className="h-6 w-20 rounded-full self-start" />
          </div>
          <div className="flex justify-between">
            <Shimmer className="h-3 w-1/3" />
            <Shimmer className="h-3 w-1/4" />
          </div>
          <Shimmer className="h-2 w-full rounded-full" />
          <div className="flex justify-between">
            {[...Array(5)].map((_, i) => (
              <Shimmer key={i} className="h-7 w-[18%] rounded" />
            ))}
          </div>
        </div>
        <div className="mt-auto space-y-2">
          <Shimmer className="h-9 w-full rounded-lg" />
          <Shimmer className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function WholesalePageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="h-16 border-b border-border bg-background/95 backdrop-blur fixed top-0 w-full z-50 flex items-center px-8 gap-8">
        <Shimmer className="h-6 w-32" />
        <div className="ml-auto flex items-center gap-3">
          <Shimmer className="h-8 w-8 rounded-full" />
          <Shimmer className="h-8 w-20 rounded-full" />
        </div>
      </div>
      <div className="pt-32 pb-16 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <Shimmer className="h-7 w-40 rounded-full mx-auto" />
          <Shimmer className="h-14 w-2/3 mx-auto" />
          <Shimmer className="h-5 w-1/2 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card/50 p-6 text-center flex flex-col items-center gap-3"
            >
              <Shimmer className="w-8 h-8 rounded-lg" />
              <Shimmer className="h-7 w-16" />
              <Shimmer className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mb-8">
          <Shimmer className="h-12 flex-1 rounded-full" />
          <Shimmer className="h-12 w-[200px] rounded-full" />
        </div>
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Shimmer className="h-5 w-32" />
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Shimmer className="w-4 h-4 rounded-sm" />
                    <Shimmer className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ))}
          </aside>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProductCardGridSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// ── Filter Sidebar (defined OUTSIDE page component to prevent remounts) ───────

interface FilterSidebarProps {
  categories: Category[]
  brands: Brand[]
  selectedCategories: string[]
  selectedBrands: string[]
  priceRange: [number, number]
  setPriceRange: (v: [number, number]) => void
  toggleCategory: (id: string) => void
  toggleBrand: (id: string) => void
  hasFilterChanges: boolean
  applyFilters: () => void
  clearFilters: () => void
  isPending: boolean
}

function FilterSidebar({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  setPriceRange,
  toggleCategory,
  toggleBrand,
  hasFilterChanges,
  applyFilters,
  clearFilters,
  isPending,
}: FilterSidebarProps) {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h3 className="font-medium text-foreground mb-4">Wholesale Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          max={10000}
          step={100}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
          <Leaf className="w-4 h-4 text-secondary" />
          Categories
        </h3>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <motion.label
              key={cat.id}
              className="flex items-center gap-3 cursor-pointer group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Checkbox
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand, i) => (
            <motion.label
              key={brand.id}
              className="flex items-center gap-3 cursor-pointer group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
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

      <AnimatePresence>
        {hasFilterChanges && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Button
              onClick={applyFilters}
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
}

// ── Main page content ─────────────────────────────────────────────────────────

function WholesalePageContent({
  initialProducts,
  categories,
  brands,
  initialFilters,
}: WholesalePageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const searchDebounceRef = useRef<NodeJS.Timeout>()

  const [searchQuery, setSearchQuery] = useState(initialFilters.search)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.selectedCategories)
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters.selectedBrands)
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange)
  const [sortBy, setSortBy] = useState(initialFilters.sortBy)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({})
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)

  const products = initialProducts

  const hasFilterChanges =
    searchQuery !== appliedFilters.search ||
    JSON.stringify([...selectedCategories].sort()) !==
      JSON.stringify([...appliedFilters.selectedCategories].sort()) ||
    JSON.stringify([...selectedBrands].sort()) !==
      JSON.stringify([...appliedFilters.selectedBrands].sort()) ||
    priceRange[0] !== appliedFilters.priceRange[0] ||
    priceRange[1] !== appliedFilters.priceRange[1] ||
    sortBy !== appliedFilters.sortBy

  const buildParams = useCallback(
    (overrides: Partial<typeof appliedFilters> = {}) => {
      const f = { ...appliedFilters, ...overrides }
      const params = new URLSearchParams()
      if (f.search) params.set("search", f.search)
      if (f.selectedCategories.length > 0) params.set("categories", f.selectedCategories.join(","))
      if (f.selectedBrands.length > 0) params.set("brands", f.selectedBrands.join(","))
      if (f.priceRange[0] > 0) params.set("minPrice", f.priceRange[0].toString())
      if (f.priceRange[1] < 10000) params.set("maxPrice", f.priceRange[1].toString())
      if (f.sortBy !== "newest") params.set("sortBy", f.sortBy)
      return params.toString()
    },
    [appliedFilters]
  )

  const navigate = useCallback(
    (params: string) => {
      startTransition(() => {
        router.push(params ? `${pathname}?${params}` : pathname)
      })
    },
    [pathname, router]
  )

  const applyFilters = useCallback(() => {
    const newFilters = { search: searchQuery, selectedCategories, selectedBrands, priceRange, sortBy }
    setAppliedFilters(newFilters)
    navigate(buildParams(newFilters))
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, sortBy, buildParams, navigate])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      const newFilters = { ...appliedFilters, search: value }
      setAppliedFilters(newFilters)
      navigate(buildParams(newFilters))
    }, 500)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const newFilters = { ...appliedFilters, sortBy: value }
    setAppliedFilters(newFilters)
    navigate(buildParams(newFilters))
  }

  const clearFilters = useCallback(() => {
    const reset: InitialFilters = {
      search: "",
      selectedCategories: [],
      selectedBrands: [],
      priceRange: [0, 10000],
      sortBy: "newest",
    }
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([0, 10000])
    setSortBy("newest")
    setAppliedFilters(reset)
    navigate("")
  }, [navigate])

  const toggleCategory = useCallback(
    (id: string) =>
      setSelectedCategories((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    []
  )

  const toggleBrand = useCallback(
    (id: string) =>
      setSelectedBrands((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    []
  )

  const updateQuantity = useCallback((productId: string, qty: number) => {
    setSelectedQuantities((prev) => ({ ...prev, [productId]: Math.max(1, qty) }))
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden pt-32 pb-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-secondary/10 text-secondary border-secondary/20 px-4 py-1.5">
              <Leaf className="w-3 h-3 mr-1.5" />
              Wholesale Portal
            </Badge>
            <motion.h1
              className="font-serif text-4xl md:text-6xl font-light mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Partner with <span className="text-primary">Excellence</span>
            </motion.h1>
            <motion.p
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Exclusive wholesale pricing for authorized retailers and distributors. Price scales with your
              quantity — the more you order, the better the rate.
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Package, value: `${products.length}+`, label: "Products", delay: 0 },
              { icon: Percent, value: "50%", label: "Max Discount", delay: 1 },
              { icon: TrendingUp, value: "Dynamic", label: "Pricing", delay: 2 },
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

      {/* ── Main content ── */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Search + toolbar */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or brand..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-12 rounded-full border-border focus:border-primary transition-colors"
              />
              {searchQuery !== appliedFilters.search && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="lg:hidden h-12 px-4 rounded-full border-border hover:bg-muted"
                  >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                    {hasFilterChanges && <span className="ml-2 w-2 h-2 bg-secondary rounded-full" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar
                      categories={categories}
                      brands={brands}
                      selectedCategories={selectedCategories}
                      selectedBrands={selectedBrands}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      toggleCategory={toggleCategory}
                      toggleBrand={toggleBrand}
                      hasFilterChanges={hasFilterChanges}
                      applyFilters={applyFilters}
                      clearFilters={clearFilters}
                      isPending={isPending}
                    />
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
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex border rounded-full overflow-hidden border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-colors ${
                    viewMode === "grid"
                      ? "bg-secondary text-white"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-colors ${
                    viewMode === "list"
                      ? "bg-secondary text-white"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-8 items-start">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 scrollbar-thin">
              <FilterSidebar
                categories={categories}
                brands={brands}
                selectedCategories={selectedCategories}
                selectedBrands={selectedBrands}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                toggleCategory={toggleCategory}
                toggleBrand={toggleBrand}
                hasFilterChanges={hasFilterChanges}
                applyFilters={applyFilters}
                clearFilters={clearFilters}
                isPending={isPending}
              />
            </aside>

            {/* Product grid / list */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{products.length}</span> products
                </p>
                <AnimatePresence>
                  {isPending && (
                    <motion.div
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Loading...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted" />
                  <p className="text-lg text-muted-foreground mb-4">No products found</p>
                  <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90">
                    Clear filters
                  </Button>
                </div>
              ) : (
                <motion.div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  key={products.map((p) => p.id).join(",")}
                >
                  {products.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <WholesaleProductCard
                        product={product}
                        viewMode={viewMode}
                        quantity={selectedQuantities[product.id] ?? 1}
                        onQuantityChange={(qty) => updateQuantity(product.id, qty)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function WholesalePageClient(props: WholesalePageClientProps) {
  return (
    <Suspense fallback={<WholesalePageSkeleton />}>
      <WholesalePageContent {...props} />
    </Suspense>
  )
}