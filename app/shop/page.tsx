import { createClient } from "@/lib/supabase/server"
import ShopPageClient from "@/components/shop-page-client"
import { Header } from "@/components/header"

export const metadata = {
  title: "Shop | Alzìa Makeup & Cosmetics",
  description: "Browse our collection of luxury cosmetics",
}

interface ShopPageProps {
  searchParams: Promise<{
    search?: string
    categories?: string
    brands?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
  }>
}

async function getProducts(filters: {
  search?: string
  categoryIds?: string[]
  brandIds?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      brand:brands(*),
      images:product_images(*)
    `,
    )
    .eq("status", "published")

  // Apply search filter
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
    )
  }

  // Apply category filter
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    query = query.in("category_id", filters.categoryIds)
  }

  // Apply brand filter
  if (filters.brandIds && filters.brandIds.length > 0) {
    query = query.in("brand_id", filters.brandIds)
  }

  // Apply price range filter
  if (filters.minPrice !== undefined) {
    query = query.gte("retail_price", filters.minPrice)
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("retail_price", filters.maxPrice)
  }

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
  }

  const { data: products } = await query

  return products || []
}

async function getCategories() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .is("parent_id", null)
    .order("display_order")

  return categories || []
}

async function getBrands() {
  const supabase = await createClient()

  const { data: brands } = await supabase.from("brands").select("*").eq("is_active", true).order("name")

  return brands || []
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Await searchParams (Next.js 15+)
  const params = await searchParams

  // Parse query parameters
  const search = params.search
  const categoryIds = params.categories?.split(",").filter(Boolean)
  const brandIds = params.brands?.split(",").filter(Boolean)
  const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined
  const sortBy = params.sortBy || "newest"

  // Fetch data with filters applied
  const [products, categories, brands] = await Promise.all([
    getProducts({ search, categoryIds, brandIds, minPrice, maxPrice, sortBy }),
    getCategories(),
    getBrands(),
  ])

  return (
    <div>
      <Header />
      <ShopPageClient
        initialProducts={products}
        categories={categories}
        brands={brands}
        initialFilters={{
          search: search || "",
          selectedCategories: categoryIds || [],
          selectedBrands: brandIds || [],
          priceRange: [minPrice || 0, maxPrice || 5000],
          sortBy: sortBy,
        }}
      />
    </div>
  )
}
