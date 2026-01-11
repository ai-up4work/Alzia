// lib/supabase/get-user-role.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export async function getUserRole() {
  const supabase = createClientComponentClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return null
  
  const { data: customer } = await supabase
    .from('customers')
    .select('role, status, customer_type')
    .eq('id', session.user.id)
    .single()
  
  return customer
}