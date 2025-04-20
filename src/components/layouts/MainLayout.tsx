import React, { useEffect } from 'react';
import { Box, IconButton, Typography, useTheme, AppBar, Toolbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from '@/features/map';
import Help from '@/features/settings/components/Help';
import SatelliteIcon from '@mui/icons-material/Satellite';
import HelpIcon from '@mui/icons-material/Help';
import FloatingPanel from '@/components/FloatingPanel';
import { Dialog } from '@/components/common';
import { RootState } from '@/store';
import L from 'leaflet';
import {
  toggleSatelliteInfo,
  setHelpOpen,
  setTheme,
} from '@/store/uiSlice';
import { LocationButton } from '@/features/map/components/LocationButton';
import SearchBox from '@/features/map/components/SearchBox';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import Logo from '@/components/Logo';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { showSatelliteInfo, helpOpen, theme: themePreference } = useSelector((state: RootState) => state.ui);
  const mapRef = React.useRef<L.Map | null>(null);

  const handleThemeToggle = () => {
    if (themePreference === 'light') {
      dispatch(setTheme('dark'));
    } else if (themePreference === 'dark') {
      dispatch(setTheme('system'));
    } else {
      dispatch(setTheme('light'));
    }
  };

  // Control button styles
  const controlButtonStyles = {
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[800] 
      : theme.palette.grey[100],
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
        ? theme.palette.grey[700] 
        : theme.palette.grey[200],
    },
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: 40,
    height: 40,
  };

  // Icon styles
  const iconStyles = {
    fontSize: 20,
    color: theme.palette.mode === 'dark' 
      ? theme.palette.grey[100] 
      : theme.palette.grey[800],
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          borderBottom: 'none',
          borderRadius: 0,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Logo />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.mode === 'dark' 
                ? theme.palette.grey[100] 
                : theme.palette.grey[900],
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: '1.125rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ 
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 2px 4px rgba(0,0,0,0.2)' 
                  : '0 2px 4px rgba(0,0,0,0.1)',
              }}>
                APAA
              </span>
            </Box>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              onClick={handleThemeToggle}
              color="inherit"
              title={`Switch to ${themePreference === 'light' ? 'dark' : themePreference === 'dark' ? 'system' : 'light'} mode`}
              sx={{
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.grey[100] 
                  : theme.palette.grey[900],
              }}
            >
              {themePreference === 'light' ? (
                <DarkModeIcon />
              ) : themePreference === 'dark' ? (
                <SettingsBrightnessIcon />
              ) : (
                <LightModeIcon />
              )}
            </IconButton>
            <Box sx={{ display: 'inline-flex' }}>
              <LocationButton mapRef={mapRef} onLocationFound={() => {}} />
            </Box>
            <IconButton
              onClick={() => dispatch(toggleSatelliteInfo())}
              color="inherit"
              title="Satellite Information"
              sx={{
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.grey[100] 
                  : theme.palette.grey[900],
              }}
            >
              <SatelliteIcon />
            </IconButton>
            <IconButton
              onClick={() => dispatch(setHelpOpen(true))}
              color="inherit"
              title="Help"
              sx={{
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.grey[100] 
                  : theme.palette.grey[900],
              }}
            >
              <HelpIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Help open={helpOpen} onClose={() => dispatch(setHelpOpen(false))} />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100%', 
        position: 'relative',
        pt: { xs: '56px', sm: '64px' } // 56px for mobile, 64px for desktop
      }}>
        <Map mapRef={mapRef} />
        
        {/* Satellite Info Panel */}
        {showSatelliteInfo && (
          <FloatingPanel onClose={() => dispatch(toggleSatelliteInfo())} />
        )}
      </Box>
    </Box>
  );
};

export default MainLayout; 