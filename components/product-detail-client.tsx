"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star, Minus, Plus, Truck, RotateCcw, Shield, ChevronRight, Package, Sparkles, Check } from "lucide-react"
import { ProductShareButton } from "@/components/ProductShareButton"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import Image from "next/image"

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
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

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const router = useRouter()
  
  // Get cart and wishlist functions
  const { addItem, openCart } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  
  const inWishlist = isInWishlist(product.id)

  const mainImage =
    product.images?.[selectedImage]?.image_url || productImages[product.slug] || "/luxury-cosmetic-product.jpg"

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    setIsAddingToCart(true)
    
    // Add item to cart
    addItem(product, quantity)
    
    // Show success toast
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`, {
      description: product.name,
      action: {
        label: "View Cart",
        onClick: () => router.push("/account/cart"),
      },
    })
    
    // Reset adding state after animation
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
    
    // Optional: Open cart sidebar
    // openCart()
  }

  const handleWishlist = () => {
    toggleItem(product)
    
    if (inWishlist) {
      toast.success('Removed from wishlist', {
        description: product.name
      })
    } else {
      toast.success('Added to wishlist!', {
        description: product.name
      })
    }
  }

  const inStock = product.stock_quantity > 0

  // Check what information is available
  const hasDescription = product.description && product.description.trim().length > 0
  const hasIngredients = product.ingredients && product.ingredients.trim().length > 0
  const hasUsageInstructions = product.usage_instructions && product.usage_instructions.trim().length > 0
  const hasAnyProductInfo = hasDescription || hasIngredients || hasUsageInstructions

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4" />
            {product.category && (
              <>
                <Link href={`/shop/${product.category.slug}`} className="hover:text-foreground transition-colors">
                  {product.category.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
                <div className="relative w-full aspect-square">
                  <Image
                    src={mainImage || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>              
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.image_url || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {product.brand && (
                <Link
                  href={`/shop?brand=${product.brand.slug}`}
                  className="text-sm text-secondary font-medium uppercase tracking-wider hover:text-primary transition-colors"
                >
                  {product.brand.name}
                </Link>
              )}

              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-light mt-2 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating_avg) ? "fill-accent text-accent" : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating_avg}</span>
                <span className="text-sm text-muted-foreground">
                  {product.rating_count > 0 ? `(${product.rating_count} reviews)` : '(No reviews yet)'}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-medium text-foreground">{formatPrice(product.retail_price)}</span>
                <span className="text-sm text-muted-foreground ml-2">incl. taxes</span>
              </div>

              {/* Short Description */}
              {(product.short_description || product.description) && (
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {product.short_description || product.description?.slice(0, 200)}
                </p>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {inStock ? (
                  <span className="inline-flex items-center gap-2 text-sm text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm text-red-600">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col gap-3 mb-8">
                {/* Add to Cart Button - Full width on mobile, first line on desktop */}
                <Button
                  size="lg"
                  className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  disabled={!inStock || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2 animate-in zoom-in" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Add to Cart - {formatPrice(product.retail_price * quantity)}</span>
                      <span className="sm:hidden">Add to Cart</span>
                    </>
                  )}
                </Button>

                {/* Quantity, Wishlist, Share - Full width on mobile */}
                <div className="flex gap-3 w-full">
                  <div className="flex items-center border rounded-full flex-1">
                    <button
                      onClick={decreaseQuantity}
                      className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors rounded-l-full"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-medium">{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors rounded-r-full"
                      disabled={quantity >= product.stock_quantity}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-40 flex-shrink-0 rounded-full p-0"
                    onClick={handleWishlist}
                    aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 mr-2 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    {inWishlist ? 'In Wishlist' : 'Wishlist'}
                  </Button>

                  <ProductShareButton product={product} className="h-12 w-32 flex-shrink-0 rounded-full p-0" />
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Orders over LKR 2,999</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">Within 30 days</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">100% Authentic</p>
                  <p className="text-xs text-muted-foreground">Guaranteed</p>
                </div>
              </div>

              {/* SKU */}
              <p className="text-sm text-muted-foreground mt-6">
                SKU: <span className="text-foreground">{product.sku}</span>
              </p>
            </div>
          </div>

          {/* Product Details Section - Only show if we have information */}
          {hasAnyProductInfo && (
            <div className="mt-16">
              <h2 className="font-serif text-3xl text-foreground font-light mb-8">Product Details</h2>
              
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Description Card */}
                {hasDescription && (
                  <div className="bg-card border border-border/50 rounded-2xl p-6 lg:p-8 hover:border-border transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-foreground font-light">About This Product</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Ingredients Card */}
                {hasIngredients && (
                  <div className="bg-card border border-border/50 rounded-2xl p-6 lg:p-8 hover:border-border transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-foreground font-light">Key Ingredients</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{product.ingredients}</p>
                  </div>
                )}

                {/* How to Use Card */}
                {hasUsageInstructions && (
                  <div className="bg-card border border-border/50 rounded-2xl p-6 lg:p-8 hover:border-border transition-colors lg:col-span-2">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl text-foreground font-light">How to Use</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{product.usage_instructions}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Section - Always show */}
          <div className="mt-16">
            <div className="bg-gradient-to-br from-card to-muted/20 border border-border/50 rounded-2xl p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-2xl text-foreground font-light mb-2">Customer Reviews</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating_avg) ? "fill-accent text-accent" : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium">{product.rating_avg}</span>
                    <span className="text-sm text-muted-foreground">
                      {product.rating_count > 0 
                        ? `Based on ${product.rating_count} ${product.rating_count === 1 ? 'review' : 'reviews'}`
                        : 'No reviews yet'
                      }
                    </span>
                  </div>
                </div>
                
                <Button variant="outline" className="rounded-full w-full sm:w-auto">
                  {product.rating_count > 0 ? 'Write a Review' : 'Be the First to Review'}
                </Button>
              </div>
              
              {product.rating_count === 0 && (
                <p className="text-muted-foreground text-center py-8 border-t border-border/50">
                  Share your experience with this product and help others make informed decisions.
                </p>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <h2 className="font-serif text-3xl text-foreground font-light mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/product/${relatedProduct.slug}`} className="group">
                    <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-border transition-colors">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={
                            productImages[relatedProduct.slug] ||
                            "/placeholder.svg?height=400&width=400&query=luxury cosmetic" ||
                            "/placeholder.svg"
                          }
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-foreground mb-1 line-clamp-1">{relatedProduct.name}</h3>
                        <p className="text-sm text-muted-foreground">{formatPrice(relatedProduct.retail_price)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}