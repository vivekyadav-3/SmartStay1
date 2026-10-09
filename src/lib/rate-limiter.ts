import { headers } from "next/headers";

interface RateLimitRecord {
  timestamps: number[];
  strikes: number;
  blockedUntil: number;
}

// In-memory sliding window store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitStore.entries()) {
    // Retain if active block is still ticking
    if (record.blockedUntil > now) continue;

    const freshTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (freshTimestamps.length === 0 && record.strikes === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = freshTimestamps;
    }
  }
}

/**
 * Extracts and sanitizes client IP address from proxy headers
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      // First IP is the client IP before intermediate proxies
      return forwardedFor.split(",")[0].trim();
    }
    const cfIp = headerList.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    const realIp = headerList.get("x-real-ip");
    if (realIp) return realIp.trim();

    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

/**
 * Robust Sliding-Window Check with Strike Escalation
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  strikes: number;
} {
  const now = Date.now();
  cleanupExpiredRecords(windowMs);

  let record = rateLimitStore.get(key);
  if (!record) {
    record = { timestamps: [], strikes: 0, blockedUntil: 0 };
    rateLimitStore.set(key, record);
  }

  // 1. Check if user is currently in penalty lockout
  if (record.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
      strikes: record.strikes,
    };
  }

  // 2. Prune timestamps outside rolling window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  // 3. Exceeded threshold: apply strike escalation
  if (record.timestamps.length >= maxRequests) {
    record.strikes += 1;

    // Escalating penalty:
    // Strike 1 = remainder of rolling window (e.g. 60-120s)
    // Strike 2 = 5 minutes (300s)
    // Strike 3+ = 15 minutes (900s) lockout
    let penaltyDurationMs = windowMs;
    if (record.strikes === 2) penaltyDurationMs = 5 * 60 * 1000;
    else if (record.strikes >= 3) penaltyDurationMs = 15 * 60 * 1000;

    record.blockedUntil = now + penaltyDurationMs;
    const retryAfterSeconds = Math.ceil(penaltyDurationMs / 1000);

    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
      strikes: record.strikes,
    };
  }

  // 4. Allowed request
  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    retryAfterSeconds: 0,
    strikes: record.strikes,
  };
}

export interface StrictRateLimitOptions {
  action: string;
  maxRequests: number;
  windowSeconds: number;
  secondaryIdentifier?: string; // Optional target roll/email for credential protection
}

/**
 * Server Action Rate Limiter with Dual-Key Defense (IP + Target Identifier)
 */
export async function enforceRateLimit(options: StrictRateLimitOptions): Promise<{
  allowed: boolean;
  error?: string;
  remaining?: number;
  retryAfterSeconds?: number;
}> {
  const { action, maxRequests, windowSeconds, secondaryIdentifier } = options;

  const ip = await getClientIp();
  const windowMs = windowSeconds * 1000;

  // Primary Check: Client IP
  const ipKey = `${action}:ip:${ip}`;
  const ipResult = checkRateLimit(ipKey, maxRequests, windowMs);

  if (!ipResult.allowed) {
    const penaltyMsg =
      ipResult.strikes > 1
        ? `Repeated activity detected. Your IP is restricted for ${ipResult.retryAfterSeconds}s.`
        : `Rate limit reached for ${action}. Please try again in ${ipResult.retryAfterSeconds}s.`;

    return {
      allowed: false,
      error: penaltyMsg,
      remaining: 0,
      retryAfterSeconds: ipResult.retryAfterSeconds,
    };
  }

  // Secondary Check (if targeting a specific student/roll to protect against distributed brute force)
  if (secondaryIdentifier) {
    const cleanId = secondaryIdentifier.trim().toLowerCase();
    const idKey = `${action}:target:${cleanId}`;
    const idResult = checkRateLimit(idKey, maxRequests + 2, windowMs * 2);

    if (!idResult.allowed) {
      return {
        allowed: false,
        error: `Too many attempts on this account. Protected for security. Try again in ${idResult.retryAfterSeconds}s.`,
        remaining: 0,
        retryAfterSeconds: idResult.retryAfterSeconds,
      };
    }
  }

  return {
    allowed: true,
    remaining: ipResult.remaining,
  };
}
