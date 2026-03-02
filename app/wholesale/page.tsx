import { createClient } from "@/lib/supabase/server"
import WholesalePageClient from "@/components/wholesale-page-client"

export const metadata = {
  title: "Wholesale | Alzìa Makeup & Cosmetics",
  description: "Exclusive wholesale pricing for authorized retailers and distributors",
}

interface WholesalePageProps {
  searchParams: Promise<{
    search?: string
    categories?: string
    brands?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    page?: string
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
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      images:product_images(*),
      wholesale_pricing(id, moq, min_price, max_price)
    `)
    .eq("status", "published")

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
    )
  }

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    query = query.in("category_id", filters.categoryIds)
  }

  if (filters.brandIds && filters.brandIds.length > 0) {
    query = query.in("brand_id", filters.brandIds)
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("retail_price", filters.minPrice)
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("retail_price", filters.maxPrice)
  }

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
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .eq("is_active", true)
    .order("name")
  return brands || []
}

export default async function WholesalePage({ searchParams }: WholesalePageProps) {
  const params = await searchParams

  const search = params.search
  const categoryIds = params.categories?.split(",").filter(Boolean)
  const brandIds = params.brands?.split(",").filter(Boolean)
  const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined
  const sortBy = params.sortBy || "newest"

  const [products, categories, brands] = await Promise.all([
    getProducts({ search, categoryIds, brandIds, minPrice, maxPrice, sortBy }),
    getCategories(),
    getBrands(),
  ])

  return (
    <WholesalePageClient
      initialProducts={products}
      categories={categories}
      brands={brands}
      initialFilters={{
        search: search || "",
        selectedCategories: categoryIds || [],
        selectedBrands: brandIds || [],
        priceRange: [minPrice || 0, maxPrice || 10000],
        sortBy,
      }}
    />
  )
}