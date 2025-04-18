import { useEffect, useState } from 'react';
import { Circle, Polyline } from 'react-leaflet';

interface SatelliteTrackProps {
  satelliteId: string;
  groundTrackPoints?: number;
}

interface SatellitePosition {
  lat: number;
  lng: number;
  alt: number;
}

const SatelliteTrack = ({ satelliteId, groundTrackPoints = 50 }: SatelliteTrackProps) => {
  const [positions, setPositions] = useState<SatellitePosition[]>([]);
  const [currentPosition, setCurrentPosition] = useState<SatellitePosition | null>(null);

  useEffect(() => {
    // Simulate satellite tracking data
    const interval = setInterval(() => {
      // Generate mock satellite position
      const newPosition: SatellitePosition = {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
        alt: 500 + Math.random() * 500
      };

      setCurrentPosition(newPosition);
      setPositions(prev => {
        const updated = [...prev, newPosition].slice(-groundTrackPoints);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [satelliteId, groundTrackPoints]);

  if (!currentPosition) return null;

  return (
    <>
      {/* Ground track line */}
      <Polyline
        positions={positions.map(pos => [pos.lat, pos.lng])}
        color="#ff0000"
        weight={2}
        opacity={0.5}
      />
      
      {/* Current position marker */}
      <Circle
        center={[currentPosition.lat, currentPosition.lng]}
        radius={10000}
        pathOptions={{
          color: '#ff0000',
          fillColor: '#ff0000',
          fillOpacity: 0.5
        }}
      />
    </>
  );
};

export default SatelliteTrack; 