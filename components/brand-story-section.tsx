"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Heart, Award, Leaf } from "lucide-react"
import { ScrollBlurText } from "./scroll-blur-text"

const stats = [
  { icon: Sparkles, value: "25+", label: "Years of expertise" },
  { icon: Heart, value: "500K+", label: "Happy customers" },
  { icon: Award, value: "50+", label: "Beauty awards" },
  { icon: Leaf, value: "100%", label: "Cruelty-free" },
]

const values = [
  {
    number: "01",
    title: "Parisian Heritage",
    description: "Born in the heart of Paris, our formulas embody centuries of French beauty expertise and elegance.",
  },
  {
    number: "02",
    title: "Premium Ingredients",
    description:
      "We source only the finest ingredients from around the world, ensuring exceptional quality in every product.",
  },
  {
    number: "03",
    title: "Sustainable Beauty",
    description: "Our commitment to the environment guides every decision, from packaging to production methods.",
  },
]

export function BrandStorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({})
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
            if (!hasAnimated) {
              setHasAnimated(true)
              stats.forEach((stat) => {
                animateCounter(stat.value, stat.label)
              })
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [hasAnimated])

  const animateCounter = (value: string, label: string) => {
    const numericValue = Number.parseInt(value.replace(/[^0-9]/g, ""))
    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const currentValue = Math.min(Math.round(increment * currentStep), numericValue)
      setAnimatedValues((prev) => ({ ...prev, [label]: currentValue }))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, duration / steps)
  }

  const formatValue = (originalValue: string, animatedValue: number | undefined) => {
    if (animatedValue === undefined) return "0"

    if (originalValue.includes("%")) return `${animatedValue}%`
    if (originalValue.includes("K+")) return `${animatedValue}K+`
    if (originalValue.includes("+")) return `${animatedValue}+`
    return `${animatedValue}`
  }

  return (
    <section ref={sectionRef} id="story" className="py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.25em] text-primary-foreground/70 font-medium mb-4">
            Our Story
          </p>
          <ScrollBlurText
            text="Beauty born in Paris"
            className="font-serif text-3xl md:text-5xl lg:text-6xl text-primary-foreground text-balance mb-6 font-light"
          />
          <p className="reveal opacity-0 animation-delay-400 text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            For over two decades, we have crafted luxury cosmetics that celebrate the art of French beauty, blending
            timeless elegance with modern innovation.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="reveal opacity-0 animation-delay-400 grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="font-serif text-4xl md:text-5xl font-medium text-primary-foreground mb-2">
                {formatValue(stat.value, animatedValues[stat.label])}
              </div>
              <div className="text-sm text-primary-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <div
              key={value.number}
              className={`reveal opacity-0 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : ""}`}
            >
              <div className="border-t border-primary-foreground/20 pt-8">
                <span className="text-sm font-medium text-primary-foreground/50 mb-4 block">{value.number}</span>
                <h3 className="font-serif text-xl md:text-2xl font-medium text-primary-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-primary-foreground/70 leading-relaxed">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
