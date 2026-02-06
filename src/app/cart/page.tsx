'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  menu_id: number;
  item: string;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  const router = useRouter();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // ✅ Fetch cart from new GET /api/cart route
  async function fetchCart() {
    try {
      const resp = await fetch('/api/cart', { credentials: 'include' });

      if (!resp.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await resp.json();
      const items: CartItem[] = data.cartItems || [];

      // Merge same items by menu_id
      const merged: any = Object.values(
        items.reduce((acc: any, curr) => {
          if (acc[curr.menu_id]) {
            acc[curr.menu_id].quantity += curr.quantity;
          } else {
            acc[curr.menu_id] = { ...curr };
          }
          return acc;
        }, {}),
      );

      setCartItems(merged);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to load cart');
      setCartItems([]);
    }
  }

  const handleDeleteItem = async (menu_id: number) => {
    try {
      const resp = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_id }),
        credentials: 'include',
      });

      const data = await resp.json();

      if (resp.ok) {
        toast.success(data.message);
        fetchCart(); // refresh cart
        window.dispatchEvent(new Event('cartUpdate'));
      } else {
        toast.error(data.error || 'Failed to remove item');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  const handleCancel = () => {
    router.push('/menu');
  };

  const handleConfirm = () => {
    // Save cart and order number to localStorage for payment page
    localStorage.setItem(
      'currentOrder',
      JSON.stringify({ orderNumber, cartItems }),
    );
    router.push('/payment');
  };

  // ✅ Check authentication and fetch cart
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          setIsLoggedIn(true);
          fetchCart();
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

  if (checkingAuth) {
    return <p className='text-center mt-5'>Checking authentication...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className='container py-5 text-center'>
        <h2>Please login to view your cart</h2>
        <button
          className='btn btn-primary mt-3'
          onClick={() => router.push('/login')}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className='container py-5'>
      <h1 className='mb-4 text-center'>Confirm your order!</h1>

      <h3>Order Summary:</h3>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className='table'>
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
                    className='btn btn-sm btn-danger'
                    onClick={() => handleDeleteItem(menu_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className='text-end fw-bold'>
                Total:
              </td>
              <td className='fw-bold'>Rs: {totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}

      <div className='d-flex justify-content-center gap-3 mt-4'>
        <button onClick={handleCancel} className='btn btn-secondary px-4'>
          Cancel
        </button>
        <button onClick={handleConfirm} className='btn btn-primary px-4'>
          Confirm
        </button>
      </div>
    </div>
  );
}
