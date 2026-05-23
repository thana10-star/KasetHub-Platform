import { useMemo, useState } from 'react';
import { getWeatherAdapterResult } from '@/services/weather/weather-adapter';

export function useWeather(initialLocationId?: string) {
  const initialResult = useMemo(() => getWeatherAdapterResult(initialLocationId), [initialLocationId]);
  const [selectedLocationId, setSelectedLocationId] = useState(initialResult.selectedLocationId);

  const weather = useMemo(() => getWeatherAdapterResult(selectedLocationId), [selectedLocationId]);

  return {
    ...weather,
    selectedLocationId,
    selectLocation: setSelectedLocationId,
  };
}
