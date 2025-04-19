import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setSelectedLocation } from '@/store/mapSlice';

interface SearchBoxProps {
  mapRef: React.RefObject<L.Map | null>;
}

const SearchBox: React.FC<SearchBoxProps> = ({ mapRef }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const map = useMap();
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const location: [number, number] = [parseFloat(lat), parseFloat(lon)];
        
        // Update the map view
        map.setView(location, 13);
        
        // Update the selected location in the store
        dispatch(setSelectedLocation(location));
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '10px',
        left: '50px',
        zIndex: 400,
      }}
    >
      <Box
        component={Paper}
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.grey[800] 
            : theme.palette.grey[100],
          borderRadius: 1,
          padding: '4px',
          boxShadow: theme.palette.mode === 'dark' 
            ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
        role="search"
        aria-label="Search location"
        onClick={(e) => e.stopPropagation()}
      >
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search location..."
          variant="standard"
          size="small"
          sx={{
            width: 200,
            '& .MuiInputBase-root': {
              color: theme.palette.mode === 'dark' 
                ? theme.palette.grey[100] 
                : theme.palette.grey[900],
              padding: '4px 8px',
            },
            '& .MuiInput-underline:before': {
              borderBottomColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[700] 
                : theme.palette.grey[300],
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[500] 
                : theme.palette.grey[400],
            },
          }}
          InputProps={{
            disableUnderline: true,
            'aria-label': 'Search location input',
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleSearch();
          }}
          size="small"
          sx={{
            color: theme.palette.mode === 'dark' 
              ? theme.palette.grey[100] 
              : theme.palette.grey[900],
          }}
          aria-label="Search"
        >
          <SearchIcon />
        </IconButton>
        {searchQuery && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setSearchQuery('');
            }}
            size="small"
            sx={{
              color: theme.palette.mode === 'dark' 
                ? theme.palette.grey[100] 
                : theme.palette.grey[900],
            }}
            aria-label="Clear search"
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default SearchBox; 