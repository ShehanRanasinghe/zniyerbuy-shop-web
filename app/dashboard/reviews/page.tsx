'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faSpinner, faStar, faUser, faReply, faPaperPlane, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { productAPI, shopAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  rating: number;
  comment: string;
  created_at: string;
  shop_reply?: string;
  shop_reply_at?: string;
}

interface Product {
  id: string;
  name: string;
  average_rating: number;
  total_reviews: number;
}

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchReviewsAndProducts();
  }, []);

  const fetchReviewsAndProducts = async () => {
    try {
      setLoading(true);
      const shopId = localStorage.getItem('shopId');
      
      if (!shopId) {
        toast.error('Shop ID not found');
        return;
      }

      // Fetch products for this shop
      const productsResponse = await productAPI.getProducts({ shop_id: shopId });
      const shopProducts = productsResponse.data.data || [];
      setProducts(shopProducts);

      // Fetch reviews for all products
      const allReviews: Review[] = [];
      for (const product of shopProducts) {
        try {
          // Note: This endpoint needs to be created in the backend
          const reviewsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/reviews/product/${product.id}`
          );
          
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            const productReviews = reviewsData.data.map((review: any) => ({
              ...review,
              product_id: product.id,
              product_name: product.name,
              customer_name: review.users?.full_name || review.user?.full_name || 'Anonymous',
            }));
            allReviews.push(...productReviews);
          }
        } catch (error) {
          console.error(`Error fetching reviews for product ${product.id}:`, error);
        }
      }

      setReviews(allReviews);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      setSubmittingReply(true);
      
      // Note: This endpoint needs to be created in the backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/reviews/${reviewId}/reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ reply: replyText }),
        }
      );

      if (response.ok) {
        toast.success('Reply posted successfully');
        setReplyText('');
        setReplyingTo(null);
        fetchReviewsAndProducts();
      } else {
        toast.error('Failed to post reply');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const getFilteredReviews = () => {
    if (filter === 'all') return reviews;
    return reviews.filter(review => review.rating === parseInt(filter));
  };

  const getOverallRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingCount = (rating: number) => {
    return reviews.filter(r => r.rating === rating).length;
  };

  const getRatingPercentage = (rating: number) => {
    if (reviews.length === 0) return 0;
    return (getRatingCount(rating) / reviews.length) * 100;
  };

  const filteredReviews = getFilteredReviews();

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
          <FontAwesomeIcon icon={faComments} />
          Customer Reviews
        </h1>
        <p className="mt-2" style={{ color: '#888888' }}>
          View and respond to customer feedback on your products
        </p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-xl font-bold text-white mb-4">Overall Rating</h2>
          <div className="flex items-center gap-4">
            <div className="text-6xl font-bold" style={{ color: '#E84E0F' }}>
              {getOverallRating()}
            </div>
            <div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={faStar}
                    className="text-2xl"
                    style={{ color: star <= Number(getOverallRating()) ? '#FF9800' : '#333333' }}
                  />
                ))}
              </div>
              <p style={{ color: '#888888' }}>Based on {reviews.length} reviews</p>
              <p className="text-sm mt-1" style={{ color: '#666666' }}>
                Across {products.length} products
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <h2 className="text-xl font-bold text-white mb-4">Rating Distribution</h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-8 flex items-center gap-1" style={{ color: '#888888' }}>
                    {rating} <FontAwesomeIcon icon={faStar} style={{ color: '#FF9800' }} />
                  </span>
                <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: '#222222' }}>
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${getRatingPercentage(rating)}%`,
                      backgroundColor: '#E84E0F',
                    }}
                  />
                </div>
                <span className="text-sm w-12 text-right" style={{ color: '#888888' }}>
                  {getRatingCount(rating)} ({getRatingPercentage(rating).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <div className="flex gap-2 flex-wrap">
          {['all', '5', '4', '3', '2', '1'].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilter(rating as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === rating ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={{
                backgroundColor: filter === rating ? '#E84E0F' : '#1A1A1A',
                border: '1px solid #333333',
              }}>
              {rating === 'all' ? 'All Reviews' : `${rating} Stars`}
              {rating === 'all' && ` (${reviews.length})`}
              {rating !== 'all' && ` (${getRatingCount(parseInt(rating))})`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        {filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl p-6 hover:shadow-lg transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FEF0EB' }}>
                    <FontAwesomeIcon icon={faUser} style={{ color: '#E84E0F' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">{review.customer_name}</h3>
                        <p className="text-sm" style={{ color: '#888888' }}>{review.product_name}</p>
                      </div>
                      <span className="text-sm" style={{ color: '#666666' }}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          style={{ color: star <= review.rating ? '#FF9800' : '#333333' }}
                        />
                      ))}
                    </div>
                    <p style={{ color: '#CCCCCC' }} className="mb-4">{review.comment}</p>

                    {/* Shop Reply */}
                    {review.shop_reply && (
                      <div className="mt-4 pl-4 border-l-2" style={{ borderColor: '#E84E0F' }}>
                        <p className="text-sm font-semibold mb-1" style={{ color: '#E84E0F' }}>
                          Shop Owner Reply
                        </p>
                        <p style={{ color: '#CCCCCC' }}>{review.shop_reply}</p>
                        {review.shop_reply_at && (
                          <p className="text-xs mt-1" style={{ color: '#666666' }}>
                            {new Date(review.shop_reply_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Reply Form */}
                    {!review.shop_reply && (
                      <div className="mt-4">
                        {replyingTo === review.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              rows={3}
                              className="w-full px-4 py-3 rounded-lg text-white"
                              style={{
                                backgroundColor: '#0A0A0A',
                                border: '1px solid #333333',
                              }}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReply(review.id)}
                                disabled={submittingReply}
                                className="px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90 flex items-center gap-2"
                                style={{ backgroundColor: '#E84E0F' }}>
                                {submittingReply ? (
                                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                ) : (
                                  <FontAwesomeIcon icon={faPaperPlane} />
                                )}
                                Post Reply
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                                className="px-4 py-2 rounded-lg font-medium transition"
                                style={{
                                  backgroundColor: '#1A1A1A',
                                  border: '1px solid #333333',
                                  color: '#888888',
                                }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyingTo(review.id)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition hover:opacity-90 flex items-center gap-2"
                            style={{
                              backgroundColor: '#1A1A1A',
                              border: '1px solid #333333',
                              color: '#E84E0F',
                            }}>
                            <FontAwesomeIcon icon={faReply} />
                            Reply to Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faDatabase} className="text-6xl mb-4" style={{ color: '#333333' }} />
            <p className="text-xl font-semibold" style={{ color: '#888888' }}>No reviews found in database</p>
            <p className="text-sm mt-2" style={{ color: '#666666' }}>
              {filter !== 'all' ? 'Try selecting a different rating filter.' : 'Your products have not received any reviews yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
