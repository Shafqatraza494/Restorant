"use client";

import React, { useState } from "react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    setTimeout(() => {
      setLoading(false);
      const orders = JSON.parse(localStorage.getItem("orders") || "{}");
      const key = orderNumber.trim().toUpperCase();
      const foundStatus = orders[key];

      if (foundStatus) {
        setStatus(foundStatus);
      } else {
        setStatus("Order number not found. Please check and try again.");
      }
    }, 1500);
  };

  return (
    <div className="container py-5">
      <h1>Track Your Order</h1>
      <form onSubmit={handleCheckStatus} className="mb-4">
        <input
          type="text"
          placeholder="Enter your Order Number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="form-control"
          required
        />
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Status"}
        </button>
      </form>

      {status && (
        <div
          className={`alert ${
            status.includes("not found") ? "alert-danger" : "alert-success"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
