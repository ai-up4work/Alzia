// lib/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Cookies from "js-cookie"

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

  // Load cached user data from cookies immediately
  const loadCachedUser = (): AuthUser | null => {
    try {
      const cached = Cookies.get(USER_CACHE_KEY)
      if (cached) {
        const userData = JSON.parse(cached)
        console.log("💾 Loaded user from cache:", userData.role)
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
      console.log("📊 Fetching customer data from database for user:", authUser.id)
      const supabase = createClient()
      
      console.log("🔍 About to query customers table...")
      
      // Add timeout to detect hanging queries
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000)
      )
      
      const queryPromise = supabase
        .from("customers")
        .select("role, first_name, last_name")
        .eq("id", authUser.id)
        .single()
      
      const { data: customer, error } = await Promise.race([queryPromise, timeoutPromise]) as any

      console.log("📦 Database response:", { customer, error })
      console.log("📦 Error details:", error ? JSON.stringify(error) : "none")

      if (error) {
        console.error("❌ Error fetching customer data:", error.message, error.details, error.hint)
        // Return cached data if query fails but user is authenticated
        const cached = loadCachedUser()
        if (cached && cached.id === authUser.id) {
          console.log("⚠️ Using cached user data due to query error")
          return cached
        }
        return authUser
      }

      if (customer) {
        console.log("✅ Customer found:", customer)
        const userData = {
          ...authUser,
          role: customer.role,
          name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
        }
        cacheUser(userData)
        return userData
      }

      console.warn("⚠️ No customer data found, returning basic auth user")
      return authUser
    } catch (error) {
      console.error("💥 Exception in fetchUserData:", error)
      // Try to use cached data on exception
      const cached = loadCachedUser()
      if (cached && cached.id === authUser.id) {
        console.log("⚠️ Using cached user data due to exception")
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
    const supabase = createClient()
    let mounted = true

    // Load cached user immediately for instant display
    const cachedUser = loadCachedUser()
    if (cachedUser) {
      setUser(cachedUser)
      setIsLoading(false)
      console.log("⚡ Using cached user for instant display")
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log("🔄 Initializing auth...")
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error("❌ Error getting user:", error)
          if (mounted) {
            setUser(null)
            cacheUser(null)
            setIsLoading(false)
          }
          return
        }

        console.log("📋 User:", authUser ? "Found" : "None")

        if (authUser && mounted) {
          console.log("👤 Fetching user data for:", authUser.id)
          const userData = await fetchUserData(authUser)
          console.log("✅ User data loaded:", userData.role)
          setUser(userData)
          cacheUser(userData)
        } else if (mounted) {
          setUser(null)
          cacheUser(null)
        }
        
        if (mounted) {
          console.log("✅ Auth initialized, loading complete")
          setIsLoading(false)
        }
      } catch (error) {
        console.error("💥 Error initializing auth:", error)
        if (mounted) {
          // Keep cached user if auth check fails
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
      console.log("🔔 Auth state changed:", event)
      
      if (!mounted) return

      if (session?.user) {
        console.log("👤 User signed in, fetching data...")
        const userData = await fetchUserData(session.user)
        console.log("✅ User data updated:", userData.role)
        setUser(userData)
        cacheUser(userData)
      } else {
        console.log("🚪 User signed out")
        setUser(null)
        cacheUser(null)
      }
      
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

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