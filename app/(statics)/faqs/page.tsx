import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cosmetics FAQ Sri Lanka | Makeup Skincare Questions – Alzìa",
  description: "Cosmetics FAQ Sri Lanka: delivery times, returns, payments, skin types & more. Makeup skincare questions answered for Sri Lanka shoppers.",
}

export default function FAQsPage() {
  const faqs = [
    {
      question: "How long cosmetics delivery Sri Lanka?",
      answer:
        "Island wide 1-5 business days. Colombo 1-3 days, Kandy/Galle 2-4 days. Free shipping over LKR 10,000.",
    },
    {
      question: "Cosmetics returns policy Sri Lanka?",
      answer:
        "30 days for unopened products with intact seals only. No refunds on opened beauty products or broken packaging.",
    },
    {
      question: "Payment methods Sri Lanka cosmetics?",
      answer:
        "Credit/debit cards, bank transfer, online wallets accepted. Secure PCI-compliant processing for Sri Lanka.",
    },
    {
      question: "Which skin type products Sri Lanka?",
      answer:
        "Oily, dry, combination, sensitive skin products available. Check product descriptions for skin type suitability.",
    },
    {
      question: "Lipstick shade matching Sri Lanka?",
      answer:
        "Upload photo for shade matching or visit shade finder. Fair, medium, dark Sri Lankan skin tones catered.",
    },
    {
      question: "Free shipping threshold Sri Lanka?",
      answer:
        "Free island wide delivery over LKR 10,000. Colombo LKR 500, outstation LKR 800-1200 under threshold.",
    },
    {
      question: "NMRA approved cosmetics Sri Lanka?",
      answer:
        "All Alzìa products NMRA registered or compliant. Check product pages for Sri Lanka cosmetics registration.",
    },
    {
      question: "Skincare routine order Sri Lanka?",
      answer:
        "Cleanse → Tone → Serum → Eye cream → Moisturize → Sunscreen (AM). Night: remove makeup first.",
    },
    {
      question: "Best face wash oily skin Sri Lanka?",
      answer:
        "Gel cleansers with salicylic acid or tea tree for oily/acne skin. See oily skin collection.",
    },
    {
      question: "Vitamin C serum benefits Sri Lanka?",
      answer:
        "Brightens skin, reduces dark spots, protects from sun damage. Morning use after cleansing.",
    },
  ]

  return (
    <BlogPageLayout
      title="Cosmetics FAQ Sri Lanka – Makeup & Skincare"
      subtitle="Sri Lanka shoppers: delivery, returns, payments, skin care routine & product questions answered."
      readTime="5 min read"
    >
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-muted/50 border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors cursor-pointer"
          >
            <summary className="flex items-start justify-between px-6 py-4 font-semibold text-foreground hover:text-primary transition-colors">
              <span className="text-lg">{faq.question}</span>
              <span className="ml-4 text-primary group-open:rotate-180 transition-transform flex-shrink-0">▶</span>
            </summary>
            <div className="px-6 pb-4 border-t border-border pt-4 text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-16 bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
        <h3 className="font-serif text-2xl font-medium text-foreground mb-3">
          More Cosmetics Questions Sri Lanka?
        </h3>
        <p className="text-muted-foreground mb-6">
          Can't find your makeup or skincare answer? Sri Lanka support ready to help.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          Contact Sri Lanka Support
        </Link>
      </div>
    </BlogPageLayout>
  )
}
