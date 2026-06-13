'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTags, faEye, faHeart, faStar, faChartLine, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { analyticsAPI } from '@/lib/api';
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
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
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

  useEffect(() => {
    // Check authentication status
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
  }, [authChecked]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, performanceRes, topProductsRes] = await Promise.all([
        analyticsAPI.getSellerStats(),
        analyticsAPI.getSellerPerformance(),
        analyticsAPI.getTopProducts(),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (performanceRes.data.success) {
        setPerformance(performanceRes.data.stats);
      }

      if (topProductsRes.data.success) {
        setTopProducts(topProductsRes.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl animate-spin" style={{ color: '#E84E0F' }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
          Welcome back! Here&apos;s your shop performance overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Total Products
              </p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalProducts}</p>
            </div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
              <FontAwesomeIcon icon={faBox} className="text-2xl" style={{ color: '#E84E0F' }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Active Deals
              </p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalDeals}</p>
            </div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F4F5' }}>
              <FontAwesomeIcon icon={faTags} className="text-2xl" style={{ color: '#2A7F8A' }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Total Views
              </p>
              <p className="text-3xl font-bold text-white mt-1">{performance.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
              <FontAwesomeIcon icon={faEye} className="text-2xl" style={{ color: '#E84E0F' }} />
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "#888888" }}>
                Total Favorites
              </p>
              <p className="text-3xl font-bold text-white mt-1">{performance.totalFavorites}</p>
            </div>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFE8E8' }}>
              <FontAwesomeIcon icon={faHeart} className="text-2xl" style={{ color: '#E84E0F' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faStar} style={{ color: '#E84E0F' }} />
            Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <span style={{ color: '#888888' }}>Average Rating</span>
              <span className="text-2xl font-bold text-white">{performance.averageRating.toFixed(1)} ⭐</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <span style={{ color: '#888888' }}>Total Reviews</span>
              <span className="text-2xl font-bold text-white">{stats.totalReviews}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <span style={{ color: '#888888' }}>Recommendation Score</span>
              <span className="text-2xl font-bold" style={{ color: '#E84E0F' }}>
                {performance.totalRecommendationScore.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faChartLine} style={{ color: '#E84E0F' }} />
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

      {/* Quick Actions */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/dashboard/products/new"
            className="p-6 rounded-xl text-center hover:opacity-80 transition"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <FontAwesomeIcon icon={faBox} className="text-3xl mb-3" style={{ color: '#E84E0F' }} />
            <p className="text-white font-semibold">Add Product</p>
          </a>
          <a
            href="/dashboard/deals/new"
            className="p-6 rounded-xl text-center hover:opacity-80 transition"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <FontAwesomeIcon icon={faTags} className="text-3xl mb-3" style={{ color: '#2A7F8A' }} />
            <p className="text-white font-semibold">Create Deal</p>
          </a>
          <a
            href="/dashboard/shop"
            className="p-6 rounded-xl text-center hover:opacity-80 transition"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
            <FontAwesomeIcon icon={faChartLine} className="text-3xl mb-3" style={{ color: '#E84E0F' }} />
            <p className="text-white font-semibold">Shop Settings</p>
          </a>
        </div>
      </div>
    </div>
  );
}
