'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faPlus, faEdit, faTrash, faEye, faHeart, faSpinner, faImage } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { productAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts({ limit: 100 });
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

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeleting(productId);
      await productAPI.deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faBox} />
            Products
          </h1>
          <p className="mt-1 text-sm sm:text-base" style={{ color: "#888888" }}>
            Manage your product inventory ({products.length} products)
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-4 sm:px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90 flex items-center gap-2"
          style={{ backgroundColor: '#E84E0F' }}>
          <FontAwesomeIcon icon={faPlus} />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <FontAwesomeIcon icon={faBox} className="text-6xl mb-4" style={{ color: '#333333' }} />
          <p className="text-xl" style={{ color: '#888888' }}>No products yet</p>
          <p className="mt-2" style={{ color: '#666666' }}>Add your first product to get started</p>
          <Link
            href="/dashboard/products/new"
            className="inline-block mt-6 px-6 py-3 rounded-xl font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#E84E0F' }}>
            Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
              <div className="relative h-48 bg-gray-800 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faImage} className="text-5xl" style={{ color: '#333333' }} />
                )}
                {!product.is_available && (
                  <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                    Unavailable
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 truncate">{product.name}</h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: '#888888' }}>
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      LKR {product.current_price?.toLocaleString()}
                    </p>
                    {product.original_price !== product.current_price && (
                      <p className="text-sm line-through" style={{ color: '#666666' }}>
                        LKR {product.original_price?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: '#888888' }}>Stock</p>
                    <p className="text-lg font-bold text-white">{product.stock_quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: '#888888' }}>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faEye} />
                    {product.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faHeart} />
                    {product.favorites_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    ⭐ {product.average_rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold transition hover:opacity-80 disabled:opacity-50"
                    style={{ backgroundColor: '#1A1A1A', color: '#FF4444', border: '1px solid #333333' }}>
                    <FontAwesomeIcon icon={deleting === product.id ? faSpinner : faTrash} className={deleting === product.id ? 'animate-spin' : ''} />
                  </button>
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition hover:opacity-90 text-center"
                    style={{ backgroundColor: '#E84E0F' }}>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
