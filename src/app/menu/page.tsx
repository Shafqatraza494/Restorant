"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  category: number;
  image: string;
}

function Page() {
  const [menuItems, setMenuItems] = useState<CartItem[]>([]);
  const router = useRouter();

  async function handleCart(item: any) {
    try {
      // 🔐 check login first
      const authRes = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!authRes.ok) {
        toast.error("Please login first to add items to cart");
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to add to cart");
        return;
      }

      toast.success(data.message);
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (error: any) {
      toast.error(error.message || "Error while adding to cart");
    }
  }

  async function fetchData() {
    try {
      const response = await fetch("/api/menu");
      const result: any = await response.json();
      setMenuItems(result);
      console.log(result);
    } catch (error) {
      console.log("error fetching menu");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Create an array of menu items based on your menu data for easier handling

  return (
    <div>
      {/* ... your existing header and nav here ... */}

      {/* Menu Items */}
      <div className="py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h5 className="section-title ff-secondary text-center text-primary fw-normal">
              Food Menu
            </h5>
            <h1 className="mb-5">Most Popular Items</h1>
          </div>
          <div className="row g-4">
            {menuItems.map((item) => (
              <div key={item.id} className="col-lg-6 d-flex align-items-center">
                <img
                  className="flex-shrink-0 img-fluid rounded"
                  src={
                    item.image ||
                    "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740&q=80"
                  }
                  alt={item.name}
                  style={{ width: "80px" }}
                />
                <div className="w-100 d-flex flex-column text-start ps-4">
                  <h5 className="d-flex justify-content-between border-bottom pb-2">
                    <span>{item.name}</span>
                    <span className="text-primary">Rs. {item.price}</span>
                  </h5>
                  <small className="fst-italic">
                    Ipsum ipsum clita erat amet dolor justo diam
                  </small>

                  <button
                    className="btn btn-sm btn-primary mt-2"
                    onClick={() => handleCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
