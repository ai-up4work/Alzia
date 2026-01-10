"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, CreditCard, Truck, ShieldCheck } from "lucide-react"
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

export default function CheckoutPage() {
  const router = useRouter()
  const { state, subtotal, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    landmark: "",
    deliveryInstructions: "",
    paymentMethod: "cod",
  })

  const deliveryCharge = subtotal >= 999 ? 0 : 99
  const total = subtotal + deliveryCharge

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)

    // Generate order number
    const orderNumber = `LUM${Date.now().toString(36).toUpperCase()}`

    // In a real app, you would save the order to the database here
    // For demo, we'll simulate the order creation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    clearCart()
    router.push(`/order-confirmation?order=${orderNumber}`)
  }

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-serif text-3xl text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some products before checking out</p>
            <Button asChild className="rounded-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="account/cart"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Checkout Form */}
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground font-light mb-8">Checkout</h1>

              {/* Progress Steps */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-foreground" : "text-muted-foreground"}`}>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    1
                  </span>
                  <span className="text-sm font-medium">Contact</span>
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className={`flex items-center gap-2 ${step >= 2 ? "text-foreground" : "text-muted-foreground"}`}>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    2
                  </span>
                  <span className="text-sm font-medium">Shipping</span>
                </div>
                <div className="flex-1 h-px bg-border" />
                <div className={`flex items-center gap-2 ${step >= 3 ? "text-foreground" : "text-muted-foreground"}`}>
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    3
                  </span>
                  <span className="text-sm font-medium">Payment</span>
                </div>
              </div>

              {/* Step 1: Contact Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl text-foreground">Contact Information</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="mt-1.5 h-12 rounded-xl"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="mt-1.5 h-12 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="mt-1.5 h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="mt-1.5 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full rounded-full"
                    onClick={() => setStep(2)}
                    disabled={!formData.email || !formData.firstName || !formData.lastName || !formData.phone}
                  >
                    Continue to Shipping
                  </Button>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl text-foreground">Shipping Address</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        placeholder="House/Flat No., Building Name"
                        className="mt-1.5 h-12 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Street, Area"
                        className="mt-1.5 h-12 rounded-xl"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="mt-1.5 h-12 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="mt-1.5 h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pinCode">PIN Code</Label>
                        <Input
                          id="pinCode"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          className="mt-1.5 h-12 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="landmark">Landmark (Optional)</Label>
                        <Input
                          id="landmark"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          placeholder="Near..."
                          className="mt-1.5 h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                      <Textarea
                        id="deliveryInstructions"
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        placeholder="Any special instructions for delivery..."
                        className="mt-1.5 rounded-xl resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full bg-transparent"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 rounded-full"
                      onClick={() => setStep(3)}
                      disabled={!formData.addressLine1 || !formData.city || !formData.state || !formData.pinCode}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-xl text-foreground">Payment Method</h2>

                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                    className="space-y-4"
                  >
                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive</p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border"}`}
                    >
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">Online Payment</p>
                            <p className="text-sm text-muted-foreground">Credit/Debit Card, UPI, Net Banking</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">Your payment information is secure and encrypted</p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full bg-transparent"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button size="lg" className="flex-1 rounded-full" onClick={handlePlaceOrder} disabled={isLoading}>
                      {isLoading ? "Processing..." : `Place Order - ${formatPrice(total)}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-2xl border border-border/50 p-6 sticky top-32">
                <h2 className="font-serif text-xl text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
                        <img
                          src={productImages[item.product.slug] || "/luxury-cosmetic-product.jpg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.product.category?.name}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {formatPrice(item.product.retail_price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground">
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(deliveryCharge)
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 mt-4 border-t border-border">
                  <span className="text-lg font-medium text-foreground">Total</span>
                  <span className="text-lg font-medium text-foreground">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
