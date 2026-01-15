import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"

export const metadata: Metadata = {
  title: "FAQs — Alzìa Paris | Frequently Asked Questions",
  description: "Frequently asked questions about Alzìa products, orders, shipping, and customer service.",
}

export default function FAQsPage() {
  const faqs = [
    {
      question: "Are Alzìa products cruelty-free?",
      answer:
        "Yes, all our products are cruelty-free and not tested on animals. We're committed to ethical beauty practices.",
    },
    {
      question: "Can I return a product if I don't like it?",
      answer:
        "We offer a 30-day return policy on unused products in original packaging. Please see our refund policy for details.",
    },
    {
      question: "Are your products suitable for sensitive skin?",
      answer:
        "Many of our products are formulated for sensitive skin, but we recommend checking individual product descriptions. If you have specific concerns, contact our support team.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship to most countries worldwide. Delivery times vary by location (7-14 business days typically). Customs fees may apply.",
    },
    {
      question: "How do I know which product is right for me?",
      answer:
        "Our product pages include detailed descriptions and usage recommendations. You can also reach out to our customer service team for personalized suggestions.",
    },
    {
      question: "Are there subscription options available?",
      answer:
        "Yes! Sign up for our beauty subscription service to receive curated products monthly. Subscribers enjoy exclusive discounts and early access to new launches.",
    },
    {
      question: "Can I use multiple Alzìa products together?",
      answer:
        "Yes, our products are designed to complement each other. Check individual product recommendations for the best layering sequence.",
    },
    {
      question: "What should I do if I experience an allergic reaction?",
      answer:
        "Stop using the product immediately and consult a healthcare professional. Contact us with details about the reaction—we'll arrange a full refund.",
    },
  ]

  return (
    <BlogPageLayout
      title="Frequently Asked Questions"
      subtitle="Got questions? We have answers. Browse through our most commonly asked questions about Alzìa products and services."
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
        <h3 className="font-serif text-2xl font-medium text-foreground mb-3">Still have questions?</h3>
        <p className="text-muted-foreground mb-6">
          Can't find the answer you're looking for? Our customer service team is ready to help.
        </p>
        <a
          href="/contact"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </BlogPageLayout>
  )
}
