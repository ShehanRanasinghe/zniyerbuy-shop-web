'use client';

import { useState } from 'react';
import Link from 'next/link';

const initialDeals = [
  {
    id: 1,
    title: 'Summer Boost',
    description: 'New Year special discount',
    product: 'Elephant House Beverages',
    discount: 10,
    originalPrice: 220,
    discountedPrice: 198,
    startDate: 'Apr 03, 2026',
    endDate: 'Apr 30, 2026',
    status: 'Expired',
  },
  {
    id: 2,
    title: '20% Off Vegetables',
    description: 'Fresh vegetables discount',
    product: 'Fresh Tomatoes',
    discount: 20,
    originalPrice: 120,
    discountedPrice: 96,
    startDate: 'Jun 01, 2026',
    endDate: 'Jun 10, 2026',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Buy 2 Get 1 Free',
    description: 'Special promotion on dairy',
    product: 'Fresh Milk',
    discount: 33,
    originalPrice: 220,
    discountedPrice: 147,
    startDate: 'Jun 05, 2026',
    endDate: 'Jun 15, 2026',
    status: 'Active',
  },
];

export default function DealsPage() {
  const [deals, setDeals] = useState(initialDeals);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Active', 'Expired'];

  const filtered = deals.filter((d) => {
    if (activeTab === 'All') return true;
    return d.status === activeTab;
  });

  const handleDelete = (id) => {
    if (confirm('Delete this deal?')) {
      setDeals(deals.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Deals & Promotions</h1>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>
            Manage your shop deals and discounts
          </p>
        </div>
        <Link href="/dashboard/deals/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white text-sm transition hover:opacity-90"
          style={{ backgroundColor: '#E84E0F' }}>
          ➕ Create Deal
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Deals', value: deals.length, bg: '#FEF0EB', color: '#E84E0F', icon: '🏷️' },
          { label: 'Active Deals', value: deals.filter(d => d.status === 'Active').length, bg: '#D1FAE5', color: '#059669', icon: '✅' },
          { label: 'Expired Deals', value: deals.filter(d => d.status === 'Expired').length, bg: '#FEE2E2', color: '#DC2626', icon: '❌' },
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

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-6 py-2 rounded-xl text-sm font-medium transition"
            style={{
              backgroundColor: activeTab === tab ? '#E84E0F' : '#FFFFFF',
              color: activeTab === tab ? '#FFFFFF' : '#666666',
              border: '1px solid #E8ECF0',
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Deals List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
            <p className="text-4xl mb-3">🏷️</p>
            <p className="font-medium" style={{ color: '#1A1A2E' }}>No deals found</p>
            <p className="text-sm mt-1" style={{ color: '#888888' }}>Create your first deal!</p>
          </div>
        ) : (
          filtered.map((deal) => (
            <div key={deal.id} className="rounded-2xl p-5 shadow-sm"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: '#FEF0EB' }}>🏷️</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-base" style={{ color: '#1A1A2E' }}>{deal.title}</p>
                      <span className="text-xs px-3 py-1 rounded-full font-bold text-white"
                        style={{ backgroundColor: '#E84E0F' }}>
                        {deal.discount}% OFF
                      </span>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#888888' }}>{deal.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm">📦</span>
                      <p className="text-sm font-medium" style={{ color: '#2A7F8A' }}>{deal.product}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full ml-1"
                        style={{
                          backgroundColor: deal.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                          color: deal.status === 'Active' ? '#059669' : '#DC2626'
                        }}>
                        {deal.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs">📅</span>
                      <p className="text-xs" style={{ color: '#888888' }}>
                        {deal.startDate} — {deal.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm line-through" style={{ color: '#AAAAAA' }}>
                        Rs. {deal.originalPrice}.00
                      </p>
                      <p className="text-base font-bold" style={{ color: '#E84E0F' }}>
                        Rs. {deal.discountedPrice}.00
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center transition hover:opacity-80"
                    style={{ backgroundColor: '#E8F4F5', color: '#2A7F8A' }}>✏️</button>
                  <button
                    onClick={() => handleDelete(deal.id)}
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