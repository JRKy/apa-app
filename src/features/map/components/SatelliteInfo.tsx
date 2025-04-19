import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Satellite } from '../types/satellite';

interface SatelliteInfoProps {
  satellite: Satellite;
}

const SatelliteInfo: React.FC<SatelliteInfoProps> = ({ satellite }) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {satellite.name}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        <Typography>Elevation:</Typography>
        <Typography>{satellite.elevation.toFixed(2)}°</Typography>
        <Typography>Azimuth:</Typography>
        <Typography>{satellite.azimuth.toFixed(2)}°</Typography>
        <Typography>Longitude:</Typography>
        <Typography>{satellite.longitude.toFixed(2)}°</Typography>
        <Typography>Altitude:</Typography>
        <Typography>{satellite.altitude.toFixed(2)} km</Typography>
      </Box>
    </Paper>
  );
};

export default SatelliteInfo; 