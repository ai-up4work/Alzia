import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Careers — Alzìa Paris | Join Our Team",
  description: "Build a career in luxury beauty. Join our passionate team at Alzìa Paris.",
}

export default function CareersPage() {
  const values = [
    { title: "Innovation", desc: "Creativity and forward-thinking in everything we do" },
    { title: "Collaboration", desc: "Teamwork and open communication across all departments" },
    { title: "Sustainability", desc: "Ethical practices and environmental responsibility" },
    { title: "Excellence", desc: "Quality and dedication in all our work" },
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
    <main className="min-h-screen bg-background">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <span className="inline-block text-sm font-medium text-secondary mb-4 tracking-widest uppercase">
            Opportunities
          </span>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight font-light text-foreground mb-8 text-balance">
            Join Our Team
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
            Build a career in luxury beauty. We're looking for passionate, creative, and dedicated individuals to help
            us transform the beauty industry.
          </p>
        </div>
      </section>

      <div className="border-b border-border" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="space-y-20 md:space-y-28">
          {/* Our Culture */}
          <section className="space-y-8">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight mb-6">
                Our Culture
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Alzìa Paris, we believe that great products come from great people. We're committed to creating a
                workplace where creativity thrives, innovation is celebrated, and every team member feels valued.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, idx) => (
                <div
                  key={idx}
                  className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="font-serif text-2xl font-light text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.desc}</p>
                  <div className="mt-6 w-10 h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>

          {/* Why Join Us */}
          <section className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Why Join Alzìa Paris?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 bg-card border border-border p-6 rounded-xl hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <span className="text-secondary font-semibold flex-shrink-0 text-lg">+</span>
                  <span className="text-muted-foreground text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Open Positions */}
          <section className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">Open Positions</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're always looking for talented individuals to join our team.
            </p>

            <div className="space-y-4">
              {openPositions.map((job, idx) => (
                <Link
                  key={idx}
                  href="/contact"
                  className="group block bg-gradient-to-r from-card to-transparent border border-border rounded-2xl p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-light text-foreground group-hover:text-primary transition-colors mb-3">
                        {job.title}
                      </h3>
                      <div className="flex gap-3">
                        <span className="bg-primary/10 px-3 py-1 rounded-lg text-primary font-medium text-sm">
                          {job.dept}
                        </span>
                        <span className="bg-secondary/10 px-3 py-1 rounded-lg text-secondary font-medium text-sm">
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-primary text-2xl group-hover:translate-x-1 transition-transform flex-shrink-0">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <p className="text-muted-foreground text-sm italic">
              Don't see a position that fits? We'd love to hear from you anyway. Send us your resume and a note about
              what you'd like to contribute.
            </p>
          </section>

          {/* Life at Alzìa */}
          <section className="bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-primary/20 rounded-3xl p-12 md:p-16 space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">Life at Alzìa Paris</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Our team is the heart of everything we do. From collaborative brainstorming sessions to celebrating
                product launches, we foster a culture where every voice matters. We're passionate about beauty,
                sustainability, and creating products that make a real difference in people's lives.
              </p>
              <p>
                Whether you're in our Paris headquarters or working remotely, you're part of a global community
                dedicated to redefining luxury beauty.
              </p>
            </div>
          </section>

          {/* Application CTA */}
          <section className="relative overflow-hidden rounded-3xl p-12 md:p-16 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-4">
                Ready to Make an Impact?
              </h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                Send us your resume, portfolio, or let us know why you'd be a great fit for our team.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-secondary text-secondary-foreground px-10 py-4 rounded-full font-medium hover:bg-secondary/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Apply Now
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
