"use client"

import { useEffect, useRef } from "react"
import { ScrollBlurText } from "./scroll-blur-text"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Best cosmetics online Sri Lanka! Fast delivery to Kandy, perfect lipstick shades for my skin tone.",
    author: "Akithma Fernando",
    role: "Verified Buyer, Kandy",
    avatar: "/elegant-woman-professional-portrait.png",
    rating: 5,
  },
  {
    quote:
      "හොඳම කොස්මෙටික්ස් සයිට් එක! ලංකාවේ ඕනෑම තැනකට ඉක්මනින් එනවා. Quality products.",
    author: "Sandali Minoli",
    role: "Verified Buyer, Galle",
    avatar: "/indian-woman-portrait-elegant.jpg",
    rating: 5,
  },
  {
    quote:
      "Premium skincare for oily Sri Lankan skin. Serum cleared my acne. Island wide delivery perfect.",
    author: "Hafsa Siraj",
    role: "Verified Buyer, Colombo",
    avatar: "/young-professional-portrait.png",
    rating: 5,
  },
  {
    quote:
      "Hair cream & perfume excellent! Long lasting fragrance, quality cream for dry hair Sri Lanka.",
    author: "Aathif Azeez",
    role: "Verified Buyer",
    avatar: "/placeholder.svg" ,
    rating: 5,
  },
  {
    quote:
      "Foundation matches Sri Lankan skin perfectly. Best makeup shop online Sri Lanka.",
    author: "Dheekshitha Balakumaran",
    role: "Verified Buyer, Jaffna",
    avatar: "/professional-woman-makeup-artist.jpg",
    rating: 5,
  },
  {
    quote:
      "නිවසටම cosmetics delivery! Oily skin face wash excellent. සුපිරි service.",
    author: "Nima Nisam",
    role: "Verified Buyer",
    avatar: "/woman-portrait-elegant-professional.jpg",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5

    const animate = () => {
      scrollPosition += scrollSpeed

      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    scrollContainer.addEventListener("mouseenter", handleMouseEnter)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter)
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 bg-background overflow-hidden lg:py-32 lg:pb-0">
      <div className="w-full">
        <div className="text-center mb-16 lg:mb-20 px-6">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.25em] text-secondary font-medium mb-4">
            Happy Customers
          </p>
          <ScrollBlurText
            text="Trusted Cosmetics Dealer in Sri Lanka"
            className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground text-balance font-light"
          />
        </div>

        <div className="reveal opacity-0 animation-delay-400">
          <div ref={scrollRef} className="flex gap-6 overflow-x-hidden" style={{ scrollBehavior: "auto" }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[320px] md:w-[380px] bg-card rounded-2xl p-6 border border-border/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 my-6 py-8"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                <blockquote className="text-base md:text-lg text-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-sm text-foreground">{testimonial.author}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
