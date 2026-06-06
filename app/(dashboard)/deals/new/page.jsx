'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const products = [
  'Fresh Tomatoes',
  'Organic Eggs',
  'Basmati Rice',
  'Fresh Milk',
  'Kist Fruit Juice',
  'Signal Toothpaste',
];

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    product: '',
    discount: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/deals');
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
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Create New Deal</h1>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>Fill in deal details below</p>
        </div>
      </div>

      <div className="rounded-2xl p-6 shadow-sm space-y-5"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>Deal Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
            style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }}
            placeholder="e.g. Summer Boost" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
            style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }}
            placeholder="Describe your deal..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>Linked Product</label>
          <select name="product" value={form.product} onChange={handleChange}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
            style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }} required>
            <option value="">Select a product</option>
            {products.map((p) => (<option key={p} value={p}>{p}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>Discount Percentage (%)</label>
          <input type="number" name="discount" value={form.discount} onChange={handleChange}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
            style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }}
            placeholder="e.g. 10" min="1" max="100" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A2E' }}>End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0', color: '#1A1A2E' }} required />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl font-medium text-sm transition hover:opacity-80"
            style={{ backgroundColor: '#F5F7FA', color: '#666666', border: '1px solid #E8ECF0' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-3 rounded-xl font-medium text-sm text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: '#E84E0F' }}>
            {loading ? 'Creating...' : 'Create Deal'}
          </button>
        </div>

      </div>
    </div>
  );
}