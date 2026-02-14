"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingBag, Trash2, Star, Search, Grid3X3, LayoutList, Loader2, Check, Package } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { toast } from "sonner"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price)
}

// Helper function to get product image
const getProductImage = (product: any): string => {
  if (product.images && product.images.length > 0) {
    // If images is an array of objects with image_url
    if (typeof product.images[0] === 'object' && product.images[0].image_url) {
      const primaryImage = product.images.find((img: any) => img.is_primary)
      return primaryImage?.image_url || product.images[0].image_url
    }
    // If images is an array of strings
    if (typeof product.images[0] === 'string') {
      return product.images[0]
    }
  }
  // Fallback to placeholder
  return 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'
}

export default function WishlistPageClient() {
  // Use wishlist context
  const { items, removeItem } = useWishlist()
  const { addItem: addToCart } = useCart()
  const router = useRouter()
  
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())
  const [addingToCartIds, setAddingToCartIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const removeFromWishlist = async (productId: string, productName: string) => {
    setRemovingIds(prev => new Set(prev).add(productId))
    
    try {
      removeItem(productId)
      toast.success("Removed from wishlist", {
        description: productName
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove item")
    } finally {
      setRemovingIds(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  const addToCartOnly = async (wishlistItem: any) => {
    const productId = wishlistItem.product.id
    setAddingToCartIds(prev => new Set(prev).add(productId))
    
    try {
      addToCart(wishlistItem.product, 1)
      
      toast.success("Added to cart!", {
        description: wishlistItem.product.name,
        action: {
          label: "View Cart",
          onClick: () => router.push("/account/cart"),
        },
      })
      
      setTimeout(() => {
        setAddingToCartIds(prev => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
      }, 1000)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add to cart")
      setAddingToCartIds(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  // Filter and sort wishlists
  const filteredWishlists = items
    .filter(item => {
      if (!searchQuery) return true
      const search = searchQuery.toLowerCase()
      const brand = item.product.brand
      const category = item.product.category
      
      return (
        item.product.name.toLowerCase().includes(search) ||
        (category && (typeof category === 'object' ? category.name : category).toLowerCase().includes(search)) ||
        (brand && (typeof brand === 'object' ? brand.name : brand).toLowerCase().includes(search))
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
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })

  // Empty State
  if (items.length === 0) {
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
              {items.length} {items.length === 1 ? "item" : "items"} saved for later
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
              Showing {filteredWishlists.length} of {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  filteredWishlists.forEach(item => {
                    addToCartOnly(item)
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
              {filteredWishlists.map((wishlistItem) => {
                const product = wishlistItem.product
                const image = getProductImage(product)
                const isRemoving = removingIds.has(product.id)
                const isAddingToCart = addingToCartIds.has(product.id)

                if (viewMode === "list") {
                  return (
                    <div
                      key={product.id}
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
                              {typeof product.brand === 'object' ? product.brand.name : product.brand}
                            </p>
                          )}
                          <Link
                            href={`/product/${product.slug}`}
                            className="font-serif text-xl text-foreground hover:text-primary transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {product.category && (typeof product.category === 'object' ? product.category.name : product.category)}
                          </p>
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
                              onClick={() => addToCartOnly(wishlistItem)}
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
                              onClick={() => removeFromWishlist(product.id, product.name)}
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
                    key={product.id}
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
                          removeFromWishlist(product.id, product.name)
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
                            {typeof product.brand === 'object' ? product.brand.name : product.brand}
                          </p>
                        )}
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 block"
                        >
                          {product.name}
                        </Link>
                        {product.category && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {typeof product.category === 'object' ? product.category.name : product.category}
                          </p>
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
                        onClick={() => addToCartOnly(wishlistItem)}
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
                        Added {new Date(wishlistItem.addedAt).toLocaleDateString("en-LK", {
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