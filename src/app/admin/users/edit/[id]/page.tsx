"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ok } from "assert";
import { User } from "lucide-react";

interface Users {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function EditUser() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Form states
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [data, setData] = useState<Users[]>([]);

  // Load fake user data on mount (replace with real API later)
  useEffect(() => {
    const fakeUser = {
      name: "Admin",
      email: "admin@example.com",
      role: "Admin",
    };
    setName(fakeUser.name);
    setEmail(fakeUser.email);
    setRole(fakeUser.role);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, role, id }),
      });
      if (res.ok) {
        toast.success("succesful update");
      } else {
        toast.error("server error");
      }
    } catch (error: any) {
      toast.error("not edit some thing went wrong");
    }

    // Log updated data (backend update later)
    console.log({ id, name, email, role });

    // Redirect back to users list
    router.push("/admin/users");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/users");
        const result: Users[] = await res.json();
        const menuitem: Users[] = result.filter((item: Users) => {
          return id == item.id;
        });
        setData(menuitem);
      } catch (err) {
        console.log("Error fetching menu:", err);
      }
    }

    fetchData();
  }, []);
  useEffect(() => {
    if (data[0]) {
      setName(data[0].name);
      setEmail(data[0].email);
      setRole(data[0].role);
    }
  }, [data]);
  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Edit User</h2>

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
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>

        <button type="submit" style={btnStyle}>
          Update User
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
