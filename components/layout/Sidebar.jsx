'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Shop', href: '/shop', icon: '🏪' },
  { label: 'Products', href: '/products', icon: '📦' },
  { label: 'Deals', href: '/deals', icon: '🏷️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div
      className="h-screen w-64 flex flex-col fixed left-0 top-0"
      style={{ backgroundColor: '#0A0A0A', borderRight: '1px solid #222222' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center py-8" style={{ borderBottom: '1px solid #222222' }}>
        <h1 className="text-2xl font-extrabold tracking-wide">
          <span style={{ color: '#E84E0F' }}>ZNIYER</span>
          <span style={{ color: '#2A7F8A' }}> BuY</span>
        </h1>
        <p className="text-xs mt-1" style={{ color: '#4A4A4A' }}>
          Shop Manager
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition"
              style={{
                backgroundColor: isActive ? '#E84E0F' : 'transparent',
                color: isActive ? '#ffffff' : '#888888',
              }}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t" style={{ borderColor: '#222222' }}>
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full transition hover:opacity-80"
          style={{ backgroundColor: '#111111' }}
        >
          <span className="text-xl">🚪</span>
          <span className="text-white">Logout</span>
        </button>
      </div>
    </div>
  );
}