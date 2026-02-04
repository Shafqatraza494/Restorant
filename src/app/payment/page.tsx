"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  item: string;
}

export default function PaymentPage() {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  // const [discount, setDiscount] = useState<number>();
  const router = useRouter();

  useEffect(() => {
    const currentOrder = localStorage.getItem("currentOrder");
    if (currentOrder) {
      try {
        const parsed = JSON.parse(currentOrder);

        if (Array.isArray(parsed.cartItems)) {
          const sanitizedCartItems = parsed.cartItems.map((item: any) => ({
            ...item,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 0,
          }));

          setCartItems(sanitizedCartItems);
        } else {
          setCartItems([]);
        }

        setOrderNumber(parsed.orderNumber || "");
      } catch (error) {
        console.error("Failed to parse currentOrder:", error);
        setCartItems([]);
        setOrderNumber("");
      }
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const taxRate = 0.1;
  const discount = 5;

  const taxAmount = totalPrice * taxRate;
  const finalTotal = Math.max(totalPrice + taxAmount - discount, 0);

  const handleCOD = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(cartItems),
      });
      console.log(response);
      if (response.ok) {
        toast.success("saved success");
        emptyCart();
      } else {
        toast.error("error in backend");
      }
    } catch (error: any) {
      toast.error(error.message);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setMessage("Order Placed - Cash on Delivery!");

      localStorage.removeItem("cart");
      localStorage.removeItem("currentOrder");
      window.dispatchEvent(new Event("cartUpdate"));

      setCartItems([]);
      setOrderNumber("");
      // router.push("/");
    }, 2000);
  };
  async function emptyCart() {
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
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Payment</h1>

      <div className="row">
        <div className="col-md-5 border p-3 mb-4">
          <h4>Order Summary</h4>
          <p>
            <strong>Order Number:</strong> {orderNumber || "N/A"}
          </p>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <table className="table table-sm">
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
                    Subtotal:
                  </td>
                  <td>Rs: {totalPrice.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">
                    Tax (10%):
                  </td>
                  <td>Rs: {taxAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-end fw-bold">
                    Discount:
                  </td>
                  <td>-Rs: {discount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-end fw-bold fs-5">
                    Total:
                  </td>
                  <td className="fs-5 fw-bold">Rs: {finalTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="col-md-7">
          <h4>Payment Method</h4>
          <div className="mt-3 mb-3">
            <span className="badge bg-dark p-2 fs-6">Cash on Delivery</span>
          </div>

          <button
            className="btn btn-success w-100"
            disabled={isProcessing}
            onClick={handleCOD}
          >
            {isProcessing
              ? "Placing Order..."
              : "Place Order (Cash on Delivery)"}
          </button>

          {message && (
            <div
              className={`alert mt-4 text-center ${
                message.includes("Order") ? "alert-success" : "alert-danger"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
