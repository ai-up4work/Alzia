"use client"

import { useCart } from "@/lib/wholesale-cart-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, X, Sparkles } from "lucide-react"
import Link from "next/link"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(price)
}

// ── Same interpolation logic as wholesale-product-card ────────────────────────
// Must stay in sync with getUnitPrice in wholesale-product-card.tsx

function calcUnitPrice(product: any, quantity: number): number {
  const wp = Array.isArray(product.wholesale_pricing)
    ? product.wholesale_pricing[0]
    : product.wholesale_pricing

  if (!wp) return product.wholesale_price

  const minPrice = Number(wp.min_price)
  const maxPrice = Number(wp.max_price)
  const moq = Number(wp.moq)
  const qty = Math.max(1, quantity)

  if (qty >= moq) return minPrice
  if (moq <= 1) return minPrice

  const ratio = (qty - 1) / (moq - 1)
  return Math.round(maxPrice - (maxPrice - minPrice) * ratio)
}

export function WholesaleCartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, updateQuantityAndPrice, totalItems, subtotal } = useCart()

  // When quantity changes in the drawer, recalculate unit price too
  const handleQuantityChange = (productId: string, product: any, newQty: number) => {
    if (newQty <= 0) {
      removeItem(productId)
      return
    }
    const newUnitPrice = calcUnitPrice(product, newQty)
    updateQuantityAndPrice(productId, newQty, newUnitPrice)
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Wholesale Cart {totalItems > 0 && `(${totalItems})`}
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Prices reflect your volume discount
              </p>
            </div>
            <button
              onClick={closeCart}
              className="rounded-full p-2 hover:bg-muted transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-3">Your cart is empty</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Add products from the wholesale portal to get started
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-white"
              onClick={closeCart}
            >
              <Link href="/wholesale">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-4">
                {state.items.map((item) => {
                  const lineTotal = item.unit_price * item.quantity
                  const image =
                    item.product.images?.find((i: any) => i.is_primary)?.image_url ||
                    item.product.images?.[0]?.image_url ||
                    "/placeholder.png"

                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-4 rounded-2xl border border-border hover:border-secondary/30 hover:shadow-sm transition-all"
                    >
                      {/* Image */}
                      <Link
                        href={`/wholesale/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0 group"
                      >
                        <img
                          src={image}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col">
                        {/* Name + remove */}
                        <div className="flex justify-between gap-2 mb-0.5">
                          <Link
                            href={`/wholesale/product/${item.product.slug}`}
                            onClick={closeCart}
                            className="font-serif text-sm text-foreground hover:text-primary transition-colors line-clamp-2 flex-1"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1.5 -mt-1 -mr-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* SKU */}
                        <p className="text-xs text-muted-foreground mb-2">{item.product.sku}</p>

                        {/* Dynamic unit price badge */}
                        <div className="flex items-center gap-1.5 mb-3">
                          <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-medium">
                            {formatPrice(item.unit_price)} / unit
                          </span>
                          {item.product.retail_price > item.unit_price && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.product.retail_price)}
                            </span>
                          )}
                        </div>

                        {/* Quantity + line total */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-border rounded-full bg-background">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.product.id, item.product, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors rounded-l-full"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <span className="w-10 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.product.id, item.product, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors rounded-r-full"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-foreground">{formatPrice(lineTotal)}</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} × {formatPrice(item.unit_price)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-muted/30 px-6 py-6">
              <div className="space-y-5">
                {/* Savings summary */}
                {(() => {
                  const retailTotal = state.items.reduce(
                    (sum, item) => sum + item.product.retail_price * item.quantity,
                    0
                  )
                  const saved = retailTotal - subtotal
                  return saved > 0 ? (
                    <div className="flex items-center justify-between text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5">
                      <span className="text-green-700 font-medium">You're saving</span>
                      <span className="text-green-700 font-bold">{formatPrice(saved)}</span>
                    </div>
                  ) : null
                })()}

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-2xl font-medium text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Wholesale pricing applied · Taxes calculated at checkout
                </p>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-full h-12 text-base font-medium bg-secondary hover:bg-secondary/90 text-white"
                    onClick={closeCart}
                  >
                    <Link href="/wholesale/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full h-12 text-base font-medium bg-background hover:bg-muted"
                    onClick={closeCart}
                  >
                    <Link href="/wholesale/cart">View Full Cart</Link>
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    onClick={closeCart}
                    className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}