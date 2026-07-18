'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercentage, faPlus, faEdit, faTrash, faSpinner, faTags, faSearch } from '@fortawesome/free-solid-svg-icons';
import { dealAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  discount_kind?: 'promotion' | 'deal';
}

export default function DiscountsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activeTab, setActiveTab] = useState<'promotions' | 'deals'>('promotions');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await dealAPI.getDeals();
      if (response.data.success) {
        setDeals(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const getEditPath = (deal: Deal) => {
    const kind = deal.discount_kind || (activeTab === 'promotions' ? 'promotion' : 'deal');
    return kind === 'promotion'
      ? `/dashboard/discounts/promotions/${deal.id}/edit`
      : `/dashboard/discounts/deals/${deal.id}/edit`;
  };

  const handleDelete = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    try {
      await dealAPI.deleteDeal(dealId);
      toast.success('Deal deleted successfully');
      fetchDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
    }
  };

  // Filter deals by active tab (promotion vs deal) and search query.
  // Previously this only filtered by search, so both tabs showed everything.
  const getFilteredDeals = () => {
    const tabKind = activeTab === 'promotions' ? 'promotion' : 'deal';
    const byTab = deals.filter(deal => (deal.discount_kind || 'deal') === tabKind);

    if (!searchQuery.trim()) return byTab;

    return byTab.filter(deal =>
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredDeals = getFilteredDeals();

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
            <FontAwesomeIcon icon={faPercentage} />
            Discounts & Promotions
          </h1>
          <p className="mt-2" style={{ color: '#888888' }}>
            Manage your promotional offers and deals
          </p>
        </div>
        {/* Dynamic Create Button based on active tab */}
        {activeTab === 'promotions' ? (
          <button
            onClick={() => router.push('/dashboard/discounts/promotions/new')}
            className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: '#E84E0F' }}>
            <FontAwesomeIcon icon={faPlus} />
            Create Promotion
          </button>
        ) : (
          <button
            onClick={() => router.push('/dashboard/discounts/deals/new')}
            className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: '#E84E0F' }}>
            <FontAwesomeIcon icon={faPlus} />
            Create Deal
          </button>
        )}
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
            placeholder="Search promotions and deals..."
            className="w-full pl-12 pr-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'promotions' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'promotions' ? '#E84E0F' : '#1A1A1A',
              border: '1px solid #333333',
            }}>
            <FontAwesomeIcon icon={faPercentage} className="mr-2" />
            Promotions
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'deals' ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
            style={{
              backgroundColor: activeTab === 'deals' ? '#E84E0F' : '#1A1A1A',
              border: '1px solid #333333',
            }}>
            <FontAwesomeIcon icon={faTags} className="mr-2" />
            Deals
          </button>
        </div>

        {/* Deals List */}
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="rounded-xl p-6 hover:shadow-lg transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
                    <span className="text-2xl font-bold" style={{ color: '#E84E0F' }}>
                      {deal.discount_percentage}%
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      deal.is_active ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'
                    }`}>
                    {deal.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{deal.title}</h3>
                <p className="text-sm mb-4" style={{ color: '#888888' }}>{deal.description}</p>

                <div className="mb-4 text-sm" style={{ color: '#666666' }}>
                  <p>Start: {new Date(deal.start_date).toLocaleDateString()}</p>
                  <p>End: {new Date(deal.end_date).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(getEditPath(deal))}
                    className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-80"
                    style={{ backgroundColor: '#2A7F8A' }}>
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id)}
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
            <FontAwesomeIcon icon={activeTab === 'promotions' ? faPercentage : faTags} className="text-6xl mb-4" style={{ color: '#333333' }} />
            <p className="text-xl mb-4" style={{ color: '#888888' }}>
              {searchQuery ? 'No results found' : `No ${activeTab} found`}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push(activeTab === 'promotions' ? '/dashboard/discounts/promotions/new' : '/dashboard/discounts/deals/new')}
                className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
                style={{ backgroundColor: '#E84E0F' }}>
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Create Your First {activeTab === 'promotions' ? 'Promotion' : 'Deal'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}