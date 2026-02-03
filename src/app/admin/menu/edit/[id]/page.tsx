"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { json } from "stream/consumers";
import { toast } from "sonner";

interface MenuItem {
  id?: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function EditMenuItem() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [data, setData] = useState<MenuItem>({
    id: 0,
    name: "",
    category: "",
    price: 0,
    image: "/uploads/ahmed.jpg",
  });

  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = fetch("http://localhost:3000/api/menu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, category, price, id }),
      });

      if ((await res).ok) {
        toast.success("succesful update");
        router.push("/admin/menu");
      } else {
        toast.error("server error");
      }
    } catch (error) {
      toast.error("not edit some thing went wrong");
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/menu");

        const result: MenuItem[] = await res.json();

        const menuitem: MenuItem[] = result.filter((item: MenuItem) => {
          return id == item.id;
        });

        setData(menuitem[0]);
      } catch (err) {
        console.log("Error fetching menu:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
    setName(data.name);
    setCategory(data.category);
    setPrice(data.price);
  }, [data]);

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Edit Menu Item</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <input
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={inputStyle}
        />

        <div className=" h-fit w-[150px] ">
          <img src={data.image} alt="" />
        </div>
        <input
          placeholder="Price"
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          style={inputStyle}
        />

        <button type="submit" style={btnStyle}>
          Update
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const btnStyle: React.CSSProperties = {
  padding: "10px 16px",
  background: "oklch(0.769 0.188 70.08)",
  color: "#fff",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};
