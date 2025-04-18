import React from 'react';
import { Box, Typography, Paper, LinearProgress, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularAlt2BarIcon from '@mui/icons-material/SignalCellularAlt2Bar';
import SignalCellularAlt1BarIcon from '@mui/icons-material/SignalCellularAlt1Bar';

interface PointingAngles {
  azimuth: number;
  elevation: number;
}

interface SatellitePointingDisplayProps {
  satelliteName: string;
  pointingAngles: PointingAngles;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)'
    : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
  boxShadow: theme.shadows[4],
  borderRadius: '12px',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const AngleDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& .MuiLinearProgress-root': {
    height: '8px',
    borderRadius: '4px',
    marginLeft: theme.spacing(1),
    flexGrow: 1,
  },
}));

const getSignalStrength = (elevation: number) => {
  if (elevation >= 30) return { icon: <SignalCellularAltIcon color="success" />, quality: 'Excellent' };
  if (elevation >= 20) return { icon: <SignalCellularAlt2BarIcon color="warning" />, quality: 'Good' };
  if (elevation >= 10) return { icon: <SignalCellularAlt1BarIcon color="error" />, quality: 'Poor' };
  return { icon: <SignalCellularAlt1BarIcon color="disabled" />, quality: 'No Signal' };
};

const getAzimuthIndicator = (azimuth: number) => {
  const normalizedAzimuth = ((azimuth % 360) + 360) % 360;
  return normalizedAzimuth > 180 ? <TrendingDownIcon /> : <TrendingUpIcon />;
};

const SatellitePointingDisplay: React.FC<SatellitePointingDisplayProps> = ({
  satelliteName,
  pointingAngles,
}) => {
  const { azimuth, elevation } = pointingAngles;
  const signalInfo = getSignalStrength(elevation);
  const azimuthIndicator = getAzimuthIndicator(azimuth);

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        {satelliteName}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Tooltip title={`Signal Quality: ${signalInfo.quality}`}>
          <Box sx={{ mr: 1 }}>{signalInfo.icon}</Box>
        </Tooltip>
        <Typography variant="body2" color="text.secondary">
          {signalInfo.quality}
        </Typography>
      </Box>

      <AngleDisplay>
        <Typography variant="body2" sx={{ minWidth: '80px' }}>
          Elevation:
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(100, (elevation / 90) * 100)}
          color={elevation >= 30 ? 'success' : elevation >= 20 ? 'warning' : 'error'}
        />
        <Typography variant="body2" sx={{ ml: 1, minWidth: '40px' }}>
          {elevation.toFixed(1)}°
        </Typography>
      </AngleDisplay>

      <AngleDisplay>
        <Typography variant="body2" sx={{ minWidth: '80px' }}>
          Azimuth:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ mr: 1 }}>{azimuthIndicator}</Box>
          <Typography variant="body2">
            {azimuth.toFixed(1)}°
          </Typography>
        </Box>
      </AngleDisplay>

      {elevation < 10 && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Warning: Low elevation angle may result in poor signal quality
        </Typography>
      )}
    </StyledPaper>
  );
};

export default SatellitePointingDisplay; 