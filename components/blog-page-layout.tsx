import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BlogPageLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
  publishDate?: string
  readTime?: string
}

export function BlogPageLayout({ title, subtitle, children, publishDate, readTime }: BlogPageLayoutProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6 text-balance">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-6">{subtitle}</p>
          {(publishDate || readTime) && (
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {publishDate && <span>Published {publishDate}</span>}
              {readTime && <span className="hidden sm:inline">•</span>}
              {readTime && <span>{readTime}</span>}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <main className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 prose prose-invert max-w-none">{children}</div>
      </main>
    </>
  )
}
