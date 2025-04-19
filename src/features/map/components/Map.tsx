import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline, LayersControl, ScaleControl, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCenter, setZoom, setSelectedLocation } from '@/store/mapSlice';
import SearchBox from './SearchBox';
import { formatAngle, formatSatelliteAngles } from '@/features/satellite/utils/satelliteUtils';

// MUOS and ALT satellite positions (geostationary)
const SATELLITES = [
  {
    id: 'muos-2',
    name: 'MUOS-2',
    position: [0.0, -177.0, 35786], // Geostationary orbit
  },
  {
    id: 'muos-5',
    name: 'MUOS-5',
    position: [0.0, -100.0, 35786],
  },
  {
    id: 'muos-3',
    name: 'MUOS-3',
    position: [0.0, -15.5, 35786],
  },
  {
    id: 'muos-4',
    name: 'MUOS-4',
    position: [0.0, 75.0, 35786],
  },
  {
    id: 'alt-2',
    name: 'ALT-2',
    position: [0.0, -127.0, 35786],
  },
  {
    id: 'alt-3',
    name: 'ALT-3',
    position: [0.0, -24.0, 35786],
  },
  {
    id: 'alt-1',
    name: 'ALT-1',
    position: [0.0, 110.0, 35786],
  },
  {
    id: 'alt-4',
    name: 'ALT-4',
    position: [0.0, 170.0, 35786],
  },
];

// Update the satellite icon definition to include a label and theme support
const createSatelliteIcon = (name: string, longitude: number) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.theme === 'dark');
  
  return L.divIcon({
    className: 'satellite-marker',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        min-width: 120px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      ">
        <div style="
          font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: ${isDarkMode ? '#E2E8F0' : '#1A202C'};
          background: ${isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          padding: 4px 8px;
          border-radius: 6px;
          margin-bottom: 4px;
          white-space: nowrap;
          box-shadow: ${isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'};
          line-height: 1.4;
        ">
          <div style="font-weight: 600;">${name}</div>
          <div style="color: ${isDarkMode ? '#A0AEC0' : '#4A5568'};">${longitude.toFixed(1)}°</div>
        </div>
        <div style="
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'white'};
          border-radius: 50%;
          box-shadow: ${isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'};
        ">
          <span class="material-icons" style="
            color: ${isDarkMode ? '#60A5FA' : '#2563EB'};
            font-size: 20px;
          ">
            satellite_alt
          </span>
        </div>
      </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 60],
    popupAnchor: [0, -64]
  });
};

// Add back the locationIcon definition
const locationIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapEvents: React.FC = () => {
  const dispatch = useDispatch();
  const center = useSelector((state: RootState) => state.map.center);
  const zoom = useSelector((state: RootState) => state.map.zoom);
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      dispatch(setCenter([center.lat, center.lng]));
      dispatch(setZoom(zoom));
    },
    click: (e) => {
      // Check if the click was on a control element
      const target = e.originalEvent.target as HTMLElement;
      const isControlClick = target.closest('.leaflet-control-search') || 
                           target.closest('.MuiTextField-root') ||
                           target.closest('.MuiIconButton-root');
      
      if (!isControlClick) {
        const { lat, lng } = e.latlng;
        dispatch(setSelectedLocation([lat, lng]));
      }
    }
  });

  return null;
};

// Calculate elevation angle between observer and satellite
export const calculateElevationAngle = (observerLat: number, observerLon: number, satLat: number, satLon: number, satAlt: number): number => {
  // Convert to radians
  const lat1 = (observerLat * Math.PI) / 180;
  const lon1 = (observerLon * Math.PI) / 180;
  const lat2 = (satLat * Math.PI) / 180;
  const lon2 = (satLon * Math.PI) / 180;

  // Calculate great circle distance
  const dLon = lon2 - lon1;
  const dLat = lat2 - lat1;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(lat1) * Math.cos(lat2) * 
           Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const R = 6371; // Earth's radius in km

  // Calculate elevation angle using more accurate spherical geometry
  const h = satAlt; // Satellite altitude in km
  const elevation = Math.atan2(
    Math.cos(c) * (R + h) - R,
    Math.sin(c) * (R + h)
  );

  return (elevation * 180) / Math.PI; // Convert to degrees
};

// Helper function to determine visibility category
const getVisibilityCategory = (elevation: number) => {
  if (elevation <= 5) return 'hidden';  // Below or just above horizon
  if (elevation < 20) return 'poor';    // Poor visibility
  return 'good';                        // Good visibility
};

// Helper function to get line style based on visibility
const getLineStyle = (category: string) => {
  switch (category) {
    case 'good':
      return { 
        color: '#2E7D32', // Dark green
        weight: 3, 
        opacity: 0.9, 
        dashArray: '0',
        className: 'line-good' // For additional styling
      };
    case 'poor':
      return { 
        color: '#1565C0', // Blue instead of orange
        weight: 2, 
        opacity: 0.9, 
        dashArray: '5,5',
        className: 'line-poor'
      };
    case 'hidden':
      return { 
        color: '#C62828', // Red
        weight: 2, 
        opacity: 0.9, 
        dashArray: '3,3',
        className: 'line-hidden'
      };
    default:
      return { 
        color: '#1565C0', 
        weight: 2, 
        opacity: 0.9, 
        dashArray: '5,5',
        className: 'line-default'
      };
  }
};

// Helper function to get marker icon based on visibility
const getMarkerIcon = (category: string, name: string, longitude: number) => {
  return createSatelliteIcon(name, longitude);
};

// Map API keys (should be moved to environment variables in production)
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFpbmFyY2h5IiwiYSI6ImNscnB6c2F0ZzA0dW0yaXF0d2F0Z2F0dW0ifQ.9JZJZJZJZJZJZJZJZJZJZJZ';
const THUNDERFOREST_API_KEY = import.meta.env.VITE_THUNDERFOREST_API_KEY || '9b2b6c0f0f0f0f0f0f0f0f0f0f0f0f0';
const STADIA_API_KEY = import.meta.env.VITE_STADIA_API_KEY || '9b2b6c0f0f0f0f0f0f0f0f0f0f0f0f0';

interface MapProps {
  mapRef: React.RefObject<L.Map>;
}

const Map: React.FC<MapProps> = ({ mapRef }) => {
  const center = useSelector((state: RootState) => state.map.center);
  const zoom = useSelector((state: RootState) => state.map.zoom);
  const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);
  const theme = useSelector((state: RootState) => state.ui.theme);
  const isDarkMode = theme === 'dark';

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={false}
        aria-label="Interactive map"
      >
        <ZoomControl 
          position="topleft"
          zoomInText="+"
          zoomOutText="-"
          zoomInTitle="Zoom in"
          zoomOutTitle="Zoom out"
        />
        <ScaleControl 
          position="bottomleft"
          imperial={false}
        />
        <LayersControl 
          position="topright"
          collapsed={false}
        >
          <LayersControl.BaseLayer checked={!isDarkMode} name="Light">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={isDarkMode} name="Dark Mode">
            <TileLayer
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={20}
              subdomains="abcd"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={17}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <SearchBox />
        <MapEvents />
        
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            icon={locationIcon}
          >
            <Popup>
              <div style={{
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                fontSize: '0.875rem',
                lineHeight: '1.6',
              }}>
                <div style={{ fontWeight: 600, color: '#1A202C', marginBottom: '4px' }}>Selected Location</div>
                <div style={{ color: '#4A5568' }}>
                  Latitude: {selectedLocation[0].toFixed(6)}°<br />
                  Longitude: {selectedLocation[1].toFixed(6)}°
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {SATELLITES.map((satellite) => {
          const observerLocation = selectedLocation || center;
          const elevation = calculateElevationAngle(
            observerLocation[0],
            observerLocation[1],
            satellite.position[0],
            satellite.position[1],
            satellite.position[2]
          );
          const category = getVisibilityCategory(elevation);
          const lineStyle = getLineStyle(category);
          const markerIcon = getMarkerIcon(category, satellite.name, satellite.position[1]);

          return (
            <React.Fragment key={satellite.id}>
              <Marker
                position={[satellite.position[0], satellite.position[1]]}
                icon={markerIcon}
              >
                <Popup>
                  <div style={{
                    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    minWidth: '160px',
                  }}>
                    <div style={{ fontWeight: 600, color: '#1A202C', marginBottom: '4px' }}>
                      {satellite.name}
                    </div>
                    <div style={{ 
                      color: '#4A5568',
                      fontFamily: 'monospace',
                      fontSize: '0.8125rem',
                    }}>
                      Elevation:{formatAngle(elevation)}<br />
                      Longitude:{formatAngle(satellite.position[1])}
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {selectedLocation && (
                <Polyline
                  positions={[
                    [selectedLocation[0], selectedLocation[1]],
                    [satellite.position[0], satellite.position[1]]
                  ]}
                  pathOptions={lineStyle}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default Map; 