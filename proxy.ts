import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const path = request.nextUrl.pathname

  // console.log("🌐 MIDDLEWARE TRIGGERED - Full URL:", request.url)
  // console.log("🌐 Path:", path)

  // Public routes - allow access
  if (!path.startsWith('/account') && !path.startsWith('/admin') && !path.startsWith('/wholesale')) {
    // console.log("✅ Public route, allowing access")
    return response
  }

  // Use getUser() instead of getSession() for security
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  // console.log('🔒 Middleware - Path:', path, '| User:', user ? 'Found' : 'None')

  // No user or error - redirect to login
  if (error || !user) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', path)
    // console.log('❌ No user, redirecting to login')
    return NextResponse.redirect(redirectUrl)
  }

  // console.log('👤 User ID:', user.id)

  // Get user role from customers table
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('role, status')
    .eq('id', user.id)
    .single()

  // console.log('👤 Middleware - Customer role:', customer?.role, '| Path:', path)

  // Check if customer exists and is active
  if (!customer) {
    // console.log('❌ No customer found')
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (customer.status !== 'active') {
    // console.log('❌ Customer not active')
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // CRITICAL: Check if role exists
  if (!customer.role) {
    // console.log('❌ No role found')
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Hierarchical role-based access control
  // admin → can access /admin, /wholesale, /account
  // wholesaler → can access /wholesale, /account (NOT /admin)
  // normal → can access only /account
  
  if (path.startsWith('/admin')) {
    // Only admin can access admin routes
    if (customer.role !== 'admin') {
      // console.log('❌ Access denied to /admin - redirecting to correct dashboard')
      const correctPath = customer.role === 'wholesaler' ? '/wholesale' : '/account'
      return NextResponse.redirect(new URL(correctPath, request.url))
    }
    // console.log('✅ Admin route - access granted for admin')
  } 
  else if (path.startsWith('/wholesale')) {
    // Admin and wholesaler can access wholesale routes
    if (customer.role !== 'admin' && customer.role !== 'wholesaler') {
      // console.log('❌ Access denied to /wholesale - not admin or wholesaler, redirecting to /account')
      return NextResponse.redirect(new URL('/account', request.url))
    }
    // console.log('✅ Wholesale route - access granted for role:', customer.role)
  } 
  else if (path.startsWith('/account')) {
    // All authenticated users can access account routes (hierarchical)
    // console.log('✅ Account route - access granted for role:', customer.role)
  }

  // console.log('✅ Middleware - Final access granted to', path)
  return response
}

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/wholesale/:path*',
  ],
}
