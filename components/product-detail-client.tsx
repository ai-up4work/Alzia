"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ShoppingBag, Star, Minus, Plus, Truck, RotateCcw, Shield, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
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

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const mainImage =
    product.images?.[selectedImage]?.image_url || productImages[product.slug] || "/luxury-cosmetic-product.jpg"

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) setQuantity(quantity + 1)
  }

  const inStock = product.stock_quantity > 0

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
                <img src={mainImage || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
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
                <span className="text-sm text-muted-foreground">({product.rating_count} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-medium text-foreground">{formatPrice(product.retail_price)}</span>
                <span className="text-sm text-muted-foreground ml-2">incl. taxes</span>
              </div>

              {/* Short Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.short_description || product.description?.slice(0, 200)}
              </p>

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
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border rounded-full">
                  <button
                    onClick={decreaseQuantity}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors rounded-l-full"
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors rounded-r-full"
                    disabled={quantity >= product.stock_quantity}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center border rounded-full">
                  <Button
                    size="lg"
                    className="flex-1 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!inStock}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Cart - {formatPrice(product.retail_price * quantity)}
                  </Button>
                </div>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-12 rounded-full p-0 bg-transparent"
                  aria-label="Add to wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">Orders over ₹999</p>
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

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 overflow-x-auto overflow-y-hidden flex-nowrap">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 py-4 text-sm sm:text-base whitespace-nowrap"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="ingredients"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 py-4 text-sm sm:text-base whitespace-nowrap"
                >
                  Ingredients
                </TabsTrigger>
                <TabsTrigger
                  value="how-to-use"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 py-4 text-sm sm:text-base whitespace-nowrap"
                >
                  How to Use
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 py-4 text-sm sm:text-base whitespace-nowrap"
                >
                  Reviews ({product.rating_count})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-8">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="leading-relaxed">{product.description}</p>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="pt-8">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="leading-relaxed">{product.ingredients || "Ingredient information coming soon."}</p>
                </div>
              </TabsContent>

              <TabsContent value="how-to-use" className="pt-8">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="leading-relaxed">{product.usage_instructions || "Usage instructions coming soon."}</p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-8">
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Reviews will be displayed here once customers start reviewing this product.
                  </p>
                  <Button variant="outline" className="rounded-full bg-transparent">
                    Write a Review
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-24">
              <h2 className="font-serif text-3xl text-foreground font-light mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/product/${relatedProduct.slug}`} className="group">
                    <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
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