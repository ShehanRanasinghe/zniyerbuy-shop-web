'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTags, faEye } from '@fortawesome/free-solid-svg-icons';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
          Welcome back!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Total Products
              </p>
              <p className="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
              <FontAwesomeIcon icon={faBox} className="text-2xl" style={{ color: '#E84E0F' }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Active Deals
              </p>
              <p className="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4F5' }}>
              <FontAwesomeIcon icon={faTags} className="text-2xl" style={{ color: '#2A7F8A' }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Total Views
              </p>
              <p className="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
              <FontAwesomeIcon icon={faEye} className="text-2xl" style={{ color: '#E84E0F' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
