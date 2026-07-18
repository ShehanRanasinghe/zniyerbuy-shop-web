# ZniyerBuy Shop Web

A modern seller dashboard for managing shops, products, and deals on the ZniyerBuy marketplace platform, built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Core Features](#core-features)
- [User Interface Components](#user-interface-components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Form Handling](#form-handling)
- [Data Visualization](#data-visualization)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Build & Deployment](#build--deployment)

## Overview

The ZniyerBuy Shop Web is a comprehensive seller dashboard that enables shop owners to manage their business on the marketplace platform. It provides tools for shop profile management, product catalog management, deal creation, and performance analytics.

**Key Capabilities:**
- **Shop Management** - Create and update shop profile
- **Product Management** - Add, edit, and delete products
- **Deal Management** - Create time-limited deals with discounts
- **Analytics Dashboard** - View shop performance metrics
- **Image Upload** - Upload product and shop images
- **Real-time Updates** - Live data refresh and notifications
- **Responsive Design** - Mobile-friendly interface

## Architecture

### System Design

```
┌─────────────────────────────────────────┐
│         Next.js Application             │
│  ┌───────────────────────────────────┐  │
│  │   App Router (Next.js 16)         │  │
│  │   - /dashboard (main layout)      │  │
│  │   - /dashboard/shop               │  │
│  │   - /dashboard/products           │  │
│  │   - /dashboard/products/new       │  │
│  │   - /dashboard/deals              │  │
│  │   - /dashboard/deals/new          │  │
│  │   - /auth/login                   │  │
│  │   - /auth/register                │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   React Components                │  │
│  │   - Client Components (forms)     │  │
│  │   - UI Components (reusable)      │  │
│  │   - Layout Components (sidebar)   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   Form Management                 │  │
│  │   - React Hook Form               │  │
│  │   - Validation logic              │  │
│  │   - Error handling                │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │   API Integration Layer           │  │
│  │   - Axios client with interceptors│  │
│  │   - Token management              │  │
│  │   - Error handling                │  │
│  └───────────────────────────────────┘  │
└─────────┬───────────────────┬───────────┘
          │                   │
          ▼                   ▼
┌──────────────────┐  ┌──────────────────┐
│  Firebase Auth   │  │  Backend API     │
│  - Token refresh │  │  - REST endpoints│
│  - Session mgmt  │  │  - Supabase DB   │
└──────────────────┘  └──────────────────┘
```

### Component Hierarchy

```
App Layout
├── Sidebar (navigation)
└── Page Content
    ├── Dashboard (/)
    │   ├── Stats Cards (4 metrics)
    │   ├── Performance Metrics
    │   ├── Top 5 Products
    │   └── Quick Actions
    ├── Shop (/shop)
    │   ├── Shop Info Form
    │   └── Image Upload
    ├── Products (/products)
    │   ├── Products Grid
    │   └── Edit/Delete Actions
    ├── New Product (/products/new)
    │   ├── Product Form
    │   └── Image Upload
    ├── Deals (/deals)
    │   ├── Deals List
    │   └── Edit/Delete Actions
    └── New Deal (/deals/new)
        └── Deal Form
```

## Technology Stack

### Core Technologies

- **Framework:** Next.js 16.2.6 (App Router)
- **UI Library:** React 19.2.4
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Authentication:** Firebase 12.13.0
- **HTTP Client:** Axios 1.16.1
- **Form Management:** React Hook Form 7.76.1
- **Notifications:** React Hot Toast 2.6.0
- **Charts:** Recharts 3.8.1
- **Icons:** Font Awesome 7.2.0

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.6 | React framework with SSR/SSG |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | React DOM renderer |
| `typescript` | 5 | Type safety |
| `tailwindcss` | 4 | Utility-first CSS |
| `axios` | 1.16.1 | HTTP client |
| `firebase` | 12.13.0 | Authentication |
| `react-hook-form` | 7.76.1 | Form state management |
| `react-hot-toast` | 2.6.0 | Toast notifications |
| `recharts` | 3.8.1 | Data visualization |
| `@fortawesome/react-fontawesome` | 3.3.1 | Icon components |

## Core Features

### 1. Dashboard Overview

**Location:** `app/dashboard/page.tsx`

**Features:**
- Real-time shop statistics
- Performance metrics display
- Top 5 products ranking
- Quick action buttons

**Statistics Tracked:**
- Total Products
- Active Deals
- Total Views
- Total Favorites

**Performance Metrics:**
- Average Rating (with star display)
- Total Reviews
- Recommendation Score

**Top Products Display:**
```typescript
interface Product {
  id: string;
  name: string;
  views: number;
  favorites_count: number;
  recommendation_score: number;
}
```

**Quick Actions:**
- Add Product (navigate to /products/new)
- Create Deal (navigate to /deals/new)
- Shop Settings (navigate to /shop)

### 2. Shop Management

**Location:** `app/dashboard/shop/page.jsx`

**Features:**
- Shop profile creation/update
- Business information management
- Location details (address, coordinates)
- Contact information
- Shop image upload

**Shop Form Fields:**
- Shop Name (required)
- Description
- Address
- Latitude/Longitude
- Phone Number
- Shop Image

**Form Validation:**
```javascript
const validateShopForm = (data) => {
  const errors = {};
  
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Shop name is required';
  }
  
  if (data.phone && !/^\d{10}$/.test(data.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }
  
  if (data.latitude && (data.latitude < -90 || data.latitude > 90)) {
    errors.latitude = 'Latitude must be between -90 and 90';
  }
  
  if (data.longitude && (data.longitude < -180 || data.longitude > 180)) {
    errors.longitude = 'Longitude must be between -180 and 180';
  }
  
  return errors;
};
```

### 3. Product Management

**Location:** `app/dashboard/inventory/page.tsx`

**Features:**
- Product catalog grid view
- Product cards with images
- Edit/Delete actions
- Stock status display
- Price information
- Edit route: `/dashboard/inventory/[id]/edit`

**Product Card Display:**
```typescript
interface ProductCard {
  id: string;
  name: string;
  description: string;
  original_price: number;
  current_price: number;
  stock_quantity: number;
  image_url: string;
  category: string;
  unit: string;
}
```

**Product Actions:**
- **Edit:** Navigate to edit form
- **Delete:** Remove product with confirmation

### 4. New Product Creation

**Location:** `app/dashboard/inventory/new/page.tsx`

**Features:**
- Multi-field product form
- Image upload with preview
- Category selection
- Unit type selection
- Price management

**Product Form Fields:**
- Product Name (required)
- Description
- Original Price (required)
- Current Price (optional, defaults to original)
- Stock Quantity (required)
- Category (required)
- Unit (kg, piece, litre, pack, dozen, metre)
- Product Image

**Category Options:**
- Electronics
- Clothing
- Food & Beverages
- Home & Garden
- Sports & Outdoors
- Books & Media
- Health & Beauty
- Toys & Games
- Automotive
- Other

**Form Submission:**
```javascript
const handleSubmit = async (data) => {
  try {
    // Get current user's shop
    const shopRes = await shopAPI.getShop(currentUser.shopId);
    
    // Create product
    const productData = {
      shop_id: shopRes.data.id,
      name: data.name,
      description: data.description,
      original_price: parseFloat(data.original_price),
      current_price: data.current_price 
        ? parseFloat(data.current_price) 
        : parseFloat(data.original_price),
      stock_quantity: parseInt(data.stock_quantity),
      category: data.category,
      unit: data.unit,
      image_url: data.image_url
    };
    
    const res = await productAPI.createProduct(productData);
    
    if (res.data.success) {
      toast.success('Product created successfully');
      router.push('/dashboard/products');
    }
  } catch (error) {
    toast.error('Failed to create product');
  }
};
```

### 5. Deal Management

**Location:** `app/dashboard/deals/page.jsx`

**Features:**
- Active deals list
- Deal cards with countdown
- Edit/Delete actions
- Deal status display

**Deal Card Display:**
```typescript
interface DealCard {
  id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  original_price: number;
  deal_price: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  views_count: number;
}
```

**Deal Actions:**
- **Edit:** Navigate to edit form
- **Delete:** Remove deal with confirmation

### 6. New Deal Creation

**Location:** `app/dashboard/deals/new/page.jsx`

**Features:**
- Deal information form
- Discount type selection
- Date range picker
- Price calculation preview

**Deal Form Fields:**
- Deal Title (required)
- Description
- Discount Type (percentage or fixed amount)
- Discount Value (required)
- Original Price (required)
- Start Date (required)
- End Date (required)

**Discount Calculation:**
```javascript
const calculateDealPrice = (originalPrice, discountType, discountValue) => {
  if (discountType === 'percentage') {
    return originalPrice * (1 - discountValue / 100);
  } else {
    return originalPrice - discountValue;
  }
};

// Real-time preview
const dealPrice = useMemo(() => {
  if (!originalPrice || !discountValue) return 0;
  return calculateDealPrice(
    parseFloat(originalPrice),
    discountType,
    parseFloat(discountValue)
  );
}, [originalPrice, discountType, discountValue]);
```

**Form Validation:**
```javascript
const validateDealForm = (data) => {
  const errors = {};
  
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Deal title is required';
  }
  
  if (!data.discount_value || data.discount_value <= 0) {
    errors.discount_value = 'Discount value must be greater than 0';
  }
  
  if (data.discount_type === 'percentage' && data.discount_value > 100) {
    errors.discount_value = 'Percentage discount cannot exceed 100%';
  }
  
  if (!data.original_price || data.original_price <= 0) {
    errors.original_price = 'Original price must be greater than 0';
  }
  
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  
  if (endDate <= startDate) {
    errors.end_date = 'End date must be after start date';
  }
  
  if (startDate < new Date()) {
    errors.start_date = 'Start date cannot be in the past';
  }
  
  return errors;
};
```

## User Interface Components

### Sidebar Component

**Location:** `components/layout/Sidebar.jsx`

**Features:**
- Navigation menu with icons
- Active route highlighting
- Responsive design
- Logo display

**Menu Items:**
- Dashboard (home icon)
- Shop (store icon)
- Products (box icon)
- Deals (tags icon)

**Active State Logic:**
```javascript
const isActive = (path) => {
  return pathname === path || pathname.startsWith(path + '/');
};
```

### StatCard Component

**Location:** `components/ui/StatCard.jsx`

**Props:**
```typescript
interface StatCardProps {
  icon: IconDefinition;
  value: number | string;
  label: string;
  color: string;
  bgColor: string;
}
```

**Usage:**
```jsx
<StatCard
  icon={faBox}
  value={stats.totalProducts}
  label="Total Products"
  color="#E84E0F"
  bgColor="#FEF0EB"
/>
```

### Button Component

**Location:** `components/ui/Button.jsx`

**Variants:**
- Primary (orange background)
- Secondary (gray background)
- Danger (red background)
- Outline (transparent with border)

**Props:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

### Input Component

**Location:** `components/ui/Input.jsx`

**Features:**
- Label support
- Error message display
- Placeholder text
- Various input types

**Props:**
```typescript
interface InputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}
```

### Card Component

**Location:** `components/ui/Card.jsx`

**Features:**
- Consistent styling
- Hover effects
- Padding and borders

**Usage:**
```jsx
<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

## State Management

### Form State with React Hook Form

**Pattern:**
```javascript
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors } } = useForm({
  defaultValues: {
    name: '',
    description: '',
    price: 0
  }
});

const onSubmit = async (data) => {
  // Handle form submission
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('name', { required: 'Name is required' })} />
    {errors.name && <span>{errors.name.message}</span>}
  </form>
);
```

### Local State for UI

**Pattern:**
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [data, setData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.getData();
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### Toast Notifications

**Pattern:**
```javascript
import toast from 'react-hot-toast';

// Success notification
toast.success('Product created successfully');

// Error notification
toast.error('Failed to create product');

// Loading notification
const toastId = toast.loading('Creating product...');
// Later...
toast.success('Product created', { id: toastId });
```

## API Integration

### Axios Client Configuration

**Location:** `lib/api.js`

**Base Setup:**
```javascript
import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL 
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
    : 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor (Token Injection):**
```javascript
api.interceptors.request.use(async (config) => {
  try {
    const user = auth?.currentUser;
    
    if (user) {
      // Get fresh token from Firebase
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Fallback to localStorage
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
```

**Response Interceptor (Error Handling):**
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/auth/login')) {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints

**Shop API:**
```javascript
export const shopAPI = {
  getShop: (shopId) => api.get(`/shops/${shopId}`),
  createShop: (data) => api.post('/shops', data),
  updateShop: (shopId, data) => api.patch(`/shops/${shopId}`, data),
  updateShopImage: (shopId, data) => 
    api.patch(`/shops/${shopId}/image`, data),
};
```

**Product API:**
```javascript
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (productId) => api.get(`/products/${productId}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (productId, data) => 
    api.patch(`/products/${productId}`, data),
  updateProductImage: (productId, data) => 
    api.patch(`/products/${productId}/image`, data),
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
};
```

**Deal API:**
```javascript
export const dealAPI = {
  getDeals: () => api.get('/deals'),
  getDeal: (dealId) => api.get(`/deals/${dealId}`),
  createDeal: (data) => api.post('/deals', data),
  updateDeal: (dealId, data) => api.patch(`/deals/${dealId}`, data),
  deleteDeal: (dealId) => api.delete(`/deals/${dealId}`),
};
```

**Analytics API:**
```javascript
export const analyticsAPI = {
  getSellerStats: () => api.get('/analytics/seller'),
  getTopProducts: () => api.get('/analytics/seller/top-products'),
  getSellerPerformance: () => api.get('/analytics/seller/performance'),
};
```

## Authentication Flow

### Firebase Authentication

**Location:** `lib/firebase.js`

**Configuration:**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Login Flow

**Location:** `app/auth/login/page.jsx`

```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('token', token);
    
    // Register user in backend if not exists
    await authAPI.register({
      firebase_uid: userCredential.user.uid,
      email: userCredential.user.email,
      full_name: userCredential.user.displayName || email,
      role: 'seller'
    });
    
    router.push('/dashboard');
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Registration Flow

**Location:** `app/auth/register/page.jsx`

```javascript
import { createUserWithEmailAndPassword } from 'firebase/auth';

const handleRegister = async (email, password, fullName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('token', token);
    
    // Register in backend
    await authAPI.register({
      firebase_uid: userCredential.user.uid,
      email: email,
      full_name: fullName,
      role: 'seller'
    });
    
    router.push('/dashboard');
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Protected Routes

**Pattern:**
```javascript
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push('/auth/login');
    } else {
      setAuthChecked(true);
    }
  });
  
  return () => unsubscribe();
}, [router]);
```

## Form Handling

### React Hook Form Integration

**Basic Form:**
```javascript
const { register, handleSubmit, formState: { errors } } = useForm();

const onSubmit = async (data) => {
  try {
    await api.createResource(data);
    toast.success('Created successfully');
  } catch (error) {
    toast.error('Failed to create');
  }
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input 
      {...register('name', { 
        required: 'Name is required',
        minLength: { value: 3, message: 'Min 3 characters' }
      })} 
    />
    {errors.name && <span>{errors.name.message}</span>}
    
    <button type="submit">Submit</button>
  </form>
);
```

### Image Upload Handling

**Pattern:**
```javascript
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image must be less than 5MB');
    return;
  }
  
  // Convert to base64
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result);
    setValue('image_url', reader.result);
  };
  reader.readAsDataURL(file);
};
```

## Data Visualization

### Performance Metrics Display

**Pattern:**
```jsx
<div className="space-y-4">
  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1A1A1A]">
    <span className="text-[#888888]">Average Rating</span>
    <span className="text-2xl font-bold text-white">
      {performance.averageRating.toFixed(1)} ⭐
    </span>
  </div>
  
  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1A1A1A]">
    <span className="text-[#888888]">Total Reviews</span>
    <span className="text-2xl font-bold text-white">
      {stats.totalReviews}
    </span>
  </div>
  
  <div className="flex items-center justify-between p-4 rounded-lg bg-[#1A1A1A]">
    <span className="text-[#888888]">Recommendation Score</span>
    <span className="text-2xl font-bold text-[#E84E0F]">
      {performance.totalRecommendationScore.toFixed(1)}
    </span>
  </div>
</div>
```

### Top Products Ranking

**Pattern:**
```jsx
{topProducts.map((product, index) => (
  <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-[#1A1A1A]">
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
        index === 0 ? 'bg-[#E84E0F] text-white' : 'bg-[#333333] text-white'
      }`}>
        {index + 1}
      </div>
      <div>
        <p className="text-white font-medium">{product.name}</p>
        <p className="text-xs text-[#888888]">
          {product.views} views • {product.favorites_count} favorites
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-[#E84E0F]">
        {product.recommendation_score.toFixed(1)}
      </p>
      <p className="text-xs text-[#888888]">score</p>
    </div>
  </div>
))}
```

## Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase project
- Backend API running

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd zniyerbuy-shop-web
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file:

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. **Start development server**
```bash
npm run dev
```

The application will run on `http://localhost:3001` (configured in package.json)

5. **Access the application**

Visit `http://localhost:3001`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |

## Build & Deployment

### Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

This will start the server on port 3001 (configured in package.json)

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Environment Variables for Production

Set all `NEXT_PUBLIC_*` variables in your hosting platform's environment configuration.

---

**Version:** 0.1.0  
**Last Updated:** 2026-06-13  
**Maintained By:** ZniyerBuy Development Team
