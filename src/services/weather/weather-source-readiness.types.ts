import type {
  WeatherCacheFreshness,
  WeatherCacheStatus,
  WeatherCacheStorageLike,
} from '@/services/weather/weather-cache.types';
import type { WeatherLocationPrivacyStatus } from '@/services/weather/weather-location.types';
import type { WeatherMode, WeatherModeStatus } from '@/services/weather/weather.types';

export type { WeatherCacheFreshness } from '@/services/weather/weather-cache.types';

export type WeatherSourceStatus =
  | 'local_fixture'
  | 'open_meteo_live_ready'
  | 'open_meteo_disabled'
  | 'production_disabled'
  | 'fallback'
  | 'stale'
  | 'offline';

export type WeatherFallbackReason =
  | 'none'
  | 'local_fixture_default'
  | 'api_disabled'
  | 'production_disabled'
  | 'api_unavailable'
  | 'stale_cache'
  | 'no_cache'
  | 'manual_refresh_cooldown';

export type WeatherLocalPreference = {
  selectedLocationId: string;
  selectedLabel: string;
  updatedAt: string;
  sourceMode: WeatherMode;
  storage: 'localStorage';
  localOnly: true;
  noSupabaseWrite: true;
  noBackendWrite: true;
  noCloudSync: true;
  noPreciseCoordinates: true;
};

export type WeatherOfflineState = {
  status: 'live' | 'local_fixture' | 'stale_cache' | 'api_unavailable' | 'disabled';
  badgeLabel: string;
  message: string;
  fallbackReason: WeatherFallbackReason;
  useLocalFixture: boolean;
  useStaleCache: boolean;
};

export type WeatherPrivacyBoundary = {
  noGps: true;
  noBrowserGeolocation: true;
  noPrecisePersonalLocationStorage: true;
  noSupabaseWrite: true;
  noBackendWrite: true;
  noCloudSync: true;
  allowedLocationPrecision: WeatherLocationPrivacyStatus['allowedPrecision'];
  summary: string;
};

export type WeatherSourceReadinessItem = {
  id: string;
  label: string;
  status: WeatherSourceStatus;
  ready: boolean;
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  detail: string;
};

export type WeatherSourceReadinessSummary = {
  sourceStatus: WeatherSourceStatus;
  modeStatus: WeatherModeStatus;
  cacheFreshness: WeatherCacheFreshness;
  fallbackReason: WeatherFallbackReason;
  attributionLabel: string;
  fetchedTimeLabel: string;
  staleAgeLabel: string;
  offlineState: WeatherOfflineState;
  privacyBoundary: WeatherPrivacyBoundary;
  readinessMatrix: WeatherSourceReadinessItem[];
};

export type WeatherLocalPreferenceStatus = {
  storageKey: string;
  hasPreference: boolean;
  selectedLocationId: string;
  selectedLabel: string;
  preference?: WeatherLocalPreference;
  localOnly: true;
  noSupabaseWrite: true;
  noBackendWrite: true;
  noCloudSync: true;
};

export type WeatherPreferenceStorageOptions = {
  storage?: WeatherCacheStorageLike | null;
  nowMs?: number;
};

export type WeatherSourceReadinessInput = {
  modeStatus: WeatherModeStatus;
  cacheStatus: WeatherCacheStatus;
  isOpenMeteo: boolean;
  isFallback?: boolean;
  fetchedAtLabel?: string;
};
