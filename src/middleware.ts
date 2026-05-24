import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect admin when real auth is added
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // const session = await getToken(...)
    // if (!session) return NextResponse.redirect(new URL("/login", request.url))
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
