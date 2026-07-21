// MapView — Interactive Google Maps component for setting shop location
// Allows users to click on map to select coordinates, uses reverse geocoding for address
// Shows a marker at the selected or current shop location

'use client';

import { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

interface MapViewProps {
  center: { lat: number; lng: number };
  zoom: number;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  currentMarker?: { lat: number; lng: number };
}

export default function MapView({ center, zoom, onLocationSelect, currentMarker }: MapViewProps) {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    currentMarker || null
  );
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Handle map click — place marker and reverse geocode address
  const handleMapClick = useCallback(
    async (event: { detail: { latLng: { lat: number; lng: number } } }) => {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;

      setMarkerPosition({ lat, lng });

      // Reverse geocode to get human-readable address
      if (typeof window !== 'undefined' && window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        try {
          const response = await geocoder.geocode({ location: { lat, lng } });
          if (response.results && response.results[0]) {
            const address = response.results[0].formatted_address;
            onLocationSelect?.(lat, lng, address);
          } else {
            onLocationSelect?.(lat, lng, 'Address not found');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          onLocationSelect?.(lat, lng, 'Unable to fetch address');
        }
      } else {
        onLocationSelect?.(lat, lng, 'Geocoding not available');
      }
    },
    [onLocationSelect]
  );

  // Show message when API key is not configured
  if (!apiKey) {
    return (
      <div
        style={{
          height: '600px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1A1A1A',
          color: '#888888',
        }}>
        <p>Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '600px', width: '100%' }}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          onClick={handleMapClick as (event: unknown) => void}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={true}
          streetViewControl={false}
          fullscreenControl={true}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}>
          {markerPosition && <AdvancedMarker position={markerPosition} />}
        </Map>
      </div>
    </APIProvider>
  );
}
