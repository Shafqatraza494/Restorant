import mysql from 'mysql2/promise';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import connection from 'src/lib/db';

interface MenuRequestBody {
  name: string;
  category: string;
  price: number;
  id: number;
}
///////////////////////////////////////////////////////////////////////////////////

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const price = formData.get('price') as string;
    const image = formData.get('image') as File;

    if (!name || !category || !price || !image) {
      return NextResponse.json(
        { error: 'All fields required' },
        { status: 400 },
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${image.name}`;
    const uploadPath = path.join(process.cwd(), 'public/uploads', fileName);

    await fs.writeFile(uploadPath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    const sql =
      'INSERT INTO menu (name, category, price, image) VALUES (?, ?, ?, ?)';

    await connection.execute(sql, [name, category, price, imageUrl]);

    return NextResponse.json({
      message: 'Item saved successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Item not saved' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await connection.execute(
      'SELECT id, name, category, price , image FROM menu',
    );

    return NextResponse.json(rows, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
////////////////////////////////////////////////////////////////////

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    const sql = `DELETE FROM menu WHERE id = ?`;
    await connection.execute(sql, [id]);

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
/////////////////////////////////////////////////////////////////////////////////////
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, price, id } = body;

    const sql =
      'UPDATE `menu` SET `name`=?,`category`=?,`price`=? WHERE `id`=?';
    await connection.execute(sql, [name, category, price, id]);

    return new Response(JSON.stringify({ message: 'Edit save Succesful' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Edit not save Succesful' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
