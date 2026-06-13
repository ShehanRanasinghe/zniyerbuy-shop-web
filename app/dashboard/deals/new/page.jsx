'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function NewDealPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/deals" className="text-sm flex items-center gap-2 mb-4 hover:opacity-70" style={{ color: '#888888' }}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Deals
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faTags} />
          Create New Deal
        </h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
          Add a new promotional deal
        </p>
      </div>

      <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Deal Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="e.g., Summer Sale 50% Off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 resize-none"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              placeholder="Describe your deal..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Start Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">End Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard/deals"
              className="px-6 py-3 rounded-xl font-semibold transition"
              style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#E84E0F' }}>
              <FontAwesomeIcon icon={faSave} />
              Create Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
