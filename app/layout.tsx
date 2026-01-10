import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Montserrat } from "next/font/google"
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

export const metadata: Metadata = {
  title: "Alzìa Paris — Luxury Cosmetics",
  description: "Discover exquisite Parisian beauty. Premium cosmetics crafted with elegance for the modern woman.",
  generator: "up4work",
  icons: {
    icon: [
      // {
      //   url: "/",
      //   media: "(prefers-color-scheme: light)",
      // },
      // {
      //   url: "/icon-dark-32x32.png",
      //   media: "(prefers-color-scheme: dark)",
      // },
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
      <body className={`${montserrat.variable} ${cormorant.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
