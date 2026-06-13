'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function DealsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faTags} />
            Deals
          </h1>
          <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
            Manage your promotional deals
          </p>
        </div>
        <Link
          href="/dashboard/deals/new"
          className="px-4 sm:px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: '#E84E0F' }}>
          <FontAwesomeIcon icon={faPlus} />
          <span className="hidden sm:inline">Add Deal</span>
        </Link>
      </div>

      <div className="text-center py-20">
        <FontAwesomeIcon icon={faTags} className="text-6xl mb-4" style={{ color: '#333333' }} />
        <p className="text-xl" style={{ color: '#888888' }}>No deals yet</p>
        <p className="mt-2" style={{ color: '#666666' }}>Create your first deal to get started</p>
      </div>
    </div>
  );
}
