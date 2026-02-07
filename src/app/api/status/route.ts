import { NextRequest } from 'next/server';
import mysql from 'mysql2/promise';
import connection from 'src/lib/db';

interface UserRequestBody {
  order_id: number;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UserRequestBody;
    const { order_id, status } = body;

    if (!order_id || !status) {
      return new Response(
        JSON.stringify({ error: 'order_id and status are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 1️⃣ Insert into status history table
    const insertStatusSql =
      'INSERT INTO status (order_id, status) VALUES (?, ?)';

    await connection.execute(insertStatusSql, [order_id, status]);

    return new Response(
      JSON.stringify({ message: 'Order status updated successfully' }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

////////////////////////////////////////////////////////////////////////////////////

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, newStatus } = body;

    if (!id || !newStatus) {
      return new Response(
        JSON.stringify({ error: 'id and newStatus are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 1️⃣ Update status history table
    const updateStatusSql =
      'UPDATE status SET `status` = ? WHERE `order_id` = ?';

    await connection.execute(updateStatusSql, [newStatus, id]);

    // 2️⃣ Update current status in orders table
    const updateOrderSql = 'UPDATE orders SET `status` = ? WHERE `id` = ?';

    await connection.execute(updateOrderSql, [newStatus, id]);

    return new Response(
      JSON.stringify({ message: 'Status updated successfully' }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Edit not saved' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////

export async function GET() {
  try {
    const [rows] = await connection.execute('SELECT * FROM status WHERE 1');

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
