"use client";

import { useState } from "react";

function HoverLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={href}
      style={{
        color: hover ? "oklch(0.769 0.188 70.08)" : "white",
        textDecoration: "none",
        padding: "8px",
        borderRadius: "4px",
        display: "block",
        transition: "color 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </a>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <aside
        style={{
          width: "250px",
          background: "#0f172b",
          color: "#fff",
          padding: "20px",
        }}
      >
        <nav
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <HoverLink href="/admin/menu">Menu</HoverLink>
          <HoverLink href="/admin/orders">Orders</HoverLink>
          <HoverLink href="/admin/users">Users</HoverLink>
          <HoverLink href="/admin/settings">Settings</HoverLink>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "20px", overflow: "scroll" }}>
        {children}
      </main>
    </div>
  );
}
