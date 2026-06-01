export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1" style={{ color: "#888888" }}>
          Welcome back!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Total Products
              </p>
              <p className="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <span className="text-4xl">📦</span>
          </div>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Active Deals
              </p>
              <p className="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <span className="text-4xl">🏷️</span>
          </div>
        </div>

        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Total Views
              </p>
              <p className="text-3xl font-bold text-white mt-1">0</p>
            </div>
            <span className="text-4xl">👁️</span>
          </div>
        </div>
      </div>
    </div>
  );
}