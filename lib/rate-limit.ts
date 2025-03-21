export interface RateLimitConfig {
  maxRequests: number;  // Maximum number of requests allowed
  windowMs: number;     // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;     // Whether the request is allowed
  limit: number;        // Maximum limit
  remaining: number;    // Remaining requests in the window
  reset: number;        // Time in ms when the window resets
}

// Simple in-memory store (Note: this won't work in a distributed environment with multiple servers)
const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  ip: string, 
  { maxRequests, windowMs }: RateLimitConfig
): RateLimitResult {
  const now = Date.now();

  // Clean up old entries that have expired
  if (now % 1000 === 0) { // Only run cleanup occasionally to reduce overhead
    for (const [storedIp, data] of ipRequestMap.entries()) {
      if (now > data.resetTime) {
        ipRequestMap.delete(storedIp);
      }
    }
  }

  // Get current state for this IP or create a new entry
  const rateLimitInfo = ipRequestMap.get(ip) || {
    count: 0,
    resetTime: now + windowMs
  };

  // If window has expired, reset the counter
  if (now > rateLimitInfo.resetTime) {
    rateLimitInfo.count = 0;
    rateLimitInfo.resetTime = now + windowMs;
  }

  // Increment counter
  rateLimitInfo.count += 1;
  ipRequestMap.set(ip, rateLimitInfo);

  const remaining = Math.max(0, maxRequests - rateLimitInfo.count);
  const success = rateLimitInfo.count <= maxRequests;

  return {
    success,
    limit: maxRequests,
    remaining,
    reset: Math.ceil((rateLimitInfo.resetTime - now) / 1000) // Seconds until reset
  };
}

// Helper to clear all rate limit data (useful for testing)
export function clearRateLimits(): void {
  ipRequestMap.clear();
} 