import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory sliding window for Edge/Proxy requests
const ipRequestCounts = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_MINUTE = 120; // 120 requests/min per IP

export default function proxy(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "127.0.0.1";

  const now = Date.now();
  let timestamps = ipRequestCounts.get(ip);
  if (!timestamps) {
    timestamps = [];
    ipRequestCounts.set(ip, timestamps);
  }

  // Filter timestamps outside current sliding window
  const fresh = timestamps.filter((ts) => now - ts < WINDOW_MS);
  ipRequestCounts.set(ip, fresh);

  if (fresh.length >= MAX_REQUESTS_PER_MINUTE) {
    const oldest = fresh[0];
    const retryAfterSeconds = Math.ceil(Math.max(1000, oldest + WINDOW_MS - now) / 1000);

    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Please wait ${retryAfterSeconds} seconds before trying again.`,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSeconds),
          "X-RateLimit-Limit": String(MAX_REQUESTS_PER_MINUTE),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  fresh.push(now);

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS_PER_MINUTE));
  response.headers.set("X-RateLimit-Remaining", String(MAX_REQUESTS_PER_MINUTE - fresh.length));
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets (.svg, .png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
