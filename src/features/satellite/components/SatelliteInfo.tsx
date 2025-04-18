import { Box, Typography, Paper, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSatelliteTracking } from '@/hooks/useSatelliteTracking';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { SATELLITES, Satellite } from '@/constants/satellites';

const GOOD_ELEVATION_THRESHOLD = 10; // degrees
const POOR_ELEVATION_THRESHOLD = 0; // degrees

// Colors matching the elevation rules
const ELEVATION_COLORS = {
  good: '#4caf50',    // Green
  poor: '#ff9800',    // Orange
  hidden: '#f44336',  // Red
};

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

  return (
    <TableRow 
      sx={{ 
        '&:last-child td, &:last-child th': { border: 0 },
        backgroundColor,
        transition: 'background-color 0.3s ease',
      }}
    >
      <TableCell component="th" scope="row" sx={{ width: '30%' }}>
        {satellite.name}
      </TableCell>
      <TableCell align="right" sx={{ width: '15%', color: textColor, fontWeight: 'medium' }}>
        {pointingAngles ? `${pointingAngles.elevation.toFixed(1)}°` : '-'}
      </TableCell>
      <TableCell align="right" sx={{ width: '15%' }}>
        {pointingAngles ? `${pointingAngles.azimuth.toFixed(1)}°` : '-'}
      </TableCell>
      <TableCell align="right" sx={{ width: '20%' }}>
        {satellite.position.longitude.toFixed(1)}°
      </TableCell>
      <TableCell align="right" sx={{ width: '20%' }}>
        {satellite.position.altitude.toFixed(0)} {units === 'metric' ? 'km' : 'mi'}
      </TableCell>
    </TableRow>
  );
};

export const SatelliteInfo: React.FC = () => {
  const units = useSelector((state: RootState) => state.settings.units);
  const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);

  // Call hooks at the top level
  const satelliteData = SATELLITES.map(satellite => ({
    satellite,
    tracking: useSatelliteTracking(satellite.id)
  }));

  if (!selectedLocation) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Select a location on the map to see satellite information</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 500,
          color: theme => theme.palette.text.primary,
        }}
      >
        MUOS Satellites
      </Typography>
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: 'calc(100vh - 200px)',
          boxShadow: 'none',
          border: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        }}
      >
        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  width: '30%',
                  backgroundColor: theme => theme.palette.background.default,
                  borderBottom: theme => `1px solid ${theme.palette.divider}`,
                  color: theme => theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                Satellite
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  width: '15%',
                  backgroundColor: theme => theme.palette.background.default,
                  borderBottom: theme => `1px solid ${theme.palette.divider}`,
                  color: theme => theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                Elev
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  width: '15%',
                  backgroundColor: theme => theme.palette.background.default,
                  borderBottom: theme => `1px solid ${theme.palette.divider}`,
                  color: theme => theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                Az
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  width: '20%',
                  backgroundColor: theme => theme.palette.background.default,
                  borderBottom: theme => `1px solid ${theme.palette.divider}`,
                  color: theme => theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                Lon
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  width: '20%',
                  backgroundColor: theme => theme.palette.background.default,
                  borderBottom: theme => `1px solid ${theme.palette.divider}`,
                  color: theme => theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
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
            color: theme => theme.palette.text.secondary,
            fontSize: '0.75rem',
          }}
        >
          Colors indicate elevation status: 
          <Box component="span" sx={{ color: ELEVATION_COLORS.good }}> Good (≥{GOOD_ELEVATION_THRESHOLD}°)</Box>,
          <Box component="span" sx={{ color: ELEVATION_COLORS.poor }}> Poor (0-{GOOD_ELEVATION_THRESHOLD}°)</Box>,
          <Box component="span" sx={{ color: ELEVATION_COLORS.hidden }}> Hidden (≤0°)</Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default SatelliteInfo; 