import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const loggedIn = request.cookies.get("loggedIn")?.value === "true";
  const role = request.cookies.get("role")?.value?.toLowerCase();

  // AUTH ROUTES HANDLING
  if ((pathname === "/login" || pathname === "/register") && loggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ADMIN ROUTE PROTECTION
  if (pathname.startsWith("/admin")) {
    if (!loggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // NORMAL USER PROTECTION
  const protectedRoutes = [
    "/booking",
    "/cart",
    "/checkout",
    "/payment",
    "/order_conformations",
  ];

  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !loggedIn
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/booking/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/payment/:path*",
    "/order_conformations/:path*",
    "/login",
    "/register",
    "/admin/:path*",
  ],
};
