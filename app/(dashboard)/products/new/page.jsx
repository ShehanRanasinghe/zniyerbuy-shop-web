'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = ['Vegetables', 'Fruits', 'Grains', 'Meat', 'Seafood', 'Dairy', 'Bakery', 'Beverages', 'Personal Care', 'Cleaning'];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    unit: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/products');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition hover:opacity-80"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Add New Product</h1>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>Fill in product details below</p>
        </div>
      </div>

      <div className="rounded-2xl p-6 shadow-sm space-y-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>
            Product Image
          </label>
          <div className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition hover:opacity-80"
            style={{ borderColor: '#E84E0F', backgroundColor: '#FEF0EB' }}>
            <p className="text-4xl mb-2">📷</p>
            <p className="text-sm font-medium" style={{ color: '#E84E0F' }}>Click to upload product image</p>
            <p className="text-xs mt-1" style={{ color: '#888888' }}>PNG, JPG up to 5MB</p>
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
            style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }}
            placeholder="e.g. Fresh Broccoli"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>
            Product Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
            style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }}
            placeholder="Describe your product..."
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} type="button"
                onClick={() => setForm({ ...form, category: cat })}
                className="px-4 py-2 rounded-xl text-xs font-medium transition"
                style={{
                  backgroundColor: form.category === cat ? '#E84E0F' : '#F5F7FA',
                  color: form.category === cat ? '#FFFFFF' : '#666666',
                  border: form.category === cat ? 'none' : '1px solid #E8ECF0',
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price, Stock, Unit */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>
              Price (LKR)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }}
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>
              Unit
            </label>
            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }}
              placeholder="1kg"
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl font-medium text-sm transition hover:opacity-80"
            style={{ backgroundColor: '#F5F7FA', color: '#666666', border: '1px solid #E8ECF0' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-medium text-sm text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#E84E0F' }}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>

      </div>
    </div>
  );
}