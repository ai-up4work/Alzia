"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, Heart, ShoppingBag, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { totalItems, openCart } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <nav className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-8">
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Navigation - Left */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </Link>
            <Link href="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Collections
            </Link>
            <Link
              href="/new-arrivals"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              New Arrivals
            </Link>
          </div>

          {/* Logo - Center */}
          <Link href="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <span className="font-serif text-foreground text-xl md:text-2xl font-medium tracking-wide">Lumière</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/auth/login"
              className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/wishlist"
              className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <button
              onClick={openCart}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 px-6 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <Link
                href="/shop"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/collections"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Collections
              </Link>
              <Link
                href="/new-arrivals"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                New Arrivals
              </Link>
              <Link
                href="/about"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Our Story
              </Link>
              <div className="flex gap-4 pt-4 border-t border-border/50">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <User className="w-5 h-5" />
                  <span>Account</span>
                </Link>
                <Link href="/wishlist" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
