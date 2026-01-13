"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

type PaymentMethod = "debit" | "jazzcash" | "easypaisa";

export default function PaymentPage() {
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Debit Card form states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // JazzCash/EasyPaisa form states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("0.00");

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
    } else {
      setCartItems([]);
      setOrderNumber("");
    }
  }, []);

  // Calculate totals safely
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const taxRate = 0.1; // 10% tax
  const discount = 5; // $5 discount fixed

  const taxAmount = totalPrice * taxRate;
  // Prevent final total from being negative
  const finalTotal = Math.max(totalPrice + taxAmount - discount, 0);

  // Update amount string for JazzCash/EasyPaisa form
  useEffect(() => {
    setAmount(finalTotal.toFixed(2));
  }, [finalTotal]);

  const resetForm = () => {
    setCardName("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setPhoneNumber("");
    setPin("");
    setAmount(finalTotal.toFixed(2));
    setPaymentMethod("");
  };

  // Validation helpers (same as your original)
  const validateCardNumber = (num: string) =>
    /^\d{16}$/.test(num.replace(/\s+/g, ""));
  const validateExpiry = (exp: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
  const validateCvv = (cvv: string) => /^\d{3}$/.test(cvv);
  const validatePhone = (phone: string) => /^03\d{9}$/.test(phone);
  const validatePin = (pin: string) => /^\d{4,6}$/.test(pin);
  const validateAmount = (amt: string) =>
    /^\d+(\.\d{1,2})?$/.test(amt) && parseFloat(amt) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (paymentMethod === "debit") {
      if (
        cardName.trim().length < 3 ||
        !validateCardNumber(cardNumber) ||
        !validateExpiry(expiry) ||
        !validateCvv(cvv)
      ) {
        setMessage("Please enter valid debit card details.");
        return;
      }
    } else if (paymentMethod === "jazzcash" || paymentMethod === "easypaisa") {
      if (!validatePhone(phoneNumber)) {
        setMessage("Please enter a valid phone number (e.g., 03XXXXXXXXX).");
        return;
      }
      if (!validatePin(pin)) {
        setMessage("Please enter a valid PIN (4 to 6 digits).");
        return;
      }
      if (!validateAmount(amount)) {
        setMessage("Please enter a valid amount.");
        return;
      }
    } else {
      setMessage("Please select a payment method.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setMessage("Payment Successful! Your order is confirmed.");

      localStorage.removeItem("cart");
      localStorage.removeItem("currentOrder");
      window.dispatchEvent(new Event("cartUpdate"));

      resetForm();
      setCartItems([]);
      setOrderNumber("");
      router.push("/");
    }, 2000);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Payment</h1>
      <div className="row">
        {/* Left - Order Summary */}
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
                {cartItems.map(({ id, name, price, quantity }) => (
                  <tr key={id}>
                    <td>{name}</td>
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

        {/* Right - Payment Method & Form */}
        <div className="col-md-7">
          <h4>Select Payment Method</h4>

          <div className="mb-4 d-flex gap-3">
            <button
              type="button"
              className={`btn ${
                paymentMethod === "debit"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setPaymentMethod("debit")}
            >
              Debit Card
            </button>
            <button
              type="button"
              className={`btn ${
                paymentMethod === "jazzcash"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setPaymentMethod("jazzcash")}
            >
              JazzCash
            </button>
            <button
              type="button"
              className={`btn ${
                paymentMethod === "easypaisa"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setPaymentMethod("easypaisa")}
            >
              EasyPaisa
            </button>
          </div>

          <form onSubmit={handleSubmit} className="w-100">
            {/* Debit Card form */}
            {paymentMethod === "debit" && (
              <>
                <div className="mb-3">
                  <label htmlFor="cardName" className="form-label">
                    Name on Card
                    <br />
                    <small>Visa, MasterCard, American Express, Discover</small>
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    value={cardName}
                    required
                    onChange={(e) => setCardName(e.target.value)}
                    className="form-control"
                    placeholder="Full Name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardNumber}
                    required
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      val =
                        val
                          .match(/.{1,4}/g)
                          ?.join(" ")
                          .substr(0, 19) || "";
                      setCardNumber(val);
                    }}
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="row">
                  <div className="col mb-3">
                    <label htmlFor="expiry" className="form-label">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      value={expiry}
                      required
                      onChange={(e) => setExpiry(e.target.value)}
                      className="form-control"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>

                  <div className="col mb-3">
                    <label htmlFor="cvv" className="form-label">
                      CVV
                    </label>
                    <input
                      type="password"
                      id="cvv"
                      value={cvv}
                      required
                      onChange={(e) => setCvv(e.target.value)}
                      className="form-control"
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
              </>
            )}

            {/* JazzCash / EasyPaisa form */}
            {(paymentMethod === "jazzcash" ||
              paymentMethod === "easypaisa") && (
              <>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    {paymentMethod === "jazzcash"
                      ? "JazzCash Mobile Number"
                      : "EasyPaisa Mobile Number"}
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    required
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 11) val = val.slice(0, 11);
                      setPhoneNumber(val);
                    }}
                    className="form-control"
                    placeholder="03XXXXXXXXX"
                    maxLength={11}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="pin" className="form-label">
                    {paymentMethod === "jazzcash"
                      ? "JazzCash PIN"
                      : "EasyPaisa PIN"}
                  </label>
                  <input
                    type="password"
                    id="pin"
                    value={pin}
                    required
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 6) val = val.slice(0, 6);
                      setPin(val);
                    }}
                    className="form-control"
                    placeholder="4 to 6 digit PIN"
                    maxLength={6}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    value={amount}
                    required
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(val)) {
                        setAmount(val);
                      }
                    }}
                    className="form-control"
                    placeholder="Amount"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing Payment..." : "Pay Now"}
            </button>
          </form>

          {message && (
            <div
              className={`alert mt-4 text-center ${
                message.includes("Successful")
                  ? "alert-success"
                  : "alert-danger"
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
