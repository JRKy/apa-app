import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import { setCenter, setSelectedLocation } from '@/store/mapSlice';
import L from 'leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface LocationButtonProps {
  mapRef: React.RefObject<L.Map | null>;
  onLocationFound: (location: [number, number]) => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({ mapRef, onLocationFound }) => {
  const dispatch = useDispatch();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCenter: [number, number] = [latitude, longitude];
        if (mapRef.current) {
          mapRef.current.setView(newCenter, 13);
        }
        dispatch(setCenter(newCenter));
        dispatch(setSelectedLocation(newCenter));
        onLocationFound(newCenter);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Location error:', error.message);
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert('Please enable location access in your browser settings to use this feature.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('Location information is unavailable. Please check your device settings.');
        } else if (error.code === error.TIMEOUT) {
          alert('Location request timed out. Please try again.');
        }
      },
      options
    );
  };

  const button = (
    <IconButton
      onClick={handleLocationClick}
      disabled={isLocating}
      color="inherit"
      aria-label="Find my location"
    >
      <LocationOnIcon />
    </IconButton>
  );

  return isLocating ? (
    <span style={{ display: 'inline-flex' }}>
      {button}
    </span>
  ) : (
    <Tooltip title="Find my location">
      {button}
    </Tooltip>
  );
}; 