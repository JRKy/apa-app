import React from 'react';
import {
  Drawer,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import Settings from '@/features/settings/components/Settings';
import Help from '@/features/settings/components/Help';

interface FloatingDrawerProps {
  active: 'settings' | 'help' | null;
  onClose: () => void;
  onOpen: (type: 'settings' | 'help') => void;
}

const FloatingDrawer: React.FC<FloatingDrawerProps> = ({ active, onClose, onOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {/* Floating Action Buttons */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <IconButton
          onClick={() => onOpen('settings')}
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[4],
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[8],
            },
          }}
          aria-label="Open settings"
        >
          <SettingsIcon />
        </IconButton>
        <IconButton
          onClick={() => onOpen('help')}
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[4],
            '&:hover': {
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[8],
            },
          }}
          aria-label="Open help"
        >
          <HelpIcon />
        </IconButton>
      </Box>

      <Fade in={!!active}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer,
            pointerEvents: 'auto',
          }}
          onClick={onClose}
          role="presentation"
        />
      </Fade>

      {/* Drawer */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={!!active}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 400,
            maxHeight: isMobile ? '80vh' : '100%',
            borderTopLeftRadius: isMobile ? 16 : 0,
            borderTopRightRadius: isMobile ? 16 : 0,
            borderBottomLeftRadius: isMobile ? 0 : 16,
            borderBottomRightRadius: isMobile ? 0 : 16,
            zIndex: theme.zIndex.drawer + 1,
          },
        }}
        ModalProps={{
          keepMounted: true,
          disablePortal: true,
          disableEnforceFocus: true,
          disableAutoFocus: true,
          hideBackdrop: true,
          container: document.body,
        }}
      >
        <Box 
          sx={{ p: 2, position: 'relative' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          <h2 id="drawer-title" style={{ display: 'none' }}>
            {active === 'settings' ? 'Settings' : 'Help'}
          </h2>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
            aria-label="Close drawer"
          >
            <CloseIcon />
          </IconButton>
          {active === 'settings' && <Settings />}
          {active === 'help' && <Help />}
        </Box>
      </Drawer>
    </>
  );
};

export default FloatingDrawer; 