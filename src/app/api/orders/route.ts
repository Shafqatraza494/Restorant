import { NextRequest } from "next/server";
import mysql from "mysql2/promise";

interface UserRequestBody {
  item: string;
  qunatity: string;
  price: string;
  subtotal: string;
  status: string;
  tax: string;
  discount: string;
  insertId: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // body = array of items

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    for (const items of body) {
      const { id, item, quantity, price } = items;
      let subtotal = quantity * price;
      let tax = 10;
      let discount = 0;
      let status = "pending";

      const sql = `
        INSERT INTO orders 
        ( item, quantity, price, subtotal, status, tax, discount)
        VALUES ( ?, ?, ?, ?, ?, ?,?)
      `;
      const sql2 = "INSERT INTO status (order_id, status) VALUES (?, ?)";

      let order = await connection.execute(sql, [
        item,
        quantity,
        price,
        subtotal,
        status,
        tax,
        discount,
      ]);

      await connection.execute(sql2, [order[0].insertId, status]);
    }

    await connection.end();

    return new Response(
      JSON.stringify({ message: "Order created successfully" }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////////

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const [rows] = await connection.execute("SELECT * FROM `orders` WHERE 1");
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
//////////////////////////////////////////////////////////////////////////////////////

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { deleteId } = body;
    console.log(deleteId);

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const sql = `DELETE FROM orders WHERE id = ?`;
    await connection.execute(sql, [deleteId]);

    await connection.end();

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
