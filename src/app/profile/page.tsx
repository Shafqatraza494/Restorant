'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Order {
  id: number;
  item: string;
  quantity: number;
  price: number;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const resp = await fetch('/api/profile', { credentials: 'include' });
      const data = await resp.json();

      if (!resp.ok) {
        toast.error(data.error || 'Failed to load profile');
        return;
      }

      setUser(data.user);
      setCompletedOrders(data.completedOrders);
      setPendingOrders(data.pendingOrders);
      // Assuming API returns readyOrders as well
      setReadyOrders(data.readyOrders || []);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p className='text-center mt-10'>Loading profile...</p>;

  if (!user)
    return (
      <p className='text-center mt-10 text-red-500'>
        User not found or not logged in.
      </p>
    );

  const renderOrders = (orders: Order[], statusColor: string) => (
    <ul className='space-y-3'>
      {orders.map((order) => (
        <li
          key={order.id}
          className='p-4 border rounded-lg shadow-sm flex justify-between items-center hover:shadow-md transition-shadow'
        >
          <div>
            <p className='font-semibold'>{order.item}</p>
            <p className='text-sm text-gray-600'>
              Qty: {order.quantity} | Price: ${order.price}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full text-white ${statusColor}`}
          >
            {order.status}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className='max-w-8xl mx-auto p-6 space-y-8'>
      <h1 className='text-3xl font-bold mb-4 text-center'>Profile</h1>

      <div className='bg-white p-6 rounded-lg shadow-md space-y-2'>
        <h2 className='text-xl font-semibold mb-2'>User Details</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-6'>
        {/* Pending Orders */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold mb-3'>Pending Orders</h2>
          {pendingOrders.length === 0 ? (
            <p className='text-gray-500'>No pending orders</p>
          ) : (
            renderOrders(pendingOrders, 'bg-yellow-500')
          )}
        </div>

        {/* Ready Orders */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold mb-3'>Ready Orders</h2>
          {readyOrders.length === 0 ? (
            <p className='text-gray-500'>No ready orders</p>
          ) : (
            renderOrders(readyOrders, 'bg-blue-500')
          )}
        </div>

        {/* Completed Orders */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold mb-3'>Completed Orders</h2>
          {completedOrders.length === 0 ? (
            <p className='text-gray-500'>No completed orders</p>
          ) : (
            renderOrders(completedOrders, 'bg-green-500')
          )}
        </div>
      </div>
    </div>
  );
}
