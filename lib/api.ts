// API Client — Centralized Axios instance for all backend requests
// Attaches Firebase JWT token to every request and handles 401 redirects globally
// All API endpoint groups are exported as named objects for use across the app

import axios from 'axios';
import { auth } from './firebase';

// Base Axios instance pointing at the backend API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
    : 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attaches auth token before every request
api.interceptors.request.use(async (config) => {
  try {
    // Get current Firebase user and retrieve fresh token
    const user = auth?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Fallback to localStorage token if Firebase user not available
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return config;
});

// Response interceptor — redirects to login on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on the login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Shop API endpoints
export const shopAPI = {
  getShop: (shopId: string) => api.get(`/shops/${shopId}`),
  createShop: (data: Record<string, unknown>) => api.post('/shops', data),
  updateShop: (shopId: string, data: Record<string, unknown>) => api.patch(`/shops/${shopId}`, data),
  updateShopImage: (shopId: string, data: Record<string, unknown>) => api.patch(`/shops/${shopId}/image`, data),
  getNearbyShops: (latitude: number, longitude: number, radius: number) =>
    api.get('/shops/nearby', { params: { latitude, longitude, radius } }),
};

// Product API endpoints
export const productAPI = {
  getProducts: (params: Record<string, unknown>) => api.get('/products', { params }),
  getProduct: (productId: string) => api.get(`/products/${productId}`),
  createProduct: (data: Record<string, unknown>) => api.post('/products', data),
  updateProduct: (productId: string, data: Record<string, unknown>) => api.patch(`/products/${productId}`, data),
  updateProductImage: (productId: string, data: Record<string, unknown>) => api.patch(`/products/${productId}/image`, data),
  deleteProduct: (productId: string) => api.delete(`/products/${productId}`),
};

// Deal API endpoints
export const dealAPI = {
  getDeals: (params?: Record<string, unknown>) => api.get('/deals', { params }),
  getDeal: (dealId: string) => api.get(`/deals/${dealId}`),
  createDeal: (data: Record<string, unknown>) => api.post('/deals', data),
  updateDeal: (dealId: string, data: Record<string, unknown>) => api.patch(`/deals/${dealId}`, data),
  deleteDeal: (dealId: string) => api.delete(`/deals/${dealId}`),
};

// Analytics API endpoints
export const analyticsAPI = {
  getSellerStats: () => api.get('/analytics/seller'),
  getTopProducts: () => api.get('/analytics/seller/top-products'),
  getSellerPerformance: () => api.get('/analytics/seller/performance'),
};

// Auth API endpoints
export const authAPI = {
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: Record<string, unknown>) => api.patch('/auth/me', data),
};

// Review API endpoints
export const reviewAPI = {
  getShopReviews: (shopId: string) => api.get(`/reviews/shop/${shopId}`),
  getProductReviews: (productId: string) => api.get(`/reviews/product/${productId}`),
  replyToReview: (reviewId: string, data: { reply: string }) => api.post(`/reviews/${reviewId}/reply`, data),
};

// Orders API endpoints
export const ordersAPI = {
  getOrders: (params?: Record<string, unknown>) => api.get('/orders', { params }),
  getOrder: (orderId: string) => api.get(`/orders/${orderId}`),
  updateOrder: (orderId: string, data: Record<string, unknown>) => api.patch(`/orders/${orderId}`, data),
};

export const uploadAPI = {
  uploadProductImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/uploads/product-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadShopImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/uploads/shop-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;