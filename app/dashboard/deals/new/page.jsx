'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faSave, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dealAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shop_id: '',
    product_id: '',
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    original_price: '',
    deal_price: '',
    image_url: '',
    start_date: '',
    end_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate deal price when discount changes
    if ((name === 'discount_value' || name === 'original_price' || name === 'discount_type') && formData.original_price) {
      calculateDealPrice({
        ...formData,
        [name]: value
      });
    }
  };

  const calculateDealPrice = (data) => {
    const originalPrice = parseFloat(data.original_price);
    const discountValue = parseFloat(data.discount_value);

    if (!originalPrice || !discountValue) return;

    let dealPrice;
    if (data.discount_type === 'percentage') {
      dealPrice = originalPrice - (originalPrice * discountValue / 100);
    } else {
      dealPrice = originalPrice - discountValue;
    }

    setFormData(prev => ({
      ...prev,
      deal_price: dealPrice.toFixed(2)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.shop_id || !formData.title || !formData.discount_value || !formData.original_price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      toast.error('Please select start and end dates');
      return;
    }

    try {
      setLoading(true);
      const dealData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        original_price: parseFloat(formData.original_price),
        deal_price: parseFloat(formData.deal_price),
      };

      const response = await dealAPI.createDeal(dealData);
      
      if (response.data.success) {
        toast.success('Deal created successfully!');
        router.push('/dashboard/deals');
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error(error.response?.data?.error || 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/deals" className="text-sm flex items-center gap-2 mb-4 hover:opacity-70" style={{ color: '#888888' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Deals
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faTags} />
          Create New Deal
        </h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
          Add a new promotional deal
        </p>
      </div>

      <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Shop ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="shop_id"
                value={formData.shop_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="Enter your shop ID"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Product ID (Optional)</label>
              <input
                type="text"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="Link to a specific product"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Deal Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="e.g., Summer Sale 50% Off"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 resize-none"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="Describe your deal..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                required>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (LKR)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="discount_value"
                value={formData.discount_value}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Original Price (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Deal Price (LKR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="deal_price"
              value={formData.deal_price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="Auto-calculated"
              required
            />
            <p className="text-xs mt-1" style={{ color: '#666666' }}>
              This is automatically calculated based on discount
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="https://example.com/deal-image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard/deals"
              className="px-6 py-3 rounded-xl font-semibold transition"
              style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: '#E84E0F' }}>
              <FontAwesomeIcon icon={loading ? faSpinner : faSave} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Creating...' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
