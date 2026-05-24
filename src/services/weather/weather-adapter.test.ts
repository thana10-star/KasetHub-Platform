import { describe, expect, test } from 'vitest';
import {
  buildOpenMeteoForecastUrl,
  type OpenMeteoFetch,
  type OpenMeteoForecastResponse,
} from '@/services/weather/weather-open-meteo-client';
import {
  getWeatherAdapterResult,
  loadWeatherAdapterResult,
  mapOpenMeteoWeatherCodeToThai,
} from '@/services/weather/weather-adapter';
import {
  clearWeatherCache,
  createMemoryWeatherCacheStorage,
  getWeatherCacheStatus,
} from '@/services/weather/weather-cache-service';
import { weatherCoarseLocations } from '@/services/weather/weather-location-fixtures';
import { farmerWeatherRiskNotes } from '@/services/weather/weather-risk-notes';

const readyEnv = {
  weatherMode: 'open_meteo_ready',
  enableRealWeatherApi: true,
  weatherDefaultLat: 13.7563,
  weatherDefaultLon: 100.5018,
  weatherDefaultLabel: 'กรุงเทพฯ',
};

const openMeteoFixture: OpenMeteoForecastResponse = {
  current: {
    time: '2026-05-24T09:00',
    temperature_2m: 32.4,
    relative_humidity_2m: 72,
    precipitation: 0.2,
    weather_code: 61,
    wind_speed_10m: 12,
  },
  daily: {
    time: ['2026-05-24', '2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30'],
    weather_code: [61, 3, 80, 95, 1, 2, 0],
    temperature_2m_max: [34, 35, 33, 32, 36, 34, 35],
    temperature_2m_min: [27, 27, 26, 25, 27, 26, 27],
    precipitation_sum: [2.1, 0, 5.5, 12, 0, 0.4, 0],
    precipitation_probability_max: [55, 20, 70, 85, 10, 25, 5],
    wind_speed_10m_max: [14, 12, 18, 30, 10, 12, 8],
  },
};

describe('M75 real weather Open-Meteo adapter', () => {
  test('default mode uses local fixture', () => {
    const result = getWeatherAdapterResult();

    expect(result.modeStatus.mode).toBe('local_fixture');
    expect(result.forecast.source.sourceType).toBe('demo');
    expect(result.modeStatus.canFetchOpenMeteo).toBe(false);
  });

  test('open_meteo_disabled does not fetch', async () => {
    let calls = 0;
    const fetcher: OpenMeteoFetch = async () => {
      calls += 1;
      return { ok: true, status: 200, json: async () => openMeteoFixture };
    };

    const result = await loadWeatherAdapterResult(undefined, {
      env: { ...readyEnv, weatherMode: 'open_meteo_disabled' },
      fetcher,
    });

    expect(calls).toBe(0);
    expect(result.forecast.source.sourceType).toBe('demo');
  });

  test('production_disabled does not fetch', async () => {
    let calls = 0;
    const fetcher: OpenMeteoFetch = async () => {
      calls += 1;
      return { ok: true, status: 200, json: async () => openMeteoFixture };
    };

    const result = await loadWeatherAdapterResult(undefined, {
      env: { ...readyEnv, weatherMode: 'production_disabled' },
      fetcher,
    });

    expect(calls).toBe(0);
    expect(result.modeStatus.statusLabel).toContain('ปิด');
  });

  test('open_meteo_ready still requires API flag before fetch', async () => {
    let calls = 0;
    const fetcher: OpenMeteoFetch = async () => {
      calls += 1;
      return { ok: true, status: 200, json: async () => openMeteoFixture };
    };

    const result = await loadWeatherAdapterResult(undefined, {
      env: { ...readyEnv, enableRealWeatherApi: false },
      fetcher,
    });

    expect(calls).toBe(0);
    expect(result.forecast.source.sourceType).toBe('demo');
  });

  test('open_meteo_ready builds correct endpoint with configured lat/lon', async () => {
    const url = buildOpenMeteoForecastUrl({ latitude: 13.7563, longitude: 100.5018 });
    expect(url).toContain('latitude=13.7563');
    expect(url).toContain('longitude=100.5018');
    expect(url).toContain('current=temperature_2m');
    expect(url).toContain('daily=weather_code');

    let requestedUrl = '';
    const fetcher: OpenMeteoFetch = async (input) => {
      requestedUrl = input;
      return { ok: true, status: 200, json: async () => openMeteoFixture };
    };

    const result = await loadWeatherAdapterResult(undefined, { env: readyEnv, fetcher });

    expect(requestedUrl).toContain('latitude=13.7563');
    expect(requestedUrl).toContain('longitude=100.5018');
    expect(result.forecast.source.label).toBe('Open-Meteo');
    expect(result.forecast.current?.temperatureC).toBe(32.4);
  });

  test('API failure falls back to fixture', async () => {
    const fetcher: OpenMeteoFetch = async () => {
      throw new Error('network_down');
    };

    const result = await loadWeatherAdapterResult(undefined, { env: readyEnv, fetcher });

    expect(result.forecast.isFallback).toBe(true);
    expect(result.forecast.source.sourceType).toBe('demo');
    expect(result.forecast.fallbackReason).toContain('network_down');
  });

  test('cache hit avoids fetch', async () => {
    const storage = createMemoryWeatherCacheStorage();
    let calls = 0;
    const fetcher: OpenMeteoFetch = async () => {
      calls += 1;
      return { ok: true, status: 200, json: async () => openMeteoFixture };
    };

    await loadWeatherAdapterResult('bangkok', {
      env: readyEnv,
      fetcher,
      cacheStorage: storage,
      nowMs: Date.parse('2026-05-24T09:00:00Z'),
    });
    const cached = await loadWeatherAdapterResult('bangkok', {
      env: readyEnv,
      fetcher,
      cacheStorage: storage,
      nowMs: Date.parse('2026-05-24T09:10:00Z'),
    });

    expect(calls).toBe(1);
    expect(cached.cacheStatus.isFresh).toBe(true);
    expect(cached.forecast.source.label).toBe('Open-Meteo');
  });

  test('stale cache shows stale status', async () => {
    const storage = createMemoryWeatherCacheStorage();
    const baseTime = Date.parse('2026-05-24T09:00:00Z');

    await loadWeatherAdapterResult('bangkok', {
      env: readyEnv,
      fetcher: async () => ({ ok: true, status: 200, json: async () => openMeteoFixture }),
      cacheStorage: storage,
      nowMs: baseTime,
      staleAfterMs: 30 * 60 * 1000,
    });

    const status = getWeatherCacheStatus('bangkok', {
      storage,
      nowMs: baseTime + 31 * 60 * 1000,
      staleAfterMs: 30 * 60 * 1000,
    });

    expect(status.isStale).toBe(true);
    expect(status.freshness).toBe('stale');
  });

  test('API failure falls back to stale cache when available', async () => {
    const storage = createMemoryWeatherCacheStorage();
    const baseTime = Date.parse('2026-05-24T09:00:00Z');

    await loadWeatherAdapterResult('bangkok', {
      env: readyEnv,
      fetcher: async () => ({ ok: true, status: 200, json: async () => openMeteoFixture }),
      cacheStorage: storage,
      nowMs: baseTime,
      staleAfterMs: 30 * 60 * 1000,
    });

    const result = await loadWeatherAdapterResult('bangkok', {
      env: readyEnv,
      fetcher: async () => {
        throw new Error('api_down');
      },
      cacheStorage: storage,
      nowMs: baseTime + 31 * 60 * 1000,
      staleAfterMs: 30 * 60 * 1000,
    });

    expect(result.forecast.isStale).toBe(true);
    expect(result.forecast.isFallback).toBe(true);
    expect(result.cacheStatus.isStale).toBe(true);
    expect(result.forecast.source.label).toBe('Open-Meteo');
  });

  test('cache can be cleared', async () => {
    const storage = createMemoryWeatherCacheStorage();

    await loadWeatherAdapterResult('bangkok', {
      env: readyEnv,
      fetcher: async () => ({ ok: true, status: 200, json: async () => openMeteoFixture }),
      cacheStorage: storage,
      nowMs: Date.parse('2026-05-24T09:00:00Z'),
    });

    expect(getWeatherCacheStatus('bangkok', { storage }).hasEntry).toBe(true);
    clearWeatherCache('bangkok', storage);
    expect(getWeatherCacheStatus('bangkok', { storage }).hasEntry).toBe(false);
  });

  test('weather code maps to Thai label', () => {
    expect(mapOpenMeteoWeatherCodeToThai(0).label).toBe('ท้องฟ้าแจ่มใส');
    expect(mapOpenMeteoWeatherCodeToThai(61).label).toContain('ฝน');
    expect(mapOpenMeteoWeatherCodeToThai(95).iconTone).toBe('storm');
  });

  test('no geolocation call occurs', async () => {
    const originalNavigator = globalThis.navigator;
    let geolocationCalls = 0;

    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: {
        geolocation: {
          getCurrentPosition: () => {
            geolocationCalls += 1;
          },
        },
      },
    });

    try {
      const result = await loadWeatherAdapterResult(undefined, {
        env: readyEnv,
        fetcher: async () => ({ ok: true, status: 200, json: async () => openMeteoFixture }),
      });

      expect(result.modeStatus.noGeolocation).toBe(true);
      expect(result.forecast.privacyNotice).toContain('ไม่มีการขอ GPS');
      expect(geolocationCalls).toBe(0);
    } finally {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        value: originalNavigator,
      });
    }
  });

  test('no precise location is stored', async () => {
    const result = await loadWeatherAdapterResult(undefined, {
      env: readyEnv,
      fetcher: async () => ({ ok: true, status: 200, json: async () => openMeteoFixture }),
    });

    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('13.7563');
    expect(serialized).not.toContain('100.5018');
    expect(result.forecast.location.label).toBe('กรุงเทพฯ');
  });

  test('coarse location fixtures do not store precise farm coordinates', () => {
    expect(weatherCoarseLocations).toHaveLength(9);
    expect(weatherCoarseLocations.every((location) => location.precision === 'province_or_city_center')).toBe(true);
    expect(weatherCoarseLocations.every((location) => location.privacyNote.includes('ไม่ใช่ตำแหน่งแปลง'))).toBe(true);
  });

  test('risk notes are general and disclaimer-bound', () => {
    expect(farmerWeatherRiskNotes).toHaveLength(4);
    expect(farmerWeatherRiskNotes.map((note) => note.title)).toContain('ก่อนพ่นยาให้ดูฝนและลม');
    expect(farmerWeatherRiskNotes.every((note) => note.boundary.includes('ไม่'))).toBe(true);
  });
});
