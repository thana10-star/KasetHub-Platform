import type { WeatherLocationForecast, WeatherMode } from '@/services/weather/weather.types';

export type WeatherCacheFreshness = 'fresh' | 'stale' | 'empty';

export type WeatherCacheEntry = {
  locationId: string;
  forecast: WeatherLocationForecast;
  cachedAt: string;
  sourceMode: WeatherMode;
  sourceLabel: string;
  staleAfterMs: number;
};

export type WeatherCacheStatus = {
  cacheKey: string;
  locationId: string;
  freshness: WeatherCacheFreshness;
  hasEntry: boolean;
  isFresh: boolean;
  isStale: boolean;
  cachedAt?: string;
  staleAfterMinutes: number;
  ageMinutes?: number;
  sourceMode?: WeatherMode;
  sourceLabel?: string;
  lastSuccessfulFetchSummary?: string;
  failureReason?: string;
  fallbackReason?: string;
  noSupabasePersistence: true;
  localOnly: true;
};

export type WeatherCacheStorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export type WeatherCacheReadOptions = {
  nowMs?: number;
  staleAfterMs?: number;
  storage?: WeatherCacheStorageLike | null;
};
