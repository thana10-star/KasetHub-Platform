import {
  futureWeatherSources,
  weatherAlertMocks,
  weatherForecastsWithAlerts,
  weatherLocations,
  weatherSources,
} from '@/services/weather/weather-fixtures';
import type { WeatherAdapterResult, WeatherLocationForecast } from '@/services/weather/weather.types';

const defaultLocationId = weatherLocations.find((location) => location.isDefault)?.id ?? weatherLocations[0]?.id;

export function getWeatherLocations() {
  return weatherLocations;
}

export function getWeatherSources() {
  return weatherSources;
}

export function getFutureWeatherSources() {
  return futureWeatherSources;
}

export function getWeatherAlerts() {
  return weatherAlertMocks;
}

export function getWeatherForecast(locationId = defaultLocationId): WeatherLocationForecast {
  return (
    weatherForecastsWithAlerts.find((forecast) => forecast.location.id === locationId) ??
    weatherForecastsWithAlerts[0]
  );
}

export function getWeatherAdapterResult(locationId = defaultLocationId): WeatherAdapterResult {
  const forecast = getWeatherForecast(locationId);

  return {
    locations: getWeatherLocations(),
    selectedLocationId: forecast.location.id,
    forecast,
    sources: getWeatherSources(),
    futureSources: getFutureWeatherSources(),
    alerts: getWeatherAlerts(),
  };
}
