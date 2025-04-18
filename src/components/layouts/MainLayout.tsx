import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from '@/features/map';
import { Settings, Help } from '@/features/settings';
import SatelliteIcon from '@mui/icons-material/Satellite';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import FloatingPanel from '@/components/FloatingPanel';
import { Dialog } from '@/components/common';
import { RootState } from '@/store';
import L from 'leaflet';
import {
  toggleSatelliteInfo,
  setSettingsOpen,
  setHelpOpen,
} from '@/store/uiSlice';
import { LocationButton } from '@/features/map/components/LocationButton';
import SearchBox from '@/features/map/components/SearchBox';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { showSatelliteInfo, settingsOpen, helpOpen } = useSelector((state: RootState) => state.ui);
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

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%', position: 'relative' }}>
      <Map mapRef={mapRef} />
      
      {/* Control Buttons - Left Side */}
      <Box sx={{ 
        position: 'absolute', 
        left: 64,
        top: 8, // Align with zoom controls
        display: 'flex', 
        flexDirection: 'column',
        gap: 2,
        zIndex: 1000 
      }}>
        <SearchBox mapRef={mapRef} />
      </Box>
      
      {/* Control Buttons - Top Right */}
      <Box sx={{ 
        position: 'absolute', 
        right: 16, 
        top: 16, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 1,
        zIndex: 1000 
      }}>
        <LocationButton mapRef={mapRef} onLocationFound={() => {}} />
        
        <Tooltip title="Satellite Information">
          <IconButton
            onClick={() => dispatch(toggleSatelliteInfo())}
            sx={{
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              boxShadow: 2,
              width: 48,
              height: 48,
            }}
          >
            <SatelliteIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Settings">
          <IconButton
            onClick={() => dispatch(setSettingsOpen(true))}
            sx={{
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              boxShadow: 2,
              width: 48,
              height: 48,
            }}
          >
            <SettingsIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Help">
          <IconButton
            onClick={() => dispatch(setHelpOpen(true))}
            sx={{
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              boxShadow: 2,
              width: 48,
              height: 48,
            }}
          >
            <HelpIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Fullscreen Button - Bottom Right */}
      <Box sx={{ 
        position: 'absolute', 
        right: 16, 
        bottom: 16, 
        zIndex: 1000 
      }}>
        <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              boxShadow: 2,
              width: 48,
              height: 48,
            }}
          >
            {isFullscreen ? (
              <FullscreenExitIcon sx={{ fontSize: 32 }} />
            ) : (
              <FullscreenIcon sx={{ fontSize: 32 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Satellite Info Panel */}
      {showSatelliteInfo && (
        <FloatingPanel onClose={() => dispatch(toggleSatelliteInfo())} />
      )}

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => dispatch(setSettingsOpen(false))}
        title="Settings"
      >
        <Settings />
      </Dialog>

      {/* Help Dialog */}
      <Dialog
        open={helpOpen}
        onClose={() => dispatch(setHelpOpen(false))}
        title="Help"
        maxWidth="md"
      >
        <Help />
      </Dialog>
    </Box>
  );
};

export default MainLayout; 