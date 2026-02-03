import mysql from "mysql2/promise";
import {NextRequest } from "next/server";
import React from "react";

interface UserRequestBody {
  name: string;
  email: string;
  password: string;
  role: string;
}

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const [rows] = await connection.execute("SELECT NOW() AS currentTime");
    await connection.end();  

    return new Response(JSON.stringify(rows), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UserRequestBody;
    const { name, email, password } = body;

    let role = 'user';

    if (!name || !email || !password || !role) {
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
      INSERT INTO users (name, email, password ,role)
      VALUES (?, ?, ?, ?)
    `;

    await connection.execute(sql, [name, email, password, role]);
    await connection.end();

    return new Response(JSON.stringify({ message: "User created successfully" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
