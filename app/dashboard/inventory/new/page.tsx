// New Product Page — Allows shop owners to add a new product to their shop
// Form inputs are fully typed and validated
// Employs single-line comments for clarity

'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faSave, faArrowLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Food & Beverages',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Automotive',
  'Other'
];

interface FormData {
  shop_id: string;
  name: string;
  description: string;
  original_price: string;
  current_price: string;
  unit: string;
  stock_quantity: string;
  image_url: string;
  category: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    shop_id: '',
    name: '',
    description: '',
    original_price: '',
    current_price: '',
    unit: 'piece',
    stock_quantity: '',
    image_url: '',
    category: '',
  });

  useEffect(() => {
    // Automatically retrieve and populate shop ID if available
    const savedShopId = localStorage.getItem('shopId');
    if (savedShopId) {
      setFormData(prev => ({
        ...prev,
        shop_id: savedShopId
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shop_id) {
      toast.error('Please select or specify a shop');
      return;
    }

    if (!formData.name || !formData.original_price || !formData.stock_quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const productData = {
        ...formData,
        original_price: parseFloat(formData.original_price),
        current_price: formData.current_price ? parseFloat(formData.current_price) : parseFloat(formData.original_price),
        stock_quantity: parseInt(formData.stock_quantity),
      };

      const response = await productAPI.createProduct(productData);

      if (response.data.success) {
        toast.success('Product created successfully!');
        router.push('/dashboard/inventory');
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/inventory" className="text-sm flex items-center gap-2 mb-4 hover:opacity-70" style={{ color: '#888888' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Products
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faBox} />
          Add New Product
        </h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
          Add a new product to your inventory
        </p>
      </div>

      <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <p className="text-xs mt-1" style={{ color: '#666666' }}>
              You can find your shop ID in the Shop Settings page
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="e.g., Premium Coffee Beans"
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
              placeholder="Describe your product..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                required>
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
                <option value="piece">Piece</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="l">Liter (l)</option>
                <option value="ml">Milliliter (ml)</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Current Price (LKR)
              </label>
              <input
                type="number"
                name="current_price"
                value={formData.current_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="Leave empty to use original price"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="0"
              required
            />
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
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard/inventory"
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
              {loading ? 'Creating...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
