"use client"

import type React from "react"
import { useState } from "react"
import { BlogPageLayout } from "@/components/blog-page-layout"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <BlogPageLayout
      title="Get in Touch"
      subtitle="Have questions or feedback? We'd love to hear from you. Our team is here to help and respond within 24 hours."
      readTime="2 min read"
    >
      <div className="grid md:grid-cols-3 gap-12 mb-16">
        {/* Contact Info Cards */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <div className="flex items-start gap-4">
              <div className="text-2xl">✉️</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground text-sm">hello@alzianaturals.com</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <div className="flex items-start gap-4">
              <div className="text-2xl">📞</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                <p className="text-muted-foreground text-sm">+94 11 123 4567</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <div className="flex items-start gap-4">
              <div className="text-2xl">📍</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Location</h3>
                <p className="text-muted-foreground text-sm">Colombo, Sri Lanka</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <div className="flex items-start gap-4">
              <div className="text-2xl">🕐</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                <p className="text-muted-foreground text-sm">Mon - Fri: 9am - 6pm</p>
                <p className="text-muted-foreground text-sm">Sat - Sun: 10am - 4pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-muted/30 rounded-xl p-8 border border-border">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Tell us more..."
              />
            </div>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium">
                  ✓ Message sent successfully! We'll be in touch soon.
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-medium transition-colors"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </BlogPageLayout>
  )
}
