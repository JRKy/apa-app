import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Tooltip, useTheme } from '@mui/material';
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
  const theme = useTheme();

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
      },
      options
    );
  };

  return (
    <Tooltip title={isLocating ? "Locating..." : "Find my location"}>
      <span>
        <IconButton
          onClick={handleLocationClick}
          disabled={isLocating}
          color="inherit"
          title="Find my location"
          sx={{
            color: theme.palette.mode === 'dark' 
              ? theme.palette.grey[100] 
              : theme.palette.grey[900],
            backgroundColor: theme.palette.mode === 'dark'
              ? theme.palette.grey[800]
              : theme.palette.grey[100],
            boxShadow: theme.palette.mode === 'dark'
              ? '0 2px 4px rgba(0, 0, 0, 0.3)'
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? theme.palette.grey[700]
                : theme.palette.grey[200],
            },
            padding: { xs: '8px', sm: '6px' },
            fontSize: { xs: '1.25rem', sm: '1rem' },
          }}
        >
          <LocationOnIcon sx={{ fontSize: 'inherit' }} />
        </IconButton>
      </span>
    </Tooltip>
  );
}; 