'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddMenuItem() {
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [error, setError] = useState<string>();
  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      return alert('plz put image');
    }
    setError('');

    if (!name || !category || !price) {
      setError('all field required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price.toString());
      formData.append('image', image);
      const response = await fetch('/api/menu', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');

        return;
      }
    } catch (err: any) {
      setError(err.message || 'Failed');
    }

    router.push('/admin/menu'); // back to menu list
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Add Menu Item</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <input
          placeholder='Item Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          placeholder='Category'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          placeholder='Price'
          type='number'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          placeholder='Image'
          type='file'
          accept='image/*'
          style={inputStyle}
          required
        />

        <button type='submit' style={btnStyle}>
          Save
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 6,
  border: '3px solid #cccccc',
};

const btnStyle: React.CSSProperties = {
  padding: '10px 16px',
  background: 'oklch(0.769 0.188 70.08)',
  color: '#fff',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
};
