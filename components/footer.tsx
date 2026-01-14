import Link from "next/link"
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Linkedin } from "lucide-react"
import Image from "next/image"

const footerLinks = {
  shop: [
    { label: "Skincare", href: "/shop/skincare" },
    { label: "Makeup", href: "/shop/makeup" },
    { label: "Fragrance", href: "/shop/fragrance" },
    { label: "Gift Sets", href: "/shop/gifts" },
  ],
  help: [
    { label: "Track Order", href: "/account/orders" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns", href: "/account/returns" },
    { label: "FAQs", href: "/faqs" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-muted text-foreground py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image src="/alzia-logo.png" alt="Alzìa Logo" width={140} height={48} className="object-contain" />
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">
              Natural beauty inspired by nature's wisdom. Experience the essence of botanical luxury.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary" />
                <span>hello@alzianaturals.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary" />
                <span>+94 11 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                © 2026 Alzìa Naturals. All rights reserved. Built with care by{" "}
                <a
                  href="https://upwork.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  UP4WORK
                </a>
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground justify-start md:justify-end">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="hover:text-primary transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-2">
                  Crafted by Freelance Team
                </p>
                <a
                  href="https://upwork.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-cinzel font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                <Image src="/up4work-logo-transparent-2.png" alt="UP4WORK Logo" width={60} height={60} className="inline-block ml-2 object-contain" />
                UP4WORK Studio
                </a>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/up4work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="UP4WORK Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com/up4work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="UP4WORK Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/company/up4work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="UP4WORK LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
