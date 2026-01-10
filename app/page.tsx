import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { FeaturedProducts } from "@/components/featured-products"
import { BrandStorySection } from "@/components/brand-story-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <BrandStorySection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
