// app/api/auth/register/route.ts
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorant",
    });

    const checkEmailQuery = "SELECT email FROM users WHERE email = ?";
    const [rows] = await connection.execute(checkEmailQuery, [email]);

    if ((rows as any[]).length > 0) {
      await connection.end();
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const insertQuery =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    try {
      await connection.execute(insertQuery, [name, email, hashedPassword]);
    } catch (insertError: any) {
      if (insertError.code === "ER_DUP_ENTRY") {
        await connection.end();
        return NextResponse.json(
          { error: "Email already exists (DB constraint)" },
          { status: 400 }
        );
      }
      throw insertError;
    }

    await connection.end();

    return NextResponse.json(
      { message: "Register Successful" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
