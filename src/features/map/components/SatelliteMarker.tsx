import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Satellite } from '../types/satellite';

interface SatelliteMarkerProps {
  satellite: Satellite;
  position: L.LatLngExpression;
}

const SatelliteMarker: React.FC<SatelliteMarkerProps> = ({ satellite, position }) => {
  const icon = L.divIcon({
    className: 'satellite-marker',
    html: `<div class="satellite-dot" style="background-color: ${satellite.color}"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div>
          <h3>{satellite.name}</h3>
          <p>Elevation: {satellite.elevation.toFixed(2)}°</p>
          <p>Azimuth: {satellite.azimuth.toFixed(2)}°</p>
          <p>Longitude: {satellite.longitude.toFixed(2)}°</p>
          <p>Altitude: {satellite.altitude.toFixed(2)} km</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default SatelliteMarker; 