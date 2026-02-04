import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret_here",
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  let user = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      user = payload; // contains id, email, role, etc.
    } catch (e) {
      // Token invalid or expired
      user = null;
    }
  }

  const loggedIn = Boolean(user);
  const role =
    typeof user?.role === "string" ? user.role.toLowerCase() : "user";

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
    "/carts",
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
    "/carts",
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
