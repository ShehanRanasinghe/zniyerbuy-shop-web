'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart, faSpinner, faArrowLeft, faBox, faUser,
  faCreditCard, faMapMarkerAlt, faPhone, faCalendar,
  faCheckCircle, faClock, faTruck, faTimesCircle, faEdit,
  faMoneyBillWave, faFileInvoice, faSave, faStore, faTag,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ordersAPI } from '@/lib/api';
import axios from 'axios';

interface OrderItem {
  id: string;
  product_id: string;
  discount_id: string | null;
  product_name: string;
  unit_price: number;
  original_price: number | null;
  quantity: number;
  line_total: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string | null;
  delivery_address: string | null;
  payment_method: 'cod' | 'paid' | 'pickup' | null;
  subtotal: number | null;
  delivery_fee: number | null;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items_count: number;
  invoice_sent: boolean;
  created_at: string;
  order_items?: OrderItem[];
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [savingFee, setSavingFee] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [editingFee, setEditingFee] = useState(false);
  const [feeInput, setFeeInput] = useState('');

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrder(orderId);
      if (response.data.success) {
        const fetchedOrder: Order = response.data.data;
        setOrder(fetchedOrder);
        setNewStatus(fetchedOrder.status);
        setFeeInput(fetchedOrder.delivery_fee != null ? String(fetchedOrder.delivery_fee) : '');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: unknown, fallback: string) =>
    (axios.isAxiosError(error) && error.response?.data?.error) ||
    (axios.isAxiosError(error) && error.response?.data?.errors?.[0]?.msg) ||
    fallback;

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order?.status) {
      toast.error('Please select a different status');
      return;
    }

    try {
      setUpdating(true);
      const response = await ordersAPI.updateOrder(orderId, { status: newStatus });

      if (response.data.success) {
        setOrder(response.data.data);
        toast.success('Order status updated successfully');
        setShowStatusUpdate(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(getErrorMessage(error, 'Failed to update order status'));
    } finally {
      setUpdating(false);
    }
  };

  const handleDeliveryFeeSave = async () => {
    const parsedFee = parseFloat(feeInput);
    if (Number.isNaN(parsedFee) || parsedFee < 0) {
      toast.error('Please enter a valid delivery fee');
      return;
    }

    try {
      setSavingFee(true);
      const response = await ordersAPI.updateOrder(orderId, { delivery_fee: parsedFee });

      if (response.data.success) {
        setOrder(response.data.data);
        toast.success('Delivery fee updated successfully');
        setEditingFee(false);
      }
    } catch (error) {
      console.error('Error updating delivery fee:', error);
      toast.error(getErrorMessage(error, 'Failed to update delivery fee'));
    } finally {
      setSavingFee(false);
    }
  };

  // Placeholder only — invoice sending isn't implemented yet.
  const handleSendInvoice = () => {
    toast('Send Invoice is coming soon — not yet implemented', { icon: '🧾' });
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

  const getPaymentMethodLabel = (method: string | null) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery (COD)';
      case 'paid':
        return 'Paid';
      case 'pickup':
        return 'Self Pickup';
      default:
        return 'Not specified';
    }
  };

  const getPaymentMethodIcon = (method: string | null) => {
    switch (method) {
      case 'cod':
        return faMoneyBillWave;
      case 'paid':
        return faCreditCard;
      case 'pickup':
        return faStore;
      default:
        return faTag;
    }
  };

  const getPaymentMethodColor = (method: string | null) => {
    switch (method) {
      case 'cod':
        return '#FF9800';
      case 'paid':
        return '#4CAF50';
      case 'pickup':
        return '#2A7F8A';
      default:
        return '#888888';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin" style={{ color: '#E84E0F' }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faShoppingCart} className="text-6xl mb-4" style={{ color: '#333333' }} />
        <p className="text-xl mb-4" style={{ color: '#888888' }}>Order not found</p>
        <Link
          href="/dashboard/orders"
          className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
          style={{ backgroundColor: '#E84E0F' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/orders" className="text-sm flex items-center gap-2 mb-4 hover:opacity-70" style={{ color: '#888888' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FontAwesomeIcon icon={faShoppingCart} />
              Order Details
            </h1>
            <p className="mt-2" style={{ color: '#888888' }}>
              View and manage order information
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {order.status === 'delivered' && (
              <button
                onClick={handleSendInvoice}
                className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center gap-2"
                style={{ backgroundColor: '#2A7F8A' }}>
                <FontAwesomeIcon icon={faFileInvoice} />
                Send Invoice
              </button>
            )}
            <button
              onClick={() => setShowStatusUpdate(!showStatusUpdate)}
              className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#E84E0F' }}>
              <FontAwesomeIcon icon={faEdit} />
              Update Status
            </button>
          </div>
        </div>
      </div>

      {/* Status Update Panel */}
      {showStatusUpdate && (
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h3 className="text-lg font-bold text-white mb-4">Update Order Status</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className="px-6 py-3 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#2A7F8A' }}>
              {updating ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Save Status'
              )}
            </button>
            <button
              onClick={() => setShowStatusUpdate(false)}
              className="px-6 py-3 rounded-lg font-semibold transition"
              style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Order Info Section */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <h2 className="text-xl font-bold text-white mb-6">Order Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order ID */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2" style={{ color: '#888888' }}>Order ID</p>
            <p className="text-xl font-bold text-white">{order.order_number}</p>
          </div>

          {/* Order Date */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2 flex items-center gap-2" style={{ color: '#888888' }}>
              <FontAwesomeIcon icon={faCalendar} />
              Order Date
            </p>
            <p className="text-xl font-bold text-white">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Status */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2" style={{ color: '#888888' }}>Status</p>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}>
              <FontAwesomeIcon icon={getStatusIcon(order.status)} />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Payment Method */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2" style={{ color: '#888888' }}>Payment Method</p>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ backgroundColor: `${getPaymentMethodColor(order.payment_method)}20`, color: getPaymentMethodColor(order.payment_method) }}>
              <FontAwesomeIcon icon={getPaymentMethodIcon(order.payment_method)} />
              {getPaymentMethodLabel(order.payment_method)}
            </span>
          </div>
        </div>

        {/* Items — full product breakdown, falling back to a plain count
            if order_items is unexpectedly empty (e.g. a legacy order). */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-white mb-4">Order Items</h3>
          {order.order_items && order.order_items.length > 0 ? (
            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg p-4 flex items-center justify-between gap-3"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faBox} style={{ color: '#888888' }} />
                    <div>
                      <p className="text-white font-semibold">{item.product_name}</p>
                      <p className="text-sm" style={{ color: '#888888' }}>
                        Qty {item.quantity} × Rs. {item.unit_price.toLocaleString()}
                        {item.discount_id && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#E84E0F20', color: '#E84E0F' }}>
                            Deal
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-white font-bold">Rs. {item.line_total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg p-4 flex items-center gap-3" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
              <FontAwesomeIcon icon={faBox} style={{ color: '#888888' }} />
              <p className="text-white font-semibold">{order.items_count} item{order.items_count === 1 ? '' : 's'} in this order</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Section */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} />
          Customer Information
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2" style={{ color: '#888888' }}>Name</p>
            <p className="text-lg font-semibold text-white">{order.customer_name}</p>
          </div>

          {/* Contact Number */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2 flex items-center gap-2" style={{ color: '#888888' }}>
              <FontAwesomeIcon icon={faPhone} />
              Contact Number
            </p>
            <p className="text-lg font-semibold text-white">{order.customer_phone || 'Not provided'}</p>
          </div>

          {/* Delivery Address */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2 flex items-center gap-2" style={{ color: '#888888' }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Delivery Address
            </p>
            <p className="text-lg font-semibold text-white">
              {order.payment_method === 'pickup' ? 'Self Pickup — no delivery address' : (order.delivery_address || 'Not provided')}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faCreditCard} />
          Payment Information
        </h2>

        <div className="space-y-4">
          {/* Price Breakdown */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span style={{ color: '#888888' }}>Subtotal</span>
                <span className="text-white font-semibold">
                  {order.subtotal != null ? `Rs. ${Number(order.subtotal).toLocaleString()}` : '—'}
                </span>
              </div>

              <div className="flex justify-between items-center gap-4">
                <span style={{ color: '#888888' }}>Delivery Fee</span>
                {editingFee ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={feeInput}
                      onChange={(e) => setFeeInput(e.target.value)}
                      className="w-28 px-3 py-1.5 rounded-lg text-white text-right focus:outline-none focus:ring-2"
                      style={{ backgroundColor: '#111111', border: '1px solid #333333' }}
                      autoFocus
                    />
                    <button
                      onClick={handleDeliveryFeeSave}
                      disabled={savingFee}
                      className="px-3 py-1.5 rounded-lg text-white text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: '#2A7F8A' }}>
                      <FontAwesomeIcon icon={savingFee ? faSpinner : faSave} className={savingFee ? 'animate-spin' : ''} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingFee(false);
                        setFeeInput(order.delivery_fee != null ? String(order.delivery_fee) : '');
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition"
                      style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingFee(true)}
                    className="text-white font-semibold flex items-center gap-2 hover:opacity-80 transition"
                    title="Click to edit delivery fee">
                    {order.delivery_fee != null ? `Rs. ${Number(order.delivery_fee).toLocaleString()}` : 'Not set'}
                    <FontAwesomeIcon icon={faEdit} className="text-xs" style={{ color: '#888888' }} />
                  </button>
                )}
              </div>

              <div className="border-t pt-3" style={{ borderColor: '#333333' }}>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-bold" style={{ color: '#E84E0F' }}>
                    Rs. {Number(order.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}