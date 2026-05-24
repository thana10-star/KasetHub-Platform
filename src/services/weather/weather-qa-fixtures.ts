import { getWeatherModeStatus } from '@/services/weather/weather-adapter';
import { DEFAULT_WEATHER_CACHE_STALE_AFTER_MS } from '@/services/weather/weather-cache-service';
import { weatherLocationPrivacyStatus } from '@/services/weather/weather-location-fixtures';

export type WeatherQaFixture = {
  id: string;
  title: string;
  mode: string;
  expectedStatus: 'pass' | 'warn' | 'blocked';
  fetchExpected: boolean;
  fallbackExpected: boolean;
  staleExample: boolean;
  note: string;
};

export const weatherQaFixtures: WeatherQaFixture[] = [
  {
    id: 'local-fixture-default',
    title: 'default local fixture',
    mode: 'local_fixture',
    expectedStatus: 'pass',
    fetchExpected: false,
    fallbackExpected: true,
    staleExample: false,
    note: 'ค่าเริ่มต้นไม่เรียก network และใช้ข้อมูลในเครื่อง',
  },
  {
    id: 'open-meteo-disabled',
    title: 'Open-Meteo disabled',
    mode: 'open_meteo_disabled',
    expectedStatus: 'blocked',
    fetchExpected: false,
    fallbackExpected: true,
    staleExample: false,
    note: 'โหมดปิด provider ต้องไม่ fetch',
  },
  {
    id: 'open-meteo-ready-flagged',
    title: 'Open-Meteo ready with flags',
    mode: 'open_meteo_ready',
    expectedStatus: 'pass',
    fetchExpected: true,
    fallbackExpected: false,
    staleExample: false,
    note: 'เรียกได้เฉพาะเมื่อเปิด mode และ flag พร้อม',
  },
  {
    id: 'network-failure-stale-cache',
    title: 'API failure uses stale cache',
    mode: 'open_meteo_ready',
    expectedStatus: 'warn',
    fetchExpected: true,
    fallbackExpected: true,
    staleExample: true,
    note: 'ถ้า API ล้มเหลวและมี cache เก่า ให้แสดง stale warning',
  },
  {
    id: 'production-disabled',
    title: 'production disabled',
    mode: 'production_disabled',
    expectedStatus: 'blocked',
    fetchExpected: false,
    fallbackExpected: true,
    staleExample: false,
    note: 'production path ต้องปิดจนกว่าจะมี review แยก',
  },
];

export function getWeatherQaSummary() {
  const modeStatus = getWeatherModeStatus();

  return {
    modeStatus,
    fixtures: weatherQaFixtures,
    cacheStaleAfterMinutes: Math.round(DEFAULT_WEATHER_CACHE_STALE_AFTER_MS / 60000),
    privacyStatus: weatherLocationPrivacyStatus,
    noGpsProof: weatherLocationPrivacyStatus.noGps && weatherLocationPrivacyStatus.noBrowserGeolocation,
    noPreciseStorageProof:
      weatherLocationPrivacyStatus.noFarmPreciseCoordinates &&
      weatherLocationPrivacyStatus.noPrecisePersonalLocationStorage,
  };
}
