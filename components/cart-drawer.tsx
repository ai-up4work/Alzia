"use client"

import { useCart } from "@/lib/cart-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react"
import Link from "next/link" 


function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    currencyDisplay: "code", // 👈 forces LKR instead of symbol
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
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        {/* Header with padding */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-serif text-2xl text-gray-900">
              Shopping Bag {totalItems > 0 && `(${totalItems})`}
            </SheetTitle>
            <button
              onClick={closeCart}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </SheetHeader>

        {state.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="font-serif text-2xl text-gray-900 mb-3">Your bag is empty</h3>
            <p className="text-gray-500 mb-8 max-w-sm">
              Discover our collection of luxury cosmetics crafted in Paris
            </p>
            <Button asChild size="lg" className="rounded-full px-8" onClick={closeCart}>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items with padding */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {state.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <Link
                      href={`/product/${item.product.slug}`}
                      onClick={closeCart}
                      className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 group"
                    >
                      <img
                        src={productImages[item.product.slug] || "/luxury-cosmetic-product.jpg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between gap-2 mb-1">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="font-serif text-base text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 flex-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 -mt-1 -mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-500 mb-3">{item.product.category?.name}</p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-gray-200 rounded-full bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-l-full"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-r-full"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.product.retail_price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              {formatPrice(item.product.retail_price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with padding */}
            <div className="border-t bg-gray-50/50 px-6 py-6">
              <div className="space-y-6">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-serif text-2xl font-medium text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-full h-12 text-base font-medium"
                    onClick={closeCart}
                  >
                    <Link href="/account/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full rounded-full h-12 text-base font-medium bg-white hover:bg-gray-50"
                    onClick={closeCart}
                  >
                    <Link href="/account/cart">View Full Cart</Link>
                  </Button>
                </div>

                {/* Continue Shopping Link */}
                <div className="text-center">
                  <button
                    onClick={closeCart}
                    className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors"
                  >
                    <Link href="/shop">Continue Shopping</Link>
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
