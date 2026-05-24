import type { WeatherCoarseLocation, WeatherLocationPrivacyStatus } from '@/services/weather/weather-location.types';
import type { WeatherLocation } from '@/services/weather/weather.types';

export const weatherCoarseLocations: WeatherCoarseLocation[] = [
  {
    id: 'bangkok',
    label: 'กรุงเทพฯ',
    region: 'ภาคกลาง',
    approximateLat: 13.7563,
    approximateLon: 100.5018,
    precision: 'province_or_city_center',
    privacyNote: 'ใช้พิกัดกลางเมืองโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน',
  },
  {
    id: 'nakhon-ratchasima',
    label: 'นครราชสีมา',
    region: 'ภาคตะวันออกเฉียงเหนือ',
    approximateLat: 14.9799,
    approximateLon: 102.0977,
    precision: 'province_or_city_center',
    privacyNote: 'ใช้พิกัดกลางเมืองโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน',
  },
  {
    id: 'khon-kaen',
    label: 'ขอนแก่น',
    region: 'ภาคตะวันออกเฉียงเหนือ',
    approximateLat: 16.4419,
    approximateLon: 102.8350,
    precision: 'province_or_city_center',
    privacyNote: 'ใช้พิกัดกลางเมืองโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน',
  },
  {
    id: 'chiang-mai',
    label: 'เชียงใหม่',
    region: 'ภาคเหนือ',
    approximateLat: 18.7883,
    approximateLon: 98.9853,
    precision: 'province_or_city_center',
    privacyNote: 'ใช้พิกัดกลางเมืองโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน',
  },
  {
    id: 'nakhon-sawan',
    label: 'นครสวรรค์',
    region: 'ภาคกลาง',
    approximateLat: 15.7047,
    approximateLon: 100.1372,
    precision: 'province_or_city_center',
    privacyNote: 'ใช้พิกัดกลางเมืองโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน',
  },
  {
    id: 'suphan-buri',
    label: 'สุพรรณบุรี',
    region: 'ภาคกลาง',
    approximateLat: 14.4745,
    approximateLon: 100.1177,
    precision: 'province_or_city_center',
    privacyNote: 'ใช้พิกัดกลางเมืองโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน',
  },
  {
    id: 'ubon-ratchathani',
    label: 'อุบลราชธานี',
    region: 'ภาคตะวันออกเฉียงเหนือ',
    approximateLat: 15.2287,
    approximateLon: 104.8564,
    precision: 'province_or_city_center',
    privacyNote: 'ใช้พิกัดกลางเมืองโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน',
  },
  {
    id: 'surat-thani',
    label: 'สุราษฎร์ธานี',
    region: 'ภาคใต้',
    approximateLat: 9.1382,
    approximateLon: 99.3215,
    precision: 'province_or_city_center',
    privacyNote: 'ใช้พิกัดกลางเมืองโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน',
  },
  {
    id: 'songkhla',
    label: 'สงขลา',
    region: 'ภาคใต้',
    approximateLat: 7.1898,
    approximateLon: 100.5951,
    precision: 'province_or_city_center',
    privacyNote: 'ใช้พิกัดกลางเมืองโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน',
  },
];

export const weatherLocationPrivacyStatus: WeatherLocationPrivacyStatus = {
  noGps: true,
  noBrowserGeolocation: true,
  noFarmPreciseCoordinates: true,
  noMapPin: true,
  noPrecisePersonalLocationStorage: true,
  allowedPrecision: 'province_or_city_center',
  summary: 'เลือกได้เฉพาะจังหวัด/เมืองกลางโดยประมาณ ไม่มี GPS ไม่มีหมุดแปลง และไม่เก็บตำแหน่งส่วนตัวแบบละเอียด',
};

export const defaultWeatherCoarseLocation =
  weatherCoarseLocations.find((location) => location.id === 'bangkok') ?? weatherCoarseLocations[0];

export function getWeatherCoarseLocation(locationId?: string): WeatherCoarseLocation {
  return weatherCoarseLocations.find((location) => location.id === locationId) ?? defaultWeatherCoarseLocation;
}

export function toWeatherLocation(location: WeatherCoarseLocation): WeatherLocation {
  return {
    id: location.id,
    label: location.label,
    province: location.label,
    region: location.region,
    isDefault: location.id === defaultWeatherCoarseLocation.id,
  };
}

export function getWeatherLocationOptions(): WeatherLocation[] {
  return weatherCoarseLocations.map(toWeatherLocation);
}
