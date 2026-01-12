// lib/auth-context.tsx - Updated version
"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
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
  const initializedRef = useRef(false)

  // Load cached user data immediately
  const loadCachedUser = (): AuthUser | null => {
    if (typeof window === 'undefined') return null
    try {
      const cached = localStorage.getItem(USER_CACHE_KEY) || Cookies.get(USER_CACHE_KEY)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (error) {
      console.error("Error loading cached user:", error)
    }
    return null
  }

  // Save user data to both localStorage and cookies
  const cacheUser = (userData: AuthUser | null) => {
    if (typeof window === 'undefined') return
    try {
      if (userData) {
        const userString = JSON.stringify(userData)
        localStorage.setItem(USER_CACHE_KEY, userString)
        Cookies.set(USER_CACHE_KEY, userString, { 
          expires: 7,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        })
      } else {
        localStorage.removeItem(USER_CACHE_KEY)
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
        console.error("Error fetching customer data:", error.message)
        // Fall back to existing user data if available
        return {
          ...authUser,
          role: user?.role || 'normal',
          name: user?.name || authUser.email?.split('@')[0] || 'User'
        }
      }

      if (customer) {
        return {
          ...authUser,
          role: customer.role,
          name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
        }
      }

      return authUser
    } catch (error) {
      console.error("Exception in fetchUserData:", error)
      return authUser
    }
  }

  const refreshUser = async () => {
    try {
      setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Skip if already initialized
    if (initializedRef.current) {
      setIsLoading(false)
      return
    }

    const initializeAuth = async () => {
      // Immediately load from cache for instant UI
      const cachedUser = loadCachedUser()
      if (cachedUser) {
        setUser(cachedUser)
        setIsLoading(false)
        initializedRef.current = true
      }

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
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
        initializedRef.current = true
      }
    }

    initializeAuth()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      subscription.unsubscribe()
    }
  }, []) // Empty dependency array - only run once

  const signOut = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      cacheUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
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
