"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star, Check } from "lucide-react"
import { ProductShareButton } from "@/components/ProductShareButton"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price)
}

export function ProductCard({
  product,
  viewMode,
  image,
}: {
  product: Product
  viewMode: "grid" | "list"
  image: string
}) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock_quantity === 0) {
      toast.error('Out of stock', {
        description: 'This product is currently unavailable'
      })
      return
    }
    
    setIsAddingToCart(true)
    
    // Add to cart
    addItem(product, 1)
    
    // Show success toast
    toast.success('Added to cart!', {
      description: product.name,
      action: {
        label: "View Cart",
        onClick: () => router.push("/account/cart"),
      },
    })
    
    // Reset state
    setTimeout(() => {
      setIsAddingToCart(false)
    }, 1000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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

  if (viewMode === "list") {
    return (
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden flex hover:shadow-lg transition-shadow duration-300">
        <Link href={`/product/${product.slug}`} className="w-48 aspect-square flex-shrink-0 relative overflow-hidden bg-muted">
          <img 
            src={image || "/placeholder.svg"} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
          />
          {product.is_featured && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
              Bestseller
            </span>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-medium text-sm">Out of Stock</span>
            </div>
          )}
        </Link>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif text-xl text-foreground font-medium mb-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.short_description}</p>
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating_avg)
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium ml-1">{product.rating_avg}</span>
              <span className="text-sm text-muted-foreground">({product.rating_count} reviews)</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-lg font-medium text-foreground">{formatPrice(product.retail_price)}</span>
              {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                <p className="text-xs text-orange-600 font-medium mt-1">
                  Only {product.stock_quantity} left
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full bg-transparent" 
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                onClick={handleWishlist}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <ProductShareButton 
                product={product} 
                className="h-9 w-24 p-0 rounded-full" 
                size="sm" 
                variant="outline" 
              />
              <Button 
                size="sm" 
                className="rounded-full"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <Check className="w-4 h-4 mr-2 animate-in zoom-in" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-card rounded-2xl lg:rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all duration-500">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
            Bestseller
          </span>
        )}
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-medium text-sm">Out of Stock</span>
          </div>
        )}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
            Only {product.stock_quantity} left
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-background hover:scale-110 shadow-lg"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
        </button>
      </Link>

      <div className="p-4 lg:p-5">
        <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-base lg:text-lg text-foreground font-medium mb-1 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{product.short_description}</p>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating_avg)
                    ? "fill-accent text-accent"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-foreground ml-1">{product.rating_avg}</span>
          <span className="text-xs text-muted-foreground">({product.rating_count})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">{formatPrice(product.retail_price)}</span>
          <div className="flex gap-1.5">
            <ProductShareButton 
              product={product} 
              showText={false} 
              className="h-8 w-8 p-0 rounded-full" 
              size="sm" 
              variant="outline" 
            />
            <Button
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-110"
              aria-label="Add to cart"
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0 || isAddingToCart}
            >
              {isAddingToCart ? (
                <Check className="w-4 h-4 animate-in zoom-in" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}