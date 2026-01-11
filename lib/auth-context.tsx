// lib/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Cookies from "js-cookie"
import { usePathname } from "next/navigation"

interface AuthUser extends User {
  role?: string
  name?: string
  profilePicture?: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USER_CACHE_KEY = "auth_user_cache"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  // Don't initialize auth on login page - let login handle the redirect
  const isLoginPage = pathname === '/auth/login'

  // Load cached user data from cookies immediately
  const loadCachedUser = (): AuthUser | null => {
    try {
      const cached = Cookies.get(USER_CACHE_KEY)
      if (cached) {
        const userData = JSON.parse(cached)
        // console.log("💾 Loaded user from cache:", userData.role)
        return userData
      }
    } catch (error) {
      console.error("Error loading cached user:", error)
    }
    return null
  }

  // Save user data to cookies
  const cacheUser = (userData: AuthUser | null) => {
    try {
      if (userData) {
        Cookies.set(USER_CACHE_KEY, JSON.stringify(userData), { 
          expires: 7, // 7 days
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        })
      } else {
        Cookies.remove(USER_CACHE_KEY)
      }
    } catch (error) {
      console.error("Error caching user:", error)
    }
  }

  const fetchUserData = async (authUser: User): Promise<AuthUser> => {
    try {
      const supabase = createClient()
      
      const { data: customer, error } = await supabase
        .from("customers")
        .select("role, first_name, last_name")
        .eq("id", authUser.id)
        .single()

      if (error) {
        console.error("❌ Error fetching customer data:", error.message)
        const cached = loadCachedUser()
        if (cached && cached.id === authUser.id) {
        //   console.log("⚠️ Using cached user data due to query error")
          return cached
        }
        return authUser
      }

      if (customer) {
        const userData = {
          ...authUser,
          role: customer.role,
          name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
        }
        cacheUser(userData)
        return userData
      }

      return authUser
    } catch (error) {
      console.error("💥 Exception in fetchUserData:", error)
      const cached = loadCachedUser()
      if (cached && cached.id === authUser.id) {
        // console.log("⚠️ Using cached user data due to exception")
        return cached
      }
      return authUser
    }
  }

  const refreshUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error("Error getting user:", error)
        setUser(null)
        cacheUser(null)
        return
      }
      
      if (authUser) {
        const userData = await fetchUserData(authUser)
        setUser(userData)
        cacheUser(userData)
      } else {
        setUser(null)
        cacheUser(null)
      }
    } catch (error) {
      console.error("Error in refreshUser:", error)
      setUser(null)
      cacheUser(null)
    }
  }

  useEffect(() => {
    // Skip auth initialization on login page
    if (isLoginPage) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    let mounted = true

    // Load cached user immediately for instant display
    const cachedUser = loadCachedUser()
    if (cachedUser) {
      setUser(cachedUser)
      setIsLoading(false)
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          if (mounted) {
            setUser(null)
            cacheUser(null)
            setIsLoading(false)
          }
          return
        }

        if (authUser && mounted) {
          const userData = await fetchUserData(authUser)
          setUser(userData)
          cacheUser(userData)
        } else if (mounted) {
          setUser(null)
          cacheUser(null)
        }
        
        if (mounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("💥 Error initializing auth:", error)
        if (mounted) {
          if (!cachedUser) {
            setUser(null)
            cacheUser(null)
          }
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Ignore auth changes on login page
      if (isLoginPage) return
      
    //   console.log("🔔 Auth state changed:", event)
      
      if (!mounted) return

      if (session?.user) {
        const userData = await fetchUserData(session.user)
        setUser(userData)
        cacheUser(userData)
      } else {
        setUser(null)
        cacheUser(null)
      }
      
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [isLoginPage])

  const signOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      cacheUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}