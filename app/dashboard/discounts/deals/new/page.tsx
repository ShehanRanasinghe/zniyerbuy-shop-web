// New Deal Page — Allows shop owners to create a promotional deal
// Deals are condition-based offers (e.g. "Buy 1 Get 1 Free", "Buy 2 Get 1 at 50% off")
// rather than a flat price discount like Promotions. The exact condition varies per
// deal, so it's captured as free text (Title + Description) instead of a rigid
// template — this keeps the form flexible for whatever offer the shop owner is running.
// Category-based deals (vs. single product) are a planned future addition.

'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faSave, faArrowLeft, faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dealAPI, productAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

interface FormData {
  shop_id: string;
  product_id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
}

export default function NewDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    shop_id: '',
    product_id: '',
    title: '',
    description: '',
    image_url: '',
    start_date: new Date().toISOString().split('T')[0], // Auto-set to today
    end_date: '',
  });

  useEffect(() => {
    // Automatically retrieve and populate shop ID if available
    const savedShopId = localStorage.getItem('shopId');
    if (savedShopId) {
      setFormData(prev => ({
        ...prev,
        shop_id: savedShopId
      }));
      // Load products for this shop
      loadProducts(savedShopId);
    }
  }, []);

  const loadProducts = async (shopId: string) => {
    try {
      setLoadingProducts(true);
      const response = await productAPI.getProducts({ shop_id: shopId });
      if (response.data.success) {
        setProducts(response.data.data || []);
        setFilteredProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSearch = (value: string) => {
    setSearchTerm(value);
    setShowDropdown(true);
    if (value.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductSelect = (product: Product) => {
    setFormData(prev => ({
      ...prev,
      product_id: product.id,
      image_url: product.image_url || '',
    }));
    setSearchTerm(product.name);
    setShowDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shop_id || !formData.title || !formData.description || !formData.product_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      toast.error('Please select start and end dates');
      return;
    }

    try {
      setLoading(true);

      // Deals are condition-based (e.g. BOGO), not a price discount, so no
      // discount_type/discount_value/price fields are sent — the condition
      // lives in title/description. discount_kind defaults to 'deal' on the
      // backend whenever occasion_type is absent.
      const dealData = {
        shop_id: formData.shop_id,
        product_id: formData.product_id,
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
      };

      const response = await dealAPI.createDeal(dealData);

      if (response.data.success) {
        toast.success('Deal created successfully!');
        router.push('/dashboard/discounts');
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      const message =
        (axios.isAxiosError(error) && error.response?.data?.error) ||
        (axios.isAxiosError(error) && error.response?.data?.errors?.[0]?.msg) ||
        'Failed to create deal';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/discounts" className="text-sm flex items-center gap-2 mb-4 hover:opacity-70" style={{ color: '#888888' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Discounts
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faTags} />
          Create New Deal
        </h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
          Add a condition-based deal, e.g. &quot;Buy 1 Get 1 Free&quot; or &quot;Buy 2 Get 1 at 50% Off&quot;
        </p>
      </div>

      <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Deal Info Section */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 pb-2" style={{ borderBottom: '1px solid #333333' }}>
              Deal Info
            </h2>

            <div className="space-y-6">
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
                  placeholder="e.g., Buy 1 Get 1 Free"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Deal Condition <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 resize-none"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                  placeholder="Describe the deal condition in your own words, e.g. 'Buy 1 Get 1 Free' or 'Buy 2, get the 3rd at 50% off'"
                  required
                />
                <p className="text-xs mt-1" style={{ color: '#666666' }}>
                  Deals vary by condition, so describe it freely rather than picking from a fixed template
                </p>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-white">
                  Deal Product <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleProductSearch(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full px-4 py-3 pr-10 rounded-lg text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                    placeholder="Search and select a product..."
                    required={!formData.product_id}
                  />
                  <FontAwesomeIcon
                    icon={loadingProducts ? faSpinner : faSearch}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${loadingProducts ? 'animate-spin' : ''}`}
                    style={{ color: '#666666' }}
                  />
                </div>

                {showDropdown && filteredProducts.length > 0 && (
                  <div
                    className="absolute z-10 w-full mt-2 rounded-lg overflow-hidden shadow-lg max-h-60 overflow-y-auto"
                    style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                  >
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className="px-4 py-3 cursor-pointer hover:bg-opacity-80 transition flex items-center gap-3"
                        style={{ backgroundColor: '#1A1A1A' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#222222'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A1A1A'}
                      >
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-white text-sm">{product.name}</p>
                          <p className="text-xs" style={{ color: '#888888' }}>
                            LKR {product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showDropdown && filteredProducts.length === 0 && searchTerm && (
                  <div
                    className="absolute z-10 w-full mt-2 rounded-lg p-4 text-center"
                    style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                  >
                    <p className="text-sm" style={{ color: '#888888' }}>No products found</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Valid Until <span className="text-red-500">*</span>
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
                <p className="text-xs mt-1" style={{ color: '#666666' }}>
                  Start date is automatically set to today ({formData.start_date})
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard/discounts"
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