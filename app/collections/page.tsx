import Link from "next/link"
import { ArrowRight, ChevronRight, Sparkles, Heart, Leaf, Gift, TrendingUp, Stars } from "lucide-react"
import Head from "next/head"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import CollectionsGrid from "@/components/CollectionsGrid"

const collections = [
  {
    id: "skincare-essentials",
    name: "Skincare Essentials",
    description:
      "The foundation of radiant skin. Our bestselling skincare collection featuring cleansers, serums, and moisturizers.",
    image: "/luxury-skincare.png",
    products: 12,
    href: "/shop?categories=skincare",
    icon: Sparkles,
  },
  {
    id: "makeup-artistry",
    name: "Makeup Artistry",
    description:
      "Express yourself with our color and beauty collection. From everyday to evening, find your perfect shades.",
    image: "/diverse-makeup-collection.png",
    products: 18,
    href: "/shop?categories=makeup",
    icon: Heart,
  },
  {
    id: "fragrance-journey",
    name: "Fragrance Journey",
    description: "Discover scents that tell your story. Our exclusive fragrance collection for every mood and moment.",
    image: "/perfume-collection.jpg",
    products: 8,
    href: "/shop?categories=fragrance",
    icon: Stars,
  },
  {
    id: "gift-sets",
    name: "Gift Sets",
    description: "Perfect gifts for the beauty lover. Thoughtfully curated sets with elegant packaging.",
    image: "/luxury-gift-sets.jpg",
    products: 6,
    href: "/shop?categories=gifts",
    icon: Gift,
  },
  {
    id: "natural-beauty",
    name: "Natural Beauty",
    description: "Pure, natural ingredients. Our collection of botanical and clean beauty products.",
    image: "/natural-beauty-products.png",
    products: 15,
    href: "/shop?search=natural",
    icon: Leaf,
  },
  {
    id: "bestsellers",
    name: "Bestsellers",
    description: "Customer favorites that deliver results. Discover why these products are loved worldwide.",
    image: "/bestselling-beauty-products.jpg",
    products: 20,
    href: "/shop?sort=bestselling",
    icon: TrendingUp,
  },
]

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 font-light mb-4">Collections</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Curated collections designed to meet every beauty need. Explore our most popular groupings and find products that speak to you.
            </p>
          </div>
          
          {/* Collections Grid */}
          <CollectionsGrid />
         </div> 
      </div>
      <Footer />
    </main>
  )
}