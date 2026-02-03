import mysql from "mysql2/promise";
import { NextRequest } from "next/server";
import connection from "src/lib/db";

interface CartRequestBody {
  id: number;
  category: string;
  name: string;
  item: string;
  quantity: number;
  price: number;
  subtotal: number;
  menu_id: number;
  user_id: number;
}

export async function GET() {
  try {
    const [rows] = await connection.execute("SELECT * FROM `carts` WHERE 1");

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
////////////////////////////////////////////////////////////

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CartRequestBody;
    console.log(body);

    const { id, name, price, category, user_id } = body;

    // console.log("kk", item);

    if (!name || !price || !category) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const sql =
      " INSERT INTO carts ( `menu_id`, `user_id`,`item`, `quantity`, `price`, `subtotal`) VALUES (?,?,?,?,?,?)";

    await connection.execute(sql, [id, user_id, name, 1, price, price]);

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
////////////////////////////////////////////////////////////////////////////

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { deleteId } = body;

    const sql = `DELETE FROM carts WHERE user_id = ?`;
    await connection.execute(sql, [deleteId]);

    return new Response(
      JSON.stringify({ message: "Item Deleted Successfully" }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to Delete Item" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
