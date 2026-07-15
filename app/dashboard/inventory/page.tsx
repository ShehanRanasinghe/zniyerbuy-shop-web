'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faPlus, faEdit, faTrash, faSpinner, faExclamationTriangle, faTimesCircle, faBox, faSearch } from '@fortawesome/free-solid-svg-icons';
import { productAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  category: string;
  image_url?: string;
  description?: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'lowstock' | 'outofstock'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts({});
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const getFilteredProducts = () => {
    let filtered = products;
    
    // Filter by tab
    switch (activeTab) {
      case 'lowstock':
        filtered = filtered.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10);
        break;
      case 'outofstock':
        filtered = filtered.filter(p => p.stock_quantity === 0);
        break;
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faWarehouse} />
            Inventory Management
          </h1>
          <p className="mt-2" style={{ color: '#888888' }}>
            Manage your product inventory and stock levels
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/products/new')}
          className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: '#E84E0F' }}>
          <FontAwesomeIcon icon={faPlus} />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl p-4" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <div className="relative">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2" 
            style={{ color: '#888888' }} 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full pl-12 pr-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'all' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'all' ? '#E84E0F' : '#1A1A1A',
              border: '1px solid #333333',
            }}>
            <FontAwesomeIcon icon={faBox} className="mr-2" />
            All Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('lowstock')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'lowstock' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'lowstock' ? '#FF9800' : '#1A1A1A',
              border: '1px solid #333333',
            }}>
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            Low Stock ({products.filter(p => p.stock_quantity > 0 && p.stock_quantity < 10).length})
          </button>
          <button
            onClick={() => setActiveTab('outofstock')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'outofstock' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'outofstock' ? '#F44336' : '#1A1A1A',
              border: '1px solid #333333',
            }}>
            <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
            Out of Stock ({products.filter(p => p.stock_quantity === 0).length})
          </button>
        </div>

        {/* Product Catalogue */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Product Catalogue</h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl p-4 hover:shadow-lg transition"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
                  {/* Product Image */}
                  <div className="w-full h-40 rounded-lg mb-3 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#222222' }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <FontAwesomeIcon icon={faBox} className="text-4xl" style={{ color: '#666666' }} />
                    )}
                  </div>

                  {/* Product Info */}
                  <h3 className="text-white font-semibold mb-2 truncate">{product.name}</h3>
                  <p className="text-sm mb-2" style={{ color: '#888888' }}>{product.category}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold" style={{ color: '#E84E0F' }}>
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock_quantity === 0
                          ? 'bg-red-900 text-red-200'
                          : product.stock_quantity < 10
                          ? 'bg-orange-900 text-orange-200'
                          : 'bg-green-900 text-green-200'
                      }`}>
                      Stock: {product.stock_quantity}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                      className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-80"
                      style={{ backgroundColor: '#2A7F8A' }}>
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-80"
                      style={{ backgroundColor: '#F44336' }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faBox} className="text-6xl mb-4" style={{ color: '#333333' }} />
              <p className="text-xl" style={{ color: '#888888' }}>
                {activeTab === 'all' && 'No products found'}
                {activeTab === 'lowstock' && 'No low stock products'}
                {activeTab === 'outofstock' && 'No out of stock products'}
              </p>
              {activeTab === 'all' && (
                <button
                  onClick={() => router.push('/dashboard/products/new')}
                  className="mt-4 px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
                  style={{ backgroundColor: '#E84E0F' }}>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Your First Product
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
