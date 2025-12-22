"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Check login status from localStorage when component mounts
  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
      return null;
    };

    const handleAuthChange = () => {
      const loggedInCookie = getCookie("loggedIn");
      setLoggedIn(loggedInCookie === "true");
    };

    handleAuthChange();

    window.addEventListener("authChange", handleAuthChange);

    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      const cartItems = JSON.parse(cart);
      const totalQuantity = cartItems.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      );
      setCartCount(totalQuantity);
    } else {
      setCartCount(0);
    }
  };

  // Run on mount and listen to "cartUpdate" event
  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdate", updateCartCount);

    return () => window.removeEventListener("cartUpdate", updateCartCount);
  }, []);

  // Logout handler
  function handleLogout() {
    // Remove loggedIn from localStorage
    localStorage.removeItem("loggedIn");

    // Clear the loggedIn cookie
    document.cookie = "loggedIn=false; path=/; max-age=86400"; // expires in 1 day
    // Dispatch authChange event to update UI
    window.dispatchEvent(new Event("authChange"));

    setLoggedIn(false);

    router.push("/login"); // Redirect to login page
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3 py-lg-0">
        <Link href="/" className="navbar-brand p-0">
          <h1 className="text-primary m-0">
            <i className="fa fa-utensils me-3"></i>Restorant
          </h1>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="fa fa-bars"></span>
        </button>
        <div className="d-flex justify-content-end w-100 align-items-center">
          <div className="navbar-nav ms-auto py-0 pe-4">
            <Link href="/" className="nav-item nav-link active">
              Home
            </Link>
            <Link href="/about" className="nav-item nav-link">
              About
            </Link>
            <Link href="/Services" className="nav-item nav-link">
              Service
            </Link>
            <Link href="/menu" className="nav-item nav-link">
              Menu
            </Link>
            <div className="relative nav-item">
              {/* Dropdown Button */}
              <div
                onClick={() => setOpen(!open)}
                className="cursor-pointer nav-link flex items-center gap-1"
              >
                Pages
                <span className="text-sm">{open ? "▲" : "▼"}</span>
              </div>

              {/* Dropdown Menu */}
              {open && (
                <div
                  className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded p-2 z-50"
                  onMouseLeave={() => setOpen(false)}
                >
                  <Link
                    href="/booking"
                    className="block px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Booking
                  </Link>

                  <Link
                    href="/team"
                    className="block px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Our Team
                  </Link>

                  <Link
                    href="/testonomial"
                    className="block px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Testimonial
                  </Link>
                </div>
              )}
            </div>

            <Link href="/contact" className="nav-item nav-link">
              Contact
            </Link>

            {/* Cart link with badge */}
            <Link
              href="/order_conformations"
              className="nav-item nav-link position-relative"
            >
              Cart
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "-10px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 7px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/track_order" className="nav-item nav-link">
              track-order
            </Link>
          </div>

          {/* Conditional button */}
          {loggedIn ? (
            <button onClick={handleLogout} className="btn btn-danger py-2 px-4">
              Logout
            </button>
          ) : (
            <Link href="/register" className="btn btn-primary py-2 px-4">
              Book A Table
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
