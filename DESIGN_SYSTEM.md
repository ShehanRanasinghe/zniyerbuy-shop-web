# ZNIYERBUY Shop Web - Design System & Documentation

## 🎨 Design Overview

Your seller dashboard has been completely redesigned with a **calm, pastel-inspired theme** using colors from your ZNIYERBUY logo. The design is user-friendly, modern, and built for an optimal selling experience.

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Pastel Orange** | #FFD4A3 | Primary accent, cards, buttons |
| **Pastel Coral** | #FFB3B3 | Secondary accent, deals, forms |
| **Pastel Teal** | #B3E5D4 | Tertiary accent, stats, CTAs |
| **Pastel Yellow** | #FFF5DC | Additional accent, stats |
| **Background** | #FFFAF5 | Main background, calm vibe |
| **Text Primary** | #3A3A3A | Main text (not pure black) |
| **Text Secondary** | #6B7280 | Secondary text, descriptions |
| **Logo Orange** | #E84E0F | Primary action buttons |
| **Logo Red** | #E8341F | Deal buttons, accents |

## 📁 Project Structure

```
app/
├── layout.tsx                 # Root layout
├── globals.css                # Global styles & color variables
├── page.tsx                   # Landing page (redesigned)
└── dashboard/
    ├── layout.jsx             # Dashboard layout with sidebar
    ├── page.tsx               # Dashboard homepage (redesigned)
    ├── shop/
    │   └── page.jsx          # Shop profile management (NEW)
    ├── products/
    │   ├── page.jsx          # Product list (NEW)
    │   └── new/
    │       └── page.jsx      # Add new product form (NEW)
    └── deals/
        ├── page.jsx          # Deals management (NEW)
        └── new/
            └── page.jsx      # Create new deal form (NEW)

components/
├── layout/
│   └── Sidebar.jsx            # Navigation sidebar (redesigned)
└── ui/
    ├── Button.jsx             # Reusable button components (NEW)
    ├── Card.jsx               # Reusable card components (NEW)
    ├── StatCard.jsx           # Stat card component (NEW)
    └── Input.jsx              # Reusable form inputs (NEW)
```

## 🎯 Pages Overview

### 1. **Home Page** (`/`)
- Beautiful landing page with logo, features, and CTA buttons
- Displays key stats (sellers, products, customers, support)
- Links to dashboard, login, and registration

### 2. **Dashboard** (`/dashboard`)
- **Stats Overview**: Total products, active deals, views, orders
- **Quick Actions**: Add product, create deal, view analytics
- **Recent Activity**: Shows store activity
- Color-coded stat cards with emoji icons

### 3. **Shop Profile** (`/dashboard/shop`)
- Manage shop name, description, contact info
- Upload shop cover image
- Edit address, city, state, zip code
- Save changes to shop profile

### 4. **Products** (`/dashboard/products`)
- View all products in grid or list layout
- Search products by name
- Edit or delete products
- CTA to add new products
- Empty state with helpful message

### 5. **Add Product** (`/dashboard/products/new`)
- Product image upload
- Product details (name, category, price, cost, stock, SKU)
- Product description
- Submit or cancel

### 6. **Deals** (`/dashboard/deals`)
- View active deals, scheduled deals, redemptions
- Create new deals
- Edit or delete deals
- Empty state with helpful guidance

### 7. **Create Deal** (`/dashboard/deals/new`)
- Deal title and description
- Discount type (percentage or fixed)
- Start and end dates
- Max redemptions setting
- Deal rules (auto-apply, stackable)

## 🎨 Design Features

### Visual Elements
- ✅ **Rounded Corners**: xl (12px) and 2xl (16px) for modern feel
- ✅ **Shadows**: Subtle shadows with hover effects for depth
- ✅ **Transitions**: Smooth 200ms transitions on all interactions
- ✅ **Responsive**: Mobile-first responsive design
- ✅ **No Black**: Uses #3A3A3A instead of pure black for softer appearance

### Component Library

#### Buttons
```jsx
import { PrimaryButton, SecondaryButton, GhostButton } from '@/components/ui/Button';

<PrimaryButton>Save Changes</PrimaryButton>      // Orange button
<SecondaryButton color="#B3E5D4">View Details</SecondaryButton>  // Custom color
<GhostButton>Cancel</GhostButton>               // Gray background
```

#### Cards
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

<Card border="#FFD4A3">
  <CardHeader>
    <CardTitle>Products</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

#### Stats
```jsx
import { StatCard } from '@/components/ui/StatCard';

<StatCard 
  title="Total Products" 
  value="42" 
  icon="📦"
  borderColor="#FFD4A3"
  valueColor="#E84E0F"
/>
```

#### Form Inputs
```jsx
import { Input, Textarea, Select } from '@/components/ui/Input';

<Input 
  label="Product Name" 
  name="name" 
  borderColor="#FFD4A3"
  required
/>

<Textarea 
  label="Description" 
  name="description"
/>

<Select 
  label="Category" 
  name="category"
  options={[
    { label: 'Electronics', value: 'electronics' },
    { label: 'Fashion', value: 'fashion' },
  ]}
/>
```

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   ```
   http://localhost:3000
   ```

## 📱 Responsive Design

All pages are fully responsive:
- **Mobile**: Single column layouts
- **Tablet**: 2-column grids
- **Desktop**: 3-4 column grids

## 🎯 Customization

To customize colors globally:

1. Edit `app/globals.css` - Update CSS variables under `:root`
2. Update component color props where needed
3. Colors are passed as inline styles for flexibility

Example:
```css
:root {
  --color-primary-orange: #FFD4A3;
  --color-primary-coral: #FFB3B3;
  /* etc */
}
```

## 📝 Naming Conventions

- **Components**: PascalCase (e.g., `StatCard`)
- **Pages**: lowercase (e.g., `page.jsx`)
- **Colors**: lowercase with hyphens (e.g., `#FFD4A3`)
- **CSS Classes**: Tailwind classes, snake_case for custom

## 🔮 Next Steps

1. **Connect to API**: Integrate with backend for real data
2. **Add Authentication**: Login/register pages
3. **Add Images**: Upload functionality for products/shop
4. **Add Charts**: Analytics and sales charts
5. **Mobile App Sync**: Ensure consistency with mobile designs
6. **Dark Mode**: Optional dark theme toggle

## 📧 Support

The design system is built to be easily maintainable and scalable. All components use consistent styling patterns and can be easily extended.

---

**Built with ❤️ for ZNIYERBUY**
