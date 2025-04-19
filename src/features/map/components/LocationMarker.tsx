import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Location } from '../types/location';

interface LocationMarkerProps {
  location: Location;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ location }) => {
  const icon = L.divIcon({
    className: 'location-marker',
    html: '<div class="location-dot"></div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });

  return (
    <Marker position={[location.latitude, location.longitude]} icon={icon}>
      <Popup>
        <div>
          <h3>{location.name}</h3>
          <p>Latitude: {location.latitude.toFixed(4)}°</p>
          <p>Longitude: {location.longitude.toFixed(4)}°</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default LocationMarker; 