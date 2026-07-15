'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, faSpinner, faArrowLeft, faBox, faUser, 
  faCreditCard, faMapMarkerAlt, faPhone, faCalendar, 
  faCheckCircle, faClock, faTruck, faTimesCircle, faEdit 
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  delivery_type: 'delivery' | 'pickup';
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items: OrderItem[];
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockOrder: Order = {
          id: orderId,
          order_number: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          customer_name: 'John Doe',
          customer_phone: '+94 77 123 4567',
          delivery_address: '123 Main Street, Colombo 07, Sri Lanka',
          payment_method: 'Cash on Delivery',
          delivery_type: 'delivery',
          subtotal: 4500,
          delivery_fee: 500,
          total_amount: 5000,
          status: 'pending',
          created_at: new Date().toISOString(),
          items: [
            {
              id: '1',
              product_name: 'Premium Coffee Beans',
              quantity: 2,
              price: 1500,
              image_url: 'https://via.placeholder.com/100',
            },
            {
              id: '2',
              product_name: 'Organic Tea Leaves',
              quantity: 1,
              price: 1500,
              image_url: 'https://via.placeholder.com/100',
            },
          ],
        };
        setOrder(mockOrder);
        setNewStatus(mockOrder.status);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order?.status) {
      toast.error('Please select a different status');
      return;
    }

    try {
      setUpdating(true);
      // API call to update status would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (order) {
        setOrder({ ...order, status: newStatus as any });
        toast.success('Order status updated successfully');
        setShowStatusUpdate(false);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
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
          <button
            onClick={() => setShowStatusUpdate(!showStatusUpdate)}
            className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: '#E84E0F' }}>
            <FontAwesomeIcon icon={faEdit} />
            Update Status
          </button>
        </div>
      </div>

      {/* Status Update Section */}
      {showStatusUpdate && (
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-xl font-bold text-white mb-4">Update Order Status</h2>
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

          {/* Delivery Type */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2" style={{ color: '#888888' }}>Delivery Type</p>
            <p className="text-xl font-bold text-white">
              {order.delivery_type === 'delivery' ? '🚚 Home Delivery' : '🏪 Self Pickup'}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-white mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg p-4 flex items-center gap-4"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-white font-semibold">{item.product_name}</p>
                  <p className="text-sm" style={{ color: '#888888' }}>
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: '#888888' }}>Price</p>
                  <p className="text-lg font-bold" style={{ color: '#E84E0F' }}>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
            <p className="text-lg font-semibold text-white">{order.customer_phone}</p>
          </div>

          {/* Delivery Address */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2 flex items-center gap-2" style={{ color: '#888888' }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Delivery Address
            </p>
            <p className="text-lg font-semibold text-white">{order.delivery_address}</p>
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
          {/* Payment Method */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2" style={{ color: '#888888' }}>Payment Method</p>
            <p className="text-lg font-semibold text-white">{order.payment_method}</p>
          </div>

          {/* Price Breakdown */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span style={{ color: '#888888' }}>Subtotal</span>
                <span className="text-white font-semibold">Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#888888' }}>Delivery Fee</span>
                <span className="text-white font-semibold">
                  {order.delivery_type === 'pickup' ? 'Free' : `Rs. ${order.delivery_fee.toLocaleString()}`}
                </span>
              </div>
              <div className="border-t pt-3" style={{ borderColor: '#333333' }}>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-bold" style={{ color: '#E84E0F' }}>
                    Rs. {order.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Type Badge */}
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <p className="text-sm mb-2" style={{ color: '#888888' }}>Fulfillment Method</p>
            <span
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold"
              style={{ 
                backgroundColor: order.delivery_type === 'delivery' ? '#2A7F8A20' : '#E84E0F20',
                color: order.delivery_type === 'delivery' ? '#2A7F8A' : '#E84E0F'
              }}>
              {order.delivery_type === 'delivery' ? (
                <>
                  <FontAwesomeIcon icon={faTruck} />
                  Home Delivery
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faBox} />
                  Self Pickup
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
