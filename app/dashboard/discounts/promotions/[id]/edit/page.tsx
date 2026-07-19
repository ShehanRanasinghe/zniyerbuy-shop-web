'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercentage, faSave, faArrowLeft, faSpinner, faSearch, faCalendar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { productAPI, dealAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import axios from 'axios';

const OCCASION_TYPES = [
  'New Year',
  'Valentine\'s Day',
  'Easter',
  'Mother\'s Day',
  'Father\'s Day',
  'Independence Day',
  'Halloween',
  'Black Friday',
  'Cyber Monday',
  'Christmas',
  'Seasonal Sale',
  'Flash Sale',
  'Clearance',
  'Grand Opening',
  'Anniversary',
  'Other'
];

interface Product {
  id: string;
  shop_id?: string;
  shops?: {
    id?: string;
  };
  name: string;
  price: number;
  image_url?: string;
  category: string;
}

export default function EditPromotionPage() {
  const router = useRouter();
  const params = useParams();
  const promotionId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    occasion_type: '',
    product_id: '',
    shop_id: '',
    price: '',
    discount_percentage: '',
    discounted_price: '',
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
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!promotionId) {
      toast.error('Invalid promotion ID');
      router.push('/dashboard/discounts');
      return;
    }

    const fetchPromotion = async () => {
      setLoading(true);
      try {
        const response = await dealAPI.getDeal(promotionId);
        if (response.data.success) {
          const promo = response.data.data;

          setFormData({
            title: promo.title || '',
            occasion_type: promo.occasion_type || '',
            product_id: promo.product_id || '',
            shop_id: promo.shop_id || promo.shops?.id || '',
            price: promo.price != null ? String(promo.price) : '',
            discount_percentage: promo.discount_percentage != null ? String(promo.discount_percentage) : '',
            discounted_price: promo.discounted_price != null ? String(promo.discounted_price) : '',
            start_date: toDateInputValue(promo.start_date),
            end_date: toDateInputValue(promo.end_date),
          });

          // Pre-fill the selected product summary if we have a product_id
          if (promo.product_id) {
            try {
              const productResponse = await productAPI.getProduct(promo.product_id);
              if (productResponse.data.success) {
                setSelectedProduct(productResponse.data.data);
              }
            } catch (productError) {
              console.error('Error loading linked product:', productError);
            }
          }
        } else {
          toast.error('Unable to load promotion details');
          router.push('/dashboard/discounts');
        }
      } catch (error) {
        console.error('Error loading promotion:', error);
        toast.error('Failed to load promotion details');
        router.push('/dashboard/discounts');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [promotionId, router]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts({});
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Recalculate discounted price whenever original price or discount % changes
  useEffect(() => {
    if (formData.price && formData.discount_percentage) {
      const original = parseFloat(formData.price);
      const discount = parseFloat(formData.discount_percentage);
      const discounted = original - (original * discount / 100);
      setFormData(prev => ({
        ...prev,
        discounted_price: discounted.toFixed(2)
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.price, formData.discount_percentage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setFormData(prev => ({
      ...prev,
      product_id: product.id,
      shop_id: product.shop_id || product.shops?.id || '',
      price: product.price.toString()
    }));
    setShowProductSearch(false);
    setSearchQuery('');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.occasion_type || !formData.product_id || !formData.discount_percentage || !formData.start_date || !formData.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    let resolvedShopId = selectedProduct?.shop_id || selectedProduct?.shops?.id || formData.shop_id;
    if (!resolvedShopId && selectedProduct) {
      const productResponse = await productAPI.getProduct(selectedProduct.id);
      if (productResponse.data?.success && productResponse.data?.data) {
        resolvedShopId = productResponse.data.data.shop_id || productResponse.data.data.shops?.id || resolvedShopId;
      }
    }

    if (!resolvedShopId) {
      toast.error('Unable to resolve shop for the selected product');
      return;
    }

    try {
      setSaving(true);

      const promotionData = {
        title: formData.title,
        description: `${formData.occasion_type} promotion`,
        discount_type: 'percentage',
        discount_percentage: parseFloat(formData.discount_percentage),
        price: parseFloat(formData.price) || null,
        discounted_price: formData.discounted_price ? parseFloat(formData.discounted_price) : null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        product_id: formData.product_id,
        shop_id: resolvedShopId,
        occasion_type: formData.occasion_type,
      };

      const response = await dealAPI.updateDeal(promotionId, promotionData);

      if (response.data.success) {
        toast.success('Promotion updated successfully!');
        router.push('/dashboard/discounts');
      }
    } catch (error) {
      console.error('Error updating promotion:', error);
      const message =
        (axios.isAxiosError(error) && error.response?.data?.error) ||
        (axios.isAxiosError(error) && error.response?.data?.errors?.[0]?.msg) ||
        'Failed to update promotion';
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
          <FontAwesomeIcon icon={faPercentage} />
          Edit Promotion
        </h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
          Update this promotional offer
        </p>
      </div>

      <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Promotion Info Section */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <h2 className="text-xl font-bold text-white mb-6">Promotion Details</h2>

            <div className="space-y-6">
              {/* Promotion Title */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Promotion Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#111111', border: '1px solid #333333' }}
                  placeholder="e.g., Summer Sale 2024"
                  required
                />
              </div>

              {/* Occasion/Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Occasion/Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="occasion_type"
                  value={formData.occasion_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#111111', border: '1px solid #333333' }}
                  required>
                  <option value="">Select occasion type</option>
                  {OCCASION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Product <span className="text-red-500">*</span>
                </label>

                {selectedProduct ? (
                  <div className="rounded-lg p-4 flex items-center justify-between" style={{ backgroundColor: '#111111', border: '1px solid #333333' }}>
                    <div className="flex items-center gap-3">
                      {selectedProduct.image_url && (
                        <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-12 h-12 rounded object-cover" />
                      )}
                      <div>
                        <p className="text-white font-medium">{selectedProduct.name}</p>
                        <p className="text-sm" style={{ color: '#888888' }}>Rs. {selectedProduct.price}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(null);
                        setFormData(prev => ({ ...prev, product_id: '', price: '' }));
                      }}
                      className="px-3 py-1 rounded text-sm"
                      style={{ backgroundColor: '#F44336', color: 'white' }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowProductSearch(!showProductSearch)}
                      className="w-full px-4 py-3 rounded-lg text-left flex items-center justify-between"
                      style={{ backgroundColor: '#111111', border: '1px solid #333333', color: '#888888' }}>
                      <span>Search and select a product</span>
                      <FontAwesomeIcon icon={faSearch} />
                    </button>

                    {showProductSearch && (
                      <div className="mt-2 rounded-lg" style={{ backgroundColor: '#111111', border: '1px solid #333333' }}>
                        <div className="p-3 border-b" style={{ borderColor: '#333333' }}>
                          <div className="relative">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#888888' }} />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search products..."
                              className="w-full pl-10 pr-4 py-2 rounded-lg text-white focus:outline-none"
                              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                              <button
                                key={product.id}
                                type="button"
                                onClick={() => handleProductSelect(product)}
                                className="w-full p-3 flex items-center gap-3 hover:bg-opacity-80 transition text-left"
                                style={{ backgroundColor: '#1A1A1A' }}>
                                {product.image_url && (
                                  <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" />
                                )}
                                <div className="flex-1">
                                  <p className="text-white font-medium">{product.name}</p>
                                  <p className="text-sm" style={{ color: '#888888' }}>Rs. {product.price}</p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <p className="p-4 text-center" style={{ color: '#888888' }}>No products found</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <h2 className="text-xl font-bold text-white mb-6">Pricing</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Original Price (Rs.)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none"
                    style={{ backgroundColor: '#111111', border: '1px solid #333333', opacity: 0.7 }}
                    placeholder="Auto-filled from product"
                  />
                  <p className="text-xs mt-1" style={{ color: '#666666' }}>
                    Automatically filled when product is selected
                  </p>
                </div>

                {/* Discount Percentage */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Discount (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#111111', border: '1px solid #333333' }}
                    placeholder="e.g., 10, 15, 20"
                    required
                  />
                </div>
              </div>

              {/* Discounted Price */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Discounted Price (Rs.)
                </label>
                <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#111111', border: '1px solid #333333' }}>
                  <p className="text-2xl font-bold" style={{ color: '#E84E0F' }}>
                    Rs. {formData.discounted_price || '0.00'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#666666' }}>
                    Calculated automatically based on discount percentage
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Period Section */}
          <div className="rounded-xl p-6" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <h2 className="text-xl font-bold text-white mb-6">Time Period</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#111111', border: '1px solid #333333' }}
                    required
                  />
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    style={{ color: '#888888' }}
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#111111', border: '1px solid #333333' }}
                    required
                  />
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    style={{ color: '#888888' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/dashboard/discounts"
              className="px-6 py-3 rounded-xl font-semibold transition text-center"
              style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
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