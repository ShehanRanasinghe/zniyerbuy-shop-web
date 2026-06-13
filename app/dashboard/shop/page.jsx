'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStore, faUser, faEnvelope, faPhone, faMapMarkerAlt, 
  faClock, faFileAlt, faSave, faCheckCircle, faSpinner 
} from '@fortawesome/free-solid-svg-icons';
import { shopAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shopId, setShopId] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'other',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    logo_url: '',
    cover_image_url: '',
  });

  useEffect(() => {
    // Try to load shop ID from localStorage
    const savedShopId = localStorage.getItem('shopId');
    if (savedShopId) {
      setShopId(savedShopId);
      fetchShopData(savedShopId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchShopData = async (id) => {
    try {
      setLoading(true);
      const response = await shopAPI.getShop(id);
      if (response.data.success) {
        const shop = response.data.data;
        setForm({
          name: shop.name || '',
          description: shop.description || '',
          category: shop.category || 'other',
          address: shop.address || '',
          city: shop.city || '',
          latitude: shop.latitude || '',
          longitude: shop.longitude || '',
          phone: shop.phone || '',
          email: shop.email || '',
          logo_url: shop.logo_url || '',
          cover_image_url: shop.cover_image_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
      toast.error('Failed to load shop data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      let response;
      if (shopId) {
        // Update existing shop
        response = await shopAPI.updateShop(shopId, form);
      } else {
        // Create new shop
        response = await shopAPI.createShop(form);
        if (response.data.success) {
          const newShopId = response.data.data.id;
          setShopId(newShopId);
          localStorage.setItem('shopId', newShopId);
        }
      }

      if (response.data.success) {
        setSuccess(true);
        toast.success(shopId ? 'Shop updated successfully!' : 'Shop created successfully!');
        
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving shop:', error);
      toast.error(error.response?.data?.error || 'Failed to save shop');
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

  const profileCompletion = () => {
    const fields = ['name', 'description', 'address', 'city', 'phone', 'email'];
    const filled = fields.filter(field => form[field]).length;
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faStore} />
          Shop Profile
        </h1>
        <p className="text-sm sm:text-base mt-2" style={{ color: '#888888' }}>
          Manage your store information and settings
        </p>
        {shopId && (
          <p className="text-xs mt-1" style={{ color: '#666666' }}>
            Shop ID: {shopId}
          </p>
        )}
      </div>

      {success && (
        <div className="bg-green-900 border border-green-700 text-green-200 p-4 rounded-xl flex items-center gap-3">
          <FontAwesomeIcon icon={faCheckCircle} />
          Shop profile {shopId ? 'updated' : 'created'} successfully.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6 sm:p-8 shadow-sm" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
              {form.logo_url ? (
                <img src={form.logo_url} alt="Shop Logo" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <FontAwesomeIcon icon={faStore} className="text-4xl sm:text-6xl" style={{ color: '#E84E0F' }} />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {form.name || 'Your Shop Name'}
              </h2>
              <p className="mt-2" style={{ color: '#888888' }}>
                {form.category} • Shop Owner
              </p>

              <div className="mt-5">
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: '#888888' }}>
                    Profile Completion
                  </span>
                  <span className="font-semibold" style={{ color: '#E84E0F' }}>
                    {profileCompletion()}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#222222' }}>
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ width: `${profileCompletion()}%`, backgroundColor: '#E84E0F' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6">
            Quick Info
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#1A1A1A' }}>
              <p className="text-xs flex items-center gap-2 mb-1" style={{ color: '#888888' }}>
                <FontAwesomeIcon icon={faEnvelope} />
                Email
              </p>
              <p className="font-medium text-white text-sm break-all">{form.email || 'Not set'}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#1A1A1A' }}>
              <p className="text-xs flex items-center gap-2 mb-1" style={{ color: '#888888' }}>
                <FontAwesomeIcon icon={faPhone} />
                Phone
              </p>
              <p className="font-medium text-white text-sm">{form.phone || 'Not set'}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#1A1A1A' }}>
              <p className="text-xs flex items-center gap-2 mb-1" style={{ color: '#888888' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                Location
              </p>
              <p className="font-medium text-white text-sm">{form.city || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 sm:p-8 shadow-sm" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
          Store Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faStore} />
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="Enter shop name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white flex items-center gap-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
                <option value="food">Food & Beverages</option>
                <option value="fashion">Fashion</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home & Garden</option>
                <option value="health">Health & Beauty</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="shop@example.com"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="0701234567"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Store Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 font-medium text-white">City</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="Colombo"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                step="any"
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="6.9271"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                step="any"
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="79.8612"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} />
              Shop Description
            </label>
            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition resize-none"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="Describe your shop..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-white">Logo URL</label>
              <input
                type="url"
                name="logo_url"
                value={form.logo_url}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="https://example.com/logo.jpg"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-white">Cover Image URL</label>
              <input
                type="url"
                name="cover_image_url"
                value={form.cover_image_url}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="https://example.com/cover.jpg"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 sm:px-8 py-4 rounded-xl font-semibold transition hover:opacity-80"
              style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
              Reset
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 sm:px-8 py-4 rounded-xl text-white font-semibold transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#E84E0F' }}>
              <FontAwesomeIcon icon={saving ? faSpinner : faSave} className={saving ? 'animate-spin' : ''} />
              {saving ? 'Saving...' : (shopId ? 'Save Changes' : 'Create Shop')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
