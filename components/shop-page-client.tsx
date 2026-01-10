"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Heart, ShoppingBag, Star, SlidersHorizontal, Search, Grid3X3, LayoutList } from "lucide-react"
import type { Product, Category, Brand } from "@/lib/types"

interface ShopPageClientProps {
  initialProducts: Product[]
  categories: Category[]
  brands: Brand[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

// Mock products for initial display
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
  "radiance-renewal-serum": "/luxury-serum-bottle-vitamin-c-gold-elegant.jpg",
  "hydra-silk-moisturizer": "/luxury-moisturizer-cream-jar-elegant-rose.jpg",
  "velvet-rouge-lipstick": "/luxury-lipstick-red-velvet-elegant-gold-case.jpg",
  "eau-de-rose-parfum": "/luxury-perfume-bottle-rose-elegant-parisian.jpg",
  "gentle-foaming-cleanser": "/luxury-skincare-products-serum-cream-elegant.jpg",
  "flawless-finish-foundation": "/luxury-makeup-lipstick-foundation-elegant.jpg",
}

export function ShopPageClient({ initialProducts, categories, brands }: ShopPageClientProps) {
  const products = initialProducts.length > 0 ? initialProducts : mockProducts
  const allCategories = categories.length > 0 ? categories : mockCategories
  const allBrands = brands.length > 0 ? brands : mockBrands

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.short_description?.toLowerCase().includes(query) ||
          p.category?.name.toLowerCase().includes(query),
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => p.category && selectedCategories.includes(p.category.id))
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => p.brand && selectedBrands.includes(p.brand.id))
    }

    // Price filter
    filtered = filtered.filter((p) => p.retail_price >= priceRange[0] && p.retail_price <= priceRange[1])

    // Sort
    switch (sortBy) {
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
    }

    return filtered
  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, sortBy])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
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
  }

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-foreground mb-4">Categories</h3>
        <div className="space-y-3">
          {allCategories.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <span className="text-sm text-muted-foreground">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-medium text-foreground mb-4">Brands</h3>
        <div className="space-y-3">
          {allBrands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={selectedBrands.includes(brand.id)} onCheckedChange={() => toggleBrand(brand.id)} />
              <span className="text-sm text-muted-foreground">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-foreground mb-4">Price Range</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} max={5000} step={100} className="mb-4" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-light mb-4">Shop All</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of luxury cosmetics crafted in Paris
            </p>
          </div>

          {/* Search & Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full"
              />
            </div>

            <div className="flex gap-3">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden h-12 px-4 rounded-full bg-transparent">
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
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

              <Select value={sortBy} onValueChange={setSortBy}>
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
                  className={`p-3 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
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
              <p className="text-sm text-muted-foreground mb-6">Showing {filteredProducts.length} products</p>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">No products found</p>
                  <Button onClick={clearFilters}>Clear filters</Button>
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6" : "space-y-4"}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      image={productImages[product.slug] || "/luxury-cosmetic-product.jpg"}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

function ProductCard({
  product,
  viewMode,
  image,
}: {
  product: Product
  viewMode: "grid" | "list"
  image: string
}) {
  if (viewMode === "list") {
    return (
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden flex">
        <Link href={`/product/${product.slug}`} className="w-48 aspect-square flex-shrink-0">
          <img src={image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </Link>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif text-xl text-foreground font-medium mb-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-3">{product.short_description}</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{product.rating_avg}</span>
              <span className="text-sm text-muted-foreground">({product.rating_count} reviews)</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-medium text-foreground">{formatPrice(product.retail_price)}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full bg-transparent" aria-label="Add to wishlist">
                <Heart className="w-4 h-4" />
              </Button>
              <Button size="sm" className="rounded-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-card rounded-2xl lg:rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all duration-500">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
            Bestseller
          </span>
        )}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 text-foreground" />
        </button>
      </Link>

      <div className="p-4 lg:p-5">
        <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-base lg:text-lg text-foreground font-medium mb-1 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{product.short_description}</p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium text-foreground">{product.rating_avg}</span>
          <span className="text-xs text-muted-foreground">({product.rating_count})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">{formatPrice(product.retail_price)}</span>
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
  )
}
