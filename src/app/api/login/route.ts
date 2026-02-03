import mysql from "mysql2/promise";
import { NextRequest } from "next/server";

interface UserRequestBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UserRequestBody;
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const sql = `
      SELECT id, name, email, role FROM users WHERE email = ? AND password = ?
    `;

    const [rows] = await connection.execute(sql, [email, password]);
    await connection.end();

    if ((rows as any[]).length === 0) {
   
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = (rows as any[])[0];

    return new Response(JSON.stringify({ message: "Login successful", user }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
