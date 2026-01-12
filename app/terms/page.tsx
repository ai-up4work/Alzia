import type { Metadata } from "next"
import { BlogPageLayout } from "@/components/blog-page-layout"

export const metadata: Metadata = {
  title: "Terms of Service — Alzìa Paris",
  description: "Terms and conditions governing your use of Alzìa Paris website and services.",
}

export default function TermsPage() {
  return (
    <BlogPageLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using our website and purchasing products."
      publishDate="January 2026"
      readTime="6 min read"
    >
      <div className="space-y-12 md:space-y-16">
        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Agreement to Terms</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this
            agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Use License</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            Permission is granted to temporarily download one copy of the materials (information or software) on Alzìa
            Paris for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
            of title, and under this license you may not:
          </p>
          <ul className="space-y-3">
            {[
              "Modify or copy the materials",
              "Use the materials for any commercial purpose or for any public display",
              "Attempt to decompile or reverse engineer any software contained on the website",
              "Remove any copyright or other proprietary notations from the materials",
              "Transfer the materials to another person or 'mirror' the materials on any other server",
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary font-semibold flex-shrink-0">•</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            The materials on Alzìa Paris are provided on an "as is" basis. Alzìa makes no warranties, expressed or
            implied, and hereby disclaims and negates all other warranties including, without limitation, implied
            warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Limitations</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            In no event shall Alzìa Paris or its suppliers be liable for any damages (including, without limitation,
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
            use the materials on Alzìa Paris, even if Alzìa or an authorized representative has been notified orally or
            in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Accuracy of Materials</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            The materials appearing on Alzìa Paris could include technical, typographical, or photographic errors. Alzìa
            Paris does not warrant that any of the materials on its website are accurate, complete, or current. Alzìa
            Paris may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Links</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Alzìa Paris has not reviewed all of the sites linked to its website and is not responsible for the contents
            of any such linked site. The inclusion of any link does not imply endorsement by Alzìa Paris of the site.
            Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">Modifications</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Alzìa Paris may revise these terms of service for its website at any time without notice. By using this
            website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>
      </div>
    </BlogPageLayout>
  )
}
