"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { ChevronLeft, CheckCircle2, AlertCircle, Sparkles, ShoppingBag, Star, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso))
}

const ROLE_LABEL: Record<string, string> = {
  normal: "Member",
  admin: "Admin",
  wholesaler: "Wholesale",
}

const TYPE_LABEL: Record<string, string> = {
  retail: "Retail",
  wholesale: "Wholesale",
}

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  blocked: "bg-red-50 text-red-600 border-red-200",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth()

  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "" })
  const isSavingRef = useRef(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login")
  }, [isLoading, isAuthenticated, router])

  // Populate form from user — but never overwrite while user is actively saving
  // This runs on EVERY user change so cached→real user transition always fills phone
  useEffect(() => {
    if (!user) return
    if (isSavingRef.current) return // don't reset mid-save
    const nameParts = (user.name || "").split(" ")
    setFormData({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      // user.phone is from customers table (set in auth-context fetchUserData)
      phone: user.phone || "",
    })
  }, [user])

  // ── Save via API route (server-side, bypasses RLS) ────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)
    isSavingRef.current = true
    setMessage(null)

    // Safety timeout — unblocks UI if something hangs
    const safetyTimer = setTimeout(() => {
      setIsSaving(false)
      setMessage({ type: "error", text: "Request timed out. Please try again." })
    }, 10_000)

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || `Server error ${res.status}`)
      }

      // Sync auth context in background so header name updates
      refreshUser().catch(() => {})

      setMessage({ type: "success", text: "Profile updated successfully" })
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" })
    } finally {
      clearTimeout(safetyTimer)
      isSavingRef.current = false
      setIsSaving(false)
    }
  }

  const handleDiscard = () => {
    if (!user) return
    const nameParts = (user.name || "").split(" ")
    setFormData({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      phone: user.phone || "",
    })
    setMessage(null)
  }

  // Skeleton
  if (isLoading || !user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24">
          <div className="max-w-2xl mx-auto px-6 lg:px-8 space-y-8">
            <div className="h-4 w-28 bg-gray-100 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-10 w-44 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-3 w-56 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <div className="h-px bg-gray-200" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
            <div className="h-px bg-gray-200" />
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-gray-100 rounded-full animate-pulse" />
                  <div className="h-11 w-full bg-gray-100 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  const initials = formData.firstName
    ? formData.firstName[0].toUpperCase()
    : (user.email ?? "U")[0].toUpperCase()

  const displayName =
    [formData.firstName, formData.lastName].filter(Boolean).join(" ") || user.email || "User"

  const tryonRemaining = Math.max(0, (user.tryon_credits ?? 0) - (user.tryon_credits_used ?? 0))
  const status = user.status ?? "active"
  const role = user.role ?? "normal"
  const customerType = user.customer_type ?? "retail"

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">

          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-10"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>

          <div className="mb-3">
            <h1 className="font-serif text-4xl md:text-5xl text-gray-900 font-light">My Profile</h1>
            <p className="text-gray-600 mt-2 text-sm">
              {user.customer_created_at
                ? `Member since ${formatDate(user.customer_created_at)}`
                : "Manage your personal information"}
            </p>
          </div>

          {/* Identity row */}
          <div className="flex items-center gap-3 mt-8 mb-6">
            <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center font-serif text-lg font-light select-none shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
           
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Orders</span>
              </div>
              <p className="font-serif text-2xl font-light text-gray-900">{user.order_count ?? 0}</p>
              <p className="text-[11px] text-gray-500">{formatCurrency(user.total_spent ?? 0)} total</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Try-Ons</span>
              </div>
              <p className="font-serif text-2xl font-light text-gray-900">{tryonRemaining}</p>
              <p className="text-[11px] text-gray-500">
                {user.tryon_credits_used ?? 0} used{user.tryon_credits != null ? ` of ${user.tryon_credits}` : ""}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                <Star className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Account</span>
              </div>
              <p className="font-serif text-2xl font-light text-gray-900">
                {TYPE_LABEL[customerType] ?? customerType}
              </p>
              <p className="text-[11px] text-gray-500">{ROLE_LABEL[role] ?? role}</p>
            </div>
          </div>

          <div className="h-px bg-gray-200 mb-8" />

          {/* Editable form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-gray-600">Personal information</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-medium text-gray-700">First name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                  className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-medium text-gray-700">Last name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                  className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium text-gray-700">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+94 71 234 5678"
                className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
              />
            </div>

            {message && (
              <div className={`flex items-center gap-2.5 px-4 py-3 rounded-full text-sm border ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}>
                {message.type === "success"
                  ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                  : <AlertCircle className="w-4 h-4 shrink-0" />}
                {message.text}
              </div>
            )}

            <div className="h-px bg-gray-200 !mt-8" />

            <div className="flex items-center gap-3 !mt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isSaving}
                className="flex-1 h-11 rounded-full bg-gray-900 hover:bg-gray-800 text-white transition-colors font-medium"
              >
                {isSaving
                  ? <span className="flex items-center gap-2"><SpinnerIcon />Saving…</span>
                  : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleDiscard}
                disabled={isSaving}
                className="h-11 rounded-full border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Discard
              </Button>
            </div>
          </form>

          {/* Read-only section */}
          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                <Lock className="w-3 h-3" />
                Managed by admin
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3 space-y-1.5">
                <Label className="text-xs font-medium text-gray-400">Email address</Label>
                <div className="h-11 rounded-full bg-gray-50 border border-gray-200 px-4 flex items-center text-sm text-gray-400 cursor-not-allowed">
                  {user.email}
                </div>
                <p className="text-xs text-gray-400 pl-3">Email cannot be changed</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-400">Role</Label>
                <div className="h-11 rounded-full bg-gray-50 border border-gray-200 px-4 flex items-center text-sm text-gray-400 cursor-not-allowed">
                  {ROLE_LABEL[role] ?? role}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-400">Account type</Label>
                <div className="h-11 rounded-full bg-gray-50 border border-gray-200 px-4 flex items-center text-sm text-gray-400 cursor-not-allowed">
                  {TYPE_LABEL[customerType] ?? customerType}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-400">Status</Label>
                <div className="h-11 rounded-full bg-gray-50 border border-gray-200 px-4 flex items-center text-sm text-gray-400 cursor-not-allowed">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}

function SpinnerIcon() {
  return (
    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}