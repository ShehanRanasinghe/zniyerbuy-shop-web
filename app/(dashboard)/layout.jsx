import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  return (
<<<<<<< HEAD
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A1628' }}>
=======
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
>>>>>>> 8c74eae (feat: add sidebar and dashboard pages)
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}