import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import path from "path";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is logged in via cookie
  const loggedIn = request.cookies.get("loggedIn")?.value === "true";

  console.log(pathname);
  console.log(loggedIn);
  
  // Routes that require user to be logged in
  const protectedRoutes = [
    "/booking",
    "/cart",
    "/checkout",
    "/payment",
    "/order_conformations",  // verify spelling here
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected  && !loggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Routes for login and register
  const authRoutes = ["/login", "/register"];

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
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
  ],
};
