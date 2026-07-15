'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faSpinner, faStore, faMapMarkerAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { shopAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import MapView from "@/components/MapView";

interface ShopLocation {
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export default function MapViewPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shopLocation, setShopLocation] = useState<ShopLocation | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  useEffect(() => {
    fetchShopLocation();
  }, []);

  const getShopId = async () => {
    // Try to get from localStorage first
    let shopId = localStorage.getItem('shopId');
    
    // If not in localStorage, fetch from current user
    if (!shopId) {
      try {
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/v1/auth/me`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          shopId = userData.data.shop_id;
          
          // Store it for future use
          if (shopId) {
            localStorage.setItem('shopId', shopId);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    
    return shopId;
  };

  const fetchShopLocation = async () => {
    try {
      setLoading(true);
      const shopId = await getShopId();
      
      if (shopId) {
        const response = await shopAPI.getShop(shopId);
        if (response.data.success) {
          const shop = response.data.data;
          setShopLocation({
            name: shop.name,
            address: shop.address,
            city: shop.city,
            latitude: shop.latitude,
            longitude: shop.longitude,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching shop location:', error);
      toast.error('Failed to load shop location');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setSelectedLocation({ lat, lng, address });
    toast.success('Location selected. Click "Confirm Location" to save.');
  };

  const handleConfirmLocation = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    try {
      setSaving(true);
      const shopId = await getShopId();
      
      if (!shopId) {
        toast.error('Shop ID not found. Please make sure you have a shop created.');
        return;
      }

      const updateData = {
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        address: selectedLocation.address,
      };

      const response = await shopAPI.updateShop(shopId, updateData);

      if (response.data.success) {
        toast.success('Location saved successfully!');
        setSelectedLocation(null);
        fetchShopLocation();
      } else {
        toast.error('Failed to save location');
      }
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Failed to save location');
    } finally {
      setSaving(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FontAwesomeIcon icon={faMapMarkedAlt} />
            Shop Location
          </h1>
          <p className="mt-2" style={{ color: '#888888' }}>
            Click on the map to set your shop location
          </p>
        </div>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "2px solid #E84E0F" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Selected Location</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold" style={{ color: '#888888' }}>Latitude:</span>
                  <span className="text-sm text-white">{selectedLocation.lat.toFixed(6)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold" style={{ color: '#888888' }}>Longitude:</span>
                  <span className="text-sm text-white">{selectedLocation.lng.toFixed(6)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-semibold" style={{ color: '#888888' }}>Address:</span>
                  <span className="text-sm text-white">{selectedLocation.address}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleConfirmLocation}
              disabled={saving}
              className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: '#E84E0F' }}>
              {saving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Confirm Location
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Current Location Info */}
      {shopLocation && shopLocation.latitude && shopLocation.longitude && (
        <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF0EB' }}>
              <FontAwesomeIcon icon={faStore} className="text-2xl" style={{ color: '#E84E0F' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{shopLocation.name}</h2>
              <p className="mt-1 flex items-center gap-2" style={{ color: '#888888' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                {shopLocation.address}
              </p>
              <p className="mt-1 text-sm" style={{ color: '#666666' }}>
                Coordinates: {shopLocation.latitude.toFixed(6)}, {shopLocation.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <MapView
          center={
            shopLocation?.latitude && shopLocation?.longitude
              ? { lat: shopLocation.latitude, lng: shopLocation.longitude }
              : { lat: 7.8731, lng: 80.7718 }
          }
          zoom={shopLocation?.latitude ? 15 : 7}
          onLocationSelect={handleLocationSelect}
          currentMarker={
            shopLocation?.latitude && shopLocation?.longitude
              ? { lat: shopLocation.latitude, lng: shopLocation.longitude }
              : undefined
          }
        />
      </div>

      {/* Instructions */}
      <div className="rounded-xl p-6" style={{ backgroundColor: "#111111", border: "1px solid #222222" }}>
        <h3 className="text-lg font-bold text-white mb-4">How to set your location</h3>
        <ol className="space-y-2" style={{ color: '#888888' }}>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#E84E0F' }}>1.</span>
            <span>Click anywhere on the map to select your shop location</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#E84E0F' }}>2.</span>
            <span>The latitude, longitude, and address will be automatically filled</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#E84E0F' }}>3.</span>
            <span>Review the selected location details</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold" style={{ color: '#E84E0F' }}>4.</span>
            <span>Click "Confirm Location" to save your shop location</span>
          </li>
        </ol>
        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
          <p className="text-sm" style={{ color: '#888888' }}>
            <span className="font-semibold" style={{ color: '#E84E0F' }}>Tip:</span> You can zoom in/out and pan the map to find your exact location. The map is focused on Sri Lanka by default.
          </p>
        </div>
      </div>
    </div>
  );
}
