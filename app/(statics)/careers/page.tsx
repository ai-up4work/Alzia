import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Careers — Alzìa Paris | Join Our Team",
  description: "Build a career in luxury beauty. Join our passionate team at Alzìa Paris.",
}

export default function CareersPage() {
  const values = [
    { title: "Innovation", desc: "Creativity and forward-thinking in everything we do", icon: "💡" },
    { title: "Collaboration", desc: "Teamwork and open communication across all departments", icon: "🤝" },
    { title: "Sustainability", desc: "Ethical practices and environmental responsibility", icon: "🌿" },
    { title: "Excellence", desc: "Quality and dedication in all our work", icon: "⭐" },
  ]

  const benefits = [
    "Competitive salary and comprehensive benefits package",
    "Professional development and training opportunities",
    "Flexible working arrangements",
    "Health, wellness, and mental health support",
    "Generous employee discount on Alzìa products",
    "Collaborative and creative work environment",
    "Career growth and advancement opportunities",
    "Work on products that make a real difference",
  ]

  const openPositions = [
    { title: "Product Development Specialist", dept: "R&D", type: "Full-time" },
    { title: "Marketing Manager", dept: "Marketing", type: "Full-time" },
    { title: "Customer Experience Lead", dept: "Customer Service", type: "Full-time" },
    { title: "Sustainability Officer", dept: "Operations", type: "Full-time" },
    { title: "E-commerce Coordinator", dept: "Digital", type: "Full-time" },
    { title: "Brand Ambassador", dept: "Marketing", type: "Part-time" },
  ]

  return (
    <BlogPageLayout
      title="Join Our Team"
      subtitle="Build a career in luxury beauty. We're looking for passionate, creative, and dedicated individuals to help us transform the beauty industry."
      readTime="4 min read"
    >
      <div className="space-y-16">
        {/* Our Culture */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Our Culture</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            At Alzìa Paris, we believe that great products come from great people. We're committed to creating a
            workplace where creativity thrives, innovation is celebrated, and every team member feels valued.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="bg-muted/50 border border-border rounded-lg p-6">
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Join Us */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Why Join Alzìa Paris?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-3 bg-muted/30 p-4 rounded-lg border border-border">
                <span className="text-secondary font-semibold flex-shrink-0 text-lg">✓</span>
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-8">Open Positions</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            We're always looking for talented individuals. Check out our current openings below.
          </p>

          <div className="space-y-4">
            {openPositions.map((job, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-muted/50 to-transparent border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="bg-primary/10 px-2 py-1 rounded text-primary font-medium">{job.dept}</span>
                      <span className="bg-secondary/10 px-2 py-1 rounded text-secondary font-medium">{job.type}</span>
                    </div>
                  </div>
                  <span className="text-primary text-2xl group-hover:translate-x-1 transition-transform flex-shrink-0">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-sm mt-6">
            Don't see a position that fits? We'd love to hear from you anyway. Send us your resume and a note about what
            you'd like to contribute.
          </p>
        </section>

        {/* Life at Alzìa */}
        <section className="bg-muted/30 border border-border rounded-2xl p-8 md:p-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Life at Alzìa Paris</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            Our team is the heart of everything we do. From collaborative brainstorming sessions to celebrating product
            launches, we foster a culture where every voice matters. We're passionate about beauty, sustainability, and
            creating products that make a real difference in people's lives.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Whether you're in our Paris headquarters or working remotely, you're part of a global community dedicated to
            redefining luxury beauty.
          </p>
        </section>

        {/* Application CTA */}
        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-12 text-center">
          <h3 className="font-serif text-3xl font-medium text-foreground mb-4">Ready to Make an Impact?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Send us your resume, portfolio, or let us know why you'd be a great fit for our team.
          </p>
          <Link
            href="/contact?subject=careers"
            className="inline-block bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-medium hover:bg-secondary/90 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </BlogPageLayout>
  )
}
