import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { SATELLITES } from '@/constants/satellites';
import { calculatePointingAngles } from '@/utils/pointingAngles';

const KM_TO_MILES = 0.621371;

interface Satellite {
  id: string;
  name: string;
  timestamp: number;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  velocity: {
    x: number;
    y: number;
    z: number;
  };
}

interface PointingAngles {
  azimuth: number;
  elevation: number;
}

export const useSatelliteTracking = (satelliteId: string) => {
  const [satellite, setSatellite] = useState<Satellite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pointingAngles, setPointingAngles] = useState<PointingAngles | null>(null);
  const units = useSelector((state: RootState) => state.settings.units);
  const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);

  const convertAltitude = (altitudeKm: number) => {
    return units === 'metric' ? altitudeKm : altitudeKm * KM_TO_MILES;
  };

  const convertVelocity = (velocityKm: number) => {
    return units === 'metric' ? velocityKm : velocityKm * KM_TO_MILES;
  };

  useEffect(() => {
    const fetchSatelliteData = () => {
      setIsLoading(true);
      setError(null);

      const foundSatellite = SATELLITES.find(sat => sat.id === satelliteId);

      if (foundSatellite) {
        const convertedSatellite = {
          ...foundSatellite,
          timestamp: Date.now(),
          position: {
            ...foundSatellite.position,
            altitude: convertAltitude(foundSatellite.position.altitude)
          },
          velocity: {
            x: convertVelocity(foundSatellite.velocity.x),
            y: convertVelocity(foundSatellite.velocity.y),
            z: convertVelocity(foundSatellite.velocity.z)
          }
        };

        setSatellite(convertedSatellite);

        if (selectedLocation) {
          const [observerLat, observerLon] = selectedLocation;
          const angles = calculatePointingAngles(
            observerLat,
            observerLon,
            foundSatellite.position.latitude,
            foundSatellite.position.longitude
          );
          setPointingAngles(angles);
        }
      } else {
        setError('Satellite not found');
      }

      setIsLoading(false);
    };

    fetchSatelliteData();
    const interval = setInterval(fetchSatelliteData, 5000);

    return () => clearInterval(interval);
  }, [satelliteId, units, selectedLocation]);

  return { satellite, isLoading, error, pointingAngles };
}; 