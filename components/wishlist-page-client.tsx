"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag, Trash2, Star, Search, Grid3X3, LayoutList, Loader2, Check, Package } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  const [addingToCartIds, setAddingToCartIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  const router = useRouter()
  const { addItem } = useCart()

  const removeFromWishlist = async (wishlistId: string, productName: string) => {
    setRemovingIds(prev => new Set(prev).add(wishlistId))
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", wishlistId)
        .eq("customer_id", userId)

      if (error) throw error

      setWishlists(prev => prev.filter(item => item.id !== wishlistId))
      toast.success("Removed from wishlist", {
        description: productName
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove item", {
        description: "Please try again"
      })
    } finally {
      setRemovingIds(prev => {
        const next = new Set(prev)
        next.delete(wishlistId)
        return next
      })
    }
  }

  const addToCartOnly = async (wishlist: WishlistItem) => {
    setAddingToCartIds(prev => new Set(prev).add(wishlist.id))
    
    try {
      addItem(wishlist.product, 1)
      
      toast.success("Added to cart!", {
        description: wishlist.product.name,
        action: {
          label: "View Cart",
          onClick: () => router.push("/account/cart"),
        },
      })
      
      // Keep item in wishlist, just add to cart
      setTimeout(() => {
        setAddingToCartIds(prev => {
          const next = new Set(prev)
          next.delete(wishlist.id)
          return next
        })
      }, 1000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
      setAddingToCartIds(prev => {
        const next = new Set(prev)
        next.delete(wishlist.id)
        return next
      })
    }
  }

  const moveToCart = async (wishlist: WishlistItem) => {
    setAddingToCartIds(prev => new Set(prev).add(wishlist.id))
    
    try {
      addItem(wishlist.product, 1)
      
      // Remove from wishlist after adding to cart
      await removeFromWishlist(wishlist.id, wishlist.product.name)
      
      toast.success("Moved to cart!", {
        description: wishlist.product.name,
        action: {
          label: "View Cart",
          onClick: () => router.push("/account/cart"),
        },
      })
    } catch (error) {
      console.error("Error moving to cart:", error)
      toast.error("Failed to move to cart")
    } finally {
      setAddingToCartIds(prev => {
        const next = new Set(prev)
        next.delete(wishlist.id)
        return next
      })
    }
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

  // Empty State
  if (wishlists.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center py-24">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-4">
                Your wishlist is empty
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
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
    <main className="min-h-screen bg-background">
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-light mb-4">
              My Wishlist
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {wishlists.length} {wishlists.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>

          {/* Search & Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  className={`p-3 transition-colors ${
                    viewMode === "grid" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-colors ${
                    viewMode === "list" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="List view"
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredWishlists.length} of {wishlists.length} item{wishlists.length !== 1 ? "s" : ""}
            </p>
            {wishlists.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  filteredWishlists.forEach(wishlist => {
                    addToCartOnly(wishlist)
                  })
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add All to Cart
              </Button>
            )}
          </div>

          {/* Products Display */}
          {filteredWishlists.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">No items match your search</p>
              <Button onClick={() => setSearchQuery("")} variant="outline" className="rounded-full">
                Clear search
              </Button>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6" : "space-y-4"}>
              {filteredWishlists.map((wishlist) => {
                const product = wishlist.product
                const image = productImages[product.slug] || product.images?.[0] || "/luxury-cosmetic-product.jpg"
                const isRemoving = removingIds.has(wishlist.id)
                const isAddingToCart = addingToCartIds.has(wishlist.id)

                if (viewMode === "list") {
                  return (
                    <div
                      key={wishlist.id}
                      className="flex gap-6 p-6 bg-card rounded-2xl border border-border/50 hover:border-border hover:shadow-lg transition-all"
                    >
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0"
                      >
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {product.brand && (
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              {product.brand.name}
                            </p>
                          )}
                          <Link
                            href={`/product/${product.slug}`}
                            className="font-serif text-xl text-foreground hover:text-primary transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">{product.category?.name}</p>
                          {product.rating_avg && product.rating_count && product.rating_count > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < Math.floor(product.rating_avg!)
                                        ? "fill-accent text-accent"
                                        : "fill-muted text-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium ml-1">{product.rating_avg.toFixed(1)}</span>
                              <span className="text-sm text-muted-foreground">({product.rating_count})</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <div className="text-2xl font-medium text-foreground">
                              {formatPrice(product.retail_price)}
                            </div>
                            {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                              <p className="text-xs text-orange-600 font-medium mt-1">
                                Only {product.stock_quantity} left
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => addToCartOnly(wishlist)}
                              disabled={product.stock_quantity === 0 || isAddingToCart || isRemoving}
                              className="rounded-full"
                            >
                              {isAddingToCart ? (
                                <>
                                  <Check className="w-4 h-4 mr-2 animate-in zoom-in" />
                                  Added!
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-4 h-4 mr-2" />
                                  Add to Cart
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => removeFromWishlist(wishlist.id, product.name)}
                              disabled={isRemoving}
                              variant="outline"
                              className="rounded-full"
                              aria-label="Remove from wishlist"
                            >
                              {isRemoving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }

                // Grid View
                return (
                  <div
                    key={wishlist.id}
                    className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-border hover:shadow-xl transition-all duration-500"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative block aspect-square bg-muted overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-white font-medium">Out of Stock</span>
                        </div>
                      )}
                      {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-orange-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                            Only {product.stock_quantity} left
                          </span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          removeFromWishlist(wishlist.id, product.name)
                        }}
                        disabled={isRemoving}
                        className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors disabled:opacity-50"
                        aria-label="Remove from wishlist"
                      >
                        {isRemoving ? (
                          <Loader2 className="w-5 h-5 text-foreground animate-spin" />
                        ) : (
                          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        )}
                      </button>
                    </Link>

                    <div className="p-4 space-y-3">
                      <div>
                        {product.brand && (
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                            {product.brand.name}
                          </p>
                        )}
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 block"
                        >
                          {product.name}
                        </Link>
                        {product.category && (
                          <p className="text-sm text-muted-foreground mt-1">{product.category.name}</p>
                        )}
                      </div>

                      {product.rating_avg && product.rating_count && product.rating_count > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating_avg!)
                                    ? "fill-accent text-accent"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium ml-1">{product.rating_avg.toFixed(1)}</span>
                          <span className="text-muted-foreground">({product.rating_count})</span>
                        </div>
                      )}

                      <div className="text-xl font-medium text-foreground">
                        {formatPrice(product.retail_price)}
                      </div>

                      <Button
                        onClick={() => addToCartOnly(wishlist)}
                        disabled={product.stock_quantity === 0 || isAddingToCart || isRemoving}
                        className="w-full rounded-full"
                      >
                        {isAddingToCart ? (
                          <>
                            <Check className="w-4 h-4 mr-2 animate-in zoom-in" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
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