import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Montserrat, Cinzel } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
})

export const metadata: Metadata = {
  title: "Alzìa Paris — Luxury Cosmetics",
  description: "Discover exquisite Parisian beauty. Premium cosmetics crafted with elegance for the modern woman.",
  generator: "up4work",
  openGraph: {
    title: "Alzìa Paris — Luxury Cosmetics",
    description: "Discover exquisite Parisian beauty. Premium cosmetics crafted with elegance for the modern woman.",
    url: "https://alzìa.com",
    siteName: "Alzìa Paris",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alzìa Paris",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alzìa Paris — Luxury Cosmetics",
    description: "Discover exquisite Parisian beauty. Premium cosmetics crafted with elegance for the modern woman.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${cormorant.variable} ${cinzel.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
