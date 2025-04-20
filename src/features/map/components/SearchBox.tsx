import React, { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, TextField, Paper, Autocomplete, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setSelectedLocation } from '@/store/mapSlice';
import { useMediaQuery } from '@mui/material';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

const SearchBox: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const map = useMap();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchControlRef = useRef<L.Control.Search | null>(null);

  useEffect(() => {
    if (isMobile) {
      // Initialize Leaflet search control
      const searchControl = new L.Control.Search({
        position: 'topleft',
        layer: L.layerGroup(),
        initial: false,
        zoom: 13,
        marker: {
          icon: new L.Icon.Default(),
          animate: true,
        },
        autoType: false,
        autoCollapse: true,
        minLength: 2,
        textPlaceholder: 'Search location...',
        textErr: 'Location not found',
        textCancel: 'Cancel',
        textNoData: 'No results found',
        sourceData: async (text: string, callResponse: Function) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=5`,
              {
                headers: {
                  'User-Agent': 'APAA-App/1.0',
                  'Accept-Language': 'en',
                },
              }
            );
            const data = await response.json();
            callResponse(data);
          } catch (error) {
            console.error('Error searching location:', error);
            callResponse([]);
          }
        },
        formatData: (data: any) => {
          return {
            title: data.display_name,
            location: [parseFloat(data.lat), parseFloat(data.lon)],
            bounds: data.boundingbox
              ? L.latLngBounds(
                  [parseFloat(data.boundingbox[0]), parseFloat(data.boundingbox[2])],
                  [parseFloat(data.boundingbox[1]), parseFloat(data.boundingbox[3])]
                )
              : null,
          };
        },
      });

      searchControlRef.current = searchControl;
      map.addControl(searchControl);

      return () => {
        if (searchControlRef.current) {
          map.removeControl(searchControlRef.current);
        }
      };
    }
  }, [map, isMobile]);

  // Desktop search functionality
  useEffect(() => {
    if (!isMobile) {
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
        timeoutId = window.setTimeout(fetchResults, 500);
      }

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, isMobile]);

  const handleLocationSelect = (result: SearchResult) => {
    const location: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
    map.setView(location, 13);
    dispatch(setSelectedLocation(location));
    setSearchQuery(result.display_name);
    setOpen(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setOpen(false);
    dispatch(setSelectedLocation(null));
  };

  if (isMobile) {
    return null; // Leaflet search control handles mobile UI
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '10px',
        left: '50px',
        zIndex: 400,
        width: '300px'
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
          margin: 0,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 2px 4px rgba(0, 0, 0, 0.3)'
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
          width: '100%',
          minWidth: '250px'
        }}
        role="search"
        aria-label="Search location"
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
          clearOnBlur={false}
          clearOnEscape={true}
          onChange={(_, newValue) => {
            if (newValue === null) {
              handleClear();
            } else if (typeof newValue !== 'string') {
              handleLocationSelect(newValue);
            }
          }}
          onInputChange={(_, newInputValue) => {
            setSearchQuery(newInputValue);
          }}
          sx={{
            width: '100%'
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
                  fontSize: '1rem',
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: 'transparent',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'transparent',
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottomColor: 'transparent',
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
          renderOption={(props, option) => (
            <li {...props} key={option.place_id}>
              {option.display_name}
            </li>
          )}
        />
      </Box>
    </Box>
  );
};

export default SearchBox; 