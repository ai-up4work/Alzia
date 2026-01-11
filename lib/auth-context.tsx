// lib/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async (authUser: User): Promise<AuthUser> => {
    try {
      const supabase = createClient()
      const { data: customer, error } = await supabase
        .from("customers")
        .select("role, first_name, last_name")
        .eq("id", authUser.id)
        .single()

      if (error) {
        console.error("Error fetching customer data:", error)
        return authUser
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
      console.error("Error in fetchUserData:", error)
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
        return
      }
      
      if (authUser) {
        const userData = await fetchUserData(authUser)
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Error in refreshUser:", error)
      setUser(null)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          if (mounted) setIsLoading(false)
          return
        }

        if (session?.user && mounted) {
          const userData = await fetchUserData(session.user)
          setUser(userData)
        }
        
        if (mounted) setIsLoading(false)
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (mounted) setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)
      
      if (!mounted) return

      if (session?.user) {
        const userData = await fetchUserData(session.user)
        setUser(userData)
      } else {
        setUser(null)
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