// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Montserrat, Cinzel, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
  fallback: ["Trajan Pro", "Times New Roman", "serif"],
})

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "Garamond", "Times New Roman", "serif"],
})

export const metadata: Metadata = {
  title: "Alzìa Paris — Luxury Cosmetics",
  description: "Discover exquisite Parisian beauty. Premium cosmetics crafted with elegance for the modern woman.",
  authors: [{ name: "up4work" }],
  metadataBase: new URL("https://alzia.vercel.app"),
  openGraph: {
    title: "Alzìa Paris — Luxury Cosmetics",
    description: "Discover exquisite Parisian beauty. Premium cosmetics crafted with elegance for the modern woman.",
    url: "https://alzia.vercel.app",
    siteName: "Alzìa Paris",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alzìa Paris - Luxury Cosmetics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alzìa Paris — Luxury Cosmetics",
    description: "Discover exquisite Parisian beauty. Premium cosmetics crafted with elegance for the modern woman.",
    images: ["/og-image.png"],
    creator: "@up4work",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
    apple: {
      url: "/favicon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${cormorant.variable} ${cinzel.variable} ${fraunces.variable}`}>
      <body className={montserrat.className}>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}