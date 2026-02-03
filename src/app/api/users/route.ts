import { NextRequest } from "next/server";
import mysql from "mysql2/promise";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, id } = body;

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const sql = "UPDATE users SET `name`=?, `email`=?, `role`=? WHERE `id`=?";
    await connection.execute(sql, [name, email, role, id]);

    await connection.end();

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
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });
    const sql = "DELETE FROM `users` WHERE id = ?";
    await connection.execute(sql, [id]);
    await connection.end();
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
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const [rows] = await connection.execute("SELECT * FROM `users` WHERE 1");
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
