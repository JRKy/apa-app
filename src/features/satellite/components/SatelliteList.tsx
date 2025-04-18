import { Box, Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import SatelliteIcon from '@mui/icons-material/Satellite';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { calculateElevationAngle } from '../utils/satelliteUtils';
import { SATELLITES } from '@/constants/satellites';

const getVisibilityCategory = (elevation: number) => {
  if (elevation <= 0) return 'hidden';
  if (elevation < 10) return 'poor';
  return 'good';
};

const getStatusColor = (category: string) => {
  switch (category) {
    case 'good':
      return '#4caf50'; // Green
    case 'poor':
      return '#ff9800'; // Orange
    case 'hidden':
      return '#f44336'; // Red
    default:
      return '#1976d2';
  }
};

const SatelliteList = () => {
  const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);

  if (!selectedLocation) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Click on the map to select a location and view satellite details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Satellite Visibility
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Selected Location: {selectedLocation[0].toFixed(4)}°, {selectedLocation[1].toFixed(4)}°
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {SATELLITES.map((satellite) => {
          const elevation = calculateElevationAngle(
            selectedLocation[0],
            selectedLocation[1],
            satellite.position.latitude,
            satellite.position.longitude,
            satellite.position.altitude
          );
          const category = getVisibilityCategory(elevation);
          const statusColor = getStatusColor(category);
          
          return (
            <Paper
              key={satellite.id}
              elevation={1}
              sx={{ mb: 1, borderLeft: `4px solid ${statusColor}` }}
            >
              <ListItem>
                <ListItemIcon>
                  <SatelliteIcon sx={{ color: statusColor }} />
                </ListItemIcon>
                <ListItemText
                  primary={satellite.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Elevation: {elevation.toFixed(1)}°
                        <br />
                        Status: {
                          category === 'good' ? 'Good Visibility' :
                          category === 'poor' ? 'Poor Visibility' :
                          'Below Horizon'
                        }
                        <br />
                        Position: {satellite.position.latitude.toFixed(2)}°, {satellite.position.longitude.toFixed(2)}°
                        <br />
                        Altitude: {satellite.position.altitude.toFixed(0)} km
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </Paper>
          );
        })}
      </List>
    </Box>
  );
};

export default SatelliteList; 