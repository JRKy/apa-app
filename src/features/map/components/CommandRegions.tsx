import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { Feature, Polygon } from 'geojson';

interface CommandRegion {
  name: string;
  coordinates: [number, number][][];
  color: string;
}

const commandRegions: CommandRegion[] = [
  {
    name: 'NORTHCOM',
    coordinates: [[[-180, 90], [-180, 0], [0, 0], [0, 90], [-180, 90]]],
    color: '#FF0000',
  },
  {
    name: 'SOUTHCOM',
    coordinates: [[[-180, 0], [-180, -90], [0, -90], [0, 0], [-180, 0]]],
    color: '#00FF00',
  },
  {
    name: 'EUCOM',
    coordinates: [[[0, 90], [0, 0], [90, 0], [90, 90], [0, 90]]],
    color: '#0000FF',
  },
  {
    name: 'AFRICOM',
    coordinates: [[[0, 0], [0, -90], [90, -90], [90, 0], [0, 0]]],
    color: '#FFFF00',
  },
  {
    name: 'CENTCOM',
    coordinates: [[[90, 90], [90, 0], [180, 0], [180, 90], [90, 90]]],
    color: '#FF00FF',
  },
  {
    name: 'INDOPACOM',
    coordinates: [[[90, 0], [90, -90], [180, -90], [180, 0], [90, 0]]],
    color: '#00FFFF',
  },
];

const CommandRegions: React.FC = () => {
  return (
    <>
      {commandRegions.map((region) => {
        const feature: Feature<Polygon> = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: region.coordinates,
          },
          properties: null,
        };

        return (
          <GeoJSON
            key={region.name}
            data={feature}
            style={{
              color: region.color,
              weight: 1,
              opacity: 0.5,
              fillOpacity: 0.1,
            }}
          />
        );
      })}
    </>
  );
};

export default CommandRegions; 