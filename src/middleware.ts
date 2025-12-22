import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



export function middleware(request: NextRequest) {
  console.error("Middleware file loaded");

  const loggedIn = request.cookies.get("loggedIn")?.value === "true"; // check if cookie loggedIn=true
console.error("loggedIn cookie value:", loggedIn);
  
  const { pathname } = request.nextUrl;

  // PROTECTED ROUTES (login required)
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

  // AUTH ROUTES (login/register should NOT open if already logged in)
  const authRoutes = ["/login", "/regis", "/register"];

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(new URL("/", request.url)); // redirect to homepage or dashboard
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
    "/track_order/:path*",
    "/login",
    "/register",
    "/regis",
  ],
};

