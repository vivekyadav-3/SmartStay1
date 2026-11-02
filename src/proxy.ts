import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface ProxyClientRecord {
  timestamps: number[];
  strikes: number;
  blockedUntil: number;
}

// In-memory rate limiting store for Edge / Proxy
const proxyIpStore = new Map<string, ProxyClientRecord>();

// Intelligent rate limits suited for high-interaction dashboards & campus networks
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_SERVER_ACTIONS_PER_MINUTE = 120; // Server actions / RPC
const MAX_MUTATION_PER_MINUTE = 60; // General API mutations
const MAX_PAGE_GET_PER_MINUTE = 150; // Navigation & RSC fetches

// Known automated malicious scanners / bot signatures
const SUSPICIOUS_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /gobuster/i,
  /dirbuster/i,
  /nmap/i,
  /masscan/i,
  /wpscan/i,
];

export default function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // 1. Instantly drop known vulnerability scanners & malicious tools
  for (const pattern of SUSPICIOUS_UA_PATTERNS) {
    if (pattern.test(userAgent)) {
      return new NextResponse(
        JSON.stringify({
          error: "Forbidden",
          message: "Automated scan signature detected.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 2. Allow Next.js router prefetch requests without consuming user quotas
  const isPrefetch =
    request.headers.get("x-middleware-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch" ||
    request.headers.get("sec-purpose") === "prefetch";

  if (isPrefetch) {
    return NextResponse.next();
  }

  // 3. Extract and sanitize client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    (forwardedFor ? forwardedFor.split(",")[0].trim() : null) ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "127.0.0.1";

  const now = Date.now();
  let record = proxyIpStore.get(ip);
  if (!record) {
    record = { timestamps: [], strikes: 0, blockedUntil: 0 };
    proxyIpStore.set(ip, record);
  }

  // 4. Check active security lockout
  if (record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: `High traffic violation detected. Your IP is temporarily restricted. Retry in ${retryAfter}s.`,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": "0",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(record.blockedUntil / 1000)),
        },
      }
    );
  }

  // 5. Prune timestamps outside rolling 1-minute window
  record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);

  // 6. Apply threshold depending on request type
  const isServerAction = Boolean(request.headers.get("next-action"));
  const isMutation = request.method === "POST" || request.method === "PUT" || request.method === "DELETE";

  let maxAllowed = MAX_PAGE_GET_PER_MINUTE;
  if (isServerAction) {
    maxAllowed = MAX_SERVER_ACTIONS_PER_MINUTE;
  } else if (isMutation) {
    maxAllowed = MAX_MUTATION_PER_MINUTE;
  }

  if (record.timestamps.length >= maxAllowed) {
    record.strikes += 1;

    // Graceful lockout penalty:
    // Strike 1 = 15s cooldown
    // Strike 2 = 45s cooldown
    // Strike 3+ = 2m lockout
    let penaltyMs = 15 * 1000;
    if (record.strikes === 2) penaltyMs = 45 * 1000;
    else if (record.strikes >= 3) penaltyMs = 2 * 60 * 1000;

    record.blockedUntil = now + penaltyMs;
    const retryAfter = Math.ceil(penaltyMs / 1000);

    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: `Rate limit of ${maxAllowed} requests/min exceeded. Cooldown active for ${retryAfter}s.`,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(maxAllowed),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil((now + penaltyMs) / 1000)),
        },
      }
    );
  }

  // Record valid request
  record.timestamps.push(now);

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(maxAllowed));
  response.headers.set("X-RateLimit-Remaining", String(maxAllowed - record.timestamps.length));
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all application routes except static files & images
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
