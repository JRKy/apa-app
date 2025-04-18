import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline, LayersControl, ScaleControl, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCenter, setZoom, setSelectedLocation } from '@/store/mapSlice';

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

// Create satellite icon
const satelliteIcon = L.divIcon({
  className: 'satellite-marker',
  html: `<div style="
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1976d2;
    font-size: 24px;
  ">
    <i class="material-icons">satellite</i>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
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
      const { lat, lng } = e.latlng;
      dispatch(setSelectedLocation([lat, lng]));
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
      return { color: '#4caf50', weight: 2, opacity: 0.8, dashArray: '0' }; // Green, solid
    case 'poor':
      return { color: '#ff9800', weight: 1, opacity: 0.7, dashArray: '5,5' }; // Orange, dashed
    case 'hidden':
      return { color: '#f44336', weight: 1, opacity: 0.5, dashArray: '3,3' }; // Red, dotted
    default:
      return { color: '#1976d2', weight: 1, opacity: 0.7, dashArray: '5,5' };
  }
};

// Helper function to get marker icon based on visibility
const getMarkerIcon = (category: string) => {
  switch (category) {
    case 'good':
      return satelliteIcon;
    case 'poor':
      return satelliteIcon;
    case 'hidden':
      return satelliteIcon;
    default:
      return satelliteIcon;
  }
};

interface MapProps {
  mapRef: React.RefObject<L.Map | null>;
}

const Map: React.FC<MapProps> = ({ mapRef }) => {
  const center = useSelector((state: RootState) => state.map.center);
  const zoom = useSelector((state: RootState) => state.map.zoom);
  const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        zoomControl={false}
      >
        <ScaleControl position="bottomleft" />
        <ZoomControl position="topleft" />
        
        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapEvents />
        
        {selectedLocation && (
          <Marker
            position={selectedLocation}
            icon={satelliteIcon}
          >
            <Popup>
              Latitude: {selectedLocation[0].toFixed(6)}°<br />
              Longitude: {selectedLocation[1].toFixed(6)}°
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
          const markerIcon = getMarkerIcon(category);

          return (
            <React.Fragment key={satellite.id}>
              <Marker
                position={[satellite.position[0], satellite.position[1]]}
                icon={markerIcon}
              >
                <Popup>
                  {satellite.name}<br />
                  Elevation: {elevation.toFixed(1)}°
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