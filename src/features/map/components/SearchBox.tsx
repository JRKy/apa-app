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

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setOpen(false);
    dispatch(setSelectedLocation(null));
  };

  return (
    <Box
      sx={{
        position: { 
          xs: 'fixed',
          sm: 'absolute'
        },
        top: { 
          xs: '56px',
          sm: '10px'
        },
        left: { 
          xs: 0,
          sm: '50px'
        },
        right: { 
          xs: 0,
          sm: 'auto'
        },
        zIndex: {
          xs: theme.zIndex.appBar + 1,
          sm: 400
        },
        width: { 
          xs: '100%',
          sm: '300px'
        },
        backgroundColor: {
          xs: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
          sm: 'transparent'
        },
        margin: 0,
        padding: 0,
        borderBottom: {
          xs: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]}`,
          sm: 'none'
        },
        transition: 'all 0.2s ease-in-out',
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
          borderRadius: { 
            xs: 0,
            sm: 1
          },
          padding: {
            xs: '0 16px',
            sm: '4px'
          },
          margin: 0,
          boxShadow: {
            xs: 'none',
            sm: theme.palette.mode === 'dark'
              ? '0 2px 4px rgba(0, 0, 0, 0.3)'
              : '0 2px 4px rgba(0, 0, 0, 0.1)'
          },
          width: '100%',
          minWidth: { xs: 'auto', sm: '250px' },
          height: { xs: '56px', sm: 'auto' },
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
            width: '100%',
            height: '100%',
            '& .MuiAutocomplete-inputRoot': {
              height: { xs: '100%', sm: 'auto' }
            },
            '& .MuiAutocomplete-clearIndicator': {
              padding: '4px',
              marginRight: '4px'
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search location..."
              variant="standard"
              size="small"
              sx={{
                width: '100%',
                height: '100%',
                '& .MuiInputBase-root': {
                  color: theme.palette.mode === 'dark' 
                    ? theme.palette.grey[100] 
                    : theme.palette.grey[900],
                  padding: { 
                    xs: '0',
                    sm: '4px 8px'
                  },
                  height: { xs: '100%', sm: 'auto' },
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
          renderOption={(props, option) => {
            if (typeof option === 'string') return null;
            return (
              <li {...props} key={option.place_id} style={{
                padding: '16px',
                fontSize: '0.9375rem',
                borderBottom: `1px solid ${theme.palette.mode === 'dark' 
                  ? theme.palette.grey[800] 
                  : theme.palette.grey[200]}`
              }}>
                {option.display_name}
              </li>
            );
          }}
          ListboxProps={{
            style: {
              maxHeight: '50vh',
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default SearchBox; 