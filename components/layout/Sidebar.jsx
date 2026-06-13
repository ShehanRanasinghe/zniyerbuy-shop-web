'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faStore, faBox, faTags, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: faChartLine },
  { label: 'Shop', href: '/dashboard/shop', icon: faStore },
  { label: 'Products', href: '/dashboard/products', icon: faBox },
  { label: 'Deals', href: '/dashboard/deals', icon: faTags },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('shopId');
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-black border-r border-[#222] z-50 hidden lg:flex">
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
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 ${
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

      <div className="p-4 border-t border-[#222]">
        <button 
          onClick={handleLogout}
          className="w-full bg-[#111] text-white rounded-2xl py-4 hover:bg-[#161616] transition flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
