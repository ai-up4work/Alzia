"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag, Trash2, Star, Search, Grid3X3, LayoutList, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface WishlistItem {
  id: string
  customer_id: string
  product_id: string
  created_at: string
  product: {
    id: string
    name: string
    slug: string
    retail_price: number
    stock_quantity: number
    rating_avg?: number
    rating_count?: number
    images: string[]
    category?: {
      id: string
      name: string
      slug: string
    }
    brand?: {
      id: string
      name: string
      slug: string
    }
  }
}

interface WishlistPageClientProps {
  wishlists: WishlistItem[]
  userId: string
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

const productImages: Record<string, string> = {
  "radiance-renewal-serum": "/luxury-serum-bottle-vitamin-c-gold-elegant.jpg",
  "hydra-silk-moisturizer": "/luxury-moisturizer-cream-jar-elegant-rose.jpg",
  "velvet-rouge-lipstick": "/luxury-lipstick-red-velvet-elegant-gold-case.jpg",
  "eau-de-rose-parfum": "/luxury-perfume-bottle-rose-elegant-parisian.jpg",
  "gentle-foaming-cleanser": "/luxury-skincare-products-serum-cream-elegant.jpg",
  "flawless-finish-foundation": "/luxury-makeup-lipstick-foundation-elegant.jpg",
}

export default function WishlistPageClient({ wishlists: initialWishlists, userId }: WishlistPageClientProps) {
  const [wishlists, setWishlists] = useState(initialWishlists)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { addItem } = useCart()

  const removeFromWishlist = async (wishlistId: string) => {
    setRemovingIds(prev => new Set(prev).add(wishlistId))
    
    const supabase = createClient()
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("id", wishlistId)
      .eq("customer_id", userId)

    if (error) {
      toast.error("Failed to remove item from wishlist")
      setRemovingIds(prev => {
        const next = new Set(prev)
        next.delete(wishlistId)
        return next
      })
    } else {
      setWishlists(prev => prev.filter(item => item.id !== wishlistId))
      toast.success("Removed from wishlist")
    }
  }

  const moveToCart = async (wishlist: WishlistItem) => {
    addItem(wishlist.product, 1)
    await removeFromWishlist(wishlist.id)
    toast.success("Moved to cart")
  }

  // Filter and sort wishlists
  const filteredWishlists = wishlists
    .filter(item => {
      if (!searchQuery) return true
      const search = searchQuery.toLowerCase()
      return (
        item.product.name.toLowerCase().includes(search) ||
        item.product.category?.name.toLowerCase().includes(search) ||
        item.product.brand?.name.toLowerCase().includes(search)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.product.retail_price - b.product.retail_price
        case "price-high":
          return b.product.retail_price - a.product.retail_price
        case "name":
          return a.product.name.localeCompare(b.product.name)
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (wishlists.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center py-24">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h1 className="font-serif text-3xl md:text-4xl text-gray-900 font-light mb-4">
                Your wishlist is empty
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Save your favorite products to your wishlist and come back to them later.
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/shop">Explore Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 font-light mb-4">
              My Wishlist
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {wishlists.length} {wishlists.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>

          {/* Search & Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full"
              />
            </div>

            <div className="flex gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] h-12 rounded-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Recently Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
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

          {/* Products Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredWishlists.length} of {wishlists.length} item{wishlists.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Products Display */}
          {filteredWishlists.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600 mb-4">No items match your search</p>
              <Button onClick={() => setSearchQuery("")} variant="outline">Clear search</Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6" : "space-y-4"}>
              {filteredWishlists.map((wishlist) => {
                const product = wishlist.product
                const image = productImages[product.slug] || product.images[0] || "/luxury-cosmetic-product.jpg"

                if (viewMode === "list") {
                  return (
                    <div
                      key={wishlist.id}
                      className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0"
                      >
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/product/${product.slug}`}
                            className="font-serif text-xl text-gray-900 hover:text-gray-600 transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p>
                          {product.rating_avg && (
                            <div className="flex items-center gap-1 mt-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{product.rating_avg.toFixed(1)}</span>
                              <span className="text-sm text-gray-500">({product.rating_count})</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="text-2xl font-medium text-gray-900">
                            {formatPrice(product.retail_price)}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => moveToCart(wishlist)}
                              disabled={product.stock_quantity === 0 || removingIds.has(wishlist.id)}
                              className="rounded-full"
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button
                              onClick={() => removeFromWishlist(wishlist.id)}
                              disabled={removingIds.has(wishlist.id)}
                              variant="outline"
                              className="rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={wishlist.id}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative block aspect-square bg-gray-100 overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-medium">Out of Stock</span>
                        </div>
                      )}
                      {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                            Only {product.stock_quantity} left
                          </span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          removeFromWishlist(wishlist.id)
                        }}
                        disabled={removingIds.has(wishlist.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      </button>
                    </Link>

                    <div className="p-4 space-y-3">
                      <div>
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-serif text-lg text-gray-900 hover:text-gray-600 transition-colors line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p>
                      </div>

                      {product.rating_avg && (
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating_avg.toFixed(1)}</span>
                          <span className="text-gray-500">({product.rating_count})</span>
                        </div>
                      )}

                      <div className="text-xl font-medium text-gray-900">
                        {formatPrice(product.retail_price)}
                      </div>

                      <Button
                        onClick={() => moveToCart(wishlist)}
                        disabled={product.stock_quantity === 0 || removingIds.has(wishlist.id)}
                        className="w-full rounded-full"
                      >
                        {removingIds.has(wishlist.id) ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
                        Added {new Date(wishlist.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Continue Shopping */}
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}