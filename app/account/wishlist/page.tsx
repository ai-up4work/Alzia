import { createClient } from "@/lib/supabase/server"
import WishlistPageClient from "@/components/wishlist-page-client"
import { Header } from "@/components/header"
import { redirect } from "next/navigation"

export const metadata = {
  title: "My Wishlist | Alzìa Paris",
  description: "View and manage your favorite products",
}

// Mock data for fallback
const mockWishlists = [
  {
    id: "1",
    customer_id: "mock-user",
    product_id: "p1",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "p1",
      name: "Radiance Renewal Serum",
      slug: "radiance-renewal-serum",
      retail_price: 2499,
      stock_quantity: 15,
      rating_avg: 4.8,
      rating_count: 124,
      images: ["/luxury-serum-bottle-vitamin-c-gold-elegant.jpg"],
      category: { 
        id: "cat1",
        name: "Skincare",
        slug: "skincare"
      },
      brand: {
        id: "brand1",
        name: "Alzìa Paris",
        slug: "alzia-paris"
      }
    }
  },
  {
    id: "2",
    customer_id: "mock-user",
    product_id: "p2",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "p2",
      name: "Hydra Silk Moisturizer",
      slug: "hydra-silk-moisturizer",
      retail_price: 1899,
      stock_quantity: 28,
      rating_avg: 4.6,
      rating_count: 89,
      images: ["/luxury-moisturizer-cream-jar-elegant-rose.jpg"],
      category: { 
        id: "cat1",
        name: "Skincare",
        slug: "skincare"
      },
      brand: {
        id: "brand1",
        name: "Alzìa Paris",
        slug: "alzia-paris"
      }
    }
  },
  {
    id: "3",
    customer_id: "mock-user",
    product_id: "p3",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "p3",
      name: "Velvet Rouge Lipstick",
      slug: "velvet-rouge-lipstick",
      retail_price: 1299,
      stock_quantity: 42,
      rating_avg: 4.9,
      rating_count: 203,
      images: ["/luxury-lipstick-red-velvet-elegant-gold-case.jpg"],
      category: { 
        id: "cat2",
        name: "Makeup",
        slug: "makeup"
      },
      brand: {
        id: "brand1",
        name: "Alzìa Paris",
        slug: "alzia-paris"
      }
    }
  },
  {
    id: "4",
    customer_id: "mock-user",
    product_id: "p4",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    product: {
      id: "p4",
      name: "Eau de Rose Parfum",
      slug: "eau-de-rose-parfum",
      retail_price: 4999,
      stock_quantity: 8,
      rating_avg: 4.7,
      rating_count: 156,
      images: ["/luxury-perfume-bottle-rose-elegant-parisian.jpg"],
      category: { 
        id: "cat3",
        name: "Fragrance",
        slug: "fragrance"
      },
      brand: {
        id: "brand1",
        name: "Alzìa Paris",
        slug: "alzia-paris"
      }
    }
  }
]

async function getWishlistItems(userId: string) {
  const supabase = await createClient()

  const { data: wishlists } = await supabase
    .from("wishlists")
    .select(`
      *,
      product:products(
        *,
        category:categories(id, name, slug),
        brand:brands(id, name, slug)
      )
    `)
    .eq("customer_id", userId)
    .order("created_at", { ascending: false })

  // Use mock data if no wishlists found
  return wishlists && wishlists.length > 0 ? wishlists : []
}

export default async function WishlistPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, redirect to login
  if (!user) {
    redirect("/login?redirect=/wishlist")
  }

  // Fetch wishlist items for the current user
  const wishlists = await getWishlistItems(user.id)

  // Use mock data as fallback for demo purposes
  const displayWishlists = wishlists.length > 0 ? wishlists : mockWishlists

  return (
    <div>
      <Header />
      <WishlistPageClient wishlists={displayWishlists} userId={user.id} />
    </div>
  )
}
