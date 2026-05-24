export type OpenMeteoForecastRequest = {
  latitude: number;
  longitude: number;
  forecastDays?: number;
  timezone?: string;
};

export type OpenMeteoForecastResponse = {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  current?: {
    time?: string;
    temperature_2m?: number;
    relative_humidity_2m?: number;
    precipitation?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
  };
};

export type OpenMeteoFetchResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<OpenMeteoForecastResponse>;
};

export type OpenMeteoFetch = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<OpenMeteoFetchResponse>;

export const openMeteoForecastEndpoint = 'https://api.open-meteo.com/v1/forecast';

export function buildOpenMeteoForecastUrl(request: OpenMeteoForecastRequest): string {
  const params = new URLSearchParams({
    latitude: String(request.latitude),
    longitude: String(request.longitude),
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: request.timezone ?? 'auto',
    forecast_days: String(request.forecastDays ?? 7),
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
  });

  return `${openMeteoForecastEndpoint}?${params.toString()}`;
}

export async function fetchOpenMeteoForecast(
  request: OpenMeteoForecastRequest,
  fetcher: OpenMeteoFetch = globalThis.fetch as OpenMeteoFetch,
  timeoutMs = 7000,
): Promise<OpenMeteoForecastResponse> {
  if (!fetcher) {
    throw new Error('weather_fetch_unavailable');
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetcher(buildOpenMeteoForecastUrl(request), { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`open_meteo_status_${response.status}`);
    }

    return response.json();
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

