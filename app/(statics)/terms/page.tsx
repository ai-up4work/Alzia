import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — Alzìa Makeup & Cosmetics Sri Lanka",
  description:
    "Alzìa terms of service for online cosmetics shopping in Sri Lanka. Returns, shipping, payments and legal terms for makeup & beauty purchases.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          <span className="inline-block text-sm font-medium text-secondary mb-4 tracking-widest uppercase">Legal</span>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight font-light text-foreground mb-8 text-balance">
            Terms & Conditions
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
            Legal terms for online cosmetics shopping, returns, shipping and payments in Sri Lanka. Updated January
            2026.
          </p>
        </div>
      </section>

      <div className="border-b border-border" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-32">
        <div className="space-y-20 md:space-y-28">
          {/* Agreement to Terms */}
          <section className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Agreement to Terms
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              By accessing and using this Alzìa Cosmetics Sri Lanka website, you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to abide by the above, please do not use this
              service.
            </p>
          </section>

          {/* Use License */}
          <section className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">Use License</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Permission is granted to temporarily download one copy of the materials (information or software) on Alzìa
              Makeup & Cosmetics Sri Lanka for personal, non-commercial transitory viewing only. Under this license you
              may not:
            </p>
            <div className="space-y-4">
              {[
                "Modify or copy the materials",
                "Use the materials for any commercial purpose or for any public display",
                "Attempt to decompile or reverse engineer any software contained on the website",
                "Remove any copyright or other proprietary notations from the materials",
                "Transfer the materials to another person or 'mirror' the materials on any other server",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                >
                  <span className="text-primary font-semibold text-lg flex-shrink-0">•</span>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="space-y-6 bg-gradient-to-br from-destructive/5 to-transparent rounded-2xl p-8 md:p-10 border border-destructive/20">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">Disclaimer</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The materials on Alzìa Cosmetics Sri Lanka are provided on an "as is" basis. Alzìa makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
              of intellectual property or other violation of rights.
            </p>
          </section>

          {/* Limitations */}
          <section className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Limitations of Liability
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In no event shall Alzìa Cosmetics Sri Lanka or its suppliers be liable for any damages (including damages
              for loss of data or profit, or due to business interruption) arising out of the use or inability to use
              the materials on Alzìa Cosmetics Sri Lanka, even if an authorized representative has been notified orally
              or in writing of the possibility of such damage.
            </p>
          </section>

          {/* Modifications */}
          <section className="space-y-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-10 border border-primary/20">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground leading-tight">Modifications</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Alzìa Cosmetics Sri Lanka may revise these terms of service at any time without notice. By using this
              website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
