"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function MenuPage() {
  const [data, setData] = useState<any[]>([]);
  console.log("mm", data);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // get data............
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/menu");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.log("Error fetching menu:", err);
      }
    }

    fetchData();
  }, []);

  function handleDeleteClick(id: number) {
    setDeleteId(id);
    setShowConfirm(true);
  }

  async function confirmDelete() {
    if (deleteId === null) return;

    // Backend call delete
    await deleteMenu(deleteId);

    // UI se remove
    setData((prev) => prev.filter((item) => item.id !== deleteId));

    setShowConfirm(false);
    setDeleteId(null);
  }

  function cancelDelete() {
    setShowConfirm(false);
    setDeleteId(null);
  }

  async function deleteMenu(id: number) {
    try {
      const response = await fetch("http://localhost:3000/api/menu", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Something went wrong");
        return;
      }

      toast.success(result.message || "Deleted successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed");
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1>Menu Management</h1>
        <Link href="/admin/menu/add">
          <button
            style={{
              padding: "8px 16px",
              background: "oklch(0.769 0.188 70.08)",
              color: "#fff",
              borderRadius: 6,
            }}
          >
            Add Item
          </button>
        </Link>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Category</th>
            <th style={cellStyle}>Price</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((item: any) => (
              <tr key={item.id}>
                <td style={cellStyle}>{item.id}</td>
                <td style={cellStyle}>{item.name}</td>
                <td style={cellStyle}>{item.category}</td>
                <td style={cellStyle}>{item.price}</td>
                <td style={cellStyle}>
                  <Link href={`/admin/menu/edit/${item.id}`}>
                    <button style={{ marginRight: 10 }}>Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showConfirm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <p>Are you sure you want to delete this item?</p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button onClick={cancelDelete} style={btnCancelStyle}>
                Cancel
              </button>
              <button onClick={confirmDelete} style={btnDeleteStyle}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const cellStyle = { border: "1px solid #ccc", padding: "10px" };
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const modalStyle = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  maxWidth: 400,
  width: "90%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};
const btnCancelStyle = {
  padding: "8px 16px",
  background: "#ccc",
  borderRadius: 6,
  cursor: "pointer",
};
const btnDeleteStyle = {
  padding: "8px 16px",
  background: "red",
  color: "#fff",
  borderRadius: 6,
  cursor: "pointer",
};
