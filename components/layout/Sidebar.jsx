'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Shop', href: '/dashboard/shop', icon: '🏪' },
  { label: 'Products', href: '/dashboard/products', icon: '📦' },
  { label: 'Deals', href: '/dashboard/deals', icon: '🏷️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-black border-r border-[#222]"
    >
      <div className="flex flex-col items-center py-8 border-b border-[#222]">
        <h1 className="text-3xl font-extrabold">
          <span className="text-[#E84E0F]">ZNIYER</span>
          <span className="text-[#2A7F8A]"> BuY</span>
        </h1>

        <p className="text-sm mt-2 text-gray-500">
          Shop Manager
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all ${
                isActive
                  ? 'bg-[#E84E0F] text-white'
                  : 'text-gray-400 hover:bg-[#161616]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#222]">
        <button className="w-full bg-[#111] text-white rounded-2xl py-4">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}