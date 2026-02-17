import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// ── shared helper ─────────────────────────────────────────────────────────────
async function getCustomerId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userEmail: string
) {
  const { data } = await supabase
    .from("customers")
    .select("id")
    .eq("email", userEmail)
    .single()
  return data?.id ?? null
}

// ── PATCH /api/addresses/[id] ─────────────────────────────────────────────────
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const customerId = await getCustomerId(supabase, user.email)
  if (!customerId) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 })
  }

  const body = await request.json()
  const {
    full_name,
    phone,
    address_line_1,
    address_line_2,
    city,
    state,
    pin_code,
    landmark,
    address_type,
    is_default,
  } = body

  if (is_default) {
    await supabase
      .from("customer_addresses")
      .update({ is_default: false })
      .eq("customer_id", customerId)
  }

  const { data, error } = await supabase
    .from("customer_addresses")
    .update({
      full_name,
      phone,
      address_line_1,
      address_line_2: address_line_2 || null,
      city,
      state,
      pin_code,
      landmark: landmark || null,
      address_type,
      is_default: is_default ?? false,
    })
    .eq("id", params.id)
    .eq("customer_id", customerId) // ownership check
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ address: data })
}

// ── DELETE /api/addresses/[id] ────────────────────────────────────────────────
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const customerId = await getCustomerId(supabase, user.email)
  if (!customerId) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 })
  }

  const { error } = await supabase
    .from("customer_addresses")
    .delete()
    .eq("id", params.id)
    .eq("customer_id", customerId) // ownership check

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}