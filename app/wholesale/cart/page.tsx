"use client"

import { useCart } from "@/lib/wholesale-cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, TrendingDown } from "lucide-react"
import Link from "next/link"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(price)
}

// Same interpolation logic as wholesale-product-card.tsx
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

export default function WholesaleCartPage() {
  const { state, removeItem, updateQuantityAndPrice, totalItems, subtotal } = useCart()

  const deliveryCharge = subtotal >= 5000 ? 0 : 350
  const total = subtotal + deliveryCharge

  const retailTotal = state.items.reduce(
    (sum, item) => sum + item.product.retail_price * item.quantity,
    0
  )
  const totalSavings = retailTotal - subtotal

  const handleQuantityChange = (productId: string, product: any, newQty: number) => {
    if (newQty <= 0) {
      removeItem(productId)
      return
    }
    const newUnitPrice = calcUnitPrice(product, newQty)
    updateQuantityAndPrice(productId, newQty, newUnitPrice)
  }

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center py-24">
              <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
              <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                Your wholesale cart is empty
              </h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Browse our wholesale portal and add products to get started.
              </p>
              <Button
                asChild size="lg"
                className="rounded-full bg-secondary hover:bg-secondary/90 text-white"
              >
                <Link href="/wholesale">Browse Wholesale</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Sparkles className="w-6 h-6 text-secondary" />
            <h1 className="font-serif text-4xl md:text-5xl text-foreground font-light">
              Wholesale Cart ({totalItems})
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-6">
              {state.items.map((item) => {
                const lineTotal = item.unit_price * item.quantity
                const image =
                  item.product.images?.find((i: any) => i.is_primary)?.image_url ||
                  item.product.images?.[0]?.image_url ||
                  "/placeholder.png"
                const savedPerUnit = item.product.retail_price - item.unit_price

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-6 p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:border-secondary/20 transition-colors"
                  >
                    {/* Image */}
                    <Link
                      href={`/wholesale/product/${item.product.slug}`}
                      className="w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0 group"
                    >
                      <img
                        src={image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/wholesale/product/${item.product.slug}`}
                            className="font-serif text-lg text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{item.product.sku}</p>

                          {/* Wholesale unit price badge */}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-medium">
                              {formatPrice(item.unit_price)} / unit
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.product.retail_price)}
                            </span>
                            {savedPerUnit > 0 && (
                              <span className="text-xs text-green-600 flex items-center gap-0.5">
                                <TrendingDown className="w-3 h-3" />
                                {formatPrice(savedPerUnit)} off
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        {/* Quantity stepper — recalculates unit price on change */}
                        <div className="flex items-center border rounded-full border-border">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.product.id, item.product, item.quantity - 1)
                            }
                            className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-l-full"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.product.id, item.product, item.quantity + 1)
                            }
                            className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-r-full"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-medium text-foreground">
                            {formatPrice(lineTotal)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-muted-foreground">
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

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border/50 p-6 sticky top-32">
                <h2 className="font-serif text-xl text-foreground mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  Order Summary
                </h2>

                {/* Savings highlight */}
                {totalSavings > 0 && (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6">
                    <span className="text-sm text-green-700 font-medium">Total Savings</span>
                    <span className="text-sm text-green-700 font-bold">
                      −{formatPrice(totalSavings)}
                    </span>
                  </div>
                )}

                <div className="space-y-4 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wholesale Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Retail Value</span>
                      <span className="text-muted-foreground line-through">
                        {formatPrice(retailTotal)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground">
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(deliveryCharge)
                      )}
                    </span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free delivery on orders above {formatPrice(5000)}
                    </p>
                  )}
                </div>

                <div className="flex justify-between py-6 border-b border-border">
                  <span className="text-lg font-medium text-foreground">Total</span>
                  <span className="text-lg font-medium text-foreground">{formatPrice(total)}</span>
                </div>

                <Button
                  asChild size="lg"
                  className="w-full rounded-full mt-6 bg-secondary hover:bg-secondary/90 text-white"
                >
                  <Link href="/wholesale/checkout">Proceed to Checkout</Link>
                </Button>

                <Button
                  asChild variant="ghost"
                  className="w-full mt-3 text-muted-foreground"
                >
                  <Link href="/wholesale">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}