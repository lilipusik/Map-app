import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

interface LocationConfig {
  accuracy: Location.Accuracy;
  timeInterval: number;  // Как часто обновлять местоположение (мс)
  distanceInterval: number;  // Минимальное расстояние (в метрах) между обновлениями
}

interface LocationState {
  location: Location.LocationObject | null;
  errorMsg: string | null;
}

export const useLocation = (config: LocationConfig) => {
  const [locationState, setLocationState] = useState<LocationState>({
    location: null,
    errorMsg: null,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationState({
          location: null,
          errorMsg: 'Разрешение на доступ к местоположению не предоставлено',
        });
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: config.accuracy,
          timeInterval: config.timeInterval,
          distanceInterval: config.distanceInterval,
        },
        (newLocation) => {
          setLocationState({
            location: newLocation,
            errorMsg: null,
          });
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, [config.accuracy, config.timeInterval, config.distanceInterval]);

  return locationState;
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Радиус Земли в метрах
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ в радианах
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Расстояние в метрах
};