"use client"

import type { Metadata } from "next"
import Link from "next/link"
import { useState } from "react"

const metadata: Metadata = {
  title: "Cosmetics FAQ Sri Lanka | Makeup Skincare Questions – Alzìa",
  description:
    "Cosmetics FAQ Sri Lanka: delivery times, returns, payments, skin types & more. Makeup skincare questions answered for Sri Lanka shoppers.",
}

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How long for cosmetics delivery in Sri Lanka?",
      answer: "Island wide 1-5 business days. Colombo 1-3 days, Kandy/Galle 2-4 days. Free shipping over LKR 10,000.",
    },
    {
      question: "What is your cosmetics returns policy?",
      answer:
        "30 days for unopened products with intact seals only. No refunds on opened beauty products or broken packaging.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Credit/debit cards, bank transfer, online wallets accepted. Secure PCI-compliant processing for all transactions.",
    },
    {
      question: "Which products are best for my skin type?",
      answer:
        "Oily, dry, combination, sensitive skin products available. Check product descriptions for skin type suitability.",
    },
    {
      question: "How do I find my perfect lipstick shade?",
      answer:
        "Upload a photo for shade matching or visit our shade finder. We cater to fair, medium, and deep skin tones.",
    },
    {
      question: "When do I get free shipping?",
      answer: "Free island wide delivery over LKR 10,000. Colombo LKR 500, outstation LKR 800-1200 under threshold.",
    },
    {
      question: "Are all products NMRA approved?",
      answer:
        "All Alzìa products are NMRA registered or compliant. Check individual product pages for Sri Lanka registration details.",
    },
    {
      question: "What's the best skincare routine?",
      answer: "Cleanse → Tone → Serum → Eye cream → Moisturize → Sunscreen (AM). Night routine: remove makeup first.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <span className="inline-block text-sm font-medium text-secondary mb-4 tracking-widest uppercase">
            Questions & Answers
          </span>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight font-light text-foreground mb-8 text-balance">
            Cosmetics Questions Answered
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
            Find answers to common questions about delivery, returns, payments, skincare routines, and more.
          </p>
        </div>
      </section>

      <div className="border-b border-border" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="space-y-20">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <button
                key={index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between px-8 py-6 md:px-10 md:py-8">
                  <span className="text-lg md:text-xl font-serif font-light text-foreground group-hover:text-primary transition-colors pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`text-primary text-2xl flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </div>
                {openIndex === index && (
                  <div className="px-8 md:px-10 pb-6 md:pb-8 border-t border-border pt-6 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.answer}
                  </div>
                )}
              </button>
            ))}
          </div>

          <section className="relative overflow-hidden rounded-3xl p-12 md:p-16 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-4">
                More Questions About Our Cosmetics?
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Can't find your answer? Our Sri Lanka support team is ready to help.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-secondary text-secondary-foreground px-10 py-4 rounded-full font-medium hover:bg-secondary/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
