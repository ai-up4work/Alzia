import Link from "next/link"
import { ArrowRight, Grid3x3, Sparkles, Palette } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import CategoriesGrid from "@/components/CategoriesGrid"

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-light mb-4">
              Shop by Category
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete range of beauty products organized by category. From skincare to makeup, find everything you need in one place.
            </p>
          </div>
          
          {/* Categories Grid */}
          <CategoriesGrid />
        </div>
      </div>
      <Footer />
    </main>
  )
}