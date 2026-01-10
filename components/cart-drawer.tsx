"use client"

import { useCart } from "@/lib/cart-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"

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

export function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, totalItems, subtotal } = useCart()

  return (
    <Sheet open={state.isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Shopping Bag ({totalItems})</SheetTitle>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="font-serif text-xl text-foreground mb-2">Your bag is empty</h3>
            <p className="text-muted-foreground mb-6">Discover our luxury cosmetics collection</p>
            <Button asChild className="rounded-full" onClick={closeCart}>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {state.items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <Link
                    href={`/product/${item.product.slug}`}
                    onClick={closeCart}
                    className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0"
                  >
                    <img
                      src={productImages[item.product.slug] || "/luxury-cosmetic-product.jpg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{item.product.category?.name}</p>
                    <p className="font-medium text-foreground">{formatPrice(item.product.retail_price)}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded-full">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors rounded-l-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors rounded-r-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</p>

              <div className="grid gap-3">
                <Button asChild size="lg" className="rounded-full" onClick={closeCart}>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent" onClick={closeCart}>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
