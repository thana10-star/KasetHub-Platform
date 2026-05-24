import { useEffect, useMemo, useState } from 'react';
import {
  getWeatherAdapterResult,
  loadWeatherAdapterResult,
} from '@/services/weather/weather-adapter';
import type { WeatherAdapterResult } from '@/services/weather/weather.types';

export function useWeather(initialLocationId?: string) {
  const initialResult = useMemo(() => getWeatherAdapterResult(initialLocationId), [initialLocationId]);
  const [selectedLocationId, setSelectedLocationId] = useState(initialResult.selectedLocationId);
  const [weather, setWeather] = useState<WeatherAdapterResult>(initialResult);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    loadWeatherAdapterResult(selectedLocationId)
      .then((result) => {
        if (!cancelled) {
          setWeather(result);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLocationId]);

  return {
    ...weather,
    isLoading,
    selectedLocationId,
    selectLocation: setSelectedLocationId,
  };
}
