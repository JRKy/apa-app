import React, { useState, useCallback, useRef } from 'react';
import { Box, Autocomplete, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import L from 'leaflet';
import { useDispatch } from 'react-redux';
import { setCenter, setSelectedLocation } from '@/store/mapSlice';
import debounce from 'lodash/debounce';

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  boundingbox?: [string, string, string, string];
  place_id: string;
}

interface SearchBoxProps {
  mapRef: React.RefObject<L.Map | null>;
}

const SearchBox: React.FC<SearchBoxProps> = ({ mapRef }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (!query) {
        setSearchResults([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
          {
            headers: {
              'User-Agent': 'APA-App/1.0',
              'Accept-Language': 'en',
            },
          }
        );
        if (response.status === 429) {
          throw new Error('Too many requests. Please try again in a moment.');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setSearchResults(data);
        if (data.length === 0) {
          setError('No results found');
        }
      } catch (error) {
        console.error('Error searching location:', error);
        setSearchResults([]);
        setError(error instanceof Error ? error.message : 'Error searching location');
      } finally {
        setLoading(false);
      }
    }, 500)
  ).current;

  // Cleanup the debounced function on unmount
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleLocationSelect = useCallback((newValue: SearchResult | null) => {
    if (newValue && mapRef.current) {
      const location: [number, number] = [parseFloat(newValue.lat), parseFloat(newValue.lon)];
      
      if (newValue.boundingbox) {
        const bounds = L.latLngBounds([
          [parseFloat(newValue.boundingbox[0]), parseFloat(newValue.boundingbox[2])],
          [parseFloat(newValue.boundingbox[1]), parseFloat(newValue.boundingbox[3])]
        ]);
        mapRef.current.fitBounds(bounds);
      } else {
        mapRef.current.setView(location, 13);
      }

      dispatch(setCenter(location));
      dispatch(setSelectedLocation(location));
      
      setInputValue('');
      setError(null);
    }
  }, [mapRef, dispatch]);

  return (
    <Box sx={{ 
      width: 300,
      backgroundColor: 'white',
      borderRadius: 1,
      boxShadow: 2,
      p: 1
    }}>
      <Autocomplete
        value={null}
        inputValue={inputValue}
        options={searchResults}
        getOptionLabel={(option) => option.display_name}
        loading={loading}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
          debouncedSearch(newInputValue);
        }}
        onChange={(_, newValue) => handleLocationSelect(newValue)}
        isOptionEqualToValue={(option, value) => option.place_id === value?.place_id}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search location..."
            error={!!error}
            helperText={error}
            InputProps={{
              ...params.InputProps,
              startAdornment: <SearchIcon sx={{ ml: 1, color: 'text.secondary' }} />,
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <li key={option.place_id} {...otherProps}>
              <Typography variant="body2">{option.display_name}</Typography>
            </li>
          );
        }}
      />
    </Box>
  );
};

export default SearchBox; 