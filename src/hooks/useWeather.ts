import { useEffect, useMemo, useState } from 'react';
import {
  getWeatherAdapterResult,
  loadWeatherAdapterResult,
} from '@/services/weather/weather-adapter';
import { clearWeatherCache } from '@/services/weather/weather-cache-service';
import type { WeatherAdapterResult } from '@/services/weather/weather.types';

export function useWeather(initialLocationId?: string) {
  const initialResult = useMemo(() => getWeatherAdapterResult(initialLocationId), [initialLocationId]);
  const [selectedLocationId, setSelectedLocationId] = useState(initialResult.selectedLocationId);
  const [weather, setWeather] = useState<WeatherAdapterResult>(initialResult);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

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
  }, [reloadKey, selectedLocationId]);

  return {
    ...weather,
    isLoading,
    selectedLocationId,
    selectLocation: setSelectedLocationId,
    clearSelectedCache: () => {
      clearWeatherCache(selectedLocationId);
      setReloadKey((value) => value + 1);
    },
  };
}
