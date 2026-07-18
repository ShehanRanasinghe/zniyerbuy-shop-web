// Edit Product Page — Loads existing product data and allows shop owners to update it
// Form inputs are fully typed and validated
// Employs single-line comments for clarity

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faSave, faArrowLeft, faSpinner, faUpload, faLink } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Fashion & Clothing',
  'Electronics',
  'Home & Living',
  'Grocery & Food',
  'Health & Beauty',
  'Sports & Outdoors',
  'Automotive',
  'Books & Stationery',
  'Toys & Baby',
  'Pet Supplies',
  'Hardware & Tools',
  'Office & Business',
  'Agriculture',
  'Gifts & Crafts',
  'Other'
];

const UNITS = [
  { value: 'pcs', label: 'Piece (pcs)' },
  { value: 'pair', label: 'Pair (pair)' },
  { value: 'set', label: 'Set (set)' },
  { value: 'pack', label: 'Pack (pack)' },
  { value: 'box', label: 'Box (box)' },
  { value: 'carton', label: 'Carton (carton)' },
  { value: 'bundle', label: 'Bundle (bundle)' },
  { value: 'dozen', label: 'Dozen (dozen)' },
  { value: 'roll', label: 'Roll (roll)' },
  { value: 'sheet', label: 'Sheet (sheet)' },
  { value: 'bottle', label: 'Bottle (bottle)' },
  { value: 'can', label: 'Can (can)' },
  { value: 'jar', label: 'Jar (jar)' },
  { value: 'tin', label: 'Tin (tin)' },
  { value: 'bag', label: 'Bag (bag)' },
  { value: 'sack', label: 'Sack (sack)' },
  { value: 'pouch', label: 'Pouch (pouch)' },
  { value: 'packet', label: 'Packet (packet)' },
  { value: 'tube', label: 'Tube (tube)' },
  { value: 'tablet', label: 'Tablet (tablet)' },
  { value: 'capsule', label: 'Capsule (capsule)' },
  { value: 'egg', label: 'Egg (egg)' },
  { value: 'tray', label: 'Tray (tray)' },
  { value: 'bunch', label: 'Bunch (bunch)' },
  { value: 'loaf', label: 'Loaf (loaf)' },
  { value: 'mg', label: 'Milligram (mg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 't', label: 'Metric Ton (t)' },
  { value: 'mL', label: 'Milliliter (mL)' },
  { value: 'L', label: 'Liter (L)' },
  { value: 'm³', label: 'Cubic Meter (m³)' },
  { value: 'mm', label: 'Millimeter (mm)' },
  { value: 'cm', label: 'Centimeter (cm)' },
  { value: 'm', label: 'Meter (m)' },
  { value: 'km', label: 'Kilometer (km)' },
  { value: 'in', label: 'Inch (in)' },
  { value: 'ft', label: 'Foot (ft)' },
  { value: 'yd', label: 'Yard (yd)' },
  { value: 'cm²', label: 'Square Centimeter (cm²)' },
  { value: 'm²', label: 'Square Meter (m²)' },
  { value: 'ft²', label: 'Square Foot (ft²)' },
  { value: 'yd²', label: 'Square Yard (yd²)' },
  { value: 'drum', label: 'Drum (drum)' },
  { value: 'barrel', label: 'Barrel (barrel)' },
  { value: 'coil', label: 'Coil (coil)' },
  { value: 'kit', label: 'Kit (kit)' },
];

interface FormData {
  shop_id: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  stock_quantity: string;
  image_url: string;
  category: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    shop_id: '',
    name: '',
    description: '',
    price: '',
    unit: 'pcs',
    stock_quantity: '',
    image_url: '',
    category: '',
  });

  useEffect(() => {
    const savedShopId = localStorage.getItem('shopId');
    if (savedShopId) {
      setFormData((prev) => ({ ...prev, shop_id: savedShopId }));
    }
  }, []);

  useEffect(() => {
    if (!productId) {
      toast.error('Invalid product ID');
      router.push('/dashboard/inventory');
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getProduct(productId);
        if (response.data.success) {
          const product = response.data.data;
          setFormData({
            shop_id: product.shop_id || localStorage.getItem('shopId') || '',
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            unit: product.unit || 'pcs',
            stock_quantity: product.stock_quantity?.toString() || '',
            image_url: product.image_url || '',
            category: product.category || '',
          });
          setImagePreview(product.image_url || '');
        } else {
          toast.error('Unable to load product details');
          router.push('/dashboard/inventory');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Failed to load product details');
        router.push('/dashboard/inventory');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  useEffect(() => {
    if (formData.image_url) {
      setImagePreview(formData.image_url);
    }
  }, [formData.image_url]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, image_url: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shop_id) {
      toast.error('Please select or specify a shop');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.name || !formData.price || !formData.stock_quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity, 10),
      };

      const response = await productAPI.updateProduct(productId, productData);
      if (response.data.success) {
        toast.success('Product updated successfully!');
        router.push('/dashboard/inventory');
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error?.response?.data?.error || 'Failed to update product');
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
        <Link href="/dashboard/inventory" className="text-sm flex items-center gap-2 mb-4 hover:opacity-70" style={{ color: '#888888' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Products
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faBox} />
          Edit Product
        </h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: '#888888' }}>
          Update your product details and pricing
        </p>
      </div>

      <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-3 text-white">Product Image</label>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setImageInputType('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  imageInputType === 'upload' ? 'text-white' : 'text-gray-400'
                }`}
                style={{
                  backgroundColor: imageInputType === 'upload' ? '#E84E0F' : '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                <FontAwesomeIcon icon={faUpload} />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageInputType('url')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  imageInputType === 'url' ? 'text-white' : 'text-gray-400'
                }`}
                style={{
                  backgroundColor: imageInputType === 'url' ? '#E84E0F' : '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                <FontAwesomeIcon icon={faLink} />
                URL
              </button>
            </div>

            {imageInputType === 'upload' ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                />
                <p className="text-xs mt-1" style={{ color: '#666666' }}>
                  Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>
            ) : (
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="https://example.com/image.jpg"
              />
            )}

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm mb-2" style={{ color: '#888888' }}>Preview:</p>
                <div className="relative w-32 h-32 rounded-lg overflow-hidden" style={{ border: '1px solid #333333' }}>
                  <img src={imagePreview} alt="Product preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4 pb-2" style={{ borderBottom: '1px solid #333333' }}>
              Product Info Section
            </h2>
            <div className="space-y-6">
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
                <label className="block text-sm font-medium mb-2 text-white">Product Description</label>
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
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4 pb-2" style={{ borderBottom: '1px solid #333333' }}>
              Pricing and Stock Section
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
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
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                    required>
                    {UNITS.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
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
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#E84E0F' }}>
              {saving ? (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faSave} />
              )}
              Save Changes
            </button>
            <Link
              href="/dashboard/inventory"
              className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid #333333' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
