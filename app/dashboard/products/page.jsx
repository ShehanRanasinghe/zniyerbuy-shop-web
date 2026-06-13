'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faPlus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faBox} />
            Products
          </h1>
          <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
            Manage your product inventory
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-4 sm:px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: '#E84E0F' }}>
          <FontAwesomeIcon icon={faPlus} />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>

      <div className="text-center py-20">
        <FontAwesomeIcon icon={faBox} className="text-6xl mb-4" style={{ color: '#333333' }} />
        <p className="text-xl" style={{ color: '#888888' }}>No products yet</p>
        <p className="mt-2" style={{ color: '#666666' }}>Add your first product to get started</p>
      </div>
    </div>
  );
}
