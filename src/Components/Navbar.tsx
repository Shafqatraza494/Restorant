"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Navbar() {
  const [pagesOpen, setPagesOpen] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const router = useRouter();

  // 🍪 Cookie helper
  function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }

  useEffect(() => {
    async function syncAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include", // send cookies
        });

        if (res.ok) {
          const data = await res.json();
          setLoggedIn(true);
          // optionally set user info in state here
        } else {
          setLoggedIn(false);
        }
      } catch {
        setLoggedIn(false);
      }
    }

    syncAuth();
    window.addEventListener("authChange", syncAuth);
    return () => window.removeEventListener("authChange", syncAuth);
  }, []);

  // 🛒 CART COUNT
  const updateCartCount = () => {
    const cart = localStorage.getItem("cart");
    if (!cart) return setCartCount(0);

    const items = JSON.parse(cart);
    const total = items.reduce(
      (sum: number, item: { quantity: number }) => sum + item.quantity,
      0,
    );
    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdate", updateCartCount);
    return () => window.removeEventListener("cartUpdate", updateCartCount);
  }, []);

  async function handleLogout() {
    try {
      // Call backend logout endpoint to clear HttpOnly cookie
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // send cookies to backend
      });

      // Clear any client-side data
      localStorage.removeItem("loggedInUser");

      // Update app state
      window.dispatchEvent(new Event("authChange"));
      toast.success("Logging Out...");

      setTimeout(() => {
        router.push("/login");
      }, 1200);

      setCollapse(false);
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 px-lg-5 py-3">
      {/* LOGO */}
      <Link href="/" className="navbar-brand p-0">
        <h1 style={{ fontSize: "20px" }} className="text-primary m-0">
          <i
            style={{ fontSize: "20px", marginLeft: "-25px" }}
            className="fa fa-utensils me-3"
          ></i>
          Tahzeeb Kitchen
        </h1>
      </Link>

      {/* HAMBURGER */}
      <button className="navbar-toggler" onClick={() => setCollapse(!collapse)}>
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* MENU */}
      <div
        className={`${
          collapse ? "d-block" : "d-none"
        } d-lg-flex align-items-center w-100`}
      >
        <div className="navbar-nav ms-auto py-3 py-lg-0 pe-4">
          <Link
            href="/"
            className="nav-item nav-link"
            onClick={() => setCollapse(false)}
          >
            Home
          </Link>

          <Link
            href="/about"
            className="nav-item nav-link"
            onClick={() => setCollapse(false)}
          >
            About
          </Link>

          <Link
            href="/service"
            className="nav-item nav-link"
            onClick={() => setCollapse(false)}
          >
            Service
          </Link>

          <Link
            href="/menu"
            className="nav-item nav-link"
            onClick={() => setCollapse(false)}
          >
            Menu
          </Link>

          {/* PAGES */}
          <div className="nav-item dropdown">
            <span
              className="nav-link dropdown-toggle cursor-pointer"
              onClick={() => setPagesOpen(!pagesOpen)}
            >
              Pages
            </span>

            {pagesOpen && (
              <div className="dropdown-menu show rounded-0 m-0">
                <Link
                  href="/booking"
                  className="dropdown-item"
                  onClick={() => setCollapse(false)}
                >
                  Booking
                </Link>
                <Link
                  href="/team"
                  className="dropdown-item"
                  onClick={() => setCollapse(false)}
                >
                  Our Team
                </Link>
                <Link
                  href="/testonomial"
                  className="dropdown-item"
                  onClick={() => setCollapse(false)}
                >
                  Testimonial
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="nav-item nav-link"
            onClick={() => setCollapse(false)}
          >
            Contact
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="nav-item nav-link position-relative"
            onClick={() => setCollapse(false)}
          >
            Cart
            {cartCount > 0 && (
              <span className="badge bg-danger ms-1">{cartCount}</span>
            )}
          </Link>
        </div>

        {/* BUTTON */}
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="btn btn-danger ms-lg-3 mt-3 mt-lg-0"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="btn btn-primary ms-lg-3 mt-3 mt-lg-0"
            onClick={() => setCollapse(false)}
          >
            Book A Table
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
