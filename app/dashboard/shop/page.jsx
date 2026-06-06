'use client';

import { useState } from 'react';

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
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#1A1A2E]">
          Shop Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your store information and settings
        </p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-2xl">
          Shop profile updated successfully.
        </div>
      )}

      {/* Top Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-3xl bg-[#FEF0EB] flex items-center justify-center text-6xl">
              🏪
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#1A1A2E]">
                {form.shopName}
              </h2>

              <p className="text-gray-500 mt-2">
                {form.ownerName} • Shop Owner
              </p>

              <div className="mt-5">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    Profile Completion
                  </span>

                  <span className="font-semibold text-[#E84E0F]">
                    75%
                  </span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-3 rounded-full bg-[#E84E0F]"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-[#1A1A2E] mb-6">
            Quick Info
          </h3>

          <div className="space-y-4">
            <div className="bg-[#F8FAFC] p-4 rounded-2xl">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{form.email}</p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium">{form.phone}</p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl">
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-medium">{form.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-8">
          Store Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">
                Shop Name
              </label>

              <input
                type="text"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Owner Name
              </label>

              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Store Address
            </label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 bg-[#F8FAFC]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">
                Opening Time
              </label>

              <input
                type="time"
                name="openTime"
                value={form.openTime}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Closing Time
              </label>

              <input
                type="time"
                name="closeTime"
                value={form.closeTime}
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-gray-200 bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Shop Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-gray-200 bg-[#F8FAFC] resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="px-8 py-4 rounded-2xl border border-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-[#E84E0F] text-white font-semibold"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}