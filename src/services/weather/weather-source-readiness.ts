import { clearWeatherCache, getWeatherCacheStatus } from '@/services/weather/weather-cache-service';
import type { WeatherCacheStorageLike } from '@/services/weather/weather-cache.types';
import { defaultWeatherCoarseLocation, getWeatherCoarseLocation, weatherLocationPrivacyStatus } from '@/services/weather/weather-location-fixtures';
import type { WeatherModeStatus } from '@/services/weather/weather.types';
import type {
  WeatherFallbackReason,
  WeatherLocalPreference,
  WeatherLocalPreferenceStatus,
  WeatherOfflineState,
  WeatherPreferenceStorageOptions,
  WeatherPrivacyBoundary,
  WeatherSourceReadinessInput,
  WeatherSourceReadinessItem,
  WeatherSourceReadinessSummary,
  WeatherSourceStatus,
} from '@/services/weather/weather-source-readiness.types';

export const WEATHER_LOCAL_PREFERENCE_STORAGE_KEY = 'kasethub.weatherLocalPreference.v1';

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

function nowIso(nowMs?: number) {
  return new Date(nowMs ?? Date.now()).toISOString();
}

export function getWeatherPrivacyBoundary(): WeatherPrivacyBoundary {
  return {
    noGps: true,
    noBrowserGeolocation: true,
    noPrecisePersonalLocationStorage: true,
    noSupabaseWrite: true,
    noBackendWrite: true,
    noCloudSync: true,
    allowedLocationPrecision: weatherLocationPrivacyStatus.allowedPrecision,
    summary: 'ใช้ได้เฉพาะจังหวัด/เมืองกลางโดยประมาณ ไม่มี GPS ไม่มีหมุดแปลง และไม่ซิงก์ขึ้นคลาวด์',
  };
}

export function readWeatherLocalPreference(
  options: WeatherPreferenceStorageOptions = {},
): WeatherLocalPreference | undefined {
  const storage = resolveStorage(options.storage);

  if (!storage) return undefined;

  try {
    const raw = storage.getItem(WEATHER_LOCAL_PREFERENCE_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<WeatherLocalPreference>;

    if (!parsed.selectedLocationId || !parsed.selectedLabel || parsed.noPreciseCoordinates !== true) {
      return undefined;
    }

    return {
      selectedLocationId: parsed.selectedLocationId,
      selectedLabel: parsed.selectedLabel,
      updatedAt: parsed.updatedAt ?? nowIso(options.nowMs),
      sourceMode: parsed.sourceMode ?? 'local_fixture',
      storage: 'localStorage',
      localOnly: true,
      noSupabaseWrite: true,
      noBackendWrite: true,
      noCloudSync: true,
      noPreciseCoordinates: true,
    };
  } catch {
    return undefined;
  }
}

export function writeWeatherLocalPreference(
  input: {
    selectedLocationId: string;
    selectedLabel?: string;
    sourceMode: WeatherModeStatus['mode'];
  },
  options: WeatherPreferenceStorageOptions = {},
): WeatherLocalPreference {
  const location = getWeatherCoarseLocation(input.selectedLocationId);
  const preference: WeatherLocalPreference = {
    selectedLocationId: location.id,
    selectedLabel: input.selectedLabel ?? location.label,
    updatedAt: nowIso(options.nowMs),
    sourceMode: input.sourceMode,
    storage: 'localStorage',
    localOnly: true,
    noSupabaseWrite: true,
    noBackendWrite: true,
    noCloudSync: true,
    noPreciseCoordinates: true,
  };
  const storage = resolveStorage(options.storage);

  if (storage) {
    storage.setItem(WEATHER_LOCAL_PREFERENCE_STORAGE_KEY, JSON.stringify(preference));
  }

  return preference;
}

export function clearWeatherLocalPreference(storage?: WeatherCacheStorageLike | null) {
  const resolved = resolveStorage(storage);

  if (!resolved) return;

  resolved.removeItem(WEATHER_LOCAL_PREFERENCE_STORAGE_KEY);
}

export function clearWeatherPreferenceAndCache(locationId?: string, storage?: WeatherCacheStorageLike | null) {
  clearWeatherLocalPreference(storage);
  clearWeatherCache(locationId, storage);
}

export function getWeatherLocalPreferenceStatus(
  options: WeatherPreferenceStorageOptions = {},
): WeatherLocalPreferenceStatus {
  const preference = readWeatherLocalPreference(options);
  const fallbackLocation = getWeatherCoarseLocation(preference?.selectedLocationId ?? defaultWeatherCoarseLocation.id);

  return {
    storageKey: WEATHER_LOCAL_PREFERENCE_STORAGE_KEY,
    hasPreference: Boolean(preference),
    selectedLocationId: preference?.selectedLocationId ?? fallbackLocation.id,
    selectedLabel: preference?.selectedLabel ?? fallbackLocation.label,
    preference,
    localOnly: true,
    noSupabaseWrite: true,
    noBackendWrite: true,
    noCloudSync: true,
  };
}

function getFallbackReason(input: WeatherSourceReadinessInput): WeatherFallbackReason {
  if (input.cacheStatus.isStale && input.isFallback) return 'stale_cache';
  if (input.modeStatus.mode === 'local_fixture') return 'local_fixture_default';
  if (input.modeStatus.mode === 'open_meteo_disabled') return 'api_disabled';
  if (input.modeStatus.mode === 'production_disabled') return 'production_disabled';
  if (input.isFallback) return input.cacheStatus.hasEntry ? 'stale_cache' : 'no_cache';
  return 'none';
}

export function getWeatherFallbackLabel(reason: WeatherFallbackReason): string {
  const labels: Record<WeatherFallbackReason, string> = {
    none: 'ไม่มี fallback',
    local_fixture_default: 'ใช้ข้อมูลสำรองในเครื่องตามค่าเริ่มต้น',
    api_disabled: 'Open-Meteo ถูกปิดด้วย flag',
    production_disabled: 'production path ถูกปิด',
    api_unavailable: 'API ภายนอกใช้งานไม่ได้',
    stale_cache: 'ใช้ข้อมูลล่าสุดที่มีในเครื่อง',
    no_cache: 'ไม่มีข้อมูลล่าสุดในเครื่อง จึงใช้ข้อมูลสำรอง',
    manual_refresh_cooldown: 'รอ cooldown ก่อนรีเฟรชอีกครั้ง',
  };

  return labels[reason];
}

export function buildWeatherOfflineState(input: WeatherSourceReadinessInput): WeatherOfflineState {
  const fallbackReason = getFallbackReason(input);

  if (input.isOpenMeteo && !input.isFallback && !input.cacheStatus.isStale) {
    return {
      status: 'live',
      badgeLabel: 'ข้อมูลจาก Open-Meteo',
      message: 'ข้อมูลอ้างอิงจาก Open-Meteo และอาจคลาดเคลื่อนได้',
      fallbackReason,
      useLocalFixture: false,
      useStaleCache: false,
    };
  }

  if (input.cacheStatus.isStale) {
    return {
      status: 'stale_cache',
      badgeLabel: 'cache เก่า',
      message: 'ใช้ข้อมูลล่าสุดที่มีในเครื่อง ควรตรวจสอบข้อมูลจากแหล่งทางการเพิ่มเติม',
      fallbackReason,
      useLocalFixture: false,
      useStaleCache: true,
    };
  }

  if (input.modeStatus.mode === 'open_meteo_ready' && input.isFallback) {
    return {
      status: 'api_unavailable',
      badgeLabel: 'API unavailable',
      message: 'Open-Meteo เรียกไม่ได้ จึงใช้ข้อมูลสำรองในเครื่อง',
      fallbackReason: input.cacheStatus.hasEntry ? 'stale_cache' : 'no_cache',
      useLocalFixture: !input.cacheStatus.hasEntry,
      useStaleCache: input.cacheStatus.hasEntry,
    };
  }

  return {
    status: input.modeStatus.mode === 'local_fixture' ? 'local_fixture' : 'disabled',
    badgeLabel: 'ข้อมูลสำรองในเครื่อง',
    message: 'ข้อมูลสำรองในเครื่องพร้อมใช้เมื่อยังไม่เปิดแหล่งพยากรณ์ออนไลน์หรือไม่มีเครือข่าย',
    fallbackReason,
    useLocalFixture: true,
    useStaleCache: false,
  };
}

function getSourceStatus(input: WeatherSourceReadinessInput): WeatherSourceStatus {
  if (input.cacheStatus.isStale) return 'stale';
  if (input.isFallback && input.modeStatus.mode === 'open_meteo_ready') return 'fallback';
  if (input.isOpenMeteo && input.modeStatus.canFetchOpenMeteo) return 'open_meteo_live_ready';
  if (input.modeStatus.mode === 'open_meteo_disabled') return 'open_meteo_disabled';
  if (input.modeStatus.mode === 'production_disabled') return 'production_disabled';
  if (input.modeStatus.mode === 'local_fixture') return 'local_fixture';
  return 'offline';
}

function buildReadinessMatrix(
  input: WeatherSourceReadinessInput,
  offlineState: WeatherOfflineState,
): WeatherSourceReadinessItem[] {
  return [
    {
      id: 'source-attribution',
      label: 'Source attribution',
      status: input.isOpenMeteo ? 'open_meteo_live_ready' : 'local_fixture',
      ready: true,
      tone: 'success',
      detail: input.isOpenMeteo ? 'แสดงข้อมูลอ้างอิงจาก Open-Meteo' : 'แสดงข้อมูลสำรองในเครื่อง',
    },
    {
      id: 'cache-freshness',
      label: 'Cache freshness',
      status: input.cacheStatus.isStale ? 'stale' : input.cacheStatus.isFresh ? 'open_meteo_live_ready' : 'local_fixture',
      ready: true,
      tone: input.cacheStatus.isStale ? 'warning' : 'success',
      detail: `cache ${input.cacheStatus.freshness} · stale หลัง ${input.cacheStatus.staleAfterMinutes} นาที`,
    },
    {
      id: 'fallback',
      label: 'Fallback reason',
      status: offlineState.status === 'live' ? 'open_meteo_live_ready' : 'fallback',
      ready: true,
      tone: offlineState.status === 'live' ? 'success' : 'warning',
      detail: getWeatherFallbackLabel(offlineState.fallbackReason),
    },
    {
      id: 'privacy',
      label: 'Privacy boundary',
      status: 'local_fixture',
      ready: true,
      tone: 'success',
      detail: 'ไม่มี GPS ไม่มีพิกัดแปลง ไม่มี Supabase write และไม่ซิงก์ preference',
    },
  ];
}

export function buildWeatherSourceReadiness(input: WeatherSourceReadinessInput): WeatherSourceReadinessSummary {
  const offlineState = buildWeatherOfflineState(input);
  const staleAgeLabel =
    input.cacheStatus.ageMinutes === undefined ? 'ยังไม่มี cache' : `${input.cacheStatus.ageMinutes} นาที`;

  return {
    sourceStatus: getSourceStatus(input),
    modeStatus: input.modeStatus,
    cacheFreshness: input.cacheStatus.freshness,
    fallbackReason: offlineState.fallbackReason,
    attributionLabel: input.isOpenMeteo ? 'ข้อมูลอ้างอิงจาก Open-Meteo' : 'ข้อมูลสำรองในเครื่อง',
    fetchedTimeLabel: input.fetchedAtLabel ?? 'ยังไม่มีเวลาอัปเดตล่าสุด',
    staleAgeLabel,
    offlineState,
    privacyBoundary: getWeatherPrivacyBoundary(),
    readinessMatrix: buildReadinessMatrix(input, offlineState),
  };
}

export function buildCurrentWeatherSourceReadiness(locationId = defaultWeatherCoarseLocation.id) {
  const cacheStatus = getWeatherCacheStatus(locationId);
  const modeStatus: WeatherModeStatus = {
    mode: 'local_fixture',
    apiEnabled: false,
    canFetchOpenMeteo: false,
    sourceLabel: 'local fixture',
    statusLabel: 'ปิด API: ใช้ข้อมูลสำรองในเครื่อง',
    disabledReason: 'ใช้ข้อมูลสำรองในเครื่อง',
    fallbackActive: true,
    noGeolocation: true,
    noPreciseLocationStorage: true,
  };

  return buildWeatherSourceReadiness({
    modeStatus,
    cacheStatus,
    isOpenMeteo: false,
    isFallback: true,
  });
}
