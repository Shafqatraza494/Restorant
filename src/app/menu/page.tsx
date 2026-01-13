"use client";

import Link from "next/link";
import React from "react";
import { toast } from "sonner";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

function addToCart(item: CartItem) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existingIndex = cart.findIndex(
    (cartItem: CartItem) => cartItem.id === item.id
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // Dispatch event so Navbar and other components know cart updated
  window.dispatchEvent(new Event("cartUpdate"));

  toast.success("Added to cart!");
}

function Page() {
  // Create an array of menu items based on your menu data for easier handling
  const menuItems: CartItem[] = [
    {
      id: 1,
      name: "Chicken Burger",
      price: 120,
      quantity: 1,
      image: "/menu-1.jpg",
    },
    {
      id: 2,
      name: "Chicken Burger",
      price: 130,
      quantity: 1,
      image: "/menu-2.jpg",
    },
    {
      id: 3,
      name: "Chicken Burger",
      price: 140,
      quantity: 1,
      image: "/menu-3.jpg",
    },
    {
      id: 4,
      name: "Chicken Burger",
      price: 150,
      quantity: 1,
      image: "/menu-4.jpg",
    },
    {
      id: 5,
      name: "Chicken Burger",
      price: 160,
      quantity: 1,
      image: "/menu-5.jpg",
    },
    {
      id: 6,
      name: "Chicken Burger",
      price: 170,
      quantity: 1,
      image: "/menu-6.jpg",
    },
    {
      id: 7,
      name: "Chicken Burger",
      price: 180,
      quantity: 1,
      image: "/menu-7.jpg",
    },
    {
      id: 8,
      name: "Chicken Burger",
      price: 200,
      quantity: 1,
      image: "/menu-8.jpg",
    },
  ];

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
                  src={item.image}
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
                    onClick={() => addToCart(item)}
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
