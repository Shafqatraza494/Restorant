import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ middleware ONLY cookie check karega
  const loggedIn = request.cookies.get("loggedIn")?.value === "true";

  console.error(loggedIn);
  

  // 🔐 Protected routes (login required)
  const protectedRoutes = [
    "/booking",
    "/cart",
    "/checkout",
    "/payment",
    "/order_conformations",
    "/track_order",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !loggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 Auth routes (login/register) — logged in user ko allow na karo
  const authRoutes = ["/login", "/register"];

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// 🎯 Middleware matcher
export const config = {
  matcher: [
    "/booking/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/payment/:path*",
    "/order_conformations/:path*",
    "/track_order/:path*",
    "/login",
    "/register",
  ],
};
