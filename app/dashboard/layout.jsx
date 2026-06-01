import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      {children}
    </div>
  );
}