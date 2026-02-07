import { NextRequest } from "next/server";
import mysql from "mysql2/promise";
import connection from "src/lib/db";

interface SettingRequestBody {
  name: string;
  address: string;
  phone: number;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SettingRequestBody;
    const { name, address, phone, email } = body;

    const sql = `
  " INSERT INTO settings (id, name, address, phone, email, created_at, updated_at) VALUES (?,?,?,?,?,?,?)"
    `;

    await connection.execute(sql, [name, address, phone, email]);

    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
///////////////////////////////////////////////////////////////////////////////////

export async function GET() {
  try {
    const [rows] = await connection.execute("SELECT * FROM `settings` WHERE 1");
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
/////////////////////////////////////////////////////////////////////////////////////

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId, name, address, phone, email } = body;

    const sql =
      "UPDATE settings SET `name`=?,`address`=?,`phone`=?,`email`=? WHERE `id`=?";
    await connection.execute(sql, [name, address, phone, email, adminId]);

    return new Response(JSON.stringify({ message: "Edit save Succesful" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Edit not save Succesful" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
