"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const randomOrder = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(randomOrder);

    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCancel = () => {
    router.push("/");
  };

  const handleConfirm = () => {
    // Save current cart + order number to localStorage so payment page can read
    localStorage.setItem(
      "currentOrder",
      JSON.stringify({ orderNumber, cartItems })
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
            {cartItems.map(({ id, name, price, quantity }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{quantity}</td>
                <td>${price.toFixed(2)}</td>
                <td>${(price * quantity).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="text-end fw-bold">
                Total:
              </td>
              <td className="fw-bold">${totalPrice.toFixed(2)}</td>
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
