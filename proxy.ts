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

  // Public routes - allow access
  if (!path.startsWith('/account') && !path.startsWith('/admin') && !path.startsWith('/wholesale')) {
    return response
  }

  // Use getUser() instead of getSession() for security
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  // console.log('Middleware - Path:', path)
  // console.log('Middleware - User ID:', user?.id)

  // No user or error - redirect to login
  if (error || !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Get user role from customers table
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('role, status')
    .eq('id', user.id)
    .single()

  // console.log('Middleware - Customer data:', customer)

  // Check if customer exists and is active
  if (!customer) {
    // console.log('Middleware - No customer found, redirecting to unauthorized')
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  if (customer.status !== 'active') {
    // console.log('Middleware - Customer not active, redirecting to unauthorized')
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // CRITICAL: Check if role exists
  if (!customer.role) {
    // console.log('Middleware - No role found for customer, redirecting to unauthorized')
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // console.log('Middleware - Checking access for role:', customer.role, 'on path:', path)

  // Hierarchical role-based access control
  // admin > wholesaler > normal
  
  if (path.startsWith('/admin')) {
    // Only admin can access admin routes
    // console.log('Admin route check - Role is:', customer.role)
    if (customer.role !== 'admin') {
      // console.log('Access denied - not admin')
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  } else if (path.startsWith('/wholesale')) {  // Changed from /wholesaler to /wholesale
    // Admin and wholesaler can access wholesale routes
    // console.log('Wholesale route check - Role is:', customer.role)
    if (customer.role !== 'admin' && customer.role !== 'wholesaler') {
      // console.log('Access denied - not admin or wholesaler')
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  } else if (path.startsWith('/account')) {
    // All roles (admin, wholesaler, normal) can access account routes
    // console.log('Account route - access granted for role:', customer.role)
  }

  // console.log('Middleware - Access granted')
  return response
}

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/wholesale/:path*',  // Changed from /wholesaler
  ],
}