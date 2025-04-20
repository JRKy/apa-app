import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDispatch } from 'react-redux';
import { setSelectedLocation } from '@/store/mapSlice';

const SearchBox: React.FC = () => {
  const map = useMap();
  const dispatch = useDispatch();

  useEffect(() => {
    const searchControl = L.Control.extend({
      options: {
        position: 'topleft'
      },
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-control-search leaflet-bar');
        const searchButton = L.DomUtil.create('a', 'leaflet-control-search-button', container);
        searchButton.href = '#';
        searchButton.innerHTML = '🔍';
        searchButton.style.cssText = `
          display: block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          text-decoration: none;
          color: #1F2937;
          background: #F8FAFC;
          border-radius: 4px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.4);
        `;

        const searchContainer = L.DomUtil.create('div', 'search-container', container);
        searchContainer.style.cssText = `
          position: absolute;
          top: 100%;
          left: 0;
          background: #FFFFFF;
          padding: 5px;
          border-radius: 4px;
          box-shadow: 0 1px 5px rgba(0,0,0,0.4);
          display: none;
          z-index: 1000;
          margin-top: 5px;
        `;

        const input = L.DomUtil.create('input', 'search-input', searchContainer);
        input.type = 'text';
        input.placeholder = 'Search location...';
        input.style.cssText = `
          width: 200px;
          padding: 8px 12px;
          border: 1px solid #E5E7EB;
          border-radius: 4px;
          color: #1F2937;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
          background: #F8FAFC;
        `;

        input.addEventListener('focus', () => {
          input.style.backgroundColor = '#FFFFFF';
          input.style.borderColor = '#2563EB';
          input.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.2)';
        });

        input.addEventListener('blur', () => {
          input.style.backgroundColor = '#F8FAFC';
          input.style.borderColor = '#E5E7EB';
          input.style.boxShadow = 'none';
        });
        
        // Create results container
        const resultsContainer = L.DomUtil.create('div', 'search-results', searchContainer);
        resultsContainer.style.cssText = `
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-top: none;
          max-height: 200px;
          overflow-y: auto;
          display: none;
          z-index: 1000;
          margin-top: 5px;
          border-radius: 4px;
        `;

        let timeoutId: number;
        
        searchButton.addEventListener('click', (e) => {
          e.preventDefault();
          searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
          if (searchContainer.style.display === 'block') {
            input.focus();
          }
        });

        const search = (query: string) => {
          if (query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
          }

          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
            .then(response => response.json())
            .then(data => {
              resultsContainer.innerHTML = '';
              if (data && data.length > 0) {
                data.forEach((item: any) => {
                  const result = L.DomUtil.create('div', 'search-result', resultsContainer);
                  result.style.cssText = `
                    padding: 8px 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #E5E7EB;
                    color: #1F2937;
                    font-size: 14px;
                    transition: background-color 0.2s;
                  `;
                  result.textContent = item.display_name;
                  result.addEventListener('mouseover', () => {
                    result.style.backgroundColor = '#F8FAFC';
                  });
                  result.addEventListener('mouseout', () => {
                    result.style.backgroundColor = '#FFFFFF';
                  });
                  result.addEventListener('click', () => {
                    const location = [parseFloat(item.lat), parseFloat(item.lon)] as [number, number];
                    map.setView(location, 13);
                    dispatch(setSelectedLocation(location));
                    input.value = item.display_name;
                    resultsContainer.style.display = 'none';
                    searchContainer.style.display = 'none';
                  });
                });
                resultsContainer.style.display = 'block';
              } else {
                resultsContainer.style.display = 'none';
              }
            });
        };

        input.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          clearTimeout(timeoutId);
          timeoutId = window.setTimeout(() => search(target.value), 300);
        });

        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            const query = input.value;
            if (query) {
              fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
                .then(response => response.json())
                .then(data => {
                  if (data && data.length > 0) {
                    const location = [parseFloat(data[0].lat), parseFloat(data[0].lon)] as [number, number];
                    map.setView(location, 13);
                    dispatch(setSelectedLocation(location));
                    searchContainer.style.display = 'none';
                  }
                });
            }
          }
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
          if (!container.contains(e.target as Node) && !searchContainer.contains(e.target as Node)) {
            resultsContainer.style.display = 'none';
            searchContainer.style.display = 'none';
          }
        });

        return container;
      }
    });

    const control = new searchControl();
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map, dispatch]);

  return null;
};

export default SearchBox; 