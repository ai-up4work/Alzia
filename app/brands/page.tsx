import Link from "next/link"
import { ArrowRight, Award, Shield, Star } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import BrandsGrid from "@/components/BrandsGrid"

export default function BrandsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-light mb-4">
              Our Brands
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover beauty from the world's most trusted and innovative brands. From luxury classics to emerging favorites, find your perfect match.
            </p>
          </div>
          
          {/* Brands Grid */}
          <BrandsGrid />
        </div>
      </div>
      <Footer />
    </main>
  )
}