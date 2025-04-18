import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { calculatePointingAngles } from '../utils/pointingAngles';
import { SATELLITES } from '@/constants/satellites';

interface Satellite {
  id: string;
  name: string;
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
  timestamp: number;
}

interface PointingAngles {
  azimuth: number;
  elevation: number;
}

const KM_TO_MILES = 0.621371;
const KM_TO_FEET = 3280.84; // Keeping this for reference
const MILES_TO_FEET = 5280; // 1 mile = 5280 feet

export const useSatelliteTracking = (satelliteId: string) => {
  const [satellite, setSatellite] = useState<Satellite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pointingAngles, setPointingAngles] = useState<PointingAngles | null>(null);
  const units = useSelector((state: RootState) => state.settings.units);
  const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);

  console.log('useSatelliteTracking - Current units:', units);
  console.log('useSatelliteTracking - Selected location:', selectedLocation);

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