// New Product Page — Allows shop owners to add a new product to their shop
// Form inputs are fully typed and validated
// Employs single-line comments for clarity

'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faSave, faArrowLeft, faSpinner, faUpload, faLink } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

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
  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url');
  const [imagePreview, setImagePreview] = useState<string>('');
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

  useEffect(() => {
    // Update image preview when URL changes
    if (formData.image_url) {
      setImagePreview(formData.image_url);
    }
  }, [formData.image_url]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          image_url: result
        }));
      };
      reader.readAsDataURL(file);
    }
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">Product Image</label>
            
            {/* Toggle between Upload and URL */}
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setImageInputType('upload')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  imageInputType === 'upload' 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
                style={{ 
                  backgroundColor: imageInputType === 'upload' ? '#E84E0F' : '#1A1A1A',
                  border: '1px solid #333333'
                }}
              >
                <FontAwesomeIcon icon={faUpload} />
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageInputType('url')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  imageInputType === 'url' 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}
                style={{ 
                  backgroundColor: imageInputType === 'url' ? '#E84E0F' : '#1A1A1A',
                  border: '1px solid #333333'
                }}
              >
                <FontAwesomeIcon icon={faLink} />
                URL
              </button>
            </div>

            {/* Image Input */}
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

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm mb-2" style={{ color: '#888888' }}>Preview:</p>
                <div className="relative w-32 h-32 rounded-lg overflow-hidden" style={{ border: '1px solid #333333' }}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Info Section */}
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
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing and Stock Section */}
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
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                    style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                    required>
                    {UNITS.map(unit => (
                      <option key={unit.value} value={unit.value}>{unit.label}</option>
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
