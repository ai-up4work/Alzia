// app/auth/login/page.tsx
"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getRoleBasedRedirect } from "@/lib/utils/role-redirect"

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams?.get("redirect")
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // console.log("🔐 Starting login process...")
      const supabase = createClient()

      // Sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error("No user data returned")
      }

      // console.log("✅ User authenticated:", authData.user.id)

      // Get user role and status from customers table
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("role, status")
        .eq("id", authData.user.id)
        .single()

      if (customerError) {
        throw new Error(`Failed to fetch customer profile: ${customerError.message}`)
      }

      if (!customer) {
        throw new Error("Customer profile not found in database")
      }

      // console.log("✅ Customer role:", customer.role, "| Status:", customer.status)

      if (customer.status !== "active") {
        await supabase.auth.signOut()
        throw new Error("Your account is not active. Please contact support.")
      }

      // Determine redirect URL
      const redirectUrl = getRoleBasedRedirect(customer.role, redirect)
      
      // console.log("🎯 Redirect URL:", redirectUrl, "for role:", customer.role)
      
      // Small delay to ensure auth cookies are set
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // console.log("🚀 Executing redirect to:", redirectUrl)
      
      // Use window.location.href for a hard navigation
      window.location.href = redirectUrl

    } catch (err: any) {
      console.error("❌ Login error:", err.message)
      setError(err.message || "Failed to login. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 
              className="text-3xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-foreground mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
