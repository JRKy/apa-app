import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, TextField, Paper, Autocomplete, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setSelectedLocation } from '@/store/mapSlice';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

const SearchBox: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const map = useMap();
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    let timeoutId: number;

    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
          {
            headers: {
              'User-Agent': 'APAA-App/1.0',
              'Accept-Language': 'en',
            },
          }
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error searching location:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim()) {
      timeoutId = window.setTimeout(fetchResults, 500); // Debounce search
    }

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLocationSelect = (result: SearchResult) => {
    const location: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
    map.setView(location, 13);
    dispatch(setSelectedLocation(location));
    setSearchQuery(result.display_name);
    setOpen(false);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '10px',
        left: { xs: '10px', sm: '50px' },
        right: { xs: '10px', sm: 'auto' },
        zIndex: 400,
        width: { xs: 'calc(100% - 20px)', sm: '400px' },
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
          width: '100%',
        }}
        role="search"
        aria-label="Search location"
        onClick={(e) => e.stopPropagation()}
      >
        <Autocomplete
          freeSolo
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          options={searchResults}
          getOptionLabel={(option) => 
            typeof option === 'string' ? option : option.display_name
          }
          loading={loading}
          value={searchQuery}
          onChange={(_, newValue) => {
            if (newValue && typeof newValue !== 'string') {
              handleLocationSelect(newValue);
            }
          }}
          onInputChange={(_, newInputValue) => {
            setSearchQuery(newInputValue);
          }}
          sx={{
            width: '100%',
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search location..."
              variant="standard"
              size="small"
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  color: theme.palette.mode === 'dark' 
                    ? theme.palette.grey[100] 
                    : theme.palette.grey[900],
                  padding: { xs: '4px 4px', sm: '4px 8px' },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
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
                ...params.InputProps,
                disableUnderline: true,
                'aria-label': 'Search location input',
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <li key={key} {...otherProps}>
                {option.display_name}
              </li>
            );
          }}
        />
      </Box>
    </Box>
  );
};

export default SearchBox; 