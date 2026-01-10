"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [email, setEmail] = useState("")

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter signup
    console.log("[v0] Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section ref={sectionRef} id="newsletter" className="py-24 lg:py-32 px-6">
      <div className="relative max-w-7xl mx-auto rounded-[32px] lg:rounded-[48px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src="/elegant-parisian-beauty-aesthetic-rose-petals-soft.jpg" alt="Elegant beauty aesthetic" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>

        {/* Content */}
        <div className="relative px-6 lg:px-16 py-16 lg:py-24 text-center">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.25em] text-accent font-medium mb-4">
            Stay Connected
          </p>
          <h2 className="reveal opacity-0 animation-delay-200 font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-background text-balance mb-6 max-w-2xl mx-auto">
            Join our world of beauty
          </h2>
          <p className="reveal opacity-0 animation-delay-400 text-background/80 leading-relaxed mb-10 max-w-lg mx-auto">
            Subscribe to receive exclusive offers, early access to new collections, and beauty tips from our experts.
          </p>

          <form
            onSubmit={handleSubmit}
            className="reveal opacity-0 animation-delay-600 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-full bg-background/90 backdrop-blur-sm border-0 px-6 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 group"
            >
              Subscribe
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="reveal opacity-0 animation-delay-600 text-xs text-background/60 mt-4">
            By subscribing, you agree to our Privacy Policy
          </p>
        </div>
      </div>
    </section>
  )
}
