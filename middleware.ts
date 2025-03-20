import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/nanny-services',
  '/businesses/create',
  '/businesses/update',
  '/businesses/manage',
  '/account',
  '/account/dashboard',
  '/account/ads',
  '/account/pages',
  '/saved-posts',
  '/notifications',
  '/owner/business-profiles/create'
]

// Define role-based routes
const adminRoutes = ['/admin']
const businessRoutes = ['/businesses']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check auth status using getUser for security
  const { data: { user } } = await supabase.auth.getUser()

  // Handle authentication
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isBusinessRoute = businessRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isAuthPage) {
    if (user) {
      // Redirect to home if already authenticated
      return NextResponse.redirect(new URL('/', request.url))
    }
    return response
  }

  // If not authenticated and trying to access any protected route (including admin/business routes)
  if (!user && (isProtectedRoute || isAdminRoute || isBusinessRoute)) {
    // Redirect to login if not authenticated
    const redirectUrl = new URL('/auth/sign-in', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated, check role-based access
  if (user) {
    try {
      // Get role directly from user metadata
      const userRole = user.user_metadata?.role || 'user'
      
      // Check role-based access
      if (isAdminRoute && userRole !== 'admin') {
        // Redirect non-admin users trying to access admin routes
        return NextResponse.redirect(new URL('/', request.url))
      }

      if (isBusinessRoute && !['admin', 'business'].includes(userRole)) {
        // Redirect non-business users trying to access business routes
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      console.error('Middleware error:', error)
      // On error, sign out user and redirect to login
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 