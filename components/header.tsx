// components/header.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Heart, ShoppingBag, User, LogOut } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import { getRoleBasedRedirect } from "@/lib/utils/role-redirect"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [localLoading, setLocalLoading] = useState(true)
  const { totalItems, openCart } = useCart()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    setMounted(true)
    
    const timer = setTimeout(() => {
      setLocalLoading(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (mounted) {
      if (authLoading && !user) {
        setLocalLoading(true)
      } else {
        setLocalLoading(false)
      }
    }
  }, [authLoading, user, mounted])

  const getDashboardLink = () => {
    if (!user?.role) {
      return '/account'
    }
    return getRoleBasedRedirect(user.role)
  }

  const handleLogout = async () => {
    try {
      // Submit to server-side logout endpoint
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = '/auth/signout'
      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback to client-side logout if server-side fails
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/auth/login'
    }
  }

  const getUserInitials = () => {
    if (user?.name) {
      const parts = user.name.trim().split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return user.name[0].toUpperCase()
    }
    return user?.email?.[0].toUpperCase() || 'U'
  }

  const renderUserAvatar = (size: 'small' | 'large') => {
    const sizeClasses = size === 'small' ? 'w-6 h-6' : 'w-8 h-8'
    const textSize = size === 'small' ? 'text-[10px]' : 'text-xs'

    return (
      <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center hover:border-primary/50 transition-all`}>
        <span className={`${textSize} font-semibold text-primary`}>
          {getUserInitials()}
        </span>
      </div>
    )
  }

  const showLoading = !mounted || (localLoading && !user)

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
              disabled={showLoading}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/shop" className="text-md font-bold text-muted-foreground hover:text-foreground transition-colors tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                Shop
              </Link>
              <Link href="/collections" className="text-md font-bold text-muted-foreground hover:text-foreground transition-colors tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                Collections
              </Link>
              <Link href="/new-arrivals" className="text-md font-bold text-muted-foreground hover:text-foreground transition-colors tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
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
              {!showLoading && isAuthenticated && user?.role === 'normal' && (
                <Link href="/account/wishlist" className="hidden md:flex p-2 text-muted-foreground hover:text-secondary transition-colors" aria-label="Wishlist">
                  <Heart className="w-5 h-5" />
                </Link>
              )}
              
              <button 
                onClick={openCart} 
                className="p-2 text-muted-foreground hover:text-secondary transition-colors relative" 
                aria-label="Shopping bag"
                disabled={showLoading}
              >
                <ShoppingBag className="w-5 h-5" />
                {!showLoading && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              <div className="hidden md:flex items-center gap-2">
                {showLoading ? (
                  <div className="w-8 h-8 rounded-full bg-muted/50 animate-pulse" />
                ) : isAuthenticated && user ? (
                  <>
                    <Link href={getDashboardLink()} aria-label="Account" className="transition-transform hover:scale-105">
                      {renderUserAvatar('large')}
                    </Link>
                    {/* Desktop logout using the handleLogout function */}
                    <button
                      onClick={handleLogout}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" className="p-2 text-muted-foreground hover:text-secondary transition-colors" aria-label="Login">
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>
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
                
                <div className="flex flex-col gap-4 pt-6 border-t border-border/50">
                  {!showLoading && isAuthenticated && user?.role === 'normal' && (
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

                  {showLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted/50 animate-pulse" />
                      <div className="h-4 w-20 bg-muted/50 animate-pulse rounded" />
                    </div>
                  ) : isAuthenticated && user ? (
                    <>
                      <Link 
                        href={getDashboardLink()} 
                        className="flex items-center gap-2" 
                        onClick={() => setIsOpen(false)}
                      >
                        {renderUserAvatar('small')}
                        <span className="text-xs font-medium tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                          {user.role === 'admin' ? 'Admin' : user.role === 'wholesaler' ? 'Dashboard' : 'Account'}
                        </span>
                      </Link>
                      {/* Mobile logout using the same handleLogout function */}
                      <button
                        onClick={() => {
                          setIsOpen(false) // Close menu first
                          handleLogout() // Then logout
                        }}
                        className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-xs font-medium tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                          Sign Out
                        </span>
                      </button>
                    </>
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
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}