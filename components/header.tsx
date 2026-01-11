// components/header.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Heart, ShoppingBag, User, LogOut } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import { getRoleBasedRedirect } from "@/lib/utils/role-redirect"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { totalItems, openCart } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasCheckedRole, setHasCheckedRole] = useState(false)

  // Function to fetch user data
  const fetchUser = async () => {
    try {
      const supabase = createClient()
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("role, first_name, last_name")
        .eq("id", session.user.id)
        .single()

      if (customerError) {
        console.error("Error fetching customer:", customerError)
        setUser({
          ...session.user,
          role: null,
          name: session.user.email,
        })
      } else if (customer) {
        const userData = {
          ...session.user,
          role: customer.role,
          name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || session.user.email,
        }
        setUser(userData)
        
        // Auto-redirect on first load if not on correct page
        if (!hasCheckedRole) {
          setHasCheckedRole(true)
          const storedRole = sessionStorage.getItem('user_role')
          
          if (storedRole && storedRole === customer.role) {
            sessionStorage.removeItem('user_role')
            const correctPath = getRoleBasedRedirect(customer.role)
            
            // Only redirect if we're on login page or root
            if (pathname === '/auth/login' || pathname === '/') {
              window.location.href = correctPath
            }
          }
        }
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error in fetchUser:", error)
      setUser(null)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const supabase = createClient()

    // Initial fetch
    fetchUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        await fetchUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsLoading(false)
        setHasCheckedRole(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Refetch user on route change to ensure fresh data
  useEffect(() => {
    if (!isLoading && pathname !== '/auth/login') {
      fetchUser()
    }
  }, [pathname])

  const isAuthenticated = !!user

  // Get the appropriate dashboard link based on user role
  const dashboardLink = user?.role ? getRoleBasedRedirect(user.role) : '/account'

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setHasCheckedRole(false)
    setIsOpen(false)
    sessionStorage.removeItem('user_role')
    window.location.href = '/'
  }

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
              {isAuthenticated && user?.role === 'normal' && (
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
                    <div className="hidden md:flex items-center gap-2">
                      <Link href={dashboardLink} aria-label="Account">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden hover:border-primary/50 transition-all">
                          {user?.profilePicture ? (
                            <Image
                              src={user.profilePicture}
                              alt={user.name || 'User'}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-primary">
                              {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Logout"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="hidden md:flex p-2 text-muted-foreground hover:text-secondary transition-colors"
                      aria-label="Login"
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
                <div className="flex flex-col gap-4 pt-6 border-t border-border/50">
                  {isAuthenticated && user?.role === 'normal' && (
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
                        <>
                          <Link href={dashboardLink} className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                              {user?.profilePicture ? (
                                <Image
                                  src={user.profilePicture}
                                  alt={user.name || 'User'}
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[10px] font-semibold text-primary">
                                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-medium tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                              {user?.role === 'admin' ? 'Admin' : user?.role === 'wholesaler' ? 'Dashboard' : 'Account'}
                            </span>
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="text-xs font-medium tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                              Logout
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