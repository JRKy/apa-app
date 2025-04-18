import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useTheme } from '@mui/material/styles';
import { SatelliteInfo } from '@/features/satellite';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<ResizeType | null>(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef({ width: 0, height: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) {
      return;
    }
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  }, [position]);

  const handleResizeMouseDown = useCallback((type: ResizeType) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeType(type);
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    resizeStartSize.current = { ...size };
  }, [size]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      // Keep panel within viewport bounds
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
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
      
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, resizeType, size]);

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
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
        boxShadow: `0 4px 20px 0 rgba(0,0,0,0.1), 0 0 0 1px ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'default',
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
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DragIndicatorIcon 
            sx={{ 
              cursor: 'grab',
              '&:active': { cursor: 'grabbing' },
              color: 'inherit',
            }}
          />
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
      <Box sx={{ flex: 1, overflow: 'auto', padding: 2 }}>
        <SatelliteInfo />
      </Box>

      {/* Resize Handles */}
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
      <Box
        className="resize-handle"
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 6,
          cursor: 'ew-resize',
          '&:hover': {
            backgroundColor: `${ELEVATION_COLORS.good}20`,
          },
        }}
        onMouseDown={handleResizeMouseDown('width')}
      />
      <Box
        className="resize-handle"
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 6,
          cursor: 'ns-resize',
          '&:hover': {
            backgroundColor: `${ELEVATION_COLORS.good}20`,
          },
        }}
        onMouseDown={handleResizeMouseDown('height')}
      />
    </Box>
  );
};

export default FloatingPanel; 