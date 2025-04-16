import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const MapComponent = () => {
  const mapRef = useRef(null);
  const defaultCenter = { lat: 21.1458, lng: 79.0882 };

  useEffect(() => {
    // Load Google Maps Script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = async () => {
    const { data: settings } = await supabase.rpc('get_initial_map_view');
    
    const map = new window.google.maps.Map(mapRef.current, {
      center: settings ? 
        { lat: settings.center_lat, lng: settings.center_lng } : 
        defaultCenter,
      zoom: settings?.zoom || 12,
      styles: [], // Add custom styles here if needed
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true
    });

    // Load and add markers for landmarks
    const { data: landmarks } = await supabase.rpc('get_nagpur_landmarks');
    landmarks?.forEach(landmark => {
      new window.google.maps.Marker({
        position: { lat: landmark.lat, lng: landmark.lng },
        map,
        title: landmark.name,
        icon: getMarkerIcon(landmark.type)
      });
    });
  };

  const getMarkerIcon = (type) => {
    // Define custom marker icons based on type
    const icons = {
      landmark: 'path/to/landmark-icon.png',
      religious: 'path/to/religious-icon.png',
      water_body: 'path/to/water-icon.png',
      historical: 'path/to/historical-icon.png'
    };
    return icons[type] || null;
  };

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default MapComponent;