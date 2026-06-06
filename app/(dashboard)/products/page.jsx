'use client';

import { useState } from 'react';
import Link from 'next/link';

const initialProducts = [
  { id: 1, name: 'Fresh Tomatoes', category: 'Vegetables', price: 120, stock: 50, unit: '1kg', status: 'In Stock' },
  { id: 2, name: 'Organic Eggs', category: 'Dairy', price: 480, stock: 12, unit: '12pcs', status: 'Low Stock' },
  { id: 3, name: 'Basmati Rice', category: 'Grains', price: 350, stock: 0, unit: '1kg', status: 'Out of Stock' },
  { id: 4, name: 'Fresh Milk', category: 'Dairy', price: 220, stock: 30, unit: '1L', status: 'In Stock' },
  { id: 5, name: 'Kist Fruit Juice', category: 'Beverages', price: 180, stock: 25, unit: '500ml', status: 'In Stock' },
  { id: 6, name: 'Signal Toothpaste', category: 'Personal Care', price: 320, stock: 8, unit: '160g', status: 'Low Stock' },
];

const categories = ['All', 'Vegetables', 'Dairy', 'Grains', 'Beverages', 'Personal Care'];
const filters = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchFilter = selectedFilter === 'All' || p.status === selectedFilter;
    return matchSearch && matchCategory && matchFilter;
  });

  const handleDelete = (id) => {
    if (confirm('Delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Products</h1>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>
            Manage your shop inventory
          </p>
        </div>
        <Link href="/products/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white text-sm transition hover:opacity-90"
          style={{ backgroundColor: '#E84E0F' }}>
          ➕ Add Product
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: products.length, bg: '#FEF0EB', color: '#E84E0F', icon: '📦' },
          { label: 'Low Stock', value: products.filter(p => p.status === 'Low Stock').length, bg: '#FEF3C7', color: '#D97706', icon: '⚠️' },
          { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length, bg: '#FEE2E2', color: '#DC2626', icon: '❌' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl p-4 flex items-center gap-4 shadow-sm"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: stat.bg }}>{stat.icon}</div>
            <div>
              <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs" style={{ color: '#888888' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl p-4 shadow-sm space-y-4"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-4 top-3 text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none"
            style={{ backgroundColor: '#F5F7FA', color: '#1A1A2E', border: '1px solid #E8ECF0' }}
            placeholder="Search products..."
          />
        </div>

        {/* Stock Filter */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button key={filter}
              onClick={() => setSelectedFilter(filter)}
              className="px-4 py-2 rounded-xl text-xs font-medium transition"
              style={{
                backgroundColor: selectedFilter === filter ? '#E84E0F' : '#F5F7FA',
                color: selectedFilter === filter ? '#FFFFFF' : '#666666',
              }}>
              {filter}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-2 rounded-xl text-xs font-medium transition"
              style={{
                backgroundColor: selectedCategory === cat ? '#2A7F8A' : '#F5F7FA',
                color: selectedCategory === cat ? '#FFFFFF' : '#666666',
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
            <p className="text-4xl mb-3">📦</p>
            <p className="font-medium" style={{ color: '#1A1A2E' }}>No products found</p>
            <p className="text-sm mt-1" style={{ color: '#888888' }}>Try a different search or filter</p>
          </div>
        ) : (
          filtered.map((product) => (
            <div key={product.id}
              className="flex items-center justify-between p-4 rounded-2xl shadow-sm"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>

              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: '#FEF0EB' }}>📦</div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>{product.name}</p>
                  <p className="text-xs mt-1" style={{ color: '#2A7F8A' }}>{product.category} • {product.unit}</p>
                  {/* Stock Bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-24 h-1.5 rounded-full" style={{ backgroundColor: '#E8ECF0' }}>
                      <div className="h-1.5 rounded-full"
                        style={{
                          width: `${Math.min((product.stock / 60) * 100, 100)}%`,
                          backgroundColor: product.status === 'In Stock' ? '#10B981' : product.status === 'Low Stock' ? '#F59E0B' : '#EF4444'
                        }} />
                    </div>
                    <span className="text-xs" style={{ color: '#888888' }}>Stock: {product.stock}</span>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: '#1A1A2E' }}>LKR {product.price}</p>
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: product.status === 'In Stock' ? '#D1FAE5' : product.status === 'Low Stock' ? '#FEF3C7' : '#FEE2E2',
                      color: product.status === 'In Stock' ? '#059669' : product.status === 'Low Stock' ? '#D97706' : '#DC2626'
                    }}>
                    {product.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:opacity-80"
                    style={{ backgroundColor: '#E8F4F5', color: '#2A7F8A' }}>✏️</button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:opacity-80"
                    style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>🗑️</button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}