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
  title: {
    default: "Alzìa – Makeup & Cosmetics Sri Lanka",
    template: "%s | Alzìa Cosmetics Sri Lanka"
  },
  description: "Shop luxury cosmetics online Sri Lanka. Premium makeup & skincare with island wide delivery.",
  authors: [{ name: "up4work" }],
  metadataBase: new URL("https://alzia.vercel.app"),
  openGraph: {
    title: "Alzìa Cosmetics Sri Lanka – Premium Makeup Skincare",
    description: "Shop luxury makeup & skincare online Sri Lanka. Fast island wide delivery.",
    url: "https://alzia.vercel.app",
    siteName: "Alzìa Cosmetics Sri Lanka",
    images: [
      {
        url: "/og-image-v3.png",  // Web/Facebook
        width: 1200,
        height: 630,
        alt: "Alzìa Cosmetics Sri Lanka – Makeup & Skincare",
      },
      // {
      //   url: "/og-image-v2.png",  // WhatsApp optimized
      //   width: 1200,
      //   height: 630,
      //   alt: "Alzìa Cosmetics Sri Lanka – Makeup & Skincare",
      // },
    ],
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alzìa Cosmetics Sri Lanka",
    description: "Premium makeup & skincare online Sri Lanka.",
    images: ["/og-image-v3.png"],  // WhatsApp-optimized for Twitter too
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
  generator: 'v0.app'
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
