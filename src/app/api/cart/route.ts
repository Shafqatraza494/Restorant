import mysql from "mysql2/promise";
import { NextRequest } from "next/server";
import connection from "src/lib/db";
import { jwtVerify } from "jose";

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

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your_jwt_secret_here",
);

export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const tokenMatch = cookie.match(/token=([^;]+)/);
    if (!tokenMatch) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = tokenMatch[1];

    let payload;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const userId = payload.id;
    if (!userId) {
      return new Response(JSON.stringify({ error: "Invalid token payload" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Query only this user's cart items
    const [rows] = await connection.execute(
      "SELECT * FROM `carts` WHERE user_id = ?",
      [userId],
    );

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

    const { id, name, price, user_id } = body;

    if (!id || !name || !price || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 },
      );
    }

    // 🔍 check if item already exists for this user
    const [rows]: any = await connection.execute(
      "SELECT * FROM carts WHERE menu_id = ? AND user_id = ?",
      [id, user_id],
    );

    if (rows.length > 0) {
      // 👉 item exists → quantity increase
      await connection.execute(
        `UPDATE carts 
         SET quantity = quantity + 1, 
             subtotal = (quantity + 1) * price 
         WHERE menu_id = ? AND user_id = ?`,
        [id, user_id],
      );

      return new Response(
        JSON.stringify({ message: "Cart updated successfully" }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    // 👉 item not exists → insert new
    await connection.execute(
      `INSERT INTO carts 
       (menu_id, user_id, item, quantity, price, subtotal) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, user_id, name, 1, price, price],
    );

    return new Response(
      JSON.stringify({ message: "Added to cart successfully" }),
      { headers: { "Content-Type": "application/json" } },
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
    const { menuId } = body;

    if (!menuId) {
      return new Response(JSON.stringify({ error: "menuId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete all cart rows with this menu_id
    await connection.execute("DELETE FROM carts WHERE menu_id = ?", [menuId]);

    return new Response(
      JSON.stringify({
        message: "All orders of this item deleted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete items" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
