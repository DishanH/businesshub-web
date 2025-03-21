import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { rateLimit } from './lib/rate-limit'

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
  '/owner/business-profiles/create',
  '/testimonials/submit',
  '/testimonials/edit',
  '/api/testimonials'  // Protect the API route for testimonial submissions
]

// Define role-based routes
const adminRoutes = ['/admin']
const businessRoutes = ['/businesses']

// Flag to use Upstash Redis or local memory-based rate limiting
const USE_REDIS_RATELIMIT = false

// Initialize Redis client for rate limiting (if using Redis)
const redis = USE_REDIS_RATELIMIT ? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
}) : null

// Create a new ratelimiter that allows 10 requests per 10 seconds (if using Redis)
const redisRatelimit = USE_REDIS_RATELIMIT ? new Ratelimit({
  redis: redis!,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true, // Enable analytics
}) : null

// Rate limit configuration for memory-based rate limiter
const RATE_LIMIT_CONFIG = {
  maxRequests: 10,
  windowMs: 10000, // 10 seconds
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Apply rate limiting based on IP
  // Get the real IP from headers (X-Forwarded-For, X-Real-IP) or fallback to a default
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (request.headers.get('x-real-ip') ?? '127.0.0.1')
  
  // Skip rate limiting for static assets
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') || 
    pathname.includes('favicon.ico') ||
    pathname.startsWith('/public')
  ) {
    return response
  }

  // Execute rate limiting
  try {
    let ratelimitResult;
    
    if (USE_REDIS_RATELIMIT && redisRatelimit) {
      // Use Redis-based rate limiting
      ratelimitResult = await redisRatelimit.limit(ip);
    } else {
      // Use memory-based rate limiting
      ratelimitResult = rateLimit(ip, RATE_LIMIT_CONFIG);
    }
    
    const { success, limit, reset, remaining } = ratelimitResult;
    
    // Set rate limit headers
    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', reset.toString())
    
    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        statusText: 'Too Many Requests',
        headers: {
          'Retry-After': reset.toString(),
        },
      })
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Continue without rate limiting on error
  }

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