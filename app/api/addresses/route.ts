import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log("[addresses GET] authError:", authError)
  console.log("[addresses GET] user:", user?.id, user?.email)

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id, email")
    .eq("email", user.email)
    .single()

  console.log("[addresses GET] customerError:", customerError)
  console.log("[addresses GET] customer:", customer)

  if (!customer) {
    return NextResponse.json({ addresses: [] })
  }

  const { data: addresses, error } = await supabase
    .from("customer_addresses")
    .select("*")
    .eq("customer_id", customer.id)

  console.log("[addresses GET] addressesError:", error)
  console.log("[addresses GET] addresses count:", addresses?.length)

  return NextResponse.json({ addresses: addresses ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log("[addresses POST] authError:", authError)
  console.log("[addresses POST] user:", user?.id, user?.email)

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id, email")
    .eq("email", user.email)
    .single()

  console.log("[addresses POST] customerError:", customerError)
  console.log("[addresses POST] customer:", customer)

  if (!customer) {
    return NextResponse.json({
      error: "Customer not found",
      debug: { searchedEmail: user.email, supabaseError: customerError?.message }
    }, { status: 404 })
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
      .eq("customer_id", customer.id)
  }

  const { data, error } = await supabase
    .from("customer_addresses")
    .insert({
      customer_id: customer.id,
      full_name,
      phone,
      address_line_1,
      address_line_2: address_line_2 || null,
      city,
      state,
      pin_code,
      landmark: landmark || null,
      address_type: address_type || "home",
      is_default: is_default ?? false,
    })
    .select()
    .single()

  console.log("[addresses POST] insertError:", error)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ address: data }, { status: 201 })
}