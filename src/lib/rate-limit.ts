/* ================================================
   Rate Limiter — In-memory (dev) / Redis-ready
   Simple sliding window counter per key.
   ================================================ */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// Pre-configured rate limiters for auth endpoints
export const authRateLimits = {
  signup: { windowMs: 60 * 60 * 1000, maxRequests: 5 }, // 5 per hour
  login: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 per 15 min
  otp: { windowMs: 60 * 1000, maxRequests: 3 }, // 3 per minute
  otpVerify: { windowMs: 15 * 60 * 1000, maxRequests: 10 }, // 10 per 15 min
  forgotPassword: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
  resetPassword: { windowMs: 60 * 60 * 1000, maxRequests: 5 }, // 5 per hour
};
