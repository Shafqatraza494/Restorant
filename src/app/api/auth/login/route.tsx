// app/api/auth/login/route.ts
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as LoginRequestBody;

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorant",
    });

    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await connection.execute(sql, [email]);
    await connection.end();

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = (rows as any[])[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Return user info excluding sensitive fields (like password)
    const { password: _pwd, ...userSafe } = user;

    return NextResponse.json(
      { message: "Login Successful", data: userSafe },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
