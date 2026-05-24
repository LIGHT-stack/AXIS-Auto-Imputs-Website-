import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect admin routes with a simple secret cookie/header.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow in development for convenience
    if (process.env.NODE_ENV === "development") return NextResponse.next();

    const secretFromHeader = request.headers.get("x-admin-secret");
    const cookie = request.cookies.get("axis_admin")?.value;

    if (cookie === process.env.ADMIN_SECRET || secretFromHeader === process.env.ADMIN_SECRET) {
      return NextResponse.next();
    }

    // Not authorized — redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
