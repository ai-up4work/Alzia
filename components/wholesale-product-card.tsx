"use client"

import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Heart, ShoppingCart, Star, Sparkles, TrendingDown, Zap, Check } from "lucide-react"
import { useCart } from "@/lib/wholesale-cart-context"

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WholesalePricing {
  id: string
  moq: number
  min_price: number
  max_price: number
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string
  brand_id: string
  retail_price: number
  wholesale_price: number
  cost_price: number
  stock_quantity: number
  tags: string[]
  status: string
  is_featured: boolean
  rating_avg: number
  rating_count: number
  created_at: string
  updated_at: string
  category?: { id: string; name: string; slug: string }
  brand?: { id: string; name: string; slug: string; logo_url: string | null }
  images?: { id: string; image_url: string; is_primary: boolean }[]
  // Supabase returns as object (not array) due to unique constraint on product_id
  wholesale_pricing?: WholesalePricing | WholesalePricing[] | null
}

export interface WholesaleProductCardProps {
  product: Product
  viewMode: "grid" | "list"
  quantity: number
  onQuantityChange: (qty: number) => void
}

// ── Helper: normalize wholesale_pricing to single object ─────────────────────

function getWP(product: Product): WholesalePricing | null {
  if (!product.wholesale_pricing) return null
  if (Array.isArray(product.wholesale_pricing)) return product.wholesale_pricing[0] ?? null
  return product.wholesale_pricing
}

// ── Pricing helpers ───────────────────────────────────────────────────────────

export function getUnitPrice(product: Product, quantity: number): number {
  const wp = getWP(product)
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

export function getMarginPercent(product: Product, quantity: number): string | null {
  const unitPrice = getUnitPrice(product, quantity)
  if (product.retail_price === 0 || unitPrice === 0) return null
  const margin = ((product.retail_price - unitPrice) / product.retail_price) * 100
  if (margin <= 0) return null
  return margin.toFixed(0)
}

export function formatPrice(price: number): string {
  if (!isFinite(price)) return "—"
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(price)
}

// ── Animation variants ────────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  hover: { y: -6, transition: { duration: 0.25, ease: "easeOut" } },
}

// ── Pricing tier strip ────────────────────────────────────────────────────────

function PricingTierStrip({ wp, quantity }: { wp: WholesalePricing; quantity: number }) {
  const minPrice = Number(wp.min_price)
  const maxPrice = Number(wp.max_price)
  const moq = Number(wp.moq)

  const atBestPrice = quantity >= moq
  const moqProgress =
    moq <= 1 ? 100 : Math.min(((quantity - 1) / (moq - 1)) * 100, 100)

  const priceAt = (qty: number): number => {
    if (qty >= moq || moq <= 1) return minPrice
    const ratio = (qty - 1) / (moq - 1)
    return Math.round(maxPrice - (maxPrice - minPrice) * ratio)
  }

  const tiers = [
    { qty: 1,                     price: priceAt(1) },
    { qty: Math.ceil(moq * 0.25), price: priceAt(Math.ceil(moq * 0.25)) },
    { qty: Math.ceil(moq * 0.5),  price: priceAt(Math.ceil(moq * 0.5)) },
    { qty: Math.ceil(moq * 0.75), price: priceAt(Math.ceil(moq * 0.75)) },
    { qty: moq,                   price: minPrice },
  ]

  const uniqueTiers = tiers.filter(
    (t, i) => i === 0 || t.price !== tiers[i - 1].price
  )

  return (
    <div className="mt-3 mb-1">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-muted-foreground flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          Volume pricing
        </span>
        <motion.span
          key={String(atBestPrice)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={atBestPrice ? "text-green-600 font-semibold" : "text-secondary font-medium"}
        >
          {atBestPrice ? "✓ Best price!" : `${moq - quantity} units to best price`}
        </motion.span>
      </div>

      <div className="relative h-2 rounded-full bg-muted overflow-hidden mb-3">
        <motion.div
          className={`h-full rounded-full ${
            atBestPrice
              ? "bg-green-500"
              : "bg-gradient-to-r from-secondary/60 to-secondary"
          }`}
          animate={{ width: `${moqProgress}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        {uniqueTiers.map((t, i) => {
          if (i === 0 || moq <= 1) return null
          const pct = Math.min(((t.qty - 1) / (moq - 1)) * 100, 100)
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-background/60"
              style={{ left: `${pct}%` }}
            />
          )
        })}
      </div>

      <div className="flex items-end justify-between gap-1">
        {uniqueTiers.map((t, i) => {
          const isActive =
            quantity >= t.qty &&
            (i === uniqueTiers.length - 1 || quantity < uniqueTiers[i + 1].qty)
          const isPast = quantity >= t.qty
          return (
            <motion.div
              key={i}
              className={`flex flex-col items-center gap-0.5 flex-1 min-w-0 ${
                i === 0
                  ? "items-start"
                  : i === uniqueTiers.length - 1
                  ? "items-end"
                  : "items-center"
              }`}
              animate={{ opacity: isPast ? 1 : 0.45 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className={`text-[10px] font-mono tabular-nums font-medium truncate ${
                  isActive
                    ? "text-secondary"
                    : i === uniqueTiers.length - 1 && atBestPrice
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {formatPrice(t.price)}
              </span>
              <span className="text-[9px] text-muted-foreground/60">{t.qty}u</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── Quantity stepper ──────────────────────────────────────────────────────────

function QuantityStepper({
  quantity,
  onQuantityChange,
}: {
  quantity: number
  onQuantityChange: (qty: number) => void
}) {
  return (
    <div className="flex items-center border rounded-lg border-border">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="px-2 hover:bg-muted"
      >
        −
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={(e) => {
          const parsed = parseInt(e.target.value, 10)
          onQuantityChange(Math.max(1, isNaN(parsed) ? 1 : parsed))
        }}
        className="flex-1 text-center border-0 focus-visible:ring-0 text-sm min-w-0 w-12"
        min={1}
      />
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onQuantityChange(quantity + 1)}
        className="px-2 hover:bg-muted"
      >
        +
      </Button>
    </div>
  )
}

// ── Savings badge ─────────────────────────────────────────────────────────────

function SavingsBadge({
  wp,
  unitPrice,
  atBestPrice,
}: {
  wp: WholesalePricing
  unitPrice: number
  atBestPrice: boolean
}) {
  const savedPerUnit = Number(wp.max_price) - unitPrice
  if (savedPerUnit <= 0) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={unitPrice}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          atBestPrice
            ? "bg-green-500/10 text-green-600 border border-green-500/20"
            : "bg-secondary/10 text-secondary border border-secondary/20"
        }`}
      >
        {atBestPrice ? <Zap className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {formatPrice(savedPerUnit)} off / unit
      </motion.div>
    </AnimatePresence>
  )
}

// ── Add to Cart button ────────────────────────────────────────────────────────

function AddToCartButton({
  product,
  quantity,
  unitPrice,
  size = "default",
}: {
  product: Product
  quantity: number
  unitPrice: number
  size?: "default" | "sm"
}) {
  const { addItem, openCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    // ✅ Correct signature: addItem(product, quantity, unit_price)
    // unit_price is locked in at the dynamic wholesale price for this quantity
    // retail CartContext is completely unaffected
    addItem(product, quantity, unitPrice)

    toast.success("Added to cart", {
      description: `${quantity}× ${product.name} — ${formatPrice(unitPrice)}/unit`,
      action: {
        label: "View Cart",
        onClick: openCart,
      },
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full">
      <Button
        onClick={handleAddToCart}
        size={size}
        className={`w-full transition-colors duration-300 ${
          added
            ? "bg-green-500 hover:bg-green-500 text-white"
            : "bg-secondary hover:bg-secondary/90 text-white"
        }`}
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Added!
            </motion.span>
          ) : (
            <motion.span
              key="cart"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}

// ── Grid card ─────────────────────────────────────────────────────────────────

function GridCard({
  product,
  quantity,
  onQuantityChange,
}: Omit<WholesaleProductCardProps, "viewMode">) {
  const wp = getWP(product)
  const unitPrice = getUnitPrice(product, quantity)
  const totalPrice = unitPrice * quantity
  const margin = getMarginPercent(product, quantity)
  const atBestPrice = wp ? quantity >= Number(wp.moq) : false

  const image =
    product.images?.find((i) => i.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    "/placeholder.png"

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 border-border flex flex-col gap-0 py-0">
        <Link
          href={`/wholesale/product/${product.slug}`}
          className="relative block h-52 overflow-hidden bg-muted flex-shrink-0"
        >
          <motion.img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <AnimatePresence mode="wait">
            {margin && (
              <motion.div
                key={`margin-${margin}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="absolute top-3 left-3"
              >
                <Badge className="bg-secondary/90 text-white backdrop-blur-sm hover:bg-secondary text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {margin}% margin
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {product.is_featured && (
            <Badge className="absolute top-3 right-3 bg-primary text-white text-xs">
              Bestseller
            </Badge>
          )}

          <motion.button
            className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="w-4 h-4 text-primary" />
          </motion.button>
        </Link>

        <CardContent className="p-4 flex flex-col flex-1 gap-0">
          <div className="mb-3">
            <Badge variant="secondary" className="text-xs mb-1.5 bg-muted text-muted-foreground">
              {product.sku}
            </Badge>
            <Link href={`/wholesale/product/${product.slug}`}>
              <h3 className="font-serif text-base text-foreground font-medium mb-1 hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground mb-1.5 line-clamp-1">
              {product.short_description}
            </p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{product.rating_avg}</span>
              <span className="text-xs text-muted-foreground">({product.rating_count})</span>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 border border-border/60 p-3 mb-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                  Unit price
                </div>
                <motion.div
                  key={unitPrice}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.22 }}
                  className={`text-xl font-bold tabular-nums ${
                    atBestPrice ? "text-green-600" : "text-secondary"
                  }`}
                >
                  {formatPrice(unitPrice)}
                </motion.div>
              </div>
              {/* <div className="text-right pt-1">
                {wp && <SavingsBadge wp={wp} unitPrice={unitPrice} atBestPrice={atBestPrice} />}
              </div> */}
            </div>

            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                Retail <span className="line-through">{formatPrice(product.retail_price)}</span>
              </span>
              <span className="text-muted-foreground">
                Total{" "}
                <motion.span
                  key={totalPrice}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="font-semibold text-foreground"
                >
                  {formatPrice(totalPrice)}
                </motion.span>
              </span>
            </div>

            {wp && <PricingTierStrip wp={wp} quantity={quantity} />}
          </div>

          <div className="mt-auto space-y-2">
            <QuantityStepper quantity={quantity} onQuantityChange={onQuantityChange} />
            <AddToCartButton product={product} quantity={quantity} unitPrice={unitPrice} size="sm" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ── List card ─────────────────────────────────────────────────────────────────

function ListCard({
  product,
  quantity,
  onQuantityChange,
}: Omit<WholesaleProductCardProps, "viewMode">) {
  const wp = getWP(product)
  const unitPrice = getUnitPrice(product, quantity)
  const totalPrice = unitPrice * quantity
  const margin = getMarginPercent(product, quantity)
  const atBestPrice = wp ? quantity >= Number(wp.moq) : false

  const image =
    product.images?.find((i) => i.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    "/placeholder.png"

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
      <Card className="overflow-hidden hover:shadow-xl transition-shadow border-border">
        <div className="flex">
          <Link
            href={`/product/${product.slug}`}
            className="w-44 flex-shrink-0 relative overflow-hidden group self-stretch"
          >
            <motion.img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover absolute inset-0"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <CardContent className="p-5 flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                  {product.sku}
                </Badge>
                <AnimatePresence mode="wait">
                  {margin && (
                    <motion.div
                      key={`margin-${margin}`}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                    >
                      <Badge className="text-xs bg-secondary/10 text-secondary border-secondary/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {margin}% margin
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href={`/wholesale/product/${product.slug}`}>
                <h3 className="font-serif text-xl text-foreground font-medium mb-1 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {product.short_description}
              </p>

              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating_avg}</span>
                <span className="text-sm text-muted-foreground">({product.rating_count})</span>
              </div>

              <div className="rounded-xl bg-muted/50 border border-border/60 p-3">
                <div className="grid grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                      Unit price
                    </div>
                    <motion.div
                      key={unitPrice}
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`text-lg font-bold tabular-nums ${
                        atBestPrice ? "text-green-600" : "text-secondary"
                      }`}
                    >
                      {formatPrice(unitPrice)}
                    </motion.div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                      Retail
                    </div>
                    <div className="text-sm text-muted-foreground line-through mt-1">
                      {formatPrice(product.retail_price)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                      Best price
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {wp ? formatPrice(Number(wp.min_price)) : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">
                      Total
                    </div>
                    <motion.div
                      key={totalPrice}
                      initial={{ y: -4, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-bold"
                    >
                      {formatPrice(totalPrice)}
                    </motion.div>
                  </div>
                </div>

                {wp && (
                  <div className="mb-2">
                    <SavingsBadge wp={wp} unitPrice={unitPrice} atBestPrice={atBestPrice} />
                  </div>
                )}
                {wp && <PricingTierStrip wp={wp} quantity={quantity} />}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="w-36">
                <QuantityStepper quantity={quantity} onQuantityChange={onQuantityChange} />
              </div>
              <div className="ml-auto w-40">
                <AddToCartButton product={product} quantity={quantity} unitPrice={unitPrice} />
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function WholesaleProductCard({
  product,
  viewMode,
  quantity,
  onQuantityChange,
}: WholesaleProductCardProps) {
  if (viewMode === "list") {
    return <ListCard product={product} quantity={quantity} onQuantityChange={onQuantityChange} />
  }
  return <GridCard product={product} quantity={quantity} onQuantityChange={onQuantityChange} />
}