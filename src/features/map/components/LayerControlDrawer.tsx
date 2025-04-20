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
  Radio,
  RadioGroup,
  FormControlLabel
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
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark Mode' },
  { id: 'satellite', name: 'Satellite' },
  { id: 'terrain', name: 'Terrain' }
];

export const LayerControlDrawer: React.FC<LayerControlDrawerProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.ui.theme === 'dark');
  const currentLayer = useSelector((state: RootState) => state.map.currentLayer);

  const handleLayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMapLayer(event.target.value));
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
          <RadioGroup
            value={effectiveLayer}
            onChange={handleLayerChange}
          >
            {LAYER_OPTIONS.map((layer) => (
              <FormControlLabel
                key={layer.id}
                value={layer.id}
                control={<Radio />}
                label={layer.name}
                sx={{
                  width: '100%',
                  margin: 0,
                  py: 1.5,
                  px: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
              />
            ))}
          </RadioGroup>
        </Box>
      </Drawer>
    </>
  );
}; 