"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [restaurantName, setRestaurantName] = useState<string>("name");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [adminId, setAdminId] = useState<number>(5);

  async function fetchData() {
    try {
      const resp = await fetch("http://localhost:3000/api/settings", {
        method: "GET",
      });

      const data = await resp.json();
      console.log(data);

      setRestaurantName(data[0].name);
      setAddress(data[0].address);
      setPhone(data[0].phone);
      setEmail(data[0].email);
      setAdminId(data[0].id);
    } catch (err) {
      toast.error("Failed to load settings");
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const resp = await fetch("http://localhost:3000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId,
          name: restaurantName,
          address,
          phone,
          email,
        }),
      });

      if (resp.ok) toast.success("Settings updated successfully");
      else toast.error("Server error updating settings");
    } catch (err) {
      toast.error("Failed updating settings");
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Restaurant Settings</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 15,
        }}
      >
        <input
          value={restaurantName}
          type="text"
          onChange={(e) => setRestaurantName(e.target.value)}
          placeholder="Restaurant Name"
          style={inputStyle}
        />
        <input
          value={address}
          type="text"
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          style={inputStyle}
        />
        <input
          value={phone}
          type="number"
          onChange={(e) => setPhone(Number(e.target.value))}
          placeholder="Phone Number"
          style={inputStyle}
        />
        <input
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={inputStyle}
        />

        <button type="submit" style={btnStyle}>
          Save Settings
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
