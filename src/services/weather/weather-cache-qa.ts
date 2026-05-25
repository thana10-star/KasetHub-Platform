import type { WeatherCacheFreshness, WeatherCacheStatus } from '@/services/weather/weather-cache.types';
import {
  DEFAULT_WEATHER_CACHE_STALE_AFTER_MS,
  getWeatherCacheStatus,
} from '@/services/weather/weather-cache-service';
import { defaultWeatherCoarseLocation } from '@/services/weather/weather-location-fixtures';

export type WeatherCacheFreshnessQa = {
  freshness: WeatherCacheFreshness;
  label: string;
  badgeTone: 'green' | 'gold' | 'neutral';
  message: string;
};

export type WeatherCacheQaExample = {
  id: string;
  title: string;
  freshness: WeatherCacheFreshness;
  fallbackReason: string;
  userMessage: string;
};

const freshnessQa: Record<WeatherCacheFreshness, WeatherCacheFreshnessQa> = {
  fresh: {
    freshness: 'fresh',
    label: 'cache ยังสด',
    badgeTone: 'green',
    message: 'ใช้ cache ได้โดยไม่ต้อง fetch ซ้ำ',
  },
  stale: {
    freshness: 'stale',
    label: 'cache เก่า',
    badgeTone: 'gold',
    message: 'ใช้ข้อมูลล่าสุดที่มีในเครื่อง พร้อมเตือนให้ตรวจสอบแหล่งทางการ',
  },
  empty: {
    freshness: 'empty',
    label: 'ยังไม่มี cache',
    badgeTone: 'neutral',
    message: 'ถ้า API ใช้ไม่ได้ จะกลับไปใช้ข้อมูลจำลองในเครื่อง',
  },
};

export function getWeatherCacheFreshnessQa(freshness: WeatherCacheFreshness): WeatherCacheFreshnessQa {
  return freshnessQa[freshness];
}

export function computeWeatherStaleAgeLabel(status: Pick<WeatherCacheStatus, 'ageMinutes' | 'freshness'>) {
  if (status.ageMinutes === undefined) return 'ยังไม่มี cache';
  if (status.ageMinutes <= 0) return 'เพิ่งบันทึก';
  return `${status.ageMinutes} นาที`;
}

export const weatherCacheQaExamples: WeatherCacheQaExample[] = [
  {
    id: 'fresh-cache',
    title: 'Fresh cache',
    freshness: 'fresh',
    fallbackReason: 'cache ยังไม่หมดอายุ จึงไม่ต้องเรียก API ซ้ำ',
    userMessage: 'ข้อมูลล่าสุดในเครื่องยังสด',
  },
  {
    id: 'stale-cache-api-failed',
    title: 'Stale cache after API failure',
    freshness: 'stale',
    fallbackReason: 'Open-Meteo เรียกไม่ได้ จึงใช้ข้อมูลล่าสุดที่มีในเครื่อง',
    userMessage: 'ใช้ข้อมูลล่าสุดที่มีในเครื่อง',
  },
  {
    id: 'no-cache-local-fixture',
    title: 'No cache fallback',
    freshness: 'empty',
    fallbackReason: 'ไม่มี cache และ API ไม่พร้อม จึงใช้ข้อมูลออฟไลน์/ข้อมูลจำลอง',
    userMessage: 'ข้อมูลออฟไลน์/ข้อมูลจำลอง',
  },
];

export function buildWeatherCacheQaSummary(locationId = defaultWeatherCoarseLocation.id) {
  const status = getWeatherCacheStatus(locationId);
  const qa = getWeatherCacheFreshnessQa(status.freshness);

  return {
    locationId,
    status,
    qa,
    staleAgeLabel: computeWeatherStaleAgeLabel(status),
    staleAfterMinutes: Math.round(DEFAULT_WEATHER_CACHE_STALE_AFTER_MS / 60000),
    examples: weatherCacheQaExamples,
    localOnly: true,
    noSupabaseWrite: true,
    noCloudSync: true,
  };
}
