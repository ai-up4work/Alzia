import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { ProductShareButton } from "@/components/ProductShareButton"
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
  if (viewMode === "list") {
    return (
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden flex">
        <Link href={`/?page=product&slug=${product.slug}`} className="w-48 aspect-square flex-shrink-0">
          <img src={image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </Link>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
            <Link href={`/?page=product&slug=${product.slug}`}>
              <h3 className="font-serif text-xl text-foreground font-medium mb-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mb-3">{product.short_description}</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{product.rating_avg}</span>
              <span className="text-sm text-muted-foreground">({product.rating_count} reviews)</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-medium text-foreground">{formatPrice(product.retail_price)}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full bg-transparent" aria-label="Add to wishlist">
                <Heart className="w-4 h-4" />
              </Button>
              <ProductShareButton product={product} className="h-8 w-24 p-0 rounded-full" size="sm" variant="outline" />
              <Button size="sm" className="rounded-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
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
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
            Bestseller
          </span>
        )}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4 text-foreground" />
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
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium text-foreground">{product.rating_avg}</span>
          <span className="text-xs text-muted-foreground">({product.rating_count})</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">{formatPrice(product.retail_price)}</span>
          <div className="flex gap-1.5">
            <ProductShareButton product={product} showText={false} className="h-8 w-8 p-0 rounded-full" size="sm" variant="outline" />
            <Button
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}