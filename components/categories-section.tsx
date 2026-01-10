"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ScrollBlurText } from "@/components/scroll-blur-text"

const categories = [
  {
    name: "Skincare",
    slug: "skincare",
    id: "a1111111-1111-1111-1111-111111111111", // Add the actual category ID from your database
    description: "Nourish & protect",
    image: "/luxury-skincare-products-serum-cream-elegant.jpg",
  },
  {
    name: "Makeup",
    slug: "makeup",
    id: "a2222222-2222-2222-2222-222222222222", // Add the actual category ID from your database
    description: "Express & enhance",
    image: "/luxury-makeup-lipstick-foundation-elegant.jpg",
  },
  {
    name: "Fragrance",
    slug: "fragrance",
    id: "a4444444-4444-4444-4444-444444444444", // Add the actual category ID from your database
    description: "Captivate & allure",
    image: "/luxury-perfume-bottle-elegant-parisian.jpg",
  },
  {
    name: "Haircare",
    slug: "haircare",
    id: "a3333333-3333-3333-3333-333333333333", // Add the actual category ID from your database
    description: "Shine & style",
    image: "/luxury-haircare-products-elegant-bottles.jpg",
  },
]

export function CategoriesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="categories" className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.25em] text-secondary font-medium mb-4">
            Shop by Category
          </p>
          <ScrollBlurText
            text="Curated for you"
            className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground text-balance mb-6 font-light"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/shop?categories=${category.id}`}
              className={`reveal opacity-0 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : index === 3 ? "animation-delay-600" : ""} group relative overflow-hidden rounded-2xl lg:rounded-3xl aspect-[3/4]`}
            >
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <h3 className="font-serif text-xl lg:text-2xl text-background font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-background/80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}