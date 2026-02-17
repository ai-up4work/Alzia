// lib/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Cookies from "js-cookie"

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuthUser extends User {
  role?: string
  name?: string
  profilePicture?: string
  phone?: string | null
  customer_type?: "retail" | "wholesale"
  status?: "active" | "blocked" | "inactive"
  total_spent?: number
  order_count?: number
  tryon_credits?: number | null
  tryon_credits_used?: number
  last_tryon_at?: string | null
  customer_created_at?: string
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
  const initializedRef = useRef(false)

  // ── Cache helpers ─────────────────────────────────────────────────────────
  const loadCachedUser = (): AuthUser | null => {
    if (typeof window === "undefined") return null
    try {
      const cached = localStorage.getItem(USER_CACHE_KEY) || Cookies.get(USER_CACHE_KEY)
      if (cached) return JSON.parse(cached)
    } catch {}
    return null
  }

  const cacheUser = (userData: AuthUser | null) => {
    if (typeof window === "undefined") return
    try {
      if (userData) {
        const s = JSON.stringify(userData)
        localStorage.setItem(USER_CACHE_KEY, s)
        Cookies.set(USER_CACHE_KEY, s, {
          expires: 7,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        })
      } else {
        localStorage.removeItem(USER_CACHE_KEY)
        Cookies.remove(USER_CACHE_KEY)
      }
    } catch {}
  }

  // ── Fetch customer data via API route (uses service role — bypasses RLS) ──
  // This is the key fix: instead of calling supabase directly from the client
  // (which is blocked by RLS), we call our own API route which uses the
  // service role key server-side.
  const fetchCustomerData = async (): Promise<Record<string, any> | null> => {
    try {
      const res = await fetch("/api/profile", {
        method: "GET",
        // Cookies are sent automatically — the API route verifies the session
        credentials: "same-origin",
      })
      if (!res.ok) return null
      const json = await res.json()
      return json.customer ?? null
    } catch (err) {
      console.error("fetchCustomerData error:", err)
      return null
    }
  }

  // ── Build the full AuthUser from a Supabase auth user ────────────────────
  const buildAuthUser = async (authUser: User): Promise<AuthUser> => {
    const customer = await fetchCustomerData()

    if (!customer) {
      // Fallback — at least we have the auth user
      return {
        ...authUser,
        role: "normal",
        name: authUser.email?.split("@")[0] ?? "User",
      }
    }

    return {
      ...authUser,
      role: customer.role,
      name:
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
        authUser.email?.split("@")[0] ||
        "User",
      phone: customer.phone,
      customer_type: customer.customer_type,
      status: customer.status,
      total_spent: customer.total_spent,
      order_count: customer.order_count,
      tryon_credits: customer.tryon_credits,
      tryon_credits_used: customer.tryon_credits_used,
      last_tryon_at: customer.last_tryon_at,
      customer_created_at: customer.created_at,
    }
  }

  // ── refreshUser — no isLoading flip, won't re-trigger skeletons ──────────
  const refreshUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      if (error || !authUser) {
        setUser(null)
        cacheUser(null)
        return
      }
      const userData = await buildAuthUser(authUser)
      setUser(userData)
      cacheUser(userData)
    } catch (err) {
      console.error("refreshUser error:", err)
    }
    // Intentionally no setIsLoading
  }

  // ── Init — once only ──────────────────────────────────────────────────────
  useEffect(() => {
    if (initializedRef.current) {
      setIsLoading(false)
      return
    }

    const initializeAuth = async () => {
      // 1. Paint cached user immediately for instant UI
      const cachedUser = loadCachedUser()
      if (cachedUser) {
        setUser(cachedUser)
        setIsLoading(false)
        initializedRef.current = true
      }

      try {
        // 2. Verify session is still valid
        const supabase = createClient()
        const { data: { user: authUser }, error } = await supabase.auth.getUser()

        if (error || !authUser) {
          setUser(null)
          cacheUser(null)
          return
        }

        // 3. Fetch fresh customer data from API (service role — no RLS issues)
        const userData = await buildAuthUser(authUser)
        setUser(userData)
        cacheUser(userData)
      } catch (err) {
        console.error("initializeAuth error:", err)
      } finally {
        setIsLoading(false)
        initializedRef.current = true
      }
    }

    initializeAuth()

    // Auth state changes (login / logout / token refresh)
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = await buildAuthUser(session.user)
          setUser(userData)
          cacheUser(userData)
        } else {
          setUser(null)
          cacheUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ── Sign out ──────────────────────────────────────────────────────────────
  const signOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      cacheUser(null)
    } catch (err) {
      console.error("signOut error:", err)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}