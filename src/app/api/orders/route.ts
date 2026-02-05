import { NextRequest } from 'next/server';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import connection from 'src/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ✅ Decode token (matches your login payload)
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user_id = decoded.id; // NOT decoded.user_id

    const body = await request.json(); // array of items

    for (const items of body) {
      const { id: menu_id, item, quantity, price } = items;

      const subtotal = quantity * price;
      const tax = 10;
      const discount = 0;
      const status = 'pending';

      const sql = `
        INSERT INTO orders 
        (user_id, menu_id, item, quantity, price, subtotal, status, tax, discount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const sql2 = `
        INSERT INTO status (order_id, status)
        VALUES (?, ?)
      `;

      const [result] = await connection.execute<ResultSetHeader>(sql, [
        user_id,
        menu_id,
        item,
        quantity,
        price,
        subtotal,
        status,
        tax,
        discount,
      ]);

      const orderId = result.insertId;

      await connection.execute(sql2, [orderId, status]);
    }

    return new Response(
      JSON.stringify({ message: 'Order created successfully' }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

//////////////////////////////////////////////////////////////////////////////////////

export async function GET() {
  try {
    // 🔐 Get token from HttpOnly cookie
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ✅ Decode JWT to get user_id
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user_id = decoded.id;

    // 🔹 Fetch only current user's orders
    const [rows] = await connection.execute(
      'SELECT * FROM `orders` WHERE user_id = ? ORDER BY id DESC',
      [user_id],
    );

    return new Response(JSON.stringify(rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
//////////////////////////////////////////////////////////////////////////////////////

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { deleteId } = body;
    console.log(deleteId);

    const sql = `DELETE FROM orders WHERE id = ?`;
    await connection.execute(sql, [deleteId]);

    return new Response(
      JSON.stringify({ message: 'Item Deleted Successfully' }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to Delete Item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
