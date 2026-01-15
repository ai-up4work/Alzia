"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]))
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const slides = [
    {
      image: "/hero-1.jpg",
      subtitle: "Cosmetics Sri Lanka",
      title: ["Premium Cosmetics", "Island Wide"],
      mobileTitle: ["Discover", "your", "radiant", "beauty", "Premium", "Makeup", "Sri Lanka"],
      description:
        "High quality premium cosmetics shop online in Sri Lanka. Makeup & beauty products with 1-5 day island wide delivery.",
    },
    {
      image: "/hero-2.png",
      subtitle: "Beauty Sri Lanka",
      title: ["Elevate your", "skincare ritual"],
      mobileTitle: ["Elevate", "your", "skincare", "ritual"],
      description:
        "Transform your skin with our luxurious skincare collection. Each product is formulated to nourish, rejuvenate, and reveal your natural radiance.",
    },
    {
      image: "/hero-3.jpg",
      subtitle: "Makeup Sri Lanka",
      title: ["Express your", "unique beauty"],
      mobileTitle: ["Express", "your", "unique", "beauty"],
      description:
        "From vibrant makeup to nourishing skincare, discover products that celebrate your individuality and enhance your natural beauty.",
    },
  ]

  // Preload all images
  useEffect(() => {
    slides.forEach((slide, index) => {
      const img = new Image()
      img.src = slide.image
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, index]))
      }
    })
  }, [])

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 15000)

    return () => clearInterval(interval)
  }, [slides.length])

  const slide = slides[currentSlide]

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      }
    }
  }

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((s, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={s.image || "/placeholder.svg?height=1080&width=1920&query=luxury cosmetics hero"}
              alt={s.subtitle}
              className="w-full h-full object-cover"
              style={{
                transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 15s ease-out'
              }}
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 w-full h-full flex items-center pt-20 md:pt-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full items-center">
          
          {/* Left Column - Main Content */}
          <div className="space-y-6 md:space-y-8 -mt-16">
            <div className="space-y-4 md:space-y-6">
              <p 
                key={`subtitle-${currentSlide}`}
                className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-background/90 font-medium animate-fade-up"
              >
                {slide.subtitle}
              </p>

              {/* Desktop/Tablet Heading */}
              <h1 
                key={`title-desktop-${currentSlide}`}
                className="hidden md:block font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-[1.1] text-background text-balance"
              >
                <AnimatedText text={slide.title[0]} delay={0.2} />
                <br />
                <span className="text-accent">
                  <AnimatedText text={slide.title[1]} delay={0.6} />
                </span>
              </h1>

              {/* Mobile Heading */}
              <h1 
                key={`title-mobile-${currentSlide}`}
                className="block md:hidden font-serif text-[2.25rem] leading-[1.1] font-medium text-background text-balance"
              >
                <AnimatedText text={slide.mobileTitle[0]} delay={0.2} />
                <br />
                <span className="text-accent">
                  <AnimatedText text={slide.mobileTitle[1]} delay={0.4} />
                </span>
                <br />
                <AnimatedText text={slide.mobileTitle[2]} delay={0.6} />
                <br />
                <span className="text-accent">
                  <AnimatedText text={slide.mobileTitle[3]} delay={0.8} />
                </span>
              </h1>

              {/* Description */}
              <p 
                key={`desc-${currentSlide}`}
                className="text-base md:text-lg text-background/90 leading-relaxed max-w-xl animate-fade-up animation-delay-400"
              >
                {slide.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-3 md:gap-4 animate-fade-up animation-delay-600">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 md:px-8 py-5 md:py-6 text-sm md:text-base group font-cinzel shadow-xl hover:shadow-2xl transition-all"
              >
                <Link href="/account/">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-6 md:px-8 py-5 md:py-6 text-sm md:text-base border-background/40 hover:bg-background/20 text-background bg-background/10 backdrop-blur-md hover:border-background/60 transition-all"
              >
                <Link href="/shop">Explore Collection</Link>
              </Button>
            </div>

            {/* Slide Indicators */}
            <div
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                flex flex-col gap-3
                z-20
                animate-fade-up animation-delay-800
                md:static
                md:translate-y-0
                md:flex-row
                md:gap-2
              "
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`
                    transition-all duration-300 rounded-full
                    ${
                      index === currentSlide
                        ? `
                          h-8 w-2.5 bg-background
                          md:h-2 md:w-10
                        `
                        : `
                          h-2.5 w-2.5 bg-background/50 hover:bg-background/70
                          md:h-2 md:w-2
                        `
                    }
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Search Bar (Desktop only) */}
          <div className="hidden lg:flex justify-end items-start pt-8">
            <div className="w-full max-w-md animate-fade-up animation-delay-400">
              <div className="flex items-center gap-3 bg-background/15 backdrop-blur-xl rounded-2xl px-6 py-4 border border-background/30 hover:border-background/50 hover:bg-background/20 transition-all shadow-2xl">
                <Search className="w-5 h-5 text-background/80 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="flex-1 bg-transparent text-base text-background placeholder-background/60 outline-none font-light"
                />
                <button
                  onClick={handleSearchClick}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap"
                >
                  Search
                </button>
              </div>
              
              {/* Search suggestions hint */}
              <p className="text-xs text-background/60 mt-3 ml-2">
                Try: "lipstick", "moisturizer", "foundation"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Bottom Floating */}
      <div className="lg:hidden absolute bottom-6 left-4 right-4 z-10 animate-fade-up animation-delay-400">
        <div className="flex items-center gap-2 bg-background/15 backdrop-blur-xl rounded-full px-5 py-3.5 border border-background/30 shadow-2xl">
          <Search className="w-5 h-5 text-background/80 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="flex-1 bg-transparent text-sm text-background placeholder-background/60 outline-none font-light"
          />
          <button
            onClick={handleSearchClick}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-bounce animation-delay-1000 z-10">
        <p className="text-xs text-background/60 uppercase tracking-widest">Scroll</p>
        <div className="w-px h-12 bg-gradient-to-b from-background/60 to-transparent" />
      </div>
    </section>
  )
}