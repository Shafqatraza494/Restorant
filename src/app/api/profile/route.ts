// src/app/api/profile/route.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connection from 'src/lib/db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('decoded', token);

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user_id = decoded.id;

    // 1️⃣ Get user details
    const [userRows]: any = await connection.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [user_id],
    );
    const user = userRows[0];

    // 2️⃣ Get orders
    const [orders]: any = await connection.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [user_id],
    );

    // 3️⃣ Filter orders by status
    const completedOrders = orders.filter((o: any) => o.status === 'completed');
    const pendingOrders = orders.filter((o: any) => o.status === 'pending');
    const readyOrders = orders.filter((o: any) => o.status === 'ready'); // ✅ new

    return new Response(
      JSON.stringify({ user, completedOrders, pendingOrders, readyOrders }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
