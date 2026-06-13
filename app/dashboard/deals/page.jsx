'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faPlus, faEdit, faTrash, faSpinner, faCalendar, faPercentage } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { dealAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await dealAPI.getDeals();
      if (response.data.success) {
        setDeals(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dealId) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      setDeleting(dealId);
      await dealAPI.deleteDeal(dealId);
      toast.success('Deal deleted successfully');
      fetchDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isActive = (deal) => {
    const now = new Date();
    const start = new Date(deal.start_date);
    const end = new Date(deal.end_date);
    return now >= start && now <= end && deal.is_active;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin" style={{ color: '#E84E0F' }} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faTags} />
            Deals
          </h1>
          <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
            Manage your promotional deals ({deals.length} deals)
          </p>
        </div>
        <Link
          href="/dashboard/deals/new"
          className="px-4 sm:px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: '#E84E0F' }}>
          <FontAwesomeIcon icon={faPlus} />
          <span className="hidden sm:inline">Add Deal</span>
        </Link>
      </div>

      {deals.length === 0 ? (
        <div className="text-center py-20">
          <FontAwesomeIcon icon={faTags} className="text-6xl mb-4" style={{ color: '#333333' }} />
          <p className="text-xl" style={{ color: '#888888' }}>No deals yet</p>
          <p className="mt-2" style={{ color: '#666666' }}>Create your first deal to get started</p>
          <Link
            href="/dashboard/deals/new"
            className="inline-block mt-6 px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#E84E0F' }}>
            Create Deal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white">{deal.title}</h3>
                    {isActive(deal) ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-600 text-white">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-3" style={{ color: '#888888' }}>
                    {deal.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                  <p className="text-xs mb-1" style={{ color: '#888888' }}>
                    <FontAwesomeIcon icon={faPercentage} className="mr-1" />
                    Discount
                  </p>
                  <p className="text-lg font-bold text-white">
                    {deal.discount_value}
                    {deal.discount_type === 'percentage' ? '%' : ' LKR'}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                  <p className="text-xs mb-1" style={{ color: '#888888' }}>Deal Price</p>
                  <p className="text-lg font-bold" style={{ color: '#E84E0F' }}>
                    LKR {deal.deal_price?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#888888' }}>
                <FontAwesomeIcon icon={faCalendar} />
                <span>{formatDate(deal.start_date)} - {formatDate(deal.end_date)}</span>
              </div>

              {deal.shops && (
                <p className="text-sm mb-4" style={{ color: '#888888' }}>
                  Shop: {deal.shops.name}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(deal.id)}
                  disabled={deleting === deal.id}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold transition hover:opacity-80 disabled:opacity-50"
                  style={{ backgroundColor: '#1A1A1A', color: '#FF4444', border: '1px solid #333333' }}>
                  <FontAwesomeIcon icon={deleting === deal.id ? faSpinner : faTrash} className={deleting === deal.id ? 'animate-spin' : ''} />
                </button>
                <Link
                  href={`/dashboard/deals/${deal.id}/edit`}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition hover:opacity-90 text-center"
                  style={{ backgroundColor: '#E84E0F' }}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
