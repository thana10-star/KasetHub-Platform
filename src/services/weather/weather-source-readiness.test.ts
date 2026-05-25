import { describe, expect, test } from 'vitest';
import { getWeatherForecast, getWeatherModeStatus } from '@/services/weather/weather-adapter';
import { computeWeatherStaleAgeLabel, getWeatherCacheFreshnessQa } from '@/services/weather/weather-cache-qa';
import {
  clearWeatherCache,
  createMemoryWeatherCacheStorage,
  getWeatherCacheStatus,
  writeWeatherCacheEntry,
} from '@/services/weather/weather-cache-service';
import { buildWeatherRefreshPolicy, WEATHER_MANUAL_REFRESH_COOLDOWN_MS } from '@/services/weather/weather-refresh-policy';
import {
  buildWeatherSourceReadiness,
  clearWeatherLocalPreference,
  clearWeatherPreferenceAndCache,
  getWeatherFallbackLabel,
  getWeatherLocalPreferenceStatus,
  getWeatherPrivacyBoundary,
  readWeatherLocalPreference,
  WEATHER_LOCAL_PREFERENCE_STORAGE_KEY,
  writeWeatherLocalPreference,
} from '@/services/weather/weather-source-readiness';

describe('M77 weather UX and data-source readiness', () => {
  test('manual refresh is disabled in local_fixture mode', () => {
    const policy = buildWeatherRefreshPolicy({
      modeStatus: getWeatherModeStatus({ weatherMode: 'local_fixture', enableRealWeatherApi: false }),
    });

    expect(policy.canRefresh).toBe(false);
    expect(policy.status).toBe('disabled');
    expect(policy.noAutoBackgroundRefresh).toBe(true);
  });

  test('stale age is computed correctly', () => {
    const storage = createMemoryWeatherCacheStorage();
    const baseTime = Date.parse('2026-05-24T09:00:00Z');

    writeWeatherCacheEntry(
      {
        locationId: 'bangkok',
        forecast: getWeatherForecast('bangkok'),
        sourceMode: 'open_meteo_ready',
        sourceLabel: 'Open-Meteo',
      },
      { storage, nowMs: baseTime, staleAfterMs: 30 * 60 * 1000 },
    );

    const status = getWeatherCacheStatus('bangkok', {
      storage,
      nowMs: baseTime + 31 * 60 * 1000,
      staleAfterMs: 30 * 60 * 1000,
    });

    expect(status.ageMinutes).toBe(31);
    expect(computeWeatherStaleAgeLabel(status)).toBe('31 นาที');
  });

  test('cache freshness states map correctly', () => {
    expect(getWeatherCacheFreshnessQa('fresh').badgeTone).toBe('green');
    expect(getWeatherCacheFreshnessQa('stale').badgeTone).toBe('gold');
    expect(getWeatherCacheFreshnessQa('empty').message).toContain('ข้อมูลสำรองในเครื่อง');
  });

  test('selected location persists locally only', () => {
    const storage = createMemoryWeatherCacheStorage();
    const preference = writeWeatherLocalPreference(
      {
        selectedLocationId: 'khon-kaen',
        sourceMode: 'local_fixture',
      },
      { storage, nowMs: Date.parse('2026-05-24T09:00:00Z') },
    );
    const saved = readWeatherLocalPreference({ storage });
    const raw = storage.getItem(WEATHER_LOCAL_PREFERENCE_STORAGE_KEY) ?? '';

    expect(saved?.selectedLocationId).toBe('khon-kaen');
    expect(preference.localOnly).toBe(true);
    expect(preference.noSupabaseWrite).toBe(true);
    expect(preference.noCloudSync).toBe(true);
    expect(raw).not.toContain('102.835');
    expect(raw).not.toContain('16.441');
  });

  test('no Supabase write occurs in preference status', () => {
    const status = getWeatherLocalPreferenceStatus({ storage: createMemoryWeatherCacheStorage() });

    expect(status.localOnly).toBe(true);
    expect(status.noSupabaseWrite).toBe(true);
    expect(status.noBackendWrite).toBe(true);
    expect(status.noCloudSync).toBe(true);
  });

  test('clear cache clears preference and cache', () => {
    const storage = createMemoryWeatherCacheStorage();

    writeWeatherLocalPreference({ selectedLocationId: 'bangkok', sourceMode: 'local_fixture' }, { storage });
    writeWeatherCacheEntry(
      {
        locationId: 'bangkok',
        forecast: getWeatherForecast('bangkok'),
        sourceMode: 'open_meteo_ready',
        sourceLabel: 'Open-Meteo',
      },
      { storage },
    );

    expect(getWeatherCacheStatus('bangkok', { storage }).hasEntry).toBe(true);
    expect(readWeatherLocalPreference({ storage })?.selectedLocationId).toBe('bangkok');

    clearWeatherPreferenceAndCache('bangkok', storage);

    expect(getWeatherCacheStatus('bangkok', { storage }).hasEntry).toBe(false);
    expect(readWeatherLocalPreference({ storage })).toBeUndefined();
  });

  test('offline fallback reason is displayable', () => {
    const summary = buildWeatherSourceReadiness({
      modeStatus: getWeatherModeStatus({ weatherMode: 'local_fixture', enableRealWeatherApi: false }),
      cacheStatus: getWeatherCacheStatus('bangkok', { storage: createMemoryWeatherCacheStorage() }),
      isOpenMeteo: false,
      isFallback: true,
    });

    expect(summary.offlineState.badgeLabel).toBe('ข้อมูลสำรองในเครื่อง');
    expect(getWeatherFallbackLabel(summary.fallbackReason)).toContain('ข้อมูลสำรองในเครื่อง');
  });

  test('no GPS or geolocation is used in privacy boundary', () => {
    const privacy = getWeatherPrivacyBoundary();

    expect(privacy.noGps).toBe(true);
    expect(privacy.noBrowserGeolocation).toBe(true);
    expect(privacy.noPrecisePersonalLocationStorage).toBe(true);
  });

  test('manual refresh cooldown is respected', () => {
    const modeStatus = getWeatherModeStatus({
      weatherMode: 'open_meteo_ready',
      enableRealWeatherApi: true,
      weatherDefaultLat: 13.7563,
      weatherDefaultLon: 100.5018,
    });
    const nowMs = Date.parse('2026-05-24T09:01:00Z');
    const policy = buildWeatherRefreshPolicy({
      modeStatus,
      lastSuccessfulRefresh: new Date(nowMs - WEATHER_MANUAL_REFRESH_COOLDOWN_MS + 30_000).toISOString(),
      nowMs,
    });

    expect(policy.canRefresh).toBe(false);
    expect(policy.status).toBe('cooldown');
    expect(policy.remainingCooldownMs).toBe(30_000);
  });

  test('clearWeatherLocalPreference is safe without storage', () => {
    clearWeatherLocalPreference(null);
    clearWeatherCache('bangkok', null);

    expect(true).toBe(true);
  });
});
