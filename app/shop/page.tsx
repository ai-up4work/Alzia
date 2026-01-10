import { createClient } from "@/lib/supabase/server"
import { ShopPageClient } from "@/components/shop-page-client"

export const metadata = {
  title: "Shop | Lumière Paris",
  description: "Browse our collection of luxury cosmetics",
}

async function getProducts() {
  const supabase = await createClient()

  const { data: products } = await supabase
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
    .order("created_at", { ascending: false })

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

export default async function ShopPage() {
  const [products, categories, brands] = await Promise.all([getProducts(), getCategories(), getBrands()])

  return <ShopPageClient initialProducts={products} categories={categories} brands={brands} />
}
