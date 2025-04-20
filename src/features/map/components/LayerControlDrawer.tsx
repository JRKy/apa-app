import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Box, 
  Typography,
  useTheme,
  Paper
} from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setMapLayer } from '@/store/mapSlice';

interface LayerControlDrawerProps {
  open: boolean;
  onClose: () => void;
}

const LAYER_OPTIONS = [
  { 
    id: 'light', 
    name: 'Light',
    preview: 'https://tile.openstreetmap.org/5/16/10.png'
  },
  { 
    id: 'dark', 
    name: 'Dark Mode',
    preview: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/5/16/10.png'
  },
  { 
    id: 'satellite', 
    name: 'Satellite',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/10/16'
  },
  { 
    id: 'terrain', 
    name: 'Terrain',
    preview: 'https://tile.opentopomap.org/5/16/10.png'
  }
];

export const LayerControlDrawer: React.FC<LayerControlDrawerProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.ui.theme === 'dark');
  const currentLayer = useSelector((state: RootState) => state.map.currentLayer);

  const handleLayerChange = (layerId: string) => {
    dispatch(setMapLayer(layerId));
    onClose();
  };

  const effectiveLayer = isDarkMode ? 'dark' : currentLayer;

  return (
    <>
      <Box 
        sx={{ 
          display: { xs: 'flex', sm: 'none' },
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: theme.zIndex.speedDial
        }}
      >
        <IconButton
          onClick={() => !open && onClose()}
          sx={{
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <LayersIcon />
        </IconButton>
      </Box>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '50vh'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Map Style</Typography>
            <IconButton onClick={onClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 2 
          }}>
            {LAYER_OPTIONS.map((layer) => (
              <Paper
                key={layer.id}
                onClick={() => handleLayerChange(layer.id)}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  border: effectiveLayer === layer.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              >
                <Box sx={{ 
                  position: 'relative',
                  width: '100%',
                  paddingTop: '75%', // 4:3 aspect ratio
                  borderRadius: 1,
                  overflow: 'hidden',
                  mb: 1
                }}>
                  <img
                    src={layer.preview}
                    alt={layer.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <Typography variant="body2" align="center">
                  {layer.name}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}; 