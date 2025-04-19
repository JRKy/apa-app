import { Box, Typography, Paper, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useSatelliteTracking } from '@/hooks/useSatelliteTracking';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { SATELLITES, Satellite } from '@/constants/satellites';
import { setUnits } from '@/store/settingsSlice';
import { useState, useEffect } from 'react';
import { Theme } from '@mui/material/styles';

const GOOD_ELEVATION_THRESHOLD = 10; // degrees
const POOR_ELEVATION_THRESHOLD = 0; // degrees

// Colors matching the elevation rules
const ELEVATION_COLORS = {
  good: '#4caf50',    // Green
  poor: '#2196f3',    // Blue
  hidden: '#f44336',  // Red
};

const KM_TO_MILES = 0.621371;

interface SatelliteRowProps {
  satellite: Satellite;
  pointingAngles: {
    azimuth: number;
    elevation: number;
  } | null;
  units: 'metric' | 'imperial';
}

const getElevationColor = (elevation: number | undefined | null) => {
  if (elevation == null) return 'inherit';
  if (elevation >= GOOD_ELEVATION_THRESHOLD) return `${ELEVATION_COLORS.good}20`;
  if (elevation > POOR_ELEVATION_THRESHOLD) return `${ELEVATION_COLORS.poor}20`;
  return `${ELEVATION_COLORS.hidden}20`;
};

const getElevationTextColor = (elevation: number | undefined | null) => {
  if (elevation == null) return 'inherit';
  if (elevation >= GOOD_ELEVATION_THRESHOLD) return ELEVATION_COLORS.good;
  if (elevation > POOR_ELEVATION_THRESHOLD) return ELEVATION_COLORS.poor;
  return ELEVATION_COLORS.hidden;
};

const SatelliteRow: React.FC<SatelliteRowProps> = ({ satellite, pointingAngles, units }) => {
  const backgroundColor = getElevationColor(pointingAngles?.elevation);
  const textColor = getElevationTextColor(pointingAngles?.elevation);
  
  // Get elevation status for accessibility
  const getElevationStatus = (elevation: number | undefined | null) => {
    if (elevation == null) return 'Unknown';
    if (elevation >= GOOD_ELEVATION_THRESHOLD) return 'Good';
    if (elevation > POOR_ELEVATION_THRESHOLD) return 'Poor';
    return 'Hidden';
  };

  const elevationStatus = getElevationStatus(pointingAngles?.elevation);
  
  // Convert altitude based on units
  const altitude = units === 'metric' 
    ? satellite.position.altitude 
    : satellite.position.altitude * KM_TO_MILES;

  return (
    <TableRow 
      sx={{ 
        '&:last-child td, &:last-child th': { border: 0 },
        backgroundColor,
        transition: 'background-color 0.3s ease',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: textColor,
        }
      }}
      aria-label={`${satellite.name} - ${elevationStatus} visibility`}
    >
      <TableCell 
        sx={{ 
          textAlign: 'center',
          padding: '8px',
          minWidth: '120px'
        }}
      >
        {satellite.name}
      </TableCell>
      <TableCell 
        sx={{ 
          textAlign: 'center',
          padding: '8px',
          minWidth: '80px',
          color: textColor,
          fontWeight: 'bold'
        }}
      >
        {elevationStatus}
      </TableCell>
      <TableCell 
        sx={{ 
          textAlign: 'center',
          padding: '8px',
          color: textColor,
          fontWeight: 'medium',
          minWidth: '80px'
        }}
      >
        {pointingAngles ? `${pointingAngles.elevation.toFixed(1)}°` : '-'}
      </TableCell>
      <TableCell 
        sx={{ 
          textAlign: 'center',
          padding: '8px',
          minWidth: '80px'
        }}
      >
        {pointingAngles ? `${pointingAngles.azimuth.toFixed(1)}°` : '-'}
      </TableCell>
      <TableCell 
        sx={{ 
          textAlign: 'center',
          padding: '8px',
          minWidth: '80px'
        }}
      >
        {satellite.position.longitude.toFixed(1)}°
      </TableCell>
      <TableCell 
        sx={{ 
          textAlign: 'center',
          padding: '8px',
          minWidth: '100px'
        }}
      >
        {altitude.toFixed(0)} {units === 'metric' ? 'km' : 'mi'}
      </TableCell>
    </TableRow>
  );
};

export const SatelliteInfo: React.FC = () => {
  const dispatch = useDispatch();
  const units = useSelector((state: RootState) => state.settings.units);
  const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);
  const [locationName, setLocationName] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationName = async () => {
      if (!selectedLocation) return;
      
      try {
        const [lat, lon] = selectedLocation;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          {
            headers: {
              'User-Agent': 'APA-App/1.0',
              'Accept-Language': 'en',
            },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch location name');
        const data = await response.json();
        setLocationName(data.display_name);
      } catch (error) {
        console.error('Error fetching location name:', error);
        setLocationName(null);
      }
    };

    fetchLocationName();
  }, [selectedLocation]);

  const formatCoordinates = (lat: number, lon: number) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
  };

  // Call hooks at the top level
  const satelliteData = SATELLITES.map(satellite => ({
    satellite,
    tracking: useSatelliteTracking(satellite.id)
  }));

  if (!selectedLocation) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert 
          severity="info"
          sx={{
            '& .MuiAlert-message': {
              fontFamily: (theme: Theme) => theme.typography.fontFamily,
              fontSize: '0.875rem',
              fontWeight: 500,
            }
          }}
        >
          Select a location on the map to see satellite information
        </Alert>
      </Box>
    );
  }

  const headerText = locationName || formatCoordinates(selectedLocation[0], selectedLocation[1]);

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: (theme: Theme) => theme.palette.text.primary,
            maxWidth: '70%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '1rem',
            [`${(theme: Theme) => theme.breakpoints.up('sm')}`]: {
              fontSize: '1.25rem',
            }
          }}
          title={headerText}
        >
          {headerText}
        </Typography>
        <ToggleButtonGroup
          value={units}
          exclusive
          onChange={(_, newUnits) => newUnits && dispatch(setUnits(newUnits))}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              fontFamily: (theme: Theme) => theme.typography.fontFamily,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              px: 2
            }
          }}
        >
          <ToggleButton value="metric">km</ToggleButton>
          <ToggleButton value="imperial">mi</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: 'calc(100vh - 200px)',
          boxShadow: 'none',
          border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1.5,
        }}
      >
        <Table 
          size="small" 
          sx={{ 
            tableLayout: 'auto', // Changed from 'fixed' to 'auto' for dynamic columns
            '& .MuiTableCell-root': {
              fontFamily: (theme: Theme) => theme.typography.fontFamily,
              fontSize: '0.875rem',
              whiteSpace: 'nowrap' // Prevent text wrapping
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                Satellite
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                Status
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                Elev
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                Az
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                Lon
              </TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                Alt
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {satelliteData.map(({ satellite, tracking }) => (
              <SatelliteRow
                key={satellite.id}
                satellite={satellite}
                pointingAngles={tracking.pointingAngles}
                units={units}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: (theme: Theme) => theme.palette.text.secondary,
            fontSize: '0.75rem',
          }}
        >
          Colors indicate elevation status: 
          <Box component="span" sx={{ color: ELEVATION_COLORS.good }}> Good (≥{GOOD_ELEVATION_THRESHOLD}°)</Box>,
          <Box component="span" sx={{ color: ELEVATION_COLORS.poor }}> Poor ({POOR_ELEVATION_THRESHOLD}-{GOOD_ELEVATION_THRESHOLD}°)</Box>,
          <Box component="span" sx={{ color: ELEVATION_COLORS.hidden }}> Hidden (&lt;{POOR_ELEVATION_THRESHOLD}°)</Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default SatelliteInfo; 