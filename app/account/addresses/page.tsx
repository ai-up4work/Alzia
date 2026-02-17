"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Plus,
  Trash2,
  Star,
  Home,
  Briefcase,
  MoreHorizontal,
  X,
  Pencil,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// ── Types ────────────────────────────────────────────────────────────────────

type AddressType = "home" | "office" | "other"

interface Address {
  id: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2?: string | null
  city: string
  state: string
  pin_code: string
  landmark?: string | null
  address_type: AddressType
  is_default: boolean
  created_at: string
}

const EMPTY_FORM = {
  full_name: "",
  phone: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  pin_code: "",
  landmark: "",
  address_type: "home" as AddressType,
  is_default: false,
}

const TYPE_ICONS: Record<AddressType, React.ReactNode> = {
  home: <Home className="w-3.5 h-3.5" />,
  office: <Briefcase className="w-3.5 h-3.5" />,
  other: <MoreHorizontal className="w-3.5 h-3.5" />,
}

const TYPE_LABEL: Record<AddressType, string> = {
  home: "Home",
  office: "Office",
  other: "Other",
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AddressesPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [fetchingAddresses, setFetchingAddresses] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth/login")
  }, [isLoading, isAuthenticated, router])

  // Fetch addresses
  useEffect(() => {
    if (!isAuthenticated) return
    fetchAddresses()
  }, [isAuthenticated])

  const fetchAddresses = async () => {
    setFetchingAddresses(true)
    try {
      const res = await fetch("/api/addresses")
      if (res.ok) {
        const data = await res.json()
        setAddresses(data.addresses ?? [])
      }
    } catch {
      // silently fail
    } finally {
      setFetchingAddresses(false)
    }
  }

  const openNew = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setMessage(null)
    setShowForm(true)
  }

  const openEdit = (addr: Address) => {
    setEditingId(addr.id)
    setForm({
      full_name: addr.full_name,
      phone: addr.phone,
      address_line_1: addr.address_line_1,
      address_line_2: addr.address_line_2 ?? "",
      city: addr.city,
      state: addr.state,
      pin_code: addr.pin_code,
      landmark: addr.landmark ?? "",
      address_type: addr.address_type,
      is_default: addr.is_default,
    })
    setMessage(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses"
      const method = editingId ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `Server error ${res.status}`)

      setMessage({ type: "success", text: editingId ? "Address updated." : "Address added." })
      await fetchAddresses()
      setTimeout(closeForm, 900)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save address." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    } catch {
      // could show toast
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await fetch(`/api/addresses/${id}/default`, { method: "POST" })
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, is_default: a.id === id }))
      )
    } catch {
      // silently fail
    }
  }

  // ── Skeleton ──────────────────────────────────────────────────────────────

  if (isLoading || !user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24">
          <div className="max-w-2xl mx-auto px-6 lg:px-8 space-y-8">
            <div className="h-4 w-28 bg-gray-100 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-10 w-48 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-3 w-40 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <div className="h-px bg-gray-200" />
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">

          {/* Back link */}
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-10"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Account
          </Link>

          {/* Page heading */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-gray-900 font-light">Addresses</h1>
              <p className="text-gray-600 mt-2 text-sm">
                {addresses.length > 0
                  ? `${addresses.length} saved address${addresses.length !== 1 ? "es" : ""}`
                  : "Manage your delivery addresses"}
              </p>
            </div>
            {!showForm && (
              <Button
                onClick={openNew}
                size="sm"
                className="rounded-full bg-gray-900 hover:bg-gray-800 text-white h-9 px-4 gap-1.5 mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add new
              </Button>
            )}
          </div>

          <div className="h-px bg-gray-200 mb-8" />

          {/* ── Address Cards ────────────────────────────────────────────── */}
          {fetchingAddresses ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : addresses.length === 0 && !showForm ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium mb-1">No addresses yet</p>
              <p className="text-sm text-gray-500 mb-6">Add an address to speed up checkout</p>
              <Button
                onClick={openNew}
                className="rounded-full bg-gray-900 hover:bg-gray-800 text-white h-10 px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add address
              </Button>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`relative rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md ${
                    addr.is_default
                      ? "border-gray-900 ring-1 ring-gray-900/10"
                      : "border-gray-200"
                  }`}
                >
                  {/* Default badge */}
                  {addr.is_default && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-gray-900 text-white rounded-full px-2.5 py-1">
                      <Star className="w-2.5 h-2.5" />
                      Default
                    </span>
                  )}

                  <div className="flex items-start gap-3 pr-20">
                    {/* Type icon */}
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 text-gray-600">
                      {TYPE_ICONS[addr.address_type]}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-gray-900">{addr.full_name}</p>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                          {TYPE_LABEL[addr.address_type]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {addr.address_line_1}
                        {addr.address_line_2 ? `, ${addr.address_line_2}` : ""}
                      </p>
                      {addr.landmark && (
                        <p className="text-xs text-gray-400 mt-0.5">Near {addr.landmark}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {addr.city}, {addr.state} — {addr.pin_code}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openEdit(addr)}
                      className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>

                    {!addr.is_default && (
                      <>
                        <span className="text-gray-200">·</span>
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Star className="w-3 h-3" />
                          Set as default
                        </button>
                      </>
                    )}

                    <span className="flex-1" />

                    <button
                      onClick={() => handleDelete(addr.id)}
                      disabled={deletingId === addr.id}
                      className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                    >
                      {deletingId === addr.id ? (
                        <SpinnerIcon className="w-3 h-3" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Add / Edit Form ──────────────────────────────────────────── */}
          {showForm && (
            <>
              {addresses.length > 0 && <div className="h-px bg-gray-200 mb-8" />}

              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-medium text-gray-900">
                  {editingId ? "Edit address" : "New address"}
                </p>
                <button
                  onClick={closeForm}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors"
                  aria-label="Close form"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Address type picker */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-700">Address type</Label>
                  <div className="flex gap-2">
                    {(["home", "office", "other"] as AddressType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, address_type: t }))}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-all ${
                          form.address_type === t
                            ? "bg-gray-900 border-gray-900 text-white"
                            : "border-gray-300 text-gray-600 hover:border-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {TYPE_ICONS[t]}
                        {TYPE_LABEL[t]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="full_name" className="text-xs font-medium text-gray-700">
                      Full name
                    </Label>
                    <Input
                      id="full_name"
                      required
                      value={form.full_name}
                      onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                      className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium text-gray-700">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+94 71 234 5678"
                      className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                    />
                  </div>
                </div>

                {/* Address lines */}
                <div className="space-y-1.5">
                  <Label htmlFor="address_line_1" className="text-xs font-medium text-gray-700">
                    Address line 1
                  </Label>
                  <Input
                    id="address_line_1"
                    required
                    value={form.address_line_1}
                    onChange={(e) => setForm((p) => ({ ...p, address_line_1: e.target.value }))}
                    placeholder="House / Flat / Building"
                    className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address_line_2" className="text-xs font-medium text-gray-700">
                    Address line 2{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="address_line_2"
                    value={form.address_line_2}
                    onChange={(e) => setForm((p) => ({ ...p, address_line_2: e.target.value }))}
                    placeholder="Street / Area / Colony"
                    className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                  />
                </div>

                {/* City / State / Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-medium text-gray-700">City</Label>
                    <Input
                      id="city"
                      required
                      value={form.city}
                      onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="text-xs font-medium text-gray-700">Province</Label>
                    <Input
                      id="state"
                      required
                      value={form.state}
                      onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                      className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pin_code" className="text-xs font-medium text-gray-700">
                      Postal code
                    </Label>
                    <Input
                      id="pin_code"
                      required
                      value={form.pin_code}
                      onChange={(e) => setForm((p) => ({ ...p, pin_code: e.target.value }))}
                      placeholder="10000"
                      className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div className="space-y-1.5">
                  <Label htmlFor="landmark" className="text-xs font-medium text-gray-700">
                    Landmark{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="landmark"
                    value={form.landmark}
                    onChange={(e) => setForm((p) => ({ ...p, landmark: e.target.value }))}
                    placeholder="Near a mosque, hospital, school…"
                    className="h-11 rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-colors"
                  />
                </div>

                {/* Set as default toggle */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.is_default}
                      onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))}
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-gray-900 transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm text-gray-700">Set as default address</span>
                </label>

                {/* Feedback */}
                {message && (
                  <div
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-full text-sm border ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    {message.text}
                  </div>
                )}

                <div className="h-px bg-gray-200 !mt-8" />

                {/* Actions */}
                <div className="flex items-center gap-3 !mt-6">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSaving}
                    className="flex-1 h-11 rounded-full bg-gray-900 hover:bg-gray-800 text-white transition-colors font-medium"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <SpinnerIcon className="w-4 h-4" />
                        Saving…
                      </span>
                    ) : editingId ? (
                      "Save changes"
                    ) : (
                      "Add address"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={closeForm}
                    disabled={isSaving}
                    className="h-11 rounded-full border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>

      <Footer />
    </main>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SpinnerIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}