// Dashboard Layout — Wraps all /dashboard/* pages with the Sidebar navigation
// The main content area has left margin on large screens to account for fixed sidebar

import Sidebar from '@/components/layout/Sidebar';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      {/* Fixed sidebar navigation */}
      <Sidebar />

      {/* Toast notification provider for the dashboard */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#FFFFFF',
            border: '1px solid #333333',
          },
        }}
      />

      {/* Main content — offset by sidebar width on large screens */}
      <main className="lg:ml-64 min-h-screen p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
