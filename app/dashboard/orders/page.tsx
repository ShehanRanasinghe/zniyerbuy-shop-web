// Orders Page — View and manage customer orders for the authenticated seller
// Fetches orders from the backend; shows friendly empty state when no orders exist yet
// Filters by order status (all, pending, processing, shipped, delivered, cancelled)

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSpinner, faCheckCircle, faClock, faTruck, faTimesCircle, faEye, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { ordersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items_count: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch orders from the backend API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders();
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number } };
      // Only show error for genuine server errors, not empty results
      if (axiosErr.response && axiosErr.response.status >= 500) {
        toast.error('Server error loading orders. Please try again.');
      }
      // Empty orders or 404 — show empty state without error toast
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return faClock;
      case 'processing':
        return faSpinner;
      case 'shipped':
        return faTruck;
      case 'delivered':
        return faCheckCircle;
      case 'cancelled':
        return faTimesCircle;
      default:
        return faClock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'processing':
        return '#2196F3';
      case 'shipped':
        return '#9C27B0';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#888888';
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin" style={{ color: '#E84E0F' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faShoppingCart} />
          Orders Management
        </h1>
        <p className="mt-2" style={{ color: '#888888' }}>
          View and manage customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={{
                backgroundColor: filter === status ? '#E84E0F' : '#1A1A1A',
                border: '1px solid #333333',
              }}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'all' && ` (${orders.length})`}
              {status !== 'all' && ` (${orders.filter(o => o.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-6 hover:shadow-lg transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{order.order_number}</h3>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2"
                        style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}>
                        <FontAwesomeIcon icon={getStatusIcon(order.status)} />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p style={{ color: '#888888' }}>Customer: {order.customer_name}</p>
                    <p className="text-sm" style={{ color: '#666666' }}>
                      {order.items_count} items • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm" style={{ color: '#888888' }}>Total Amount</p>
                      <p className="text-2xl font-bold" style={{ color: '#E84E0F' }}>
                        Rs. {order.total_amount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                      className="px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-80"
                      style={{ backgroundColor: '#2A7F8A' }}>
                      <FontAwesomeIcon icon={faEye} className="mr-2" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faDatabase} className="text-6xl mb-4" style={{ color: '#333333' }} />
            <p className="text-xl font-semibold" style={{ color: '#888888' }}>No orders found in database</p>
            <p className="text-sm mt-2" style={{ color: '#666666' }}>
              {filter === 'all'
                ? 'Your shop has not received any orders yet.'
                : `No ${filter} orders found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
