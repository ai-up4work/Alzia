import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    has_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    has_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url_preview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
    all_public_vars: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC'))
  })
}