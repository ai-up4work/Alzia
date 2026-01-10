"use client"

import { useCart } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

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

export default function CartPage() {
  const { state, removeItem, updateQuantity, totalItems, subtotal } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const deliveryCharge = subtotal >= 999 ? 0 : 99
  const total = subtotal - discount + deliveryCharge

  const applyCoupon = () => {
    // Mock coupon validation
    if (couponCode.toUpperCase() === "WELCOME10") {
      setDiscount(Math.min(subtotal * 0.1, 500))
    } else {
      setDiscount(0)
    }
  }

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center py-24">
              <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
              <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you have not added anything to your cart yet. Explore our collection of luxury cosmetics.
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/shop">Continue Shopping</Link>
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
          <h1 className="font-serif text-4xl md:text-5xl text-foreground font-light mb-12">
            Shopping Bag ({totalItems})
          </h1>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {state.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-6 p-6 bg-card rounded-2xl border border-border/50 shadow-sm"
                >
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="w-32 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0"
                  >
                    <img
                      src={productImages[item.product.slug] || "/luxury-cosmetic-product.jpg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-serif text-lg text-foreground hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.product.category?.name}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border rounded-full">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-l-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-r-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-medium text-foreground">
                          {formatPrice(item.product.retail_price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">{formatPrice(item.product.retail_price)} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border/50 p-6 sticky top-32">
                <h2 className="font-serif text-xl text-foreground mb-6">Order Summary</h2>

                {/* Coupon Code */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="pl-10 h-11 rounded-full"
                    />
                  </div>
                  <Button variant="outline" className="rounded-full bg-transparent h-11" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>

                <div className="space-y-4 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
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
                    <p className="text-xs text-muted-foreground">Free delivery on orders above {formatPrice(999)}</p>
                  )}
                </div>

                <div className="flex justify-between py-6 border-b border-border">
                  <span className="text-lg font-medium text-foreground">Total</span>
                  <span className="text-lg font-medium text-foreground">{formatPrice(total)}</span>
                </div>

                <Button asChild size="lg" className="w-full rounded-full mt-6">
                  <Link href="/account/checkout">Proceed to Checkout</Link>
                </Button>

                <Button asChild variant="ghost" className="w-full mt-3 text-muted-foreground">
                  <Link href="/shop">Continue Shopping</Link>
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
