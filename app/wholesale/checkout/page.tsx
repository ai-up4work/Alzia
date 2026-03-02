"use client"

import type React from "react"
import { useState } from "react"
import { useCart } from "@/lib/wholesale-cart-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, CreditCard, Truck, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"
import { CheckoutSteps } from "@/components/CheckoutSteps"
import { supabase } from "@/lib/supabase/supabase"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(price)
}

const WHATSAPP_NUMBER = "94779303482"

function buildWhatsAppMessage(
  orderNumber: string,
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    pinCode: string
    landmark: string
    deliveryInstructions: string
    paymentMethod: string
    companyName: string
  },
  items: { name: string; sku: string; quantity: number; unitPrice: number; lineTotal: number }[],
  subtotal: number,
  retailTotal: number,
  deliveryCharge: number,
  total: number
) {
  const itemLines = items
    .map(
      (i) =>
        `  • ${i.name} (${i.sku}) x${i.quantity} @ LKR ${i.unitPrice.toLocaleString()} = LKR ${i.lineTotal.toLocaleString()}`
    )
    .join("\n")

  const address = [
    formData.addressLine1,
    formData.addressLine2,
    formData.city,
    formData.state,
    formData.pinCode,
    formData.landmark ? `(Near ${formData.landmark})` : "",
  ]
    .filter(Boolean)
    .join(", ")

  const saved = retailTotal - subtotal

  return encodeURIComponent(
    `🏭 *New Wholesale Order!*\n\n` +
    `*Order #:* ${orderNumber}\n` +
    `*Business:* ${formData.companyName || "N/A"}\n` +
    `*Contact:* ${formData.firstName} ${formData.lastName}\n` +
    `*Email:* ${formData.email}\n` +
    `*Phone:* ${formData.phone}\n\n` +
    `*📦 Items:*\n${itemLines}\n\n` +
    `*Subtotal (Wholesale):* LKR ${subtotal.toLocaleString()}\n` +
    `*Retail Value:* LKR ${retailTotal.toLocaleString()}\n` +
    `*Total Savings:* LKR ${saved.toLocaleString()}\n` +
    `*Delivery:* ${deliveryCharge === 0 ? "FREE" : `LKR ${deliveryCharge.toLocaleString()}`}\n` +
    `*Total:* LKR ${total.toLocaleString()}\n\n` +
    `*💳 Payment:* ${formData.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}\n\n` +
    `*📍 Address:*\n${address}\n` +
    (formData.deliveryInstructions ? `\n*Instructions:* ${formData.deliveryInstructions}` : "")
  )
}

export default function WholesaleCheckoutPage() {
  // ✅ Wholesale cart — uses unit_price, completely separate from retail
  const { state, subtotal, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({})

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    companyName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    landmark: "",
    deliveryInstructions: "",
    paymentMethod: "cod",
  })

  // Wholesale free delivery threshold is higher than retail
  const deliveryCharge = subtotal >= 5000 ? 0 : 350
  const total = subtotal + deliveryCharge

  // Retail total for savings display
  const retailTotal = state.items.reduce(
    (sum, item) => sum + item.product.retail_price * item.quantity,
    0
  )
  const totalSavings = retailTotal - subtotal

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const isStep1Valid = () =>
    !!(formData.email && formData.firstName && formData.lastName && formData.phone)

  const isStep2Valid = () =>
    !!(formData.addressLine1 && formData.city && formData.state && formData.pinCode)

  const handleContinueToStep = (nextStep: number) => {
    setCompletedSteps((prev) => ({ ...prev, [step]: true }))
    setStep(nextStep)
  }

  const handleStepClick = (targetStep: number) => {
    if (targetStep <= step || completedSteps[targetStep - 1]) {
      setStep(targetStep)
    }
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const orderNumber = `WHL${Date.now().toString(36).toUpperCase()}`

      // ── 1. Insert wholesale order ─────────────────────────────────────
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          order_type: "wholesale", // ✅ Flag as wholesale
          customer_email: formData.email,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_phone: formData.phone,
          company_name: formData.companyName || null,
          status: "pending",
          payment_status: "pending",
          payment_method: formData.paymentMethod,
          subtotal,
          delivery_charge: deliveryCharge,
          discount_amount: totalSavings, // savings vs retail
          tax_amount: 0,
          total_amount: total,
          delivery_instructions: formData.deliveryInstructions || null,
          shipping_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName || null,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2 || null,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
            landmark: formData.landmark || null,
            phone: formData.phone,
          },
        })
        .select("id")
        .single()

      if (orderError) throw new Error(`Order creation failed: ${orderError.message}`)

      // ── 2. Insert order_items using wholesale unit_price ──────────────
      const orderItems = state.items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_sku: item.product.sku,
        product_image: item.product.images?.find((i) => i.is_primary)?.image_url ?? null,
        quantity: item.quantity,
        unit_price: item.unit_price,           // ✅ wholesale unit price
        retail_price: item.product.retail_price, // kept for reference
        total_price: item.unit_price * item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
      if (itemsError) throw new Error(`Order items failed: ${itemsError.message}`)

      // ── 3. WhatsApp notification ──────────────────────────────────────
      const waItems = state.items.map((item) => ({
        name: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        lineTotal: item.unit_price * item.quantity,
      }))

      const waMessage = buildWhatsAppMessage(
        orderNumber,
        formData,
        waItems,
        subtotal,
        retailTotal,
        deliveryCharge,
        total
      )

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`, "_blank")

      // ── 4. Clear cart and redirect ────────────────────────────────────
      clearCart()
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
      window.location.href = `${baseUrl}/account/order-confirmation?order=${orderNumber}`
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-serif text-3xl text-foreground mb-4">Your wholesale cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some products from the wholesale portal</p>
            <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90 text-white">
              <Link href="/wholesale">Browse Wholesale</Link>
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
          {/* Back button */}
          <Link
            href="/wholesale"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Wholesale
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* ── Checkout Form ── */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h1 className="font-serif text-3xl md:text-4xl text-foreground font-light">
                  Wholesale Checkout
                </h1>
              </div>

              <CheckoutSteps currentStep={step} onStepClick={handleStepClick} />

              {/* Step 1: Contact */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl text-foreground">Contact Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Business / Company Name (Optional)</Label>
                      <Input
                        id="companyName" name="companyName" value={formData.companyName}
                        onChange={handleInputChange} placeholder="Your business name"
                        className="mt-1.5 h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email" name="email" type="email" value={formData.email}
                        onChange={handleInputChange} placeholder="your@email.com"
                        className="mt-1.5 h-12 rounded-xl" required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName" name="firstName" value={formData.firstName}
                          onChange={handleInputChange} className="mt-1.5 h-12 rounded-xl" required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName" name="lastName" value={formData.lastName}
                          onChange={handleInputChange} className="mt-1.5 h-12 rounded-xl" required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone" name="phone" type="tel" value={formData.phone}
                        onChange={handleInputChange} placeholder="+94 77 930 3482"
                        className="mt-1.5 h-12 rounded-xl" required
                      />
                    </div>
                  </div>
                  <Button
                    size="lg" className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-white"
                    onClick={() => handleContinueToStep(2)} disabled={!isStep1Valid()}
                  >
                    Continue to Shipping
                  </Button>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl text-foreground">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1" name="addressLine1" value={formData.addressLine1}
                        onChange={handleInputChange} placeholder="House/Flat No., Building Name"
                        className="mt-1.5 h-12 rounded-xl" required
                      />
                    </div>
                    <div>
                      <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                      <Input
                        id="addressLine2" name="addressLine2" value={formData.addressLine2}
                        onChange={handleInputChange} placeholder="Street, Area"
                        className="mt-1.5 h-12 rounded-xl"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city" name="city" value={formData.city}
                          onChange={handleInputChange} className="mt-1.5 h-12 rounded-xl" required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state" name="state" value={formData.state}
                          onChange={handleInputChange} className="mt-1.5 h-12 rounded-xl" required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pinCode">PIN Code</Label>
                        <Input
                          id="pinCode" name="pinCode" value={formData.pinCode}
                          onChange={handleInputChange} className="mt-1.5 h-12 rounded-xl" required
                        />
                      </div>
                      <div>
                        <Label htmlFor="landmark">Landmark (Optional)</Label>
                        <Input
                          id="landmark" name="landmark" value={formData.landmark}
                          onChange={handleInputChange} placeholder="Near..."
                          className="mt-1.5 h-12 rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</Label>
                      <Textarea
                        id="deliveryInstructions" name="deliveryInstructions"
                        value={formData.deliveryInstructions} onChange={handleInputChange}
                        placeholder="Any special instructions..."
                        className="mt-1.5 rounded-xl resize-none" rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="lg" className="rounded-full bg-transparent"
                      onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      size="lg" className="flex-1 rounded-full bg-secondary hover:bg-secondary/90 text-white"
                      onClick={() => handleContinueToStep(3)} disabled={!isStep2Valid()}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="font-serif text-xl text-foreground">Payment Method</h2>

                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, paymentMethod: value }))
                    }
                    className="space-y-4"
                  >
                    <div
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        formData.paymentMethod === "cod"
                          ? "border-secondary bg-secondary/5"
                          : "border-border"
                      }`}
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

                    <div className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-not-allowed opacity-60 border-border bg-muted/30">
                      <RadioGroupItem value="online" id="online" disabled />
                      <Label htmlFor="online" className="flex-1 cursor-not-allowed">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">Online Payment</p>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                Not yet enabled
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Credit/Debit Card, Bank Transfer
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-muted-foreground">
                      Your payment information is secure and encrypted
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      variant="outline" size="lg" className="rounded-full bg-transparent"
                      onClick={() => setStep(2)} disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 rounded-full bg-secondary hover:bg-secondary/90 text-white"
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Place Wholesale Order · ${formatPrice(total)}`
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Order Summary ── */}
            <div>
              <div className="bg-card rounded-2xl border border-border/50 p-6 sticky top-32">
                <h2 className="font-serif text-xl text-foreground mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {state.items.map((item) => {
                    const image =
                      item.product.images?.find((i) => i.is_primary)?.image_url ||
                      item.product.images?.[0]?.image_url ||
                      "/placeholder.png"

                    return (
                      <div key={item.product.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0 relative">
                          <img
                            src={image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                          {/* Wholesale unit price vs retail */}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-secondary font-medium">
                              {formatPrice(item.unit_price)}/unit
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.product.retail_price)}
                            </span>
                          </div>
                        </div>
                        {/* ✅ Line total uses unit_price not retail_price */}
                        <p className="text-sm font-medium text-foreground">
                          {formatPrice(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-3 pt-6 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Wholesale Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Total Savings</span>
                      <span className="text-green-600 font-medium">−{formatPrice(totalSavings)}</span>
                    </div>
                  )}
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
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free delivery on orders over {formatPrice(5000)}
                    </p>
                  )}
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