"use client"

import { useEffect, useRef } from "react"
import { ScrollBlurText } from "./scroll-blur-text"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "The Radiance Serum has transformed my skin. After just two weeks, my complexion is brighter and more even than ever before.",
    author: "Sophie M.",
    role: "Verified Buyer",
    avatar: "/elegant-woman-professional-portrait.png",
    rating: 5,
  },
  {
    quote:
      "Finally, a luxury brand that delivers on its promises. The packaging is exquisite and the products are absolutely divine.",
    author: "Priya K.",
    role: "Verified Buyer",
    avatar: "/indian-woman-portrait-elegant.jpg",
    rating: 5,
  },
  {
    quote:
      "The Velvet Rouge lipstick stays on all day without drying my lips. The color is stunning and the formula is incredibly comfortable.",
    author: "Emma L.",
    role: "Verified Buyer",
    avatar: "/young-professional-portrait.png",
    rating: 5,
  },
  {
    quote:
      "Eau de Rose is my signature scent now. I receive compliments everywhere I go. It's sophisticated yet not overpowering.",
    author: "Ananya R.",
    role: "Verified Buyer",
    avatar: "/woman-portrait-elegant-professional.jpg",
    rating: 5,
  },
  {
    quote:
      "As a makeup artist, I recommend Lumière to all my clients. The quality is exceptional and rivals brands twice the price.",
    author: "Dr. Meera S.",
    role: "Professional MUA",
    avatar: "/professional-woman-makeup-artist.jpg",
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
            Customer Love
          </p>
          <ScrollBlurText
            text="What they say about us"
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
