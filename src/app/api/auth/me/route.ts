import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret_here",
);

export async function GET(request: Request) {
  // Get cookie header
  const cookie = request.headers.get("cookie") || "";

  // Extract 'token' cookie value
  const tokenMatch = cookie.match(/token=([^;]+)/);
  if (!tokenMatch) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = tokenMatch[1];

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Return user info from token payload
    return NextResponse.json({ user: payload }, { status: 200 });
  } catch (error) {
    // Token invalid or expired
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
