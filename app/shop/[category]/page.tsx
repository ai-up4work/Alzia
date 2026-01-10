"use client";

import { useState } from "react"
import { ChevronDown, SlidersHorizontal, X } from "lucide-react"

// Mock product data - replace with your actual data
const products = [
  {
    id: 1,
    name: "Radiance Elixir Serum",
    category: "skincare",
    price: 128,
    image: "/luxury-serum-bottle-elegant.jpg",
    description: "Illuminating facial serum"
  },
  {
    id: 2,
    name: "Velvet Rose Moisturizer",
    category: "skincare",
    price: 95,
    image: "/luxury-cream-jar-elegant.jpg",
    description: "Hydrating day cream"
  },
  {
    id: 3,
    name: "Diamond Eye Cream",
    category: "skincare",
    price: 145,
    image: "/luxury-eye-cream-elegant.jpg",
    description: "Anti-aging eye treatment"
  },
  {
    id: 4,
    name: "Pure Glow Cleanser",
    category: "skincare",
    price: 68,
    image: "/luxury-cleanser-bottle.jpg",
    description: "Gentle foaming cleanser"
  },
  {
    id: 5,
    name: "Golden Essence Toner",
    category: "skincare",
    price: 75,
    image: "/luxury-toner-bottle.jpg",
    description: "Balancing facial mist"
  },
  {
    id: 6,
    name: "Silk Renewal Mask",
    category: "skincare",
    price: 110,
    image: "/luxury-mask-jar.jpg",
    description: "Overnight sleeping mask"
  }
]

const categoryInfo = {
  skincare: {
    title: "Skincare",
    subtitle: "Nourish & Protect",
    description: "Discover our luxurious collection of skincare essentials, crafted with the finest ingredients to reveal your natural radiance."
  },
  makeup: {
    title: "Makeup",
    subtitle: "Express & Enhance",
    description: "Elevate your beauty routine with our signature makeup collection, designed to enhance your natural features."
  },
  fragrance: {
    title: "Fragrance",
    subtitle: "Captivate & Allure",
    description: "Immerse yourself in our exquisite fragrances, each scent telling a story of Parisian elegance."
  },
  haircare: {
    title: "Haircare",
    subtitle: "Shine & Style",
    description: "Transform your hair with our premium haircare collection, formulated for luminous, healthy locks."
  }
}

export default function CategoryPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategory] = useState("skincare") // In real app, get from URL params
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 200])

  const category = categoryInfo[selectedCategory]
  const filteredProducts = products.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
        <img
          src="/luxury-skincare-products-serum-cream-elegant.jpg"
          alt={category.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-sm uppercase tracking-[0.25em] text-background/80 font-medium mb-3">
            {category.subtitle}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-background font-light mb-4">
            {category.title}
          </h1>
          <p className="text-background/90 max-w-2xl text-sm md:text-base">
            {category.description}
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8 lg:mb-12 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-full hover:bg-muted transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
            <p className="text-sm text-muted-foreground hidden md:block">
              {filteredProducts.length} products
            </p>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-background border border-border rounded-full px-4 py-2 pr-10 text-sm font-medium cursor-pointer hover:bg-muted transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              isFilterOpen ? "block" : "hidden"
            } lg:block w-full lg:w-64 shrink-0 fixed lg:static inset-0 z-50 lg:z-auto bg-background lg:bg-transparent p-6 lg:p-0 overflow-y-auto`}
          >
            <div className="lg:sticky lg:top-24">
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsFilterOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-xl mb-6">Filters</h3>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="text-sm font-medium mb-4 uppercase tracking-wider">Price Range</h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Product Type */}
              <div className="mb-8">
                <h4 className="text-sm font-medium mb-4 uppercase tracking-wider">Product Type</h4>
                <div className="space-y-3">
                  {["Serum", "Moisturizer", "Cleanser", "Mask", "Eye Cream"].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skin Type */}
              <div className="mb-8">
                <h4 className="text-sm font-medium mb-4 uppercase tracking-wider">Skin Type</h4>
                <div className="space-y-3">
                  {["All Skin Types", "Dry", "Oily", "Combination", "Sensitive"].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm group-hover:text-foreground transition-colors">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  style={{
                    animation: `fade-up 0.6s ease-out forwards ${index * 100}ms`
                  }}
                >
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                      {product.description}
                    </p>
                    <h3 className="font-serif text-base lg:text-lg mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm font-medium">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-24" />

      <style jsx>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}