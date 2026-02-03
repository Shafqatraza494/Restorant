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
}

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  console.log("mm", cartItems);

  const router = useRouter();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  async function fetchData() {
    try {
      const resp = await fetch("http://localhost:3000/api/cart");
      const result: any = await resp.json();
      setCartItems(result);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async () => {
    let localData = localStorage.getItem("loggedInUser");
    let userId = null;
    if (localData) {
      userId = JSON.parse(localData);
    }

    try {
      let resp = await fetch("http://localhost:3000/api/cart", {
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

  const handleConfirm = () => {
    // Save current cart + order number to localStorage so payment page can read
    localStorage.setItem(
      "currentOrder",
      JSON.stringify({ orderNumber, cartItems }),
    );
    router.push("/payment");
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Thank you for your order!</h1>
      <p className="text-center mb-5">
        Your order number is <strong>{orderNumber}</strong>
      </p>

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
            </tr>
          </thead>
          <tbody>
            {cartItems.map(({ id, item, price, quantity }) => (
              <tr key={id}>
                <td>{item}</td>
                <td>{quantity}</td>
                <td>Rs: {price.toFixed(2)}</td>
                <td>Rs: {(price * quantity).toFixed(2)}</td>
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
