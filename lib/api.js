import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Shop API endpoints
export const shopAPI = {
  getShop: (shopId) => api.get(`/shops/${shopId}`),
  createShop: (data) => api.post('/shops', data),
  updateShop: (shopId, data) => api.patch(`/shops/${shopId}`, data),
  updateShopImage: (shopId, data) => api.patch(`/shops/${shopId}/image`, data),
  getNearbyShops: (latitude, longitude, radius) => 
    api.get('/shops/nearby', { params: { latitude, longitude, radius } }),
};

// Product API endpoints
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (productId) => api.get(`/products/${productId}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (productId, data) => api.patch(`/products/${productId}`, data),
  updateProductImage: (productId, data) => api.patch(`/products/${productId}/image`, data),
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
};

// Deal API endpoints
export const dealAPI = {
  getDeals: () => api.get('/deals'),
  getDeal: (dealId) => api.get(`/deals/${dealId}`),
  createDeal: (data) => api.post('/deals', data),
  updateDeal: (dealId, data) => api.patch(`/deals/${dealId}`, data),
  deleteDeal: (dealId) => api.delete(`/deals/${dealId}`),
};

// Analytics API endpoints
export const analyticsAPI = {
  getSellerStats: () => api.get('/analytics/seller'),
  getTopProducts: () => api.get('/analytics/seller/top-products'),
  getSellerPerformance: () => api.get('/analytics/seller/performance'),
};

// Auth API endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export default api;
