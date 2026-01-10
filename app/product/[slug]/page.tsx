import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "@/components/product-detail-client"

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      brand:brands(*),
      images:product_images(*)
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  return product
}

async function getRelatedProducts(categoryId: string, excludeId: string) {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      brand:brands(*)
    `,
    )
    .eq("category_id", categoryId)
    .eq("status", "published")
    .neq("id", excludeId)
    .limit(4)

  return products || []
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: `${product.name} | Alzìa Paris`,
    description: product.short_description || product.description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  // If no product from DB, use mock data for demo
  const mockProduct = getMockProduct(slug)
  const displayProduct = product || mockProduct

  if (!displayProduct) {
    notFound()
  }

  const relatedProducts = product?.category_id ? await getRelatedProducts(product.category_id, product.id) : []

  return <ProductDetailClient product={displayProduct} relatedProducts={relatedProducts} />
}

function getMockProduct(slug: string) {
  const mockProducts: Record<string, any> = {
    "radiance-renewal-serum": {
      id: "p1111111-1111-1111-1111-111111111111",
      sku: "LP-SER-001",
      name: "Radiance Renewal Serum",
      slug: "radiance-renewal-serum",
      description:
        "A luxurious vitamin C serum that brightens and evens skin tone while reducing the appearance of fine lines. Formulated with 15% stabilized vitamin C and hyaluronic acid for maximum efficacy. This powerful formula penetrates deep into the skin to deliver visible results within weeks.",
      short_description: "Brightening vitamin C serum for radiant skin",
      category_id: "a1111111-1111-1111-1111-111111111111",
      brand_id: "b1111111-1111-1111-1111-111111111111",
      retail_price: 2450,
      wholesale_price: 1960,
      cost_price: 980,
      min_wholesale_qty: 10,
      stock_quantity: 150,
      low_stock_threshold: 20,
      ingredients:
        "Aqua, Ascorbic Acid (15%), Sodium Hyaluronate, Glycerin, Niacinamide (5%), Ferulic Acid, Vitamin E, Rosa Damascena Flower Water, Aloe Barbadensis Leaf Juice",
      usage_instructions:
        "Apply 3-4 drops to clean, dry skin morning and evening. Gently massage into face and neck. Follow with moisturizer and SPF during the day.",
      tags: ["vitamin-c", "brightening", "anti-aging", "bestseller"],
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
      },
      brand: {
        id: "b1111111-1111-1111-1111-111111111111",
        name: "Alzìa Paris",
        slug: "lumiere-paris",
      },
      images: [{ id: "1", image_url: "/luxury-serum-bottle-vitamin-c-gold-elegant.jpg", is_primary: true }],
    },
    "hydra-silk-moisturizer": {
      id: "p2222222-2222-2222-2222-222222222222",
      sku: "BN-CRM-001",
      name: "Hydra-Silk Moisturizer",
      slug: "hydra-silk-moisturizer",
      description:
        "An ultra-rich yet lightweight moisturizer that delivers 72-hour hydration. Infused with silk proteins and botanical extracts for a silky-smooth finish that lasts all day.",
      short_description: "Luxurious 72-hour hydrating cream",
      retail_price: 1850,
      wholesale_price: 1480,
      stock_quantity: 200,
      ingredients: "Aqua, Glycerin, Squalane, Silk Amino Acids, Shea Butter, Vitamin E, Jojoba Oil, Ceramide Complex",
      usage_instructions: "Apply generously to face and neck after serum. Use morning and evening for best results.",
      tags: ["hydrating", "moisturizer", "silk", "luxury"],
      status: "published",
      is_featured: true,
      rating_avg: 4.6,
      rating_count: 89,
      category: { id: "a1111111-1111-1111-1111-111111111111", name: "Skincare", slug: "skincare" },
      brand: { id: "b2222222-2222-2222-2222-222222222222", name: "Belle Naturelle", slug: "belle-naturelle" },
      images: [{ id: "1", image_url: "/luxury-moisturizer-cream-jar-elegant-rose.jpg", is_primary: true }],
    },
    "velvet-rouge-lipstick": {
      id: "p3333333-3333-3333-3333-333333333333",
      sku: "ER-LIP-001",
      name: "Velvet Rouge Lipstick",
      slug: "velvet-rouge-lipstick",
      description:
        "A creamy, long-wearing lipstick with intense color payoff. The velvet formula glides on smoothly and stays put for up to 8 hours without drying.",
      short_description: "Intense color velvet-finish lipstick",
      retail_price: 1200,
      wholesale_price: 960,
      stock_quantity: 300,
      ingredients: "Ricinus Communis Oil, Cera Alba, Pigments, Vitamin E, Jojoba Oil",
      usage_instructions: "Apply directly to lips. Can be layered for more intense color.",
      tags: ["lipstick", "long-lasting", "velvet", "rouge"],
      status: "published",
      is_featured: true,
      rating_avg: 4.7,
      rating_count: 156,
      category: { id: "a2222222-2222-2222-2222-222222222222", name: "Makeup", slug: "makeup" },
      brand: { id: "b3333333-3333-3333-3333-333333333333", name: "Éclat Royal", slug: "eclat-royal" },
      images: [{ id: "1", image_url: "/luxury-lipstick-red-velvet-elegant-gold-case.jpg", is_primary: true }],
    },
    "eau-de-rose-parfum": {
      id: "p4444444-4444-4444-4444-444444444444",
      sku: "RM-PRF-001",
      name: "Eau de Rose Parfum",
      slug: "eau-de-rose-parfum",
      description:
        "A captivating rose fragrance with notes of Turkish rose, bergamot, and sandalwood. This elegant scent evokes the romance of a Parisian garden at dusk.",
      short_description: "Elegant rose eau de parfum",
      retail_price: 4500,
      wholesale_price: 3600,
      stock_quantity: 80,
      ingredients: "Alcohol Denat, Parfum, Rosa Damascena, Citrus Bergamia, Santalum Album",
      usage_instructions: "Spray on pulse points: wrists, neck, and behind ears.",
      tags: ["perfume", "rose", "luxury", "gift"],
      status: "published",
      is_featured: true,
      rating_avg: 4.9,
      rating_count: 67,
      category: { id: "a4444444-4444-4444-4444-444444444444", name: "Fragrance", slug: "fragrance" },
      brand: { id: "b4444444-4444-4444-4444-444444444444", name: "Rose de Mai", slug: "rose-de-mai" },
      images: [{ id: "1", image_url: "/luxury-perfume-bottle-rose-elegant-parisian.jpg", is_primary: true }],
    },
  }

  return mockProducts[slug] || null
}
