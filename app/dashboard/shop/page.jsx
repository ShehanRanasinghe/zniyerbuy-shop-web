'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStore, faUser, faEnvelope, faPhone, faMapMarkerAlt, 
  faClock, faFileAlt, faSave, faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';

export default function ShopPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    shopName: 'Pramo Shop',
    ownerName: 'Pramodya Karunathilake',
    email: 'pramodyakarunathilake@gmail.com',
    phone: '0701911306',
    address: '28 Upper Dickson Rd, Galle 80000, Sri Lanka',
    openTime: '08:00',
    closeTime: '18:00',
    description:
      'We provide quality products with fast delivery and excellent customer service.',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faStore} />
          Shop Profile
        </h1>

        <p className="text-sm sm:text-base mt-2" style={{ color: '#888888' }}>
          Manage your store information and settings
        </p>
      </div>

      {success && (
        <div className="bg-green-900 border border-green-700 text-green-200 p-4 rounded-xl flex items-center gap-3">
          <FontAwesomeIcon icon={faCheckCircle} />
          Shop profile updated successfully.
        </div>
      )}

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2 rounded-2xl p-6 sm:p-8 shadow-sm" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
              <FontAwesomeIcon icon={faStore} className="text-4xl sm:text-6xl" style={{ color: '#E84E0F' }} />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {form.shopName}
              </h2>

              <p className="mt-2" style={{ color: '#888888' }}>
                {form.ownerName} • Shop Owner
              </p>

              <div className="mt-5">
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: '#888888' }}>
                    Profile Completion
                  </span>

                  <span className="font-semibold" style={{ color: '#E84E0F' }}>
                    75%
                  </span>
                </div>

                <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#222222' }}>
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ width: '75%', backgroundColor: '#E84E0F' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
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
              <p className="font-medium text-white text-sm break-all">{form.email}</p>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: '#1A1A1A' }}>
              <p className="text-xs flex items-center gap-2 mb-1" style={{ color: '#888888' }}>
                <FontAwesomeIcon icon={faPhone} />
                Phone
              </p>
              <p className="font-medium text-white text-sm">{form.phone}</p>
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: '#1A1A1A' }}>
              <p className="text-xs flex items-center gap-2 mb-1" style={{ color: '#888888' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                Location
              </p>
              <p className="font-medium text-white text-sm">{form.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl p-6 sm:p-8 shadow-sm" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
          Store Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faStore} />
                Shop Name
              </label>

              <input
                type="text"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} />
                Owner Name
              </label>

              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              />
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
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} />
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              Store Address
            </label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} />
                Opening Time
              </label>

              <input
                type="time"
                name="openTime"
                value={form.openTime}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} />
                Closing Time
              </label>

              <input
                type="time"
                name="closeTime"
                value={form.closeTime}
                onChange={handleChange}
                className="w-full p-4 rounded-xl text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
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
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              className="px-6 sm:px-8 py-4 rounded-xl font-semibold transition hover:opacity-80"
              style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 sm:px-8 py-4 rounded-xl text-white font-semibold transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#E84E0F' }}>
              <FontAwesomeIcon icon={faSave} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
