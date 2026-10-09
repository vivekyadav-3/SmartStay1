import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface ProxyClientRecord {
  timestamps: number[];
  strikes: number;
  blockedUntil: number;
}

// In-memory rate limiting store for Edge / Proxy
const proxyIpStore = new Map<string, ProxyClientRecord>();

// Tight rate limits
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_MUTATION_PER_MINUTE = 15; // 15 POST/action requests / min
const MAX_PAGE_GET_PER_MINUTE = 45; // 45 page requests / min

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

  // 2. Extract and sanitize client IP
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

  // 3. Check active security lockout
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

  // 4. Prune timestamps outside rolling 1-minute window
  record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);

  // 5. Apply threshold depending on request method
  const isMutation = request.method === "POST" || request.method === "PUT" || request.method === "DELETE";
  const maxAllowed = isMutation ? MAX_MUTATION_PER_MINUTE : MAX_PAGE_GET_PER_MINUTE;

  if (record.timestamps.length >= maxAllowed) {
    record.strikes += 1;

    // Escalating lockout duration:
    // Strike 1 = 60s
    // Strike 2 = 5 minutes
    // Strike 3+ = 15 minutes lockout
    let penaltyMs = 60 * 1000;
    if (record.strikes === 2) penaltyMs = 5 * 60 * 1000;
    else if (record.strikes >= 3) penaltyMs = 15 * 60 * 1000;

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
