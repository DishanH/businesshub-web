import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/nanny-services',
  '/add-business',
  '/account',
  '/business/dashboard',
  '/business/ads',
  '/business/pages',
  '/saved-posts',
  '/notifications'
]

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Check if the current path matches any protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // If accessing auth pages with a session, redirect to home
  if (request.nextUrl.pathname.startsWith('/auth') && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If accessing protected routes without a session, redirect to sign in
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/sign-in', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/nanny-services/:path*',
    '/add-business/:path*',
    '/account/:path*',
    '/business/:path*',
    '/saved-posts/:path*',
    '/notifications/:path*',
    '/auth/:path*'
  ],
} 