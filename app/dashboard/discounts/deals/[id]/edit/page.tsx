// Edit Deal Page — Same condition-based form as Create Deal, but pre-filled
// with the existing deal's data (fetched from Supabase via GET /api/v1/deals/:id)
// and submitting a PATCH instead of a POST.

'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faSave, faArrowLeft, faSpinner, faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditDealPage() {
  const router = useRouter();
  const params = useParams();
  const dealId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    start_date: '',
    end_date: '',
  });

  // Format an ISO date string from the API into the yyyy-MM-dd shape
  // required by <input type="date">
  const toDateInputValue = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!dealId) {
      toast.error('Invalid deal ID');
      router.push('/dashboard/discounts');
      return;
    }

    const fetchDeal = async () => {
      setLoading(true);
      try {
        const response = await dealAPI.getDeal(dealId);
        if (response.data.success) {
          const deal = response.data.data;
          const shopId = deal.shop_id || deal.shops?.id || '';

          setFormData({
            shop_id: shopId,
            product_id: deal.product_id || '',
            title: deal.title || '',
            description: deal.description || '',
            image_url: deal.image_url || '',
            start_date: toDateInputValue(deal.start_date),
            end_date: toDateInputValue(deal.end_date),
          });

          if (deal.product_id) {
            try {
              const productResponse = await productAPI.getProduct(deal.product_id);
              if (productResponse.data.success) {
                setSearchTerm(productResponse.data.data.name || '');
              }
            } catch (productError) {
              console.error('Error loading linked product:', productError);
            }
          }

          if (shopId) {
            loadProducts(shopId);
          }
        } else {
          toast.error('Unable to load deal details');
          router.push('/dashboard/discounts');
        }
      } catch (error) {
        console.error('Error loading deal:', error);
        toast.error('Failed to load deal details');
        router.push('/dashboard/discounts');
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [dealId, router]);

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
      image_url: product.image_url || prev.image_url,
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

    const todayStr = new Date().toISOString().split('T')[0];
    if (formData.start_date < todayStr) {
      toast.error('Start date cannot be in the past');
      return;
    }
    if (formData.end_date < formData.start_date) {
      toast.error('End date cannot be before the start date');
      return;
    }

    try {
      setSaving(true);

      const dealData = {
        shop_id: formData.shop_id,
        product_id: formData.product_id,
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
      };

      const response = await dealAPI.updateDeal(dealId, dealData);

      if (response.data.success) {
        toast.success('Deal updated successfully!');
        router.push('/dashboard/discounts');
      }
    } catch (error) {
      console.error('Error updating deal:', error);
      const message =
        (axios.isAxiosError(error) && error.response?.data?.error) ||
        (axios.isAxiosError(error) && error.response?.data?.errors?.[0]?.msg) ||
        'Failed to update deal';
      toast.error(message);
    } finally {
      setSaving(false);
    }
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
      <div className="mb-8">
        <Link href="/dashboard/discounts" className="text-sm flex items-center gap-2 mb-4 hover:opacity-70" style={{ color: '#888888' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Discounts
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faTags} />
          Edit Deal
        </h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
          Update this deal&apos;s condition, product, or dates
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                    required
                  />
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
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                    required
                  />
                </div>
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
              disabled={saving}
              className="px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: '#E84E0F' }}>
              <FontAwesomeIcon icon={saving ? faSpinner : faSave} className={saving ? 'animate-spin' : ''} />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}