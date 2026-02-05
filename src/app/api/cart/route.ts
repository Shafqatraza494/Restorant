import mysql from 'mysql2/promise';
import { NextRequest } from 'next/server';
import connection from 'src/lib/db';
import { jwtVerify } from 'jose';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    let payload;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401 },
      );
    }

    const userId = payload.id;
    if (!userId)
      return new Response(JSON.stringify({ error: 'Invalid token payload' }), {
        status: 401,
      });

    const [rows] = await connection.execute(
      'SELECT * FROM carts WHERE user_id = ?',
      [userId],
    );

    const sanitized = rows.map((item: any) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    return new Response(JSON.stringify({ cartItems: sanitized }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

////////////////////////////////////////////////////////////

export async function POST(request: NextRequest) {
  try {
    // 🔐 1. Get JWT from HttpOnly cookie
    const cookie = request.headers.get('cookie') || '';
    const tokenMatch = cookie.match(/token=([^;]+)/);

    if (!tokenMatch) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const token = tokenMatch[1];

    // 🔐 2. Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    // 📦 3. Read request body
    const body = await request.json();
    const { id, name, price } = body;

    if (!id || !name || !price) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 },
      );
    }

    // 🔍 4. Check if item already exists
    const [rows]: any = await connection.execute(
      'SELECT * FROM carts WHERE menu_id = ? AND user_id = ?',
      [id, userId],
    );

    if (rows.length > 0) {
      // ➕ Increase quantity
      await connection.execute(
        `UPDATE carts 
         SET quantity = quantity + 1,
             subtotal = (quantity + 1) * price
         WHERE menu_id = ? AND user_id = ?`,
        [id, userId],
      );

      return new Response(
        JSON.stringify({ message: 'add to Cart successfully' }),
        { status: 200 },
      );
    }

    // ➕ Insert new item
    await connection.execute(
      `INSERT INTO carts (menu_id, user_id, item, quantity, price, subtotal)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, userId, name, 1, price, price],
    );

    return new Response(
      JSON.stringify({ message: 'Added to cart successfully' }),
      { status: 200 },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

////////////////////////////////////////////////////////////////////////////

const JWT_SECRET2 = process.env.JWT_SECRET!;

export async function DELETE(request: NextRequest) {
  try {
    // 🔐 Auth from HttpOnly cookie
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET2);
    const user_id = decoded.id;

    const body = await request.json();
    const { menu_id } = body;

    let message = '';

    if (menu_id) {
      // 🗑 Delete a single item
      const [result]: any = await connection.execute(
        'DELETE FROM carts WHERE user_id = ? AND menu_id = ?',
        [user_id, menu_id],
      );

      if (result.affectedRows === 0) {
        return new Response(
          JSON.stringify({ message: 'Item not found in cart' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }

      message = 'Item removed from cart';
    } else {
      // 🗑 Delete all items for this user
      await connection.execute('DELETE FROM carts WHERE user_id = ?', [
        user_id,
      ]);
      message = 'All cart items cleared';
    }

    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete cart items' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
