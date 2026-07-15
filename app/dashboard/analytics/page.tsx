'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSpinner, faEye, faHeart, faStar, faShoppingCart, faDollarSign, faBox, faBan, faUsers, faMapMarkerAlt, faArrowTrendUp, faRobot } from '@fortawesome/free-solid-svg-icons';
import { analyticsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
  totalShops: number;
  totalProducts: number;
  totalDeals: number;
  totalReviews: number;
}

interface Performance {
  totalViews: number;
  totalFavorites: number;
  averageRating: number;
  totalRecommendationScore: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalShops: 0,
    totalProducts: 0,
    totalDeals: 0,
    totalReviews: 0,
  });
  const [performance, setPerformance] = useState<Performance>({
    totalViews: 0,
    totalFavorites: 0,
    averageRating: 0,
    totalRecommendationScore: 0,
  });

  // Mock revenue data
  const revenueData = {
    totalRevenue: 125450,
    totalSales: 342,
    cancelledOrders: 18,
    cancelledRevenue: 8750,
  };

  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 18 },
    { name: 'Wed', sales: 5000, orders: 32 },
    { name: 'Thu', sales: 2780, orders: 15 },
    { name: 'Fri', sales: 6890, orders: 42 },
    { name: 'Sat', sales: 8390, orders: 55 },
    { name: 'Sun', sales: 7490, orders: 48 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Food', value: 200 },
    { name: 'Home', value: 100 },
  ];

  // AI Predictions Mock Data
  const nextMonthPredictions = {
    predictedRevenue: 145800,
    predictedDailyRevenue: 4850,
    predictedUsers: 1250,
    topCategory: 'Electronics',
    topCategorySales: 520,
  };

  const dailyRevenuePrediction = [
    { day: 'Day 1-5', revenue: 22500 },
    { day: 'Day 6-10', revenue: 24800 },
    { day: 'Day 11-15', revenue: 26200 },
    { day: 'Day 16-20', revenue: 28500 },
    { day: 'Day 21-25', revenue: 25300 },
    { day: 'Day 26-30', revenue: 18500 },
  ];

  const categoryPrediction = [
    { name: 'Electronics', predicted: 520, current: 400 },
    { name: 'Fashion', predicted: 380, current: 300 },
    { name: 'Food', predicted: 280, current: 200 },
    { name: 'Home', predicted: 150, current: 100 },
  ];

  const userLocationData = [
    { location: 'Colombo', users: 450, percentage: 36 },
    { location: 'Kandy', users: 280, percentage: 22 },
    { location: 'Galle', users: 220, percentage: 18 },
    { location: 'Negombo', users: 180, percentage: 14 },
    { location: 'Others', users: 120, percentage: 10 },
  ];

  const COLORS = ['#E84E0F', '#2A7F8A', '#FF9800', '#4CAF50', '#9C27B0'];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, performanceRes] = await Promise.all([
        analyticsAPI.getSellerStats(),
        analyticsAPI.getSellerPerformance(),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (performanceRes.data.success) {
        setPerformance(performanceRes.data.stats);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin" style={{ color: '#E84E0F' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon icon={faChartLine} />
          Analytics Dashboard
        </h1>
        <p className="mt-2" style={{ color: '#888888' }}>
          Track your shop performance and insights
        </p>
      </div>

      <>
          {/* Revenue Summary */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <h2 className="text-xl font-bold text-white mb-6">Revenue Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#888888" }}>Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">Rs. {revenueData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
                <FontAwesomeIcon icon={faDollarSign} className="text-2xl" style={{ color: '#E84E0F' }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#888888" }}>Total Sales</p>
                <p className="text-3xl font-bold text-white mt-1">{revenueData.totalSales}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4F5' }}>
                <FontAwesomeIcon icon={faShoppingCart} className="text-2xl" style={{ color: '#2A7F8A' }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#888888" }}>Cancelled Orders</p>
                <p className="text-3xl font-bold text-white mt-1">{revenueData.cancelledOrders}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFE8E8' }}>
                <FontAwesomeIcon icon={faBan} className="text-2xl" style={{ color: '#E84E0F' }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#888888" }}>Cancelled Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">Rs. {revenueData.cancelledRevenue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF3E0' }}>
                <FontAwesomeIcon icon={faDollarSign} className="text-2xl" style={{ color: '#FF9800' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-xl font-bold text-white mb-6">Weekly Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', borderRadius: '8px' }}
                labelStyle={{ color: '#FFFFFF' }}
              />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#E84E0F" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#2A7F8A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-xl font-bold text-white mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Predictions Section */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "2px solid #E84E0F" }}>
        <div className="flex items-center gap-3 mb-6">
          <FontAwesomeIcon icon={faRobot} className="text-2xl" style={{ color: '#E84E0F' }} />
          <h2 className="text-xl font-bold text-white">AI-Powered Predictions for Next Month</h2>
        </div>
        
        {/* Prediction Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon icon={faArrowTrendUp} style={{ color: '#4CAF50' }} />
              <p className="text-sm" style={{ color: "#888888" }}>Predicted Revenue</p>
            </div>
            <p className="text-2xl font-bold text-white">Rs. {nextMonthPredictions.predictedRevenue.toLocaleString()}</p>
            <p className="text-xs mt-1" style={{ color: '#4CAF50' }}>+16.2% from this month</p>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon icon={faDollarSign} style={{ color: '#2A7F8A' }} />
              <p className="text-sm" style={{ color: "#888888" }}>Daily Revenue</p>
            </div>
            <p className="text-2xl font-bold text-white">Rs. {nextMonthPredictions.predictedDailyRevenue.toLocaleString()}</p>
            <p className="text-xs mt-1" style={{ color: '#888888' }}>Average per day</p>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon icon={faUsers} style={{ color: '#FF9800' }} />
              <p className="text-sm" style={{ color: "#888888" }}>Expected Users</p>
            </div>
            <p className="text-2xl font-bold text-white">{nextMonthPredictions.predictedUsers.toLocaleString()}</p>
            <p className="text-xs mt-1" style={{ color: '#FF9800' }}>+12.5% increase</p>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center gap-3 mb-2">
              <FontAwesomeIcon icon={faBox} style={{ color: '#E84E0F' }} />
              <p className="text-sm" style={{ color: "#888888" }}>Top Category</p>
            </div>
            <p className="text-2xl font-bold text-white">{nextMonthPredictions.topCategory}</p>
            <p className="text-xs mt-1" style={{ color: '#888888' }}>{nextMonthPredictions.topCategorySales} predicted sales</p>
          </div>
        </div>

        {/* Prediction Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue Prediction */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <h3 className="text-lg font-bold text-white mb-4">Daily Revenue Forecast</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dailyRevenuePrediction}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E84E0F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E84E0F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis dataKey="day" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', borderRadius: '8px' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E84E0F" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Sales Prediction */}
          <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <h3 className="text-lg font-bold text-white mb-4">Category Sales Prediction</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryPrediction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', borderRadius: '8px' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Legend />
                <Bar dataKey="current" fill="#888888" name="Current Month" />
                <Bar dataKey="predicted" fill="#E84E0F" name="Predicted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      </>
    </div>
  );
}
