import mysql from "mysql2/promise";
import { NextRequest } from "next/server";
import connection from "src/lib/db";
import jwt from "jsonwebtoken";

interface UserRequestBody {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UserRequestBody;
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const sql = `SELECT id, name, email, role FROM users WHERE email = ? AND password = ?`;

    const [rows] = await connection.execute(sql, [email, password]);

    if ((rows as any[]).length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const user = (rows as any[])[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Set HttpOnly cookie
    // For security, set SameSite=Lax (or Strict) and Secure in production (HTTPS)
    const isProduction = process.env.NODE_ENV === "production";

    return new Response(JSON.stringify({ message: "Login successful", user }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax${
          isProduction ? "; Secure" : ""
        }`,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
