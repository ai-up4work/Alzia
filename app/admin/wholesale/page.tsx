"use client"

import { useState } from "react"
import { 
  Store, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface WholesaleProduct {
  id: string
  name: string
  image: string
  sku: string
  category: string
  retailPrice: number
  wholesalePrice: number
  minOrderQty: number
  stock: number
  status: "active" | "inactive" | "out_of_stock"
  tier1Discount: number
  tier2Discount: number
  tier3Discount: number
}

// Mock data
const mockProducts: WholesaleProduct[] = [
  {
    id: "1",
    name: "Organic Lavender Essential Oil",
    image: "/products/lavender.jpg",
    sku: "WS-LAV-001",
    category: "Essential Oils",
    retailPrice: 29.99,
    wholesalePrice: 18.99,
    minOrderQty: 12,
    stock: 240,
    status: "active",
    tier1Discount: 10,
    tier2Discount: 15,
    tier3Discount: 20,
  },
  {
    id: "2",
    name: "Natural Face Serum",
    image: "/products/serum.jpg",
    sku: "WS-SER-002",
    category: "Skincare",
    retailPrice: 45.99,
    wholesalePrice: 28.99,
    minOrderQty: 6,
    stock: 80,
    status: "active",
    tier1Discount: 12,
    tier2Discount: 18,
    tier3Discount: 25,
  },
  {
    id: "3",
    name: "Herbal Sleep Tea Blend",
    image: "/products/tea.jpg",
    sku: "WS-TEA-003",
    category: "Wellness",
    retailPrice: 19.99,
    wholesalePrice: 11.99,
    minOrderQty: 24,
    stock: 0,
    status: "out_of_stock",
    tier1Discount: 8,
    tier2Discount: 12,
    tier3Discount: 18,
  },
]

export default function AdminWholesalePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<WholesaleProduct | null>(null)

  const stats = [
    { 
      label: "Total Products", 
      value: "48", 
      icon: Package, 
      trend: "+12%",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: "Active Wholesale", 
      value: "42", 
      icon: Store, 
      trend: "+8%",
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    { 
      label: "Wholesale Revenue", 
      value: "$12,480", 
      icon: DollarSign, 
      trend: "+23%",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    { 
      label: "Wholesale Clients", 
      value: "28", 
      icon: Users, 
      trend: "+5",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
  ]

  const categories = ["all", "Essential Oils", "Skincare", "Wellness", "Supplements"]

  return (
    <div className="min-h-screen">
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-wide text-foreground flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <Store className="w-6 h-6 text-primary-foreground" />
                </div>
                Wholesale Management
              </h1>
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                Manage wholesale products, pricing, and tier discounts
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-2xl px-6 py-6 font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-background/80 backdrop-blur-md border border-border/50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500 font-medium">{stat.trend}</span>
                    </div>
                  </div>
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-2xl border-border/50 bg-background/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant="outline"
                  className={cn(
                    "rounded-2xl border-border/50 whitespace-nowrap transition-all duration-200",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                      : "hover:bg-muted/50"
                  )}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Table/Grid */}
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-border/50 bg-background/50">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-4">Product</div>
              <div className="col-span-2">Pricing</div>
              <div className="col-span-2">Min Order</div>
              <div className="col-span-2">Stock</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/50">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="px-6 py-4 hover:bg-muted/30 transition-colors group"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden border border-border/50">
                      <Package className="w-8 h-8 text-primary/60" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                      <p className="text-xs text-muted-foreground mt-1 px-2 py-1 bg-muted/50 rounded-lg inline-block">
                        {product.category}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="col-span-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground line-through">
                        ${product.retailPrice.toFixed(2)}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        ${product.wholesalePrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Min Order */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">{product.minOrderQty} units</span>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        product.stock > 100 ? "bg-green-500" : product.stock > 0 ? "bg-yellow-500" : "bg-red-500"
                      )} />
                      <span className="font-semibold">{product.stock} units</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    {product.status === "active" && (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                    {product.status === "inactive" && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    )}
                    {product.status === "out_of_stock" && (
                      <div className="flex items-center gap-1 text-red-500">
                        <XCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-primary/10 hover:text-primary"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Tier Pricing (Expandable) */}
                {selectedProduct?.id === product.id && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                      Tier Discounts
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-4 border border-blue-500/20">
                        <p className="text-xs text-muted-foreground mb-1">Tier 1 (12-24 units)</p>
                        <p className="text-2xl font-bold text-blue-500">{product.tier1Discount}%</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-4 border border-purple-500/20">
                        <p className="text-xs text-muted-foreground mb-1">Tier 2 (25-50 units)</p>
                        <p className="text-2xl font-bold text-purple-500">{product.tier2Discount}%</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-2xl p-4 border border-orange-500/20">
                        <p className="text-xs text-muted-foreground mb-1">Tier 3 (50+ units)</p>
                        <p className="text-2xl font-bold text-orange-500">{product.tier3Discount}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold font-serif">Add Wholesale Product</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Form sections would go here */}
                <div className="text-center text-muted-foreground py-12">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p>Product form would be implemented here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}