import { useEffect, useMemo, useState } from 'react';
import {
  getWeatherAdapterResult,
  loadWeatherAdapterResult,
} from '@/services/weather/weather-adapter';
import { clearWeatherCache } from '@/services/weather/weather-cache-service';
import { buildWeatherRefreshPolicy } from '@/services/weather/weather-refresh-policy';
import {
  clearWeatherLocalPreference,
  getWeatherLocalPreferenceStatus,
  readWeatherLocalPreference,
  writeWeatherLocalPreference,
} from '@/services/weather/weather-source-readiness';
import type { WeatherAdapterResult } from '@/services/weather/weather.types';

export function useWeather(initialLocationId?: string) {
  const initialPreference = useMemo(() => readWeatherLocalPreference(), []);
  const initialResult = useMemo(
    () => getWeatherAdapterResult(initialLocationId ?? initialPreference?.selectedLocationId),
    [initialLocationId, initialPreference?.selectedLocationId],
  );
  const [selectedLocationId, setSelectedLocationId] = useState(initialResult.selectedLocationId);
  const [weather, setWeather] = useState<WeatherAdapterResult>(initialResult);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [manualRefreshMessage, setManualRefreshMessage] = useState('');
  const [lastSuccessfulRefresh, setLastSuccessfulRefresh] = useState<string | undefined>(undefined);

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

  const refreshPolicy = buildWeatherRefreshPolicy({
    modeStatus: weather.modeStatus,
    lastSuccessfulRefresh,
    isLoading,
  });

  async function manualRefresh() {
    const policy = buildWeatherRefreshPolicy({
      modeStatus: weather.modeStatus,
      lastSuccessfulRefresh,
    });

    if (!policy.canRefresh) {
      setManualRefreshMessage(policy.message);
      return;
    }

    setIsLoading(true);
    setManualRefreshMessage('กำลังรีเฟรชข้อมูลจาก Open-Meteo');

    try {
      const result = await loadWeatherAdapterResult(selectedLocationId, { forceRefresh: true });
      const refreshedAt = new Date().toISOString();

      setWeather(result);
      setLastSuccessfulRefresh(refreshedAt);
      setManualRefreshMessage(result.forecast.isFallback ? 'รีเฟรชไม่สำเร็จ ใช้ข้อมูลสำรองในเครื่อง' : 'รีเฟรชข้อมูลสำเร็จ');
    } finally {
      setIsLoading(false);
    }
  }

  function selectLocation(locationId: string) {
    const nextResult = getWeatherAdapterResult(locationId);

    writeWeatherLocalPreference({
      selectedLocationId: nextResult.selectedLocationId,
      selectedLabel: nextResult.forecast.location.label,
      sourceMode: weather.modeStatus.mode,
    });
    setSelectedLocationId(nextResult.selectedLocationId);
  }

  return {
    ...weather,
    isLoading,
    lastSuccessfulRefresh,
    localPreferenceStatus: getWeatherLocalPreferenceStatus(),
    manualRefresh,
    manualRefreshMessage,
    refreshPolicy,
    selectedLocationId,
    selectLocation,
    clearSelectedCache: () => {
      clearWeatherCache(selectedLocationId);
      setReloadKey((value) => value + 1);
    },
    clearWeatherLocalPreference: () => {
      clearWeatherLocalPreference();
      setSelectedLocationId(initialResult.selectedLocationId);
      setReloadKey((value) => value + 1);
    },
  };
}
