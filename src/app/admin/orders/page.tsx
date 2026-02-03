"use client";

import { ok } from "assert";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { json } from "stream/consumers";

interface Order {
  id: number;
  order_id: number;
  item: string;
  price: number;
  quantity: number;
  tax: number;
  subtotal: number;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<Order[]>([]);

  // Function to update order status
  async function updateStatus(id: number, newStatus: string) {
    try {
      const res = await fetch("http://localhost:3000/api/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Updated Successfully");

        // Update frontend state
        setStatus((prev) =>
          prev.map((order) =>
            order.order_id === id ? { ...order, status: newStatus } : order,
          ),
        );
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  /////////getdata////

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/orders");
        const result = await res.json();

        setOrders(result);
      } catch (err) {
        toast.error("error.message");
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/status");
        const result = await res.json();
        console.log("ytr5gy5rtg5", result);

        setStatus(result);
      } catch (err) {
        toast.error("error.message");
      }
    }

    fetchData();
  }, []);

  // Delete confirmation logic
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [err, setError] = useState<string>();

  function handleDeleteClick(id: number) {
    setDeleteId(id);
    setShowConfirm(true);
  }

  async function confirmDelete() {
    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteId }),
      });
      if (response.ok) {
        setOrders((prev) => prev.filter((order) => order.id !== deleteId));
        setShowConfirm(false);
        setDeleteId(null);
        toast.success("deleted success");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function cancelDelete() {
    setShowConfirm(false);
    setDeleteId(null);
  }

  return (
    <div>
      <h1>Orders Management</h1>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
      >
        <thead>
          <tr>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Customer</th>
            <th style={cellStyle}>Price</th>
            <th style={cellStyle}>Quantity</th>
            <th style={cellStyle}>status</th>
            <th style={cellStyle}>Tax</th>
            <th style={cellStyle}>SubTotal</th>
            <th style={cellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={cellStyle}>{order.id}</td>
              <td style={cellStyle}>{order.item}</td>
              <td style={cellStyle}>{order.price}</td>
              <td style={cellStyle}>{order.quantity}</td>
              <td style={cellStyle}>
                {
                  status.find((s) => {
                    return s.order_id == order.id;
                  })?.status
                }
              </td>
              <td style={cellStyle}>{order.tax}%</td>
              <td style={cellStyle}>
                {(
                  Number(order.subtotal) -
                  Number(order.subtotal) * (Number(order.tax) / 100)
                ).toFixed(2)}
              </td>

              <td style={cellStyle}>
                {/* Show buttons based on current status */}
                {status.find((s) => {
                  return s.order_id == order.id;
                })?.status === "pending" && (
                  <button
                    style={btnReadyStyle}
                    onClick={() => updateStatus(order.id, "Ready")}
                  >
                    Ready
                  </button>
                )}
                {status.find((s) => {
                  return s.order_id == order.id;
                })?.status === "Ready" && (
                  <button
                    style={btnDeliveredStyle}
                    onClick={() => updateStatus(order.id, "Delivered")}
                  >
                    Delivered
                  </button>
                )}
                {/* No status update if Delivered */}

                {/* Delete button always visible */}
                <button
                  style={btnDeleteStyle}
                  onClick={() => handleDeleteClick(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <p>Are you sure you want to delete this order?</p>
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button style={btnCancelStyle} onClick={cancelDelete}>
                Cancel
              </button>
              <button style={btnDeleteStyle} onClick={confirmDelete}>
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
  padding: 10,
};

const btnReadyStyle: React.CSSProperties = {
  padding: "6px 12px",
  marginRight: 8,
  backgroundColor: "#ff9900",
  border: "none",
  borderRadius: 4,
  color: "white",
  cursor: "pointer",
};

const btnDeliveredStyle: React.CSSProperties = {
  padding: "6px 12px",
  marginRight: 8,
  backgroundColor: "#28a745",
  border: "none",
  borderRadius: 4,
  color: "white",
  cursor: "pointer",
};

const btnDeleteStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#dc3545",
  border: "none",
  borderRadius: 4,
  color: "white",
  cursor: "pointer",
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
  backgroundColor: "white",
  padding: 20,
  borderRadius: 8,
  maxWidth: 400,
  width: "90%",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};

const btnCancelStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#6c757d",
  border: "none",
  borderRadius: 4,
  color: "white",
  cursor: "pointer",
};
