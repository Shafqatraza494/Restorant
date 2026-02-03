import mysql from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface MenuRequestBody {
  name: string;
  category: string;
  price: number;
  id: number;
}
///////////////////////////////////////////////////////////////////////////////////

export async function POST(request: NextRequest) {
  try {
    // ✅ FormData read karo
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const price = formData.get("price") as string;
    const image = formData.get("image") as File;

    if (!name || !category || !price || !image) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );
    }

    // ✅ Image save
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${image.name}`;
    const uploadPath = path.join(process.cwd(), "public/uploads", fileName);

    await fs.writeFile(uploadPath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    // ✅ DB insert
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const sql =
      "INSERT INTO menu (name, category, price, image) VALUES (?, ?, ?, ?)";

    await connection.execute(sql, [name, category, price, imageUrl]);

    await connection.end();

    return NextResponse.json({
      message: "Item saved successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Item not saved" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const [rows] = await connection.execute(
      "SELECT id, name, category, price , image FROM menu",
    );

    await connection.end();

    return NextResponse.json(rows, {
      headers: { "Content-Type": "application/json" },
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

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });

    const sql = `DELETE FROM menu WHERE id = ?`;
    await connection.execute(sql, [id]);

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
/////////////////////////////////////////////////////////////////////////////////////
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, price, id } = body;
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "restorants_1",
    });
    const sql =
      "UPDATE `menu` SET `name`=?,`category`=?,`price`=? WHERE `id`=?";
    await connection.execute(sql, [name, category, price, id]);
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
