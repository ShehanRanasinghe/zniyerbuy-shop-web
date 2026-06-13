import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      <main className="lg:ml-64 min-h-screen p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
