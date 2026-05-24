import type {
  WeatherCacheEntry,
  WeatherCacheReadOptions,
  WeatherCacheStatus,
  WeatherCacheStorageLike,
} from '@/services/weather/weather-cache.types';
import type { WeatherLocationForecast, WeatherMode } from '@/services/weather/weather.types';

export const WEATHER_CACHE_STORAGE_KEY = 'kasethub.weatherCache.v1';
export const DEFAULT_WEATHER_CACHE_STALE_AFTER_MS = 45 * 60 * 1000;

type WeatherCacheState = Record<string, WeatherCacheEntry>;

function getDefaultStorage(): WeatherCacheStorageLike | null {
  try {
    return typeof globalThis.localStorage === 'undefined' ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}

function resolveStorage(storage?: WeatherCacheStorageLike | null) {
  return storage === undefined ? getDefaultStorage() : storage;
}

function readCacheState(storage?: WeatherCacheStorageLike | null): WeatherCacheState {
  const resolved = resolveStorage(storage);

  if (!resolved) return {};

  try {
    const raw = resolved.getItem(WEATHER_CACHE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as WeatherCacheState;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeCacheState(state: WeatherCacheState, storage?: WeatherCacheStorageLike | null) {
  const resolved = resolveStorage(storage);

  if (!resolved) return;

  resolved.setItem(WEATHER_CACHE_STORAGE_KEY, JSON.stringify(state));
}

export function createMemoryWeatherCacheStorage(initial: Record<string, string> = {}): WeatherCacheStorageLike {
  const data = { ...initial };

  return {
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

export function getWeatherCacheKey(locationId: string) {
  return `weather:${locationId}`;
}

export function readWeatherCacheEntry(
  locationId: string,
  options: WeatherCacheReadOptions = {},
): WeatherCacheEntry | undefined {
  return readCacheState(options.storage)[getWeatherCacheKey(locationId)];
}

export function getWeatherCacheStatus(
  locationId: string,
  options: WeatherCacheReadOptions & { failureReason?: string; fallbackReason?: string } = {},
): WeatherCacheStatus {
  const entry = readWeatherCacheEntry(locationId, options);
  const staleAfterMs = options.staleAfterMs ?? entry?.staleAfterMs ?? DEFAULT_WEATHER_CACHE_STALE_AFTER_MS;
  const nowMs = options.nowMs ?? Date.now();

  if (!entry) {
    return {
      cacheKey: getWeatherCacheKey(locationId),
      locationId,
      freshness: 'empty',
      hasEntry: false,
      isFresh: false,
      isStale: false,
      staleAfterMinutes: Math.round(staleAfterMs / 60000),
      failureReason: options.failureReason,
      fallbackReason: options.fallbackReason,
      noSupabasePersistence: true,
      localOnly: true,
    };
  }

  const cachedAtMs = Date.parse(entry.cachedAt);
  const ageMs = Number.isFinite(cachedAtMs) ? Math.max(0, nowMs - cachedAtMs) : staleAfterMs + 1;
  const isFresh = ageMs <= staleAfterMs;

  return {
    cacheKey: getWeatherCacheKey(locationId),
    locationId,
    freshness: isFresh ? 'fresh' : 'stale',
    hasEntry: true,
    isFresh,
    isStale: !isFresh,
    cachedAt: entry.cachedAt,
    staleAfterMinutes: Math.round(staleAfterMs / 60000),
    ageMinutes: Math.round(ageMs / 60000),
    sourceMode: entry.sourceMode,
    sourceLabel: entry.sourceLabel,
    lastSuccessfulFetchSummary: `${entry.forecast.location.label} · ${entry.sourceLabel} · ${entry.cachedAt}`,
    failureReason: options.failureReason,
    fallbackReason: options.fallbackReason,
    noSupabasePersistence: true,
    localOnly: true,
  };
}

export function isWeatherCacheFresh(
  locationId: string,
  options: WeatherCacheReadOptions = {},
): boolean {
  return getWeatherCacheStatus(locationId, options).isFresh;
}

export function writeWeatherCacheEntry(
  input: {
    locationId: string;
    forecast: WeatherLocationForecast;
    sourceMode: WeatherMode;
    sourceLabel: string;
  },
  options: WeatherCacheReadOptions = {},
): WeatherCacheEntry {
  const staleAfterMs = options.staleAfterMs ?? DEFAULT_WEATHER_CACHE_STALE_AFTER_MS;
  const entry: WeatherCacheEntry = {
    locationId: input.locationId,
    forecast: input.forecast,
    cachedAt: new Date(options.nowMs ?? Date.now()).toISOString(),
    sourceMode: input.sourceMode,
    sourceLabel: input.sourceLabel,
    staleAfterMs,
  };
  const state = readCacheState(options.storage);
  state[getWeatherCacheKey(input.locationId)] = entry;
  writeCacheState(state, options.storage);

  return entry;
}

export function clearWeatherCache(locationId?: string, storage?: WeatherCacheStorageLike | null) {
  const resolved = resolveStorage(storage);

  if (!resolved) return;

  if (!locationId) {
    resolved.removeItem(WEATHER_CACHE_STORAGE_KEY);
    return;
  }

  const state = readCacheState(resolved);
  delete state[getWeatherCacheKey(locationId)];
  writeCacheState(state, resolved);
}
