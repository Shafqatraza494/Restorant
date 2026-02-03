import { NextRequest } from "next/server";
import mysql from "mysql2/promise";
import connection from "src/lib/db";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, id } = body;

    const sql = "UPDATE users SET `name`=?, `email`=?, `role`=? WHERE `id`=?";
    await connection.execute(sql, [name, email, role, id]);

    return new Response(
      JSON.stringify({ message: "Edit saved successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Edit not saved" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    const sql = "DELETE FROM `users` WHERE id = ?";
    await connection.execute(sql, [id]);
    return new Response(
      JSON.stringify({ message: "Gmail Deleted Successfully" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Failed to Delete Gmail" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
/////////////////////////////////////////////////////////////////////////////////////////

export async function GET() {
  try {
    const [rows] = await connection.execute("SELECT * FROM `users` WHERE 1");

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
