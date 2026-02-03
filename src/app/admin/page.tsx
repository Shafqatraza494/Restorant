"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { json } from "stream/consumers";
import { toast } from "sonner";

const cardStyle: React.CSSProperties = {
  flex: 1,
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#0f172b",
  color: "white",
  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  transition: "transform 0.2s ease",
  minWidth: 150,
};

const cardHoverStyle: React.CSSProperties = {
  transform: "scale(1.05)",
};

type CardProps = {
  href: string;
  title: string;
  count: number | string;
  icon: React.ReactNode;
  subtotal: number;
  acc: number;
  item: object;
};

function AdminCard({ href, title, count, icon }: CardProps) {
  const [hover, setHover] = React.useState(false);

  return (
    <Link href={href} style={{ textDecoration: "none", flex: 1 }}>
      <div
        style={{
          ...cardStyle,
          ...(hover ? cardHoverStyle : {}),
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
        <div style={{ fontSize: 24, fontWeight: "bold" }}>{count}</div>
        <div style={{ fontSize: 16, opacity: 0.8 }}>{title}</div>
      </div>
    </Link>
  );
}

export default function AdminHome() {
  const [menu, setMenu] = useState();
  const [order, setOrder] = useState();
  console.log(order);
  const [user, setUser] = useState();
  const [totalSales, setTotalSales] = useState<number>();
  const [allOrders, setAllOrders] = useState<CardProps[]>([]);
  async function orderStatus() {
    try {
      const res = await fetch("http://localhost:3000/api/orders");
      const data = await res.json();
      setOrder(data.length);
      setAllOrders(data);
      console.log(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (allOrders.length > 0) {
      const finalTotal = allOrders.reduce((acc, item) => {
        return acc + Number(item.subtotal);
      }, 0);

      setTotalSales(finalTotal);
    } else {
      setTotalSales(0);
    }
  }, [allOrders]);

  async function menufunction() {
    try {
      const res = await fetch("http://localhost:3000/api/menu");
      const data = await res.json();
      setMenu(data.length);
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  async function usersfunction() {
    try {
      const res = await fetch("http://localhost:3000/api/users");
      const data = await res.json();
      setUser(data.length);
    } catch (error: any) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    orderStatus();
    menufunction();
    usersfunction();
  }, []);
  // Replace these with real data from your backend or API later
  const stats = {
    menuItems: menu,
    orders: order,
    users: user,
    sales: "PKR " + totalSales,
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>

      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 30,
          flexWrap: "wrap",
        }}
      >
        <AdminCard
          href="/admin/menu"
          title="Menu Items"
          count={stats.menuItems}
          icon={<i className="fa fa-utensils" />}
        />
        <AdminCard
          href="/admin/orders"
          title="Orders"
          count={stats.orders}
          icon={<i className="fa fa-shopping-cart" />}
        />
        <AdminCard
          href="/admin/users"
          title="Users"
          count={stats.users}
          icon={<i className="fa fa-users" />}
        />
        <AdminCard
          href="/admin/settings"
          title="Total Sales"
          count={stats.sales}
          icon={<i className="fa fa-rupee-sign" />}
        />
      </div>
    </div>
  );
}
