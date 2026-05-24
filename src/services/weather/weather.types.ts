export type AgricultureWeatherRisk =
  | 'heavy_rain'
  | 'drought'
  | 'heat'
  | 'high_uv'
  | 'strong_wind'
  | 'high_humidity'
  | 'disease_risk'
  | 'good_spraying_window'
  | 'good_harvest_window';

export type WeatherReliabilityLevel = 'demo_sample' | 'future_official' | 'future_provider';

export type WeatherMode = 'local_fixture' | 'open_meteo_disabled' | 'open_meteo_ready' | 'production_disabled';

export type WeatherApiStatus = 'local_fixture' | 'disabled' | 'ready' | 'fallback' | 'error';

export type WeatherSource = {
  id: string;
  label: string;
  shortLabel: string;
  sourceType: 'demo' | 'tmd' | 'open_meteo' | 'weather_provider';
  reliabilityLevel: WeatherReliabilityLevel;
  status: 'fixture_only' | 'planned' | 'live_ready';
  attributionLabel: string;
  plannedUse: string;
};

export type WeatherLocation = {
  id: string;
  label: string;
  province: string;
  region: string;
  isDefault?: boolean;
};

export type WeatherCurrentConditions = {
  temperatureC: number;
  humidityPercent?: number;
  precipitationMm?: number;
  windKph: number;
  weatherCode?: number;
  conditionLabel: string;
  observedAtLabel: string;
};

export type WeatherForecastHour = {
  id: string;
  timeLabel: string;
  temperatureC: number;
  rainChancePercent: number;
  humidityPercent: number;
  windKph: number;
  riskIds: AgricultureWeatherRisk[];
};

export type WeatherForecastDay = {
  id: string;
  dateLabel: string;
  dayName: string;
  conditionLabel: string;
  iconTone: 'sun' | 'rain' | 'cloud' | 'storm' | 'heat';
  minTempC: number;
  maxTempC: number;
  rainChancePercent: number;
  humidityPercent: number;
  windKph: number;
  precipitationMm?: number;
  uvIndex: number;
  risks: AgricultureWeatherRisk[];
  summary: string;
};

export type CropWorkRecommendation = {
  id: string;
  title: string;
  detail: string;
  actionLabel: string;
  priority: 'good' | 'caution' | 'avoid';
  riskIds: AgricultureWeatherRisk[];
};

export type WeatherAlertMock = {
  id: string;
  title: string;
  body: string;
  locationLabel: string;
  riskId: AgricultureWeatherRisk;
  severity: 'info' | 'warning' | 'danger';
  route: '/app/weather';
  demoLabel: string;
};

export type WeatherLocationForecast = {
  location: WeatherLocation;
  source: WeatherSource;
  reliabilityLevel: WeatherReliabilityLevel;
  mode?: WeatherMode;
  apiStatus?: WeatherApiStatus;
  updatedAtLabel: string;
  fetchedAt?: string;
  fetchedAtLabel?: string;
  isStale?: boolean;
  isFallback?: boolean;
  fallbackReason?: string;
  externalNotice?: string;
  privacyNotice?: string;
  current?: WeatherCurrentConditions;
  today: WeatherForecastDay;
  hourly: WeatherForecastHour[];
  daily: WeatherForecastDay[];
  recommendations: CropWorkRecommendation[];
  alerts: WeatherAlertMock[];
  demoNotice: string;
  disclaimer: string;
};

export type WeatherModeStatus = {
  mode: WeatherMode;
  apiEnabled: boolean;
  canFetchOpenMeteo: boolean;
  sourceLabel: string;
  statusLabel: string;
  disabledReason?: string;
  fallbackActive: boolean;
  noGeolocation: true;
  noPreciseLocationStorage: true;
};

export type WeatherAdapterResult = {
  locations: WeatherLocation[];
  selectedLocationId: string;
  forecast: WeatherLocationForecast;
  sources: WeatherSource[];
  futureSources: WeatherSource[];
  alerts: WeatherAlertMock[];
  modeStatus: WeatherModeStatus;
};
