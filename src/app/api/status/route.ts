import { NextRequest } from "next/server";
import mysql from "mysql2/promise";

interface UserRequestBody {
  order_id: number;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UserRequestBody;
    const { order_id, status } = body;

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const sql = `INSERT INTO status ( order_id, status ) VALUES (?,?)`;

    await connection.execute(sql, [order_id, status]);
    await connection.end();

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
////////////////////////////////////////////////////////////////////////////////////

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, newStatus } = body;
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });
    const sql = "UPDATE status SET `status`=? WHERE `order_id`=?";
    await connection.execute(sql, [newStatus, id]);
    await connection.end();

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
////////////////////////////////////////////////////////////////////////////////////////////////

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const [rows] = await connection.execute("SELECT * FROM status WHERE 1");
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
