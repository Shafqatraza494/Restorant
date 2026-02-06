'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  item: string;
  name?: string;
  price: number;
  quantity: number;
}

export default function PaymentPage() {
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Fetch cart from API on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const resp = await fetch('/api/cart', { credentials: 'include' });
        if (!resp.ok) throw new Error('Failed to fetch cart');

        const data = await resp.json();

        // Ensure price & quantity are numbers
        const sanitizedCart = (data.cartItems || []).map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 0,
        }));

        setCartItems(sanitizedCart);
        setOrderNumber(data.orderNumber || '');
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to load cart');
        setCartItems([]);
        setOrderNumber('');
      }
    };

    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const taxRate = 0.1;
  const discount = 5;

  const finalTotal = Math.max(totalPrice - discount, 0);

  const handleCOD = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const resp = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItems),
        credentials: 'include',
      });

      if (!resp.ok) throw new Error('Failed to place order');

      toast.success('Order placed successfully');
      setMessage('Order Placed - Cash on Delivery!');

      // Clear cart on server
      await emptyCart();

      // Clear local state
      setCartItems([]);
      setOrderNumber('');
      window.dispatchEvent(new Event('cartUpdate'));

      // Optional redirect after 2s
      setTimeout(() => router.push('/'), 2000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to place order');
      setMessage('Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear user's cart on server
  async function emptyCart() {
    try {
      const resp = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // delete all items
        credentials: 'include',
      });

      if (!resp.ok) {
        const data = await resp.json();
        toast.error(data.error || 'Failed to clear cart');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear cart');
    }
  }

  return (
    <div className='container py-5'>
      <h1 className='mb-4 text-center'>Payment</h1>

      <div className='row'>
        {/* Order Summary */}
        <div className='col-md-5 border p-3 mb-4 bg-light rounded'>
          <h4 className='mb-3'>Order Summary</h4>
          <p>
            <strong>Order Number:</strong> {orderNumber || 'N/A'}
          </p>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <table className='table table-sm'>
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
                  <td colSpan={3} className='text-end fw-bold'>
                    Subtotal:
                  </td>
                  <td>Rs: {totalPrice.toFixed(2)}</td>
                </tr>

                <tr>
                  <td colSpan={3} className='text-end fw-bold'>
                    Discount:
                  </td>
                  <td>Rs: -{discount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className='text-end fw-bold fs-5'>
                    Total:
                  </td>
                  <td className='fs-5 fw-bold'>Rs: {finalTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Payment Method */}
        <div className='col-md-7'>
          <h4>Payment Method</h4>
          <div className='mt-3 mb-3'>
            <span className='badge bg-dark p-2 fs-6'>Cash on Delivery</span>
          </div>

          <button
            className='btn btn-success w-100'
            disabled={isProcessing}
            onClick={handleCOD}
          >
            {isProcessing
              ? 'Placing Order...'
              : 'Place Order (Cash on Delivery)'}
          </button>

          {message && (
            <div
              className={`alert mt-4 text-center ${
                message.includes('Order') ? 'alert-success' : 'alert-danger'
              }`}
              role='alert'
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
