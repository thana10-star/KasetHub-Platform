import { publicEnv } from '@/config/env';
import {
  futureWeatherSources,
  weatherAlertMocks,
  weatherForecastsWithAlerts,
  weatherSources,
} from '@/services/weather/weather-fixtures';
import {
  getWeatherCacheStatus,
  readWeatherCacheEntry,
  writeWeatherCacheEntry,
} from '@/services/weather/weather-cache-service';
import type { WeatherCacheStorageLike } from '@/services/weather/weather-cache.types';
import {
  defaultWeatherCoarseLocation,
  getWeatherCoarseLocation,
  getWeatherLocationOptions,
  toWeatherLocation,
  weatherLocationPrivacyStatus,
} from '@/services/weather/weather-location-fixtures';
import {
  fetchOpenMeteoForecast,
  type OpenMeteoFetch,
  type OpenMeteoForecastResponse,
} from '@/services/weather/weather-open-meteo-client';
import type {
  AgricultureWeatherRisk,
  CropWorkRecommendation,
  WeatherAdapterResult,
  WeatherApiStatus,
  WeatherCurrentConditions,
  WeatherForecastDay,
  WeatherLocation,
  WeatherLocationForecast,
  WeatherMode,
  WeatherModeStatus,
  WeatherSource,
} from '@/services/weather/weather.types';

type WeatherAdapterEnv = {
  weatherMode?: string;
  enableRealWeatherApi?: boolean;
  weatherDefaultLat?: number;
  weatherDefaultLon?: number;
  weatherDefaultLabel?: string;
};

type LoadWeatherOptions = {
  env?: WeatherAdapterEnv;
  fetcher?: OpenMeteoFetch;
  timeoutMs?: number;
  cacheStorage?: WeatherCacheStorageLike | null;
  nowMs?: number;
  staleAfterMs?: number;
  forceRefresh?: boolean;
};

type WeatherCacheOptions = Pick<LoadWeatherOptions, 'cacheStorage' | 'nowMs' | 'staleAfterMs'>;

const defaultLocationId = defaultWeatherCoarseLocation.id;

const openMeteoSource: WeatherSource = {
  id: 'open-meteo-source',
  label: 'Open-Meteo',
  shortLabel: 'Open-Meteo',
  sourceType: 'open_meteo',
  reliabilityLevel: 'future_provider',
  status: 'live_ready',
  attributionLabel: 'ข้อมูลอ้างอิงจาก API ภายนอก Open-Meteo',
  plannedUse: 'ใช้เมื่อเปิด VITE_WEATHER_MODE=open_meteo_ready และ VITE_ENABLE_REAL_WEATHER_API=true เท่านั้น',
};

const weatherModes: WeatherMode[] = ['local_fixture', 'open_meteo_disabled', 'open_meteo_ready', 'production_disabled'];

function normalizeWeatherMode(mode?: string): WeatherMode {
  return weatherModes.includes(mode as WeatherMode) ? (mode as WeatherMode) : 'local_fixture';
}

function resolveWeatherEnv(overrides?: WeatherAdapterEnv) {
  return {
    weatherMode: normalizeWeatherMode(overrides?.weatherMode ?? publicEnv.weatherMode),
    enableRealWeatherApi: overrides?.enableRealWeatherApi ?? publicEnv.enableRealWeatherApi,
    weatherDefaultLat: overrides?.weatherDefaultLat ?? publicEnv.weatherDefaultLat,
    weatherDefaultLon: overrides?.weatherDefaultLon ?? publicEnv.weatherDefaultLon,
    weatherDefaultLabel: overrides?.weatherDefaultLabel ?? publicEnv.weatherDefaultLabel,
  };
}

function hasValidConfiguredCoordinate(env: ReturnType<typeof resolveWeatherEnv>) {
  return (
    Number.isFinite(env.weatherDefaultLat) &&
    Number.isFinite(env.weatherDefaultLon) &&
    Math.abs(env.weatherDefaultLat) <= 90 &&
    Math.abs(env.weatherDefaultLon) <= 180
  );
}

export function getWeatherModeStatus(overrides?: WeatherAdapterEnv): WeatherModeStatus {
  const env = resolveWeatherEnv(overrides);
  const canFetchOpenMeteo =
    env.weatherMode === 'open_meteo_ready' && env.enableRealWeatherApi && hasValidConfiguredCoordinate(env);

  const disabledReason =
    env.weatherMode === 'local_fixture'
      ? 'ใช้ข้อมูลสำรองในเครื่อง'
      : env.weatherMode === 'open_meteo_disabled'
        ? 'Open-Meteo ถูกปิดไว้'
        : env.weatherMode === 'production_disabled'
          ? 'production mode ถูกปิดไว้'
          : !env.enableRealWeatherApi
            ? 'ยังไม่ได้เปิด VITE_ENABLE_REAL_WEATHER_API'
            : !hasValidConfiguredCoordinate(env)
              ? 'lat/lon ไม่พร้อม'
              : undefined;

  return {
    mode: env.weatherMode,
    apiEnabled: env.enableRealWeatherApi,
    canFetchOpenMeteo,
    sourceLabel: canFetchOpenMeteo ? 'Open-Meteo' : 'local fixture',
    statusLabel: canFetchOpenMeteo ? 'พร้อมเรียก Open-Meteo' : `ปิด API: ${disabledReason}`,
    disabledReason,
    fallbackActive: !canFetchOpenMeteo,
    noGeolocation: true,
    noPreciseLocationStorage: true,
  };
}

export function getWeatherLocations() {
  return getWeatherLocationOptions();
}

export function getWeatherSources() {
  return [weatherSources[0], openMeteoSource];
}

export function getFutureWeatherSources() {
  return futureWeatherSources;
}

export function getWeatherAlerts() {
  return weatherAlertMocks;
}

function enrichLocalForecast(
  forecast: WeatherLocationForecast,
  status: WeatherModeStatus,
  location = forecast.location,
  overrides?: Partial<WeatherLocationForecast>,
): WeatherLocationForecast {
  const today = forecast.today;
  const fetchedAt = new Date().toISOString();

  return {
    ...forecast,
    location,
    mode: status.mode,
    apiStatus: status.canFetchOpenMeteo ? 'ready' : 'local_fixture',
    fetchedAt,
    fetchedAtLabel: forecast.updatedAtLabel,
    isStale: false,
    isFallback: true,
    fallbackReason: status.disabledReason ?? 'ใช้ข้อมูลสำรองในเครื่อง',
    privacyNotice: 'ไม่มีการขอ GPS และไม่มีการเก็บตำแหน่งส่วนตัว',
    current: {
      temperatureC: today.maxTempC - 2,
      humidityPercent: today.humidityPercent,
      precipitationMm: today.precipitationMm ?? Number((today.rainChancePercent / 25).toFixed(1)),
      windKph: today.windKph,
      conditionLabel: today.conditionLabel,
      observedAtLabel: forecast.updatedAtLabel,
    },
    ...overrides,
  };
}

function getFixtureForecastForCoarseLocation(locationId = defaultLocationId) {
  const coarseLocation = getWeatherCoarseLocation(locationId);

  return (
    weatherForecastsWithAlerts.find((item) => item.location.label === coarseLocation.label) ??
    weatherForecastsWithAlerts.find((item) => item.location.region === coarseLocation.region) ??
    weatherForecastsWithAlerts.find((item) => item.location.label === defaultWeatherCoarseLocation.label) ??
    weatherForecastsWithAlerts[0]
  );
}

export function getWeatherForecast(locationId = defaultLocationId): WeatherLocationForecast {
  const status = getWeatherModeStatus();
  const coarseLocation = getWeatherCoarseLocation(locationId);
  const forecast = getFixtureForecastForCoarseLocation(coarseLocation.id);

  return enrichLocalForecast(forecast, status, toWeatherLocation(coarseLocation));
}

function getLocalWeatherAdapterResult(
  locationId = defaultLocationId,
  status = getWeatherModeStatus(),
  cacheOptions: WeatherCacheOptions = {},
): WeatherAdapterResult {
  const coarseLocation = getWeatherCoarseLocation(locationId);
  const forecast = getFixtureForecastForCoarseLocation(coarseLocation.id);
  const enrichedForecast = enrichLocalForecast(forecast, status, toWeatherLocation(coarseLocation));

  return {
    locations: getWeatherLocations(),
    selectedLocationId: coarseLocation.id,
    forecast: enrichedForecast,
    sources: getWeatherSources(),
    futureSources: getFutureWeatherSources(),
    alerts: getWeatherAlerts(),
    modeStatus: status,
    cacheStatus: getWeatherCacheStatus(coarseLocation.id, {
      nowMs: cacheOptions.nowMs,
      staleAfterMs: cacheOptions.staleAfterMs,
      storage: cacheOptions.cacheStorage,
    }),
    locationPrivacyStatus: weatherLocationPrivacyStatus,
  };
}

export function getWeatherAdapterResult(locationId = defaultLocationId): WeatherAdapterResult {
  return getLocalWeatherAdapterResult(locationId, getWeatherModeStatus());
}

export function mapOpenMeteoWeatherCodeToThai(code?: number): {
  label: string;
  iconTone: WeatherForecastDay['iconTone'];
} {
  if (code === 0) return { label: 'ท้องฟ้าแจ่มใส', iconTone: 'sun' };
  if ([1, 2].includes(code ?? -1)) return { label: 'มีเมฆบางส่วน', iconTone: 'cloud' };
  if (code === 3) return { label: 'เมฆมาก', iconTone: 'cloud' };
  if ([45, 48].includes(code ?? -1)) return { label: 'หมอก', iconTone: 'cloud' };
  if ([51, 53, 55].includes(code ?? -1)) return { label: 'ฝนปรอย', iconTone: 'rain' };
  if ([61, 63, 65, 66, 67].includes(code ?? -1)) return { label: 'ฝนตก', iconTone: 'rain' };
  if ([71, 73, 75, 77].includes(code ?? -1)) return { label: 'อากาศหนาวจัด/หิมะ', iconTone: 'cloud' };
  if ([80, 81, 82].includes(code ?? -1)) return { label: 'ฝนเป็นช่วง', iconTone: 'rain' };
  if ([95, 96, 99].includes(code ?? -1)) return { label: 'พายุฝนฟ้าคะนอง', iconTone: 'storm' };
  return { label: 'ไม่ทราบสภาพอากาศ', iconTone: 'cloud' };
}

function buildRiskIds(input: {
  maxTempC: number;
  rainChancePercent: number;
  humidityPercent?: number;
  windKph: number;
  precipitationMm: number;
}): AgricultureWeatherRisk[] {
  const risks = new Set<AgricultureWeatherRisk>();

  if (input.maxTempC >= 35) risks.add('heat');
  if (input.rainChancePercent >= 70 || input.precipitationMm >= 8) risks.add('heavy_rain');
  if ((input.humidityPercent ?? 0) >= 80) risks.add('high_humidity');
  if (input.windKph >= 24) risks.add('strong_wind');
  if (input.rainChancePercent < 35 && input.windKph < 15 && input.precipitationMm < 1) {
    risks.add('good_spraying_window');
  }
  if (risks.size === 0) risks.add('good_harvest_window');

  return [...risks];
}

function formatThaiDateLabel(date: string, index: number): { dayName: string; dateLabel: string } {
  if (index === 0) {
    return { dayName: 'วันนี้', dateLabel: date };
  }

  if (index === 1) {
    return { dayName: 'พรุ่งนี้', dateLabel: date };
  }

  return { dayName: `อีก ${index} วัน`, dateLabel: date };
}

function buildDailyForecastFromOpenMeteo(response: OpenMeteoForecastResponse): WeatherForecastDay[] {
  const daily = response.daily;
  const times = daily?.time ?? [];

  return times.slice(0, 7).map((date, index) => {
    const weatherCode = daily?.weather_code?.[index];
    const mapped = mapOpenMeteoWeatherCodeToThai(weatherCode);
    const maxTempC = Number(daily?.temperature_2m_max?.[index] ?? 0);
    const minTempC = Number(daily?.temperature_2m_min?.[index] ?? 0);
    const rainChancePercent = Number(daily?.precipitation_probability_max?.[index] ?? 0);
    const precipitationMm = Number(daily?.precipitation_sum?.[index] ?? 0);
    const windKph = Number(daily?.wind_speed_10m_max?.[index] ?? 0);
    const labels = formatThaiDateLabel(date, index);
    const risks = buildRiskIds({ maxTempC, rainChancePercent, windKph, precipitationMm });

    return {
      id: `open-meteo-day-${date}`,
      dateLabel: labels.dateLabel,
      dayName: labels.dayName,
      conditionLabel: mapped.label,
      iconTone: mapped.iconTone,
      minTempC: Math.round(minTempC),
      maxTempC: Math.round(maxTempC),
      rainChancePercent: Math.round(rainChancePercent),
      humidityPercent: Number(response.current?.relative_humidity_2m ?? 0),
      windKph: Math.round(windKph),
      precipitationMm,
      uvIndex: 0,
      risks,
      summary: `พยากรณ์จาก Open-Meteo: ${mapped.label}, ฝนประมาณ ${precipitationMm} มม., ลมสูงสุด ${Math.round(windKph)} กม./ชม.`,
    };
  });
}

function buildRecommendationsFromForecast(today: WeatherForecastDay): CropWorkRecommendation[] {
  return [
    {
      id: 'open-meteo-before-spray',
      title: 'ก่อนพ่นยาให้ดูฝนและลม',
      detail: `วันนี้โอกาสฝน ${today.rainChancePercent}% และลมประมาณ ${today.windKph} กม./ชม. ควรตรวจฉลากและดูสภาพจริงที่แปลงก่อนทำงาน`,
      actionLabel: 'เช็กฝนและลม',
      priority: today.risks.includes('heavy_rain') || today.risks.includes('strong_wind') ? 'avoid' : 'caution',
      riskIds: today.risks,
    },
    {
      id: 'open-meteo-forecast-warning',
      title: 'ข้อมูลอากาศเป็นการพยากรณ์',
      detail: 'ตัวเลขอาจคลาดเคลื่อนได้ โดยเฉพาะฝนเฉพาะพื้นที่ ควรตรวจท้องฟ้าและแหล่งข้อมูลท้องถิ่นก่อนตัดสินใจ',
      actionLabel: 'ตรวจซ้ำก่อนทำงาน',
      priority: 'caution',
      riskIds: ['heavy_rain'],
    },
  ];
}

function buildOpenMeteoForecast(
  response: OpenMeteoForecastResponse,
  status: WeatherModeStatus,
  coarseLocation = defaultWeatherCoarseLocation,
): WeatherLocationForecast {
  const daily = buildDailyForecastFromOpenMeteo(response);
  const today = daily[0] ?? getLocalWeatherAdapterResult(undefined, status).forecast.today;
  const currentMapped = mapOpenMeteoWeatherCodeToThai(response.current?.weather_code);
  const fetchedAt = new Date().toISOString();
  const location: WeatherLocation = toWeatherLocation(coarseLocation);
  const current: WeatherCurrentConditions = {
    temperatureC: Number(response.current?.temperature_2m ?? today.maxTempC),
    humidityPercent: response.current?.relative_humidity_2m,
    precipitationMm: Number(response.current?.precipitation ?? today.precipitationMm ?? 0),
    windKph: Number(response.current?.wind_speed_10m ?? today.windKph),
    weatherCode: response.current?.weather_code,
    conditionLabel: currentMapped.label,
    observedAtLabel: response.current?.time ?? 'เวลาจาก Open-Meteo',
  };

  return {
    location,
    source: openMeteoSource,
    reliabilityLevel: openMeteoSource.reliabilityLevel,
    mode: status.mode,
    apiStatus: 'ready',
    updatedAtLabel: 'Open-Meteo ล่าสุด',
    fetchedAt,
    fetchedAtLabel: new Intl.DateTimeFormat('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(fetchedAt)),
    isStale: false,
    isFallback: false,
    externalNotice: 'ข้อมูลอ้างอิงจาก API ภายนอก',
    privacyNotice: 'ใช้ตำแหน่งจังหวัด/เมืองกลางโดยประมาณเท่านั้น ไม่มีการขอ GPS และไม่มีการเก็บตำแหน่งส่วนตัว',
    current,
    today: {
      ...today,
      conditionLabel: current.conditionLabel,
      humidityPercent: current.humidityPercent ?? today.humidityPercent,
      windKph: Math.round(current.windKph),
      precipitationMm: current.precipitationMm ?? today.precipitationMm ?? 0,
    },
    hourly: [],
    daily,
    recommendations: buildRecommendationsFromForecast(today),
    alerts: [],
    demoNotice: '',
    disclaimer: 'ข้อมูลอากาศเป็นการพยากรณ์ อาจคลาดเคลื่อนได้ ควรตรวจสภาพจริงและแหล่งข้อมูลท้องถิ่นก่อนตัดสินใจ',
  };
}

function localFallbackWithReason(
  locationId: string | undefined,
  status: WeatherModeStatus,
  reason: string,
  cacheOptions: WeatherCacheOptions = {},
): WeatherAdapterResult {
  const coarseLocation = getWeatherCoarseLocation(locationId);
  const result = getLocalWeatherAdapterResult(coarseLocation.id, { ...status, fallbackActive: true }, cacheOptions);

  return {
    ...result,
    selectedLocationId: coarseLocation.id,
    cacheStatus: getWeatherCacheStatus(coarseLocation.id, {
      nowMs: cacheOptions.nowMs,
      staleAfterMs: cacheOptions.staleAfterMs,
      storage: cacheOptions.cacheStorage,
      failureReason: reason,
      fallbackReason: 'ใช้ข้อมูลสำรองในเครื่องเพราะไม่มีข้อมูลล่าสุดที่ใช้ได้',
    }),
    forecast: {
      ...result.forecast,
      apiStatus: 'fallback' as WeatherApiStatus,
      isFallback: true,
      fallbackReason: reason,
      externalNotice: undefined,
    },
  };
}

export async function loadWeatherAdapterResult(
  locationId = defaultLocationId,
  options: LoadWeatherOptions = {},
): Promise<WeatherAdapterResult> {
  const env = resolveWeatherEnv(options.env);
  const status = getWeatherModeStatus(env);
  const coarseLocation = getWeatherCoarseLocation(locationId);
  const cacheOptions = {
    nowMs: options.nowMs,
    staleAfterMs: options.staleAfterMs,
    storage: options.cacheStorage,
  };

  if (!status.canFetchOpenMeteo) {
    return getLocalWeatherAdapterResult(coarseLocation.id, status, options);
  }

  const cachedEntry = readWeatherCacheEntry(coarseLocation.id, cacheOptions);
  const cacheStatus = getWeatherCacheStatus(coarseLocation.id, cacheOptions);

  if (cachedEntry && cacheStatus.isFresh && !options.forceRefresh) {
    return {
      locations: getWeatherLocations(),
      selectedLocationId: coarseLocation.id,
      forecast: {
        ...cachedEntry.forecast,
        apiStatus: 'ready',
        isFallback: false,
        isStale: false,
        fallbackReason: undefined,
        updatedAtLabel: 'จากข้อมูลล่าสุดในเครื่อง',
      },
      sources: getWeatherSources(),
      futureSources: getFutureWeatherSources(),
      alerts: getWeatherAlerts(),
      modeStatus: status,
      cacheStatus,
      locationPrivacyStatus: weatherLocationPrivacyStatus,
    };
  }

  try {
    const response = await fetchOpenMeteoForecast(
      {
        latitude: coarseLocation.approximateLat,
        longitude: coarseLocation.approximateLon,
        forecastDays: 7,
      },
      options.fetcher,
      options.timeoutMs,
    );
    const forecast = buildOpenMeteoForecast(response, status, coarseLocation);

    writeWeatherCacheEntry(
      {
        locationId: coarseLocation.id,
        forecast,
        sourceMode: status.mode,
        sourceLabel: forecast.source.label,
      },
      cacheOptions,
    );

    return {
      locations: getWeatherLocations(),
      selectedLocationId: coarseLocation.id,
      forecast,
      sources: getWeatherSources(),
      futureSources: getFutureWeatherSources(),
      alerts: getWeatherAlerts(),
      modeStatus: status,
      cacheStatus: getWeatherCacheStatus(coarseLocation.id, cacheOptions),
      locationPrivacyStatus: weatherLocationPrivacyStatus,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'open_meteo_fetch_failed';
    const staleEntry = readWeatherCacheEntry(coarseLocation.id, cacheOptions);

    if (staleEntry) {
      return {
        locations: getWeatherLocations(),
        selectedLocationId: coarseLocation.id,
        forecast: {
          ...staleEntry.forecast,
          apiStatus: 'fallback',
          isFallback: true,
          isStale: true,
          fallbackReason: reason,
          updatedAtLabel: 'ใช้ข้อมูลเก่าในเครื่อง',
        },
        sources: getWeatherSources(),
        futureSources: getFutureWeatherSources(),
        alerts: getWeatherAlerts(),
        modeStatus: {
          ...status,
          fallbackActive: true,
        },
        cacheStatus: getWeatherCacheStatus(coarseLocation.id, {
          ...cacheOptions,
          failureReason: reason,
          fallbackReason: 'ใช้ stale cache เพราะ Open-Meteo เรียกไม่ได้',
        }),
        locationPrivacyStatus: weatherLocationPrivacyStatus,
      };
    }

    return localFallbackWithReason(coarseLocation.id, status, reason, options);
  }
}
