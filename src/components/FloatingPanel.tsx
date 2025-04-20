import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { SatelliteInfo } from '@/features/satellite';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSatelliteWindow } from '@/store/uiSlice';

// Colors matching the elevation rules
const ELEVATION_COLORS = {
  good: '#4caf50',    // Green
  poor: '#ff9800',    // Orange
  hidden: '#f44336',  // Red
};

interface FloatingPanelProps {
  onClose: () => void;
}

type ResizeType = 'width' | 'height' | 'both';

const FloatingPanel: React.FC<FloatingPanelProps> = ({ onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { position, size } = useSelector((state: RootState) => state.ui.satelliteWindow);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<ResizeType | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef({ width: 0, height: 0 });

  // Set initial size for mobile
  useEffect(() => {
    if (isMobile) {
      dispatch(setSatelliteWindow({
        position: { x: 0, y: 64 }, // Below header
        size: { 
          width: window.innerWidth,
          height: window.innerHeight * 0.6
        }
      }));
    }
  }, [isMobile, dispatch]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile || (e.target as HTMLElement).closest('.resize-handle')) {
      return;
    }
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [position, isMobile]);

  const handleResizeMouseDown = useCallback((type: ResizeType) => (e: React.MouseEvent) => {
    if (isMobile) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeType(type);
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    resizeStartSize.current = { ...size };
  }, [size, isMobile]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile) return;
    
    if (isDragging) {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      // Keep panel within viewport bounds and respect header height
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      const minY = 64; // Header height
      
      const newPosition = {
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY))
      };
      
      dispatch(setSatelliteWindow({ position: newPosition, size }));
    } else if (isResizing && resizeType) {
      const deltaX = e.clientX - resizeStartPos.current.x;
      const deltaY = e.clientY - resizeStartPos.current.y;
      
      let newWidth = size.width;
      let newHeight = size.height;
      
      if (resizeType === 'width' || resizeType === 'both') {
        newWidth = Math.max(400, Math.min(window.innerWidth * 0.9, resizeStartSize.current.width + deltaX));
      }
      
      if (resizeType === 'height' || resizeType === 'both') {
        newHeight = Math.max(300, Math.min(window.innerHeight * 0.8, resizeStartSize.current.height + deltaY));
      }
      
      dispatch(setSatelliteWindow({ 
        position,
        size: { width: newWidth, height: newHeight }
      }));
    }
  }, [isDragging, isResizing, resizeType, size, position, dispatch, isMobile]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeType(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <Box
      ref={panelRef}
      sx={{
        position: 'fixed',
        left: isMobile ? 0 : position.x,
        top: isMobile ? 64 : position.y,
        width: isMobile ? '100%' : size.width,
        height: isMobile ? '60vh' : size.height,
        backgroundColor: theme.palette.background.paper,
        borderRadius: isMobile ? 0 : 1,
        boxShadow: `0 4px 20px 0 rgba(0,0,0,0.1), 0 0 0 1px ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'default',
        transition: isMobile ? 'transform 0.3s ease-in-out' : 'none',
        transform: isMobile ? 'translateY(0)' : 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderBottom: `1px solid ${theme.palette.primary.dark}`,
          p: 1.5,
          cursor: isMobile ? 'default' : 'grab',
          '&:active': {
            cursor: isMobile ? 'default' : 'grabbing',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && (
            <DragIndicatorIcon 
              sx={{ 
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
                color: 'inherit',
              }}
            />
          )}
          <Typography variant="h6" component="div">
            Satellite Information
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'inherit' }}
          aria-label="Close satellite information"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        padding: 2,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.background.default,
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.grey[400],
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.grey[500],
        },
      }}>
        <SatelliteInfo />
      </Box>

      {/* Resize Handles - Only show on desktop */}
      {!isMobile && (
        <Box
          className="resize-handle"
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 20,
            height: 20,
            cursor: 'nwse-resize',
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 3,
              bottom: 3,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 0 10px 10px',
              borderColor: `transparent transparent ${ELEVATION_COLORS.good} transparent`,
              opacity: 0.5,
            },
            '&:hover::after': {
              opacity: 0.8,
            },
          }}
          onMouseDown={handleResizeMouseDown('both')}
        />
      )}
    </Box>
  );
};

export default FloatingPanel; 