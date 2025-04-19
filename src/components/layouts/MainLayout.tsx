import React, { useEffect } from 'react';
import { Box, IconButton, Tooltip, Typography, useTheme, Divider, AppBar, Toolbar } from '@mui/material';
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
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import Logo from '@/components/Logo';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { showSatelliteInfo, helpOpen, theme: themePreference } = useSelector((state: RootState) => state.ui);
  const mapRef = React.useRef<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

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
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.grey[900] 
            : theme.palette.grey[50],
          borderBottom: `1px solid ${theme.palette.mode === 'dark' 
            ? theme.palette.grey[800] 
            : theme.palette.grey[200]}`,
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
              flexDirection: 'column',
              color: theme.palette.mode === 'dark' 
                ? theme.palette.grey[100] 
                : theme.palette.grey[900],
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              Antenna Pointing Angles Application
            </Box>
            <Typography
              component="span"
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: theme.palette.mode === 'dark' 
                  ? theme.palette.grey[400] 
                  : theme.palette.grey[600],
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3em',
                  height: '1.5em',
                  borderRadius: '4px',
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontSize: '0.85em',
                  fontWeight: 700,
                  mr: 0.5,
                  padding: '0 0.75em',
                }}
              >
                APAA
              </Box>
              by J. Kennedy
            </Typography>
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
        pt: '64px' // Add padding top to account for fixed AppBar
      }}>
        <Map mapRef={mapRef} />
        
        {/* Fullscreen button */}
        <IconButton
          onClick={toggleFullscreen}
          color="inherit"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1000,
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
            color: theme.palette.mode === 'dark' 
              ? theme.palette.grey[100] 
              : theme.palette.grey[900],
          }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
        
        {/* Satellite Info Panel */}
        {showSatelliteInfo && (
          <FloatingPanel onClose={() => dispatch(toggleSatelliteInfo())} />
        )}
      </Box>
    </Box>
  );
};

export default MainLayout; 