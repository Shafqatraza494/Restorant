"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  item: string;
  menu_id: number;
}

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  console.log("mm", cartItems);

  const router = useRouter();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  async function fetchData() {
    try {
      const resp = await fetch("/api/cart");
      const result: CartItem[] = await resp.json();

      // 🔹 merge same items
      const merged: any = Object.values(
        result.reduce((acc: any, curr) => {
          if (acc[curr.item]) {
            acc[curr.item].quantity += curr.quantity;
          } else {
            acc[curr.item] = { ...curr };
          }
          return acc;
        }, {}),
      );

      setCartItems(merged);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const handleDeleteItem = async (id: number) => {
    try {
      const resp = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuId: id }),
      });

      if (resp.ok) {
        toast.success("Item removed");
        fetchData(); // refresh cart
        window.dispatchEvent(new Event("cartUpdate"));
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleCancel = async () => {
    let localData = localStorage.getItem("loggedInUser");
    let userId = null;
    if (localData) {
      userId = JSON.parse(localData);
    }

    try {
      let resp = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteId: userId.id }),
      });
      const data = await resp.json();
      if (resp.ok) {
        toast.success(data.message);
        window.dispatchEvent(new Event("cartUpdate"));
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message || "nothing done with that thing you passed");
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include", // 🔥 important for HttpOnly cookie
        });

        if (res.ok) {
          setIsLoggedIn(true);
          fetchData(); // only fetch cart if logged in
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleConfirm = () => {
    // Save current cart + order number to localStorage so payment page can read
    localStorage.setItem(
      "currentOrder",
      JSON.stringify({ orderNumber, cartItems }),
    );
    router.push("/payment");
  };

  if (checkingAuth) {
    return <p className="text-center mt-5">Checking authentication...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className="container py-5 text-center">
        <h2>Please login to view your cart</h2>
        <button
          className="btn btn-primary mt-3"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Confirm your order!</h1>

      <h3>Order Summary:</h3>
      {cartItems.length === 0 ? (
        <p>Your cart was empty.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(({ id, menu_id, item, price, quantity }) => (
              <tr key={id}>
                <td>{item}</td>
                <td>{quantity}</td>
                <td>Rs: {price.toFixed(2)}</td>
                <td>Rs: {(price * quantity).toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteItem(menu_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="text-end fw-bold">
                Total:
              </td>
              <td className="fw-bold">Rs: {totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button onClick={handleCancel} className="btn btn-secondary px-4">
          Cancel
        </button>
        <button onClick={handleConfirm} className="btn btn-primary px-4">
          Confirm
        </button>
      </div>
    </div>
  );
}
