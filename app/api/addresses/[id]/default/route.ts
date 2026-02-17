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

// ── POST /api/addresses/[id]/default ─────────────────────────────────────────
export async function POST(_request: Request, { params }: { params: { id: string } }) {
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

  // Unset all defaults for this customer
  await supabase
    .from("customer_addresses")
    .update({ is_default: false })
    .eq("customer_id", customerId)

  // Set new default (ownership check via customer_id)
  const { error } = await supabase
    .from("customer_addresses")
    .update({ is_default: true })
    .eq("id", params.id)
    .eq("customer_id", customerId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}