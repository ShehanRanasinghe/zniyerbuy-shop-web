'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/products" className="text-sm flex items-center gap-2 mb-4 hover:opacity-70" style={{ color: '#888888' }}>
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
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Product Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="e.g., Premium Coffee Beans"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 resize-none"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="Describe your product..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Price (LKR)</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Stock Quantity</label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard/products"
              className="px-6 py-3 rounded-xl font-semibold transition"
              style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#E84E0F' }}>
              <FontAwesomeIcon icon={faSave} />
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
