"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [orders] = useState([
    { id: "ORD001", product: "Ceylon Black Tea Premium", qty: 5, price: "₨2,500", date: "Today", status: "Processing" },
    { id: "ORD002", product: "Pure Coconut Oil", qty: 3, price: "₨1,800", date: "Yesterday", status: "Shipped" },
    { id: "ORD003", product: "Cinnamon Sticks Bundle", qty: 2, price: "₨950", date: "2 days ago", status: "Delivered" },
    { id: "ORD004", product: "Sri Lankan Jaggery", qty: 4, price: "₨3,200", date: "3 days ago", status: "Delivered" },
    { id: "ORD005", product: "Hand-woven Batik Fabric", qty: 1, price: "₨4,500", date: "4 days ago", status: "Delivered" },
  ]);

  const [products] = useState([
    { name: "Ceylon Black Tea Premium", price: "₨2,500", sales: 248, icon: "🍵", category: "Beverages", rating: 4.8 },
    { name: "Pure Coconut Oil", price: "₨1,800", sales: 312, icon: "🥥", category: "Oils", rating: 4.9 },
    { name: "Cinnamon Sticks Bundle", price: "₨950", sales: 456, icon: "✨", category: "Spices", rating: 4.7 },
    { name: "Sri Lankan Jaggery", price: "₨3,200", sales: 189, icon: "🟤", category: "Sweeteners", rating: 4.6 },
    { name: "Cardamom Pods (100g)", price: "₨1,200", sales: 134, icon: "🌱", category: "Spices", rating: 4.8 },
    { name: "Hand-woven Batik Fabric", price: "₨4,500", sales: 87, icon: "🎨", category: "Textiles", rating: 4.9 },
  ]);

  const stats = [
    { label: "Total Revenue", value: "₨428,950", change: "+12.5%", icon: "💰", color: "from-orange-500" },
    { label: "Total Orders", value: "1,248", change: "+8.3%", icon: "📦", color: "from-orange-400" },
    { label: "Active Products", value: "156", change: "+15.2%", icon: "🛍️", color: "from-orange-600" },
    { label: "Pending Delivery", value: "23", change: "-2.1%", icon: "🚚", color: "from-orange-500" },
  ];

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh" }} className="p-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back! 👋</h1>
        <p style={{ color: "#888888" }} className="text-lg">
          Here's what's happening with your ZNIYERBUY store today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-lg p-6 overflow-hidden relative"
            style={{
              backgroundColor: "#111111",
              border: "1px solid #222222",
              background: `linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, transparent 100%), #111111`,
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p style={{ color: "#888888" }} className="text-sm font-medium">
                  {stat.label}
                </p>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p style={{ color: "#22c55e" }} className="text-sm font-medium">
                {stat.change} from last month
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Products */}
        <div className="lg:col-span-2">
          <div className="rounded-lg p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                🏆 Top Selling Products
              </h2>
              <p style={{ color: "#888888" }} className="text-sm mt-1">
                Your bestsellers this month
              </p>
            </div>

            <div className="space-y-4">
              {products.map((product, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg flex items-center justify-between hover:opacity-80 transition"
                  style={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #1a1a1a",
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-3xl">{product.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{product.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span style={{ color: "#888888" }} className="text-xs">
                          {product.category}
                        </span>
                        <span style={{ color: "#fbbf24" }} className="text-xs font-medium">
                          ⭐ {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{product.price}</p>
                    <p style={{ color: "#22c55e" }} className="text-xs font-medium mt-1">
                      {product.sales} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats & Summary */}
        <div className="space-y-6">
          {/* Sales Summary */}
          <div className="rounded-lg p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              📊 Sales Summary
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <p style={{ color: "#888888" }} className="text-sm">
                    Today
                  </p>
                  <p className="text-white font-semibold">₨12,450</p>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: "#1a1a1a",
                    background: `linear-gradient(90deg, #ff6b35 70%, #1a1a1a 70%)`,
                  }}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <p style={{ color: "#888888" }} className="text-sm">
                    This Week
                  </p>
                  <p className="text-white font-semibold">₨84,320</p>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: "#1a1a1a",
                    background: `linear-gradient(90deg, #ff6b35 85%, #1a1a1a 85%)`,
                  }}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <p style={{ color: "#888888" }} className="text-sm">
                    This Month
                  </p>
                  <p className="text-white font-semibold">₨428,950</p>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{
                    backgroundColor: "#1a1a1a",
                    background: `linear-gradient(90deg, #ff6b35 100%, #1a1a1a 100%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              ⚡ Performance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p style={{ color: "#888888" }} className="text-sm">
                  Conversion Rate
                </p>
                <p className="text-white font-bold">3.24%</p>
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: "#888888" }} className="text-sm">
                  Avg Order Value
                </p>
                <p className="text-white font-bold">₨3,450</p>
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: "#888888" }} className="text-sm">
                  Customer Satisfaction
                </p>
                <p style={{ color: "#22c55e" }} className="text-white font-bold">
                  4.7⭐
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: "#888888" }} className="text-sm">
                  Return Rate
                </p>
                <p style={{ color: "#ff6b35" }} className="text-white font-bold">
                  1.2%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8 rounded-lg p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📦 Recent Orders
          </h2>
          <p style={{ color: "#888888" }} className="text-sm mt-1">
            Latest customer orders from your store
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #222222" }}>
                <th style={{ color: "#888888" }} className="text-left py-3 px-4 font-semibold">
                  Order ID
                </th>
                <th style={{ color: "#888888" }} className="text-left py-3 px-4 font-semibold">
                  Product
                </th>
                <th style={{ color: "#888888" }} className="text-left py-3 px-4 font-semibold">
                  Qty
                </th>
                <th style={{ color: "#888888" }} className="text-left py-3 px-4 font-semibold">
                  Amount
                </th>
                <th style={{ color: "#888888" }} className="text-left py-3 px-4 font-semibold">
                  Date
                </th>
                <th style={{ color: "#888888" }} className="text-left py-3 px-4 font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #1a1a1a" }} className="hover:bg-opacity-50 hover:bg-slate-900 transition">
                  <td style={{ color: "#ff6b35" }} className="py-3 px-4 font-semibold">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-white">{order.product}</td>
                  <td className="py-3 px-4 text-white text-center">{order.qty}</td>
                  <td className="py-3 px-4 text-white font-semibold">{order.price}</td>
                  <td style={{ color: "#888888" }} className="py-3 px-4">
                    {order.date}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          order.status === "Delivered"
                            ? "rgba(34, 197, 94, 0.2)"
                            : order.status === "Shipped"
                              ? "rgba(59, 130, 246, 0.2)"
                              : "rgba(245, 158, 11, 0.2)",
                        color:
                          order.status === "Delivered"
                            ? "#22c55e"
                            : order.status === "Shipped"
                              ? "#3b82f6"
                              : "#f59e0b",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}