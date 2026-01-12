"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import type { Category, Brand } from "@/lib/types"

interface FilterSidebarProps {
  categories: Category[]
  brands: Brand[]
  selectedCategories: string[]
  selectedBrands: string[]
  priceRange: [number, number]
  onCategoryToggle: (categoryId: string) => void
  onBrandToggle: (brandId: string) => void
  onPriceRangeChange: (range: [number, number]) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  hasChanges: boolean
  isPending: boolean
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export function FilterSidebar({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  onCategoryToggle,
  onBrandToggle,
  onPriceRangeChange,
  onApplyFilters,
  onClearFilters,
  hasChanges,
  isPending,
}: FilterSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-medium text-foreground mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => onCategoryToggle(category.id)}
              />
              <span className="text-sm text-muted-foreground">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-medium text-foreground mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => onBrandToggle(brand.id)}
              />
              <span className="text-sm text-muted-foreground">{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-foreground mb-4">Price Range</h3>
        <Slider value={priceRange} onValueChange={onPriceRangeChange} max={5000} step={100} className="mb-4" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Apply Filters Button */}
      {hasChanges && (
        <Button onClick={onApplyFilters} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : (
            "Apply Filters"
          )}
        </Button>
      )}

      {/* Clear Filters */}
      <Button variant="outline" className="w-full bg-transparent" onClick={onClearFilters} disabled={isPending}>
        Clear All Filters
      </Button>
    </div>
  )
}
