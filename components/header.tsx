"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Heart, ShoppingBag, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { totalItems, openCart } = useCart()
  const { user, isAuthenticated, isLoading } = useAuth()

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&display=swap" rel="stylesheet" />
      
      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
        <nav className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between h-16 md:h-20 px-4 md:px-8">
            <button 
              className="md:hidden p-2" 
              onClick={() => setIsOpen(!isOpen)} 
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/shop" 
                className="text-md font-bold text-muted-foreground hover:text-foreground transition-colors tracking-wider"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Shop
              </Link>
              <Link 
                href="/collections" 
                className="text-md font-bold text-muted-foreground hover:text-foreground transition-colors tracking-wider"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Collections
              </Link>
              <Link
                href="/new-arrivals"
                className="text-md font-bold text-muted-foreground hover:text-foreground transition-colors tracking-wider"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                New Arrivals
              </Link>
            </div>

            <div className="flex-1 flex justify-center md:flex-none md:absolute md:left-1/2 md:-translate-x-1/2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/alzia-logo.png"
                  alt="Alzìa Logo"
                  width={120}
                  height={40}
                  className="object-contain w-20 md:w-28"
                  priority
                />
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {isAuthenticated && (
                <Link
                  href="/account/wishlist"
                  className="hidden md:flex p-2 text-muted-foreground hover:text-secondary transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Link>
              )}
              
              <button
                onClick={openCart}
                className="p-2 text-muted-foreground hover:text-secondary transition-colors relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </button>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Link href="/account" className="hidden md:flex" aria-label="Account">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden hover:border-primary/50 transition-all">
                        {user?.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-primary">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="hidden md:flex p-2 text-muted-foreground hover:text-secondary transition-colors"
                    >
                      <User className="w-5 h-5" />
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden py-6 px-6 border-t border-border/50">
              <div className="flex flex-col gap-6">
                <Link
                  href="/shop"
                  className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors tracking-wider"
                  style={{ fontFamily: "'Cinzel', serif" }}
                  onClick={() => setIsOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  href="/collections"
                  className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors tracking-wider"
                  style={{ fontFamily: "'Cinzel', serif" }}
                  onClick={() => setIsOpen(false)}
                >
                  Collections
                </Link>
                <Link
                  href="/new-arrivals"
                  className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors tracking-wider"
                  style={{ fontFamily: "'Cinzel', serif" }}
                  onClick={() => setIsOpen(false)}
                >
                  New Arrivals
                </Link>
                <div className="flex gap-6 pt-6 border-t border-border/50">
                  {isAuthenticated && (
                    <Link 
                      href="/account/wishlist" 
                      className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-xs font-medium tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                        Wishlist
                      </span>
                    </Link>
                  )}

                  {!isLoading && (
                    <>
                      {isAuthenticated ? (
                        <Link href="/account" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                            {user?.profilePicture ? (
                              <Image
                                src={user.profilePicture}
                                alt={user.name}
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] font-semibold text-primary">
                                {user?.name?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-medium tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                            Account
                          </span>
                        </Link>
                      ) : (
                        <Link
                          href="/auth/login"
                          className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="w-5 h-5" />
                          <span className="text-xs font-medium tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                            Login
                          </span>
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}