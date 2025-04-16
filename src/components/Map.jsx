import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { supabase } from '../lib/supabaseClient';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [mapSettings, setMapSettings] = useState({
    center: [21.1458, 79.0882],
    zoom: 12,
    bounds: null
  });
  const [landmarks, setLandmarks] = useState([]);
  const [heatZones, setHeatZones] = useState([]);

  useEffect(() => {
    async function initializeMap() {
      // Get initial map settings
      const { data: settings } = await supabase.rpc('get_initial_map_view');
      if (settings) {
        setMapSettings({
          center: [settings.center_lat, settings.center_lng],
          zoom: settings.zoom,
          bounds: settings.default_bounds
        });
      }

      // Get landmarks
      const { data: landmarkData } = await supabase.rpc('get_nagpur_landmarks');
      if (landmarkData) {
        setLandmarks(landmarkData);
      }

      // Get heat zones
      const { data: zoneData } = await supabase.rpc('get_nagpur_heat_zones');
      if (zoneData) {
        setHeatZones(zoneData);
      }
    }

    initializeMap();
  }, []);

  return (
    <MapContainer
      center={mapSettings.center}
      zoom={mapSettings.zoom}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Render Landmarks */}
      {landmarks.map(landmark => (
        <Marker 
          key={landmark.name}
          position={[landmark.lat, landmark.lng]}
        >
          <Popup>
            <h3>{landmark.name}</h3>
            <p>Type: {landmark.type}</p>
          </Popup>
        </Marker>
      ))}

      {/* Render Heat Zones */}
      {heatZones.map(zone => (
        <Marker
          key={zone.zone_name}
          position={[zone.center_lat, zone.center_lng]}
        >
          <Popup>
            <h3>{zone.zone_name}</h3>
            <p>Type: {zone.zone_type}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;