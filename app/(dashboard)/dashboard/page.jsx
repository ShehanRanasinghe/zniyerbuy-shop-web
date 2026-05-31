export default function DashboardPage() {
  return (
    <div>
<<<<<<< HEAD
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1" style={{ color: '#8899AA' }}>Welcome back!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="rounded-xl p-6" style={{ backgroundColor: '#132333' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#8899AA' }}>Total Products</p>
=======
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1" style={{ color: '#888888' }}>Welcome back!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="rounded-xl p-6" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#888888' }}>Total Products</p>
>>>>>>> 8c74eae (feat: add sidebar and dashboard pages)
              <p className="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <span className="text-4xl">📦</span>
          </div>
        </div>

<<<<<<< HEAD
        <div className="rounded-xl p-6" style={{ backgroundColor: '#132333' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#8899AA' }}>Active Deals</p>
=======
        <div className="rounded-xl p-6" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#888888' }}>Active Deals</p>
>>>>>>> 8c74eae (feat: add sidebar and dashboard pages)
              <p className="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <span className="text-4xl">🏷️</span>
          </div>
        </div>

<<<<<<< HEAD
        <div className="rounded-xl p-6" style={{ backgroundColor: '#132333' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#8899AA' }}>Total Views</p>
=======
        <div className="rounded-xl p-6" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#888888' }}>Total Views</p>
>>>>>>> 8c74eae (feat: add sidebar and dashboard pages)
              <p className="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <span className="text-4xl">👁️</span>
          </div>
        </div>

      </div>
    </div>
  );
}