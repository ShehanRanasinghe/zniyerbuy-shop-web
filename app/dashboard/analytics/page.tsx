'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSpinner, faEye, faHeart, faStar, faShoppingCart, faDollarSign, faBox, faBan, faUsers, faMapMarkerAlt, faArrowTrendUp, faRobot } from '@fortawesome/free-solid-svg-icons';
import { analyticsAPI, ordersAPI, productAPI, aiAPI } from '@/lib/api';
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

// Shape returned by GET /api/v1/ai/predictions/shop/:shopId
// (proxies zniyerbuy-ai-module's /predictions/shop/{shop_id})
interface DailyForecastPoint {
  day: string;
  date: string;
  revenue: number;
}

interface CategoryPredictionPoint {
  name: string;
  current: number;
  predicted: number;
}

interface Predictions {
  status: 'ok' | 'no_data';
  message?: string;
  predicted_revenue: number | null;
  predicted_revenue_growth_pct: number | null;
  predicted_daily_revenue: number | null;
  expected_users: number | null;
  expected_users_growth_pct: number | null;
  top_category: string | null;
  top_category_predicted_sales: number | null;
  daily_revenue_forecast: DailyForecastPoint[];
  category_sales_prediction: CategoryPredictionPoint[];
}

// The dashboard groups the AI module's 30 daily points into 5-day buckets
// ("Day 1-5" ... "Day 26-30") for the forecast chart.
function bucketDailyForecast(forecast: DailyForecastPoint[]) {
  const buckets: { day: string; revenue: number }[] = [];
  for (let i = 0; i < forecast.length; i += 5) {
    const slice = forecast.slice(i, i + 5);
    if (slice.length === 0) continue;
    const avg = slice.reduce((sum, p) => sum + p.revenue, 0) / slice.length;
    buckets.push({
      day: `Day ${i + 1}-${Math.min(i + 5, forecast.length)}`,
      revenue: Math.round(avg),
    });
  }
  return buckets;
}

function formatGrowth(pct: number | null | undefined): string | null {
  if (pct == null) return null;
  return `${pct > 0 ? '+' : ''}${pct}%`;
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

  // Real revenue/sales data, computed from actual orders (see fetchAnalytics)
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalSales: 0,
    cancelledOrders: 0,
    cancelledRevenue: 0,
  });

  // Real weekly sales trend, computed from actual orders over the last 7 days
  const [salesData, setSalesData] = useState<{ name: string; sales: number; orders: number }[]>([]);

  // Real product distribution by category (there's no per-order line-item
  // data in this schema yet, so this reflects the shop's product catalog
  // by category rather than fabricated sales-by-category numbers)
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);

  // AI-Powered Predictions — live from zniyerbuy-ai-module via
  // GET /api/v1/ai/predictions/shop/:shopId (computed from this shop's
  // real orders + products, not mock data).
  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [predictionsLoading, setPredictionsLoading] = useState(true);
  const [predictionsError, setPredictionsError] = useState<string | null>(null);

  const COLORS = ['#E84E0F', '#2A7F8A', '#FF9800', '#4CAF50', '#9C27B0'];

  useEffect(() => {
    fetchAnalytics();
    fetchPredictions();
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

      // Real revenue summary + weekly sales trend, computed from actual orders
      try {
        const ordersRes = await ordersAPI.getOrders({});
        if (ordersRes.data.success) {
          const orders: { total_amount: number; status: string; created_at: string }[] = ordersRes.data.data || [];

          const nonCancelled = orders.filter(o => o.status !== 'cancelled');
          const cancelled = orders.filter(o => o.status === 'cancelled');

          setRevenueData({
            totalRevenue: nonCancelled.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0),
            totalSales: nonCancelled.length,
            cancelledOrders: cancelled.length,
            cancelledRevenue: cancelled.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0),
          });

          // Weekly sales trend: last 7 days, including today
          const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const days: { name: string; sales: number; orders: number; dateKey: string }[] = [];
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push({
              name: dayLabels[d.getDay()],
              sales: 0,
              orders: 0,
              dateKey: d.toISOString().split('T')[0],
            });
          }

          nonCancelled.forEach(order => {
            const orderDateKey = new Date(order.created_at).toISOString().split('T')[0];
            const dayEntry = days.find(d => d.dateKey === orderDateKey);
            if (dayEntry) {
              dayEntry.sales += Number(order.total_amount) || 0;
              dayEntry.orders += 1;
            }
          });

          setSalesData(days.map(({ name, sales, orders }) => ({ name, sales, orders })));
        }
      } catch (ordersError) {
        console.error('Error fetching orders for analytics:', ordersError);
      }

      // Real product distribution by category (no per-order line-item data
      // exists yet, so this is the shop's catalog breakdown by category,
      // not sales-by-category)
      try {
        const shopId = localStorage.getItem('shopId');
        const productsRes = await productAPI.getProducts(shopId ? { shop_id: shopId } : {});
        if (productsRes.data.success) {
          const products: { category: string }[] = productsRes.data.data || [];
          const counts: Record<string, number> = {};
          products.forEach(p => {
            const cat = p.category || 'Other';
            counts[cat] = (counts[cat] || 0) + 1;
          });
          setCategoryData(Object.entries(counts).map(([name, value]) => ({ name, value })));
        }
      } catch (productsError) {
        console.error('Error fetching products for analytics:', productsError);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Fetches live next-month predictions for this shop from the AI module,
  // via the backend's GET /api/v1/ai/predictions/shop/:shopId proxy.
  const fetchPredictions = async () => {
    try {
      setPredictionsLoading(true);
      setPredictionsError(null);

      const shopId = localStorage.getItem('shopId');
      if (!shopId) {
        setPredictionsError('No shop selected — cannot load predictions.');
        return;
      }

      const res = await aiAPI.getShopPredictions(shopId);
      if (res.data.success) {
        setPredictions(res.data.data);
      } else {
        setPredictionsError(res.data.error || 'Failed to load predictions');
      }
    } catch (error: any) {
      console.error('Error fetching AI predictions:', error);
      setPredictionsError(
        error?.response?.data?.error || 'Failed to load AI predictions'
      );
    } finally {
      setPredictionsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin" style={{ color: '#E84E0F' }} />
      </div>
    );
  }

  const forecastBuckets = predictions ? bucketDailyForecast(predictions.daily_revenue_forecast) : [];
  const revenueGrowth = formatGrowth(predictions?.predicted_revenue_growth_pct);
  const usersGrowth = formatGrowth(predictions?.expected_users_growth_pct);

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
          <h2 className="text-xl font-bold text-white mb-6">Products by Category</h2>
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

        {predictionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} className="text-3xl animate-spin" style={{ color: '#E84E0F' }} />
          </div>
        ) : predictionsError ? (
          <div className="rounded-xl p-6 text-center" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333", color: '#FF9800' }}>
            {predictionsError}
          </div>
        ) : !predictions || predictions.status === 'no_data' ? (
          <div className="rounded-xl p-6 text-center" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333", color: '#888888' }}>
            {predictions?.message || 'Not enough order history yet to generate predictions. Predictions unlock once this shop has a few completed orders.'}
          </div>
        ) : (
          <>
            {/* Prediction Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
                <div className="flex items-center gap-3 mb-2">
                  <FontAwesomeIcon icon={faArrowTrendUp} style={{ color: '#4CAF50' }} />
                  <p className="text-sm" style={{ color: "#888888" }}>Predicted Revenue</p>
                </div>
                <p className="text-2xl font-bold text-white">
                  Rs. {(predictions.predicted_revenue ?? 0).toLocaleString()}
                </p>
                {revenueGrowth && (
                  <p className="text-xs mt-1" style={{ color: '#4CAF50' }}>{revenueGrowth} from this month</p>
                )}
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
                <div className="flex items-center gap-3 mb-2">
                  <FontAwesomeIcon icon={faDollarSign} style={{ color: '#2A7F8A' }} />
                  <p className="text-sm" style={{ color: "#888888" }}>Daily Revenue</p>
                </div>
                <p className="text-2xl font-bold text-white">
                  Rs. {(predictions.predicted_daily_revenue ?? 0).toLocaleString()}
                </p>
                <p className="text-xs mt-1" style={{ color: '#888888' }}>Average per day</p>
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
                <div className="flex items-center gap-3 mb-2">
                  <FontAwesomeIcon icon={faUsers} style={{ color: '#FF9800' }} />
                  <p className="text-sm" style={{ color: "#888888" }}>Expected Users</p>
                </div>
                <p className="text-2xl font-bold text-white">
                  {(predictions.expected_users ?? 0).toLocaleString()}
                </p>
                {usersGrowth && (
                  <p className="text-xs mt-1" style={{ color: '#FF9800' }}>{usersGrowth} increase</p>
                )}
              </div>

              <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
                <div className="flex items-center gap-3 mb-2">
                  <FontAwesomeIcon icon={faBox} style={{ color: '#E84E0F' }} />
                  <p className="text-sm" style={{ color: "#888888" }}>Top Category</p>
                </div>
                <p className="text-2xl font-bold text-white">{predictions.top_category ?? '—'}</p>
                <p className="text-xs mt-1" style={{ color: '#888888' }}>
                  {predictions.top_category_predicted_sales ?? 0} predicted sales
                </p>
              </div>
            </div>

            {/* Prediction Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Revenue Prediction */}
              <div className="rounded-xl p-6" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
                <h3 className="text-lg font-bold text-white mb-4">Daily Revenue Forecast</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={forecastBuckets}>
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
                  <BarChart data={predictions.category_sales_prediction}>
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
          </>
        )}
      </div>
      </>
    </div>
  );
}