import { headers } from "next/headers";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitStore.entries()) {
    const freshTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (freshTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = freshTimestamps;
    }
  }
}

/**
 * Extracts client IP from incoming request headers
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp) return realIp.trim();

    const cfIp = headerList.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

/**
 * Checks if a specific key has exceeded the rate limit
 *
 * @param key Unique identifier (e.g., IP, userId, action:ip)
 * @param maxRequests Maximum requests allowed in the time window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  cleanupExpiredRecords(windowMs);

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter out timestamps outside the active sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterMs = Math.max(0, oldestTimestamp + windowMs - now);
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  // Record this request
  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    retryAfterSeconds: 0,
  };
}

export interface RateLimitOptions {
  action: string;
  maxRequests?: number;
  windowSeconds?: number;
  customKey?: string;
}

/**
 * Rate limiter utility designed specifically for Next.js Server Actions
 *
 * Defaults:
 * - maxRequests: 10
 * - windowSeconds: 60 (1 minute)
 */
export async function enforceRateLimit(options: RateLimitOptions): Promise<{
  allowed: boolean;
  error?: string;
  remaining?: number;
  retryAfterSeconds?: number;
}> {
  const { action, maxRequests = 10, windowSeconds = 60, customKey } = options;

  const ip = customKey || (await getClientIp());
  const compositeKey = `${action}:${ip}`;
  const windowMs = windowSeconds * 1000;

  const result = checkRateLimit(compositeKey, maxRequests, windowMs);

  if (!result.allowed) {
    return {
      allowed: false,
      error: `Too many requests for ${action}. Please slow down and try again in ${result.retryAfterSeconds}s.`,
      remaining: 0,
      retryAfterSeconds: result.retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remaining: result.remaining,
  };
}
