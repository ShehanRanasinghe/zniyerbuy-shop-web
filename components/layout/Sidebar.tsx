// Sidebar — Fixed left navigation panel for the dashboard
// Shows menu items for all dashboard sections and handles logout via Firebase
// Hidden on mobile (lg:flex), menu items highlight the active route

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faWarehouse,
  faShoppingCart,
  faUser,
  faSignOutAlt,
  faTag,
  faTags,
  faBoxOpen,
  faPercentage,
  faComments,
  faMapMarkedAlt,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

// Navigation menu items — each maps to a dashboard route
const menuItems: { label: string; href: string; icon: IconDefinition }[] = [
  { label: 'Dashboard', href: '/dashboard', icon: faChartLine },
  { label: 'Add Product', href: '/dashboard/inventory/new', icon: faBoxOpen },
  { label: 'Inventory', href: '/dashboard/inventory', icon: faWarehouse },
  { label: 'Add Promotions', href: '/dashboard/discounts/promotions/new', icon: faTag },
  { label: 'Add Deals', href: '/dashboard/discounts/deals/new', icon: faTags },
  { label: 'Discounts', href: '/dashboard/discounts', icon: faPercentage },
  { label: 'Orders', href: '/dashboard/orders', icon: faShoppingCart },
  { label: 'Reviews', href: '/dashboard/reviews', icon: faComments },
  { label: 'Analytics', href: '/dashboard/analytics', icon: faChartLine },
  { label: 'Profile', href: '/dashboard/profile', icon: faUser },
  { label: 'Store Location', href: '/dashboard/map', icon: faMapMarkedAlt },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Sign out from Firebase and clear local storage, then redirect to login
  const handleLogout = async () => {
    try {
      await signOut(auth!);
      localStorage.removeItem('token');
      localStorage.removeItem('shopId');
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-black border-r border-[#222] z-50 hidden lg:flex">
      {/* Brand logo and app name */}
      <div className="flex flex-col items-center py-5 border-b border-[#222]">
        <div className="w-full flex justify-center">
          <img src="/logo.png" alt="ZNIYER BuY" className="h-15 w-24" />
        </div>
        <h1 className="text-3xl font-extrabold">
          <span className="text-[#E84E0F]">ZNIYER</span>
          <span className="text-[#2A7F8A]"> BuY</span>
        </h1>
        <p className="text-sm mt-2 text-gray-500">Shop Manager</p>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          // Exact match for dashboard root, prefix match for sub-pages
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#E84E0F] text-white shadow-lg'
                  : 'text-gray-400 hover:bg-[#161616] hover:text-white'
              }`}>
              <FontAwesomeIcon icon={item.icon} className="text-lg" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-[#222]">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-[#111] text-white rounded-2xl py-4 hover:bg-[#161616] transition flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout confirmation pop-up */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-2xl p-6 w-full max-w-sm" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
            <h3 className="text-lg font-bold text-white mb-2">Log out?</h3>
            <p className="text-sm mb-6" style={{ color: '#888888' }}>
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition"
                style={{ backgroundColor: '#1A1A1A', color: '#888888', border: '1px solid #333333' }}>
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#E84E0F' }}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
