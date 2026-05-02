import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Route protection matrix:
 *
 *  /admin/*   → must be authenticated AND have role === "ADMIN"
 *  /checkout  → must be authenticated
 *
 * This runs at the Edge; no DB calls — session is validated via the
 * signed HTTP-only cookie that better-auth sets.
 */

const PROTECTED_ROUTES: Record<string, "auth" | "admin"> = {
  "/checkout": "auth",
  "/admin": "admin",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Determine which protection level applies
  const protectionLevel = Object.entries(PROTECTED_ROUTES).find(([prefix]) =>
    pathname.startsWith(prefix),
  )?.[1];

  if (!protectionLevel) {
    return NextResponse.next();
  }

  // Retrieve session without hitting the DB — better-auth validates the
  // cookie signature on the edge.
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    // Redirect unauthenticated users to /login with a callback
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (protectionLevel === "admin") {
    const role = (session.user as { role?: string }).role;
    if (role !== "ADMIN") {
      // Authenticated but not an admin
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/checkout/:path*"],
};
