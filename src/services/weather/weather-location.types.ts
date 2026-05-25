export type WeatherLocationPrecision = 'province_or_city_center';

export type WeatherCoarseLocation = {
  id: string;
  label: string;
  region: string;
  approximateLat: number;
  approximateLon: number;
  precision: WeatherLocationPrecision;
  privacyNote: string;
};

export type WeatherLocationPrivacyStatus = {
  noGps: true;
  noBrowserGeolocation: true;
  noFarmPreciseCoordinates: true;
  noMapPin: true;
  noPrecisePersonalLocationStorage: true;
  allowedPrecision: WeatherLocationPrecision;
  summary: string;
};
