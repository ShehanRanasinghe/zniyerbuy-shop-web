'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTags, faShoppingCart, faDollarSign, faExclamationTriangle, faSpinner, faPlus, faWarehouse, faPercentage, faComments, faMapMarkedAlt, faMapMarkerAlt, faStore, faUser, faChartLine, faStar } from '@fortawesome/free-solid-svg-icons';
import { analyticsAPI, shopAPI, productAPI, ordersAPI, authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

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

interface Product {
  id: string;
  name: string;
  views: number;
  favorites_count: number;
  recommendation_score: number;
  stock_quantity?: number;
}

interface ShopInfo {
  name: string;
  owner_name: string;
  category: string;
  address: string;
  logo_url: string;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [timeFilter, setTimeFilter] = useState('today');
  const [shopInfo, setShopInfo] = useState<ShopInfo>({ name: '', owner_name: '', category: '', address: '', logo_url: '' });
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
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    // Check authentication status
    if (!auth) {
      router.push('/auth/login');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth/login');
      } else {
        setAuthChecked(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (authChecked) {
      fetchDashboardData();
    }
  }, [authChecked, timeFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch shop info
      const shopId = localStorage.getItem('shopId');
      if (shopId) {
        const shopRes = await shopAPI.getShop(shopId);
        if (shopRes.data.success) {
          setShopInfo(prev => ({
            ...prev,
            name: shopRes.data.data.name || 'My Shop',
            category: shopRes.data.data.category || 'General',
            address: shopRes.data.data.address || '',
            logo_url: shopRes.data.data.logo_url || '',
          }));
        }
      }

      // Fetch owner's name — this is a users field (full_name), not a shops
      // field, so it can't come from shopAPI.getShop(). Non-critical: if
      // this fails, the rest of the dashboard should still load.
      try {
        const userRes = await authAPI.getCurrentUser();
        if (userRes.data.success) {
          setShopInfo(prev => ({
            ...prev,
            owner_name: userRes.data.data.full_name || 'Shop Owner',
          }));
        }
      } catch {
        // Non-critical — ignore if this fails
      }

      // Fetch analytics data. Uses allSettled (not all) so that if one call
      // fails, it doesn't wipe out the other two — this was exactly why the
      // dashboard previously showed no data at all whenever any single
      // analytics endpoint errored.
      const [statsResult, performanceResult, topProductsResult] = await Promise.allSettled([
        analyticsAPI.getSellerStats(),
        analyticsAPI.getSellerPerformance(),
        analyticsAPI.getTopProducts(),
      ]);

      if (statsResult.status === 'fulfilled' && statsResult.value.data.success) {
        setStats(statsResult.value.data.stats);
      }

      if (performanceResult.status === 'fulfilled' && performanceResult.value.data.success) {
        setPerformance(performanceResult.value.data.stats);
      }

      if (topProductsResult.status === 'fulfilled' && topProductsResult.value.data.success) {
        setTopProducts(topProductsResult.value.data.data.slice(0, 5));
      }

      // Fetch products to calculate low stock count (scoped to this shop only —
      // previously fetched all shops' products, so a fresh shop with zero
      // products of its own would still show a non-zero count from other
      // shops' low-stock items)
      try {
        const productsRes = await productAPI.getProducts(shopId ? { shop_id: shopId } : {});
        if (productsRes.data.success) {
          const products = productsRes.data.data;
          const lowStock = products.filter((p: Product) => (p.stock_quantity || 0) < 51).length;
          setLowStockCount(lowStock);
        }
      } catch {
        // Non-critical — ignore if products fail to load
      }

      // Fetch orders to calculate orders count and revenue, filtered by
      // the selected time range (today/yesterday/last7days/thismonth/lifetime).
      // Previously timeFilter only re-triggered a fetch of the same
      // unfiltered data — clicking a different filter changed nothing.
      try {
        const ordersRes = await ordersAPI.getOrders({});
        if (ordersRes.data.success) {
          const allOrders: Order[] = ordersRes.data.data || [];
          const filteredOrders = filterOrdersByTimeRange(allOrders, timeFilter);

          setOrdersCount(filteredOrders.length);
          const totalRevenue = filteredOrders
            .filter((order) => order.status !== 'cancelled')
            .reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
          setRevenue(totalRevenue);
        }
      } catch {
        // Non-critical — ignore if orders fail to load
      }

    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number } };
      // Only show error toast on server errors, not empty DB
      if (axiosErr.response && axiosErr.response.status >= 500) {
        toast.error('Server error loading dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filters orders by the selected time range. Used by fetchDashboardData
  // to compute ordersCount/revenue for the currently selected filter.
  const filterOrdersByTimeRange = (orders: Order[], filter: string): Order[] => {
    if (filter === 'lifetime') return orders;

    const now = new Date();

    if (filter === 'today') {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return orders.filter(o => new Date(o.created_at) >= startOfToday);
    }

    if (filter === 'yesterday') {
      const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return orders.filter(o => {
        const created = new Date(o.created_at);
        return created >= startOfYesterday && created < startOfToday;
      });
    }

    if (filter === 'last7days') {
      const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      return orders.filter(o => new Date(o.created_at) >= sevenDaysAgo);
    }

    if (filter === 'thismonth') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return orders.filter(o => new Date(o.created_at) >= startOfMonth);
    }

    return orders;
  };

  // Returns current stat values for display — ordersCount/revenue are
  // already computed for the selected timeFilter in fetchDashboardData
  const getFilteredStats = () => ({
    totalProducts: stats.totalProducts,
    lowStockProducts: lowStockCount,
    ordersCount,
    revenue,
  });

  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin" style={{ color: '#E84E0F' }} />
      </div>
    );
  }

  const filteredStats = getFilteredStats();

  return (
    <div className="space-y-8">
      {/* Header with Owner and Shop Name */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#FEF0EB' }}>
            {shopInfo.logo_url ? (
              <img src={shopInfo.logo_url} alt={shopInfo.name} className="w-full h-full object-cover" />
            ) : (
              <FontAwesomeIcon icon={faUser} className="text-2xl" style={{ color: '#E84E0F' }} />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{shopInfo.owner_name}</h2>
            <div className="flex items-center gap-2 mt-1">

              <FontAwesomeIcon icon={faStore} style={{ color: '#888888' }} />
              <p className="text-lg" style={{ color: '#888888' }}>{shopInfo.name} ||</p>

            {shopInfo.address && (
              <div className="flex items-center gap-1 ">
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#888888' }} />
                <p className="text-sm" style={{ color: '#888888' }}>{shopInfo.address}</p>
              </div>
            )}
              
            </div>
          </div>
        </div>
      </div>

      {/* Business Overview Section */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white">Business Overview</h2>
          
          {/* Time Filter */}
          <div className="flex gap-2 flex-wrap">
            {['today', 'yesterday', 'last7days', 'thismonth', 'lifetime'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  timeFilter === filter
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: timeFilter === filter ? '#E84E0F' : '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                {filter === 'today' && 'Today'}
                {filter === 'yesterday' && 'Yesterday'}
                {filter === 'last7days' && 'Last 7 Days'}
                {filter === 'thismonth' && 'This Month'}
                {filter === 'lifetime' && 'Lifetime'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#888888" }}>Total Products</p>
                <p className="text-3xl font-bold text-white mt-1">{filteredStats.totalProducts}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
                <FontAwesomeIcon icon={faBox} className="text-2xl" style={{ color: '#E84E0F' }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#888888" }}>Low Stock Products</p>
                <p className="text-3xl font-bold text-white mt-1">{filteredStats.lowStockProducts}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF3E0' }}>
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl" style={{ color: '#FF9800' }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#888888" }}>Orders Count</p>
                <p className="text-3xl font-bold text-white mt-1">{filteredStats.ordersCount}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4F5' }}>
                <FontAwesomeIcon icon={faShoppingCart} className="text-2xl" style={{ color: '#2A7F8A' }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1" style={{ backgroundColor: "#1A1A1A", border: "1px solid #333333" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "#888888" }}>Revenue</p>
                <p className="text-3xl font-bold text-white mt-1">Rs. {filteredStats.revenue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                <FontAwesomeIcon icon={faDollarSign} className="text-2xl" style={{ color: '#4CAF50' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/dashboard/inventory/new')}
            className="p-6 rounded-xl text-center hover:opacity-80 transition flex flex-col items-center gap-3"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
              <FontAwesomeIcon icon={faPlus} className="text-xl" style={{ color: '#E84E0F' }} />
            </div>
            <p className="text-white font-semibold">Add Products</p>
          </button>

          <button
            onClick={() => router.push('/dashboard/inventory')}
            className="p-6 rounded-xl text-center hover:opacity-80 transition flex flex-col items-center gap-3"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F4F5' }}>
              <FontAwesomeIcon icon={faWarehouse} className="text-xl" style={{ color: '#2A7F8A' }} />
            </div>
            <p className="text-white font-semibold">Inventory</p>
          </button>

          <button
            onClick={() => router.push('/dashboard/discounts')}
            className="p-6 rounded-xl text-center hover:opacity-80 transition flex flex-col items-center gap-3"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF3E0' }}>
              <FontAwesomeIcon icon={faPercentage} className="text-xl" style={{ color: '#FF9800' }} />
            </div>
            <p className="text-white font-semibold">Discounts</p>
          </button>

          <button
            onClick={() => router.push('/dashboard/orders')}
            className="p-6 rounded-xl text-center hover:opacity-80 transition flex flex-col items-center gap-3"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <FontAwesomeIcon icon={faShoppingCart} className="text-xl" style={{ color: '#4CAF50' }} />
            </div>
            <p className="text-white font-semibold">View Orders</p>
          </button>

          <button
            onClick={() => router.push('/dashboard/reviews')}
            className="p-6 rounded-xl text-center hover:opacity-80 transition flex flex-col items-center gap-3"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
              <FontAwesomeIcon icon={faComments} className="text-xl" style={{ color: '#E84E0F' }} />
            </div>
            <p className="text-white font-semibold">View Reviews</p>
          </button>

          <button
            onClick={() => router.push('/dashboard/map')}
            className="p-6 rounded-xl text-center hover:opacity-80 transition flex flex-col items-center gap-3"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F4F5' }}>
              <FontAwesomeIcon icon={faMapMarkedAlt} className="text-xl" style={{ color: '#2A7F8A' }} />
            </div>
            <p className="text-white font-semibold">Map View</p>
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} style={{ color: '#E84E0F' }} />
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <span style={{ color: '#888888' }}>Total Views</span>
              <span className="text-2xl font-bold text-white">{performance.totalViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <span style={{ color: '#888888' }}>Total Favorites</span>
              <span className="text-2xl font-bold text-white">{performance.totalFavorites}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <span style={{ color: '#888888' }}>Average Rating</span>
              <span className="text-2xl font-bold text-white">
                {performance.averageRating.toFixed(1)}
                <FontAwesomeIcon icon={faStar} className="ml-1" style={{ color: '#FF9800' }} />
              </span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faBox} style={{ color: '#E84E0F' }} />
            Top 5 Products
          </h2>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-opacity-80 transition"
                  style={{ backgroundColor: '#1A1A1A' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: index === 0 ? '#E84E0F' : '#333333', color: 'white' }}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-xs" style={{ color: '#888888' }}>
                        {product.views} views • {product.favorites_count} favorites
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#E84E0F' }}>
                      {product.recommendation_score.toFixed(1)}
                    </p>
                    <p className="text-xs" style={{ color: '#888888' }}>score</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p style={{ color: '#888888' }}>No products yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}