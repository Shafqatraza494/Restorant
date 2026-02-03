"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function UsersPage() {
  const [data, setData] = useState([
    { id: 1, name: "Admin", email: "admin@example.com", role: "Admin" },
    { id: 2, name: "Staff", email: "staff@example.com", role: "Staff" },
  ]);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/users");
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    }

    fetchData();
  }, []);

  function handleDeleteClick(id: number) {
    setDeleteId(id);
    setShowConfirm(true);
  }

  function confirmDelete() {
    if (deleteId == null) {
      return;
    }
    handleDelete(deleteId);
    setData((prev) => prev.filter((item) => item.id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);
  }

  function cancelDelete() {
    setShowConfirm(false);
    setDeleteId(null);
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
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
        <h1>Users Management</h1>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>Role</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td style={cellStyle}>{item.id}</td>
              <td style={cellStyle}>{item.name}</td>
              <td style={cellStyle}>{item.email}</td>
              <td style={cellStyle}>{item.role}</td>
              <td style={cellStyle}>
                <Link href={`/admin/users/edit/${item.id}`}>
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
            <p>Are you sure you want to delete this user?</p>
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

const cellStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "10px",
};

const overlayStyle: React.CSSProperties = {
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

const modalStyle: React.CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  maxWidth: 400,
  width: "90%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};

const btnCancelStyle: React.CSSProperties = {
  padding: "8px 16px",
  background: "#ccc",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const btnDeleteStyle: React.CSSProperties = {
  padding: "8px 16px",
  background: "red",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
