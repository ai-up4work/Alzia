// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// ── Server-side Supabase clients ──────────────────────────────────────────────

// Service role client — bypasses RLS, used for the actual DB write
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // never expose this client-side
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Server session client — used only to verify the caller's identity
async function getSessionClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // read-only in route handlers
      },
    }
  )
}

// ── PATCH /api/profile ────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    // 1. Verify the caller is authenticated
    const sessionClient = await getSessionClient()
    const { data: { user }, error: authError } = await sessionClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse and validate the body
    const body = await req.json()
    const { firstName, lastName, phone } = body

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof phone !== "string"
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // 3. Write to customers table using service role (bypasses RLS)
    const service = getServiceClient()
    const { error: dbError } = await service
      .from("customers")
      .update({
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        phone: phone.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (dbError) {
      console.error("DB update error:", dbError.message)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // 4. Also update Supabase Auth metadata (best-effort)
    await service.auth.admin.updateUserById(user.id, {
      user_metadata: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("PATCH /api/profile error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// ── GET /api/profile ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    const sessionClient = await getSessionClient()
    const { data: { user }, error: authError } = await sessionClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const service = getServiceClient()
    const { data, error } = await service
      .from("customers")
      .select(
        "id, email, first_name, last_name, phone, customer_type, status, role, total_spent, order_count, tryon_credits, tryon_credits_used, last_tryon_at, created_at"
      )
      .eq("id", user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message ?? "Not found" }, { status: 404 })
    }

    return NextResponse.json({ customer: data })
  } catch (err: any) {
    console.error("GET /api/profile error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}