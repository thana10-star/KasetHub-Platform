import type { WeatherCoarseLocation, WeatherLocationPrivacyStatus } from '@/services/weather/weather-location.types';
import type { WeatherLocation } from '@/services/weather/weather.types';

const provincePrivacyNote = 'ใช้พิกัดกลางจังหวัดโดยประมาณ ไม่ใช่ตำแหน่งแปลงหรือบ้าน';

export const THAI_WEATHER_PROVINCE_COUNT = 77;

export const weatherCommonProvinceLocationIds = [
  'bangkok',
  'nakhon-ratchasima',
  'khon-kaen',
  'chiang-mai',
  'nakhon-sawan',
  'suphan-buri',
  'ubon-ratchathani',
  'surat-thani',
  'songkhla',
] as const;

function provinceLocation(input: Omit<WeatherCoarseLocation, 'precision' | 'privacyNote'>): WeatherCoarseLocation {
  return {
    ...input,
    precision: 'province_or_city_center',
    privacyNote: provincePrivacyNote,
  };
}

export const weatherCoarseLocations: WeatherCoarseLocation[] = [
  provinceLocation({ id: 'bangkok', label: 'กรุงเทพฯ', region: 'ภาคกลาง', approximateLat: 13.7563, approximateLon: 100.5018 }),
  provinceLocation({ id: 'ang-thong', label: 'อ่างทอง', region: 'ภาคกลาง', approximateLat: 14.5896, approximateLon: 100.4550 }),
  provinceLocation({ id: 'chai-nat', label: 'ชัยนาท', region: 'ภาคกลาง', approximateLat: 15.1852, approximateLon: 100.1251 }),
  provinceLocation({ id: 'kanchanaburi', label: 'กาญจนบุรี', region: 'ภาคกลาง', approximateLat: 14.0228, approximateLon: 99.5328 }),
  provinceLocation({ id: 'lop-buri', label: 'ลพบุรี', region: 'ภาคกลาง', approximateLat: 14.7995, approximateLon: 100.6534 }),
  provinceLocation({ id: 'nakhon-nayok', label: 'นครนายก', region: 'ภาคกลาง', approximateLat: 14.2069, approximateLon: 101.2131 }),
  provinceLocation({ id: 'nakhon-pathom', label: 'นครปฐม', region: 'ภาคกลาง', approximateLat: 13.8199, approximateLon: 100.0622 }),
  provinceLocation({ id: 'nakhon-sawan', label: 'นครสวรรค์', region: 'ภาคกลาง', approximateLat: 15.7047, approximateLon: 100.1372 }),
  provinceLocation({ id: 'nonthaburi', label: 'นนทบุรี', region: 'ภาคกลาง', approximateLat: 13.8591, approximateLon: 100.5217 }),
  provinceLocation({ id: 'pathum-thani', label: 'ปทุมธานี', region: 'ภาคกลาง', approximateLat: 14.0208, approximateLon: 100.5250 }),
  provinceLocation({ id: 'phetchaburi', label: 'เพชรบุรี', region: 'ภาคกลาง', approximateLat: 13.1119, approximateLon: 99.9447 }),
  provinceLocation({ id: 'phra-nakhon-si-ayutthaya', label: 'พระนครศรีอยุธยา', region: 'ภาคกลาง', approximateLat: 14.3532, approximateLon: 100.5689 }),
  provinceLocation({ id: 'prachuap-khiri-khan', label: 'ประจวบคีรีขันธ์', region: 'ภาคกลาง', approximateLat: 11.8124, approximateLon: 99.7973 }),
  provinceLocation({ id: 'ratchaburi', label: 'ราชบุรี', region: 'ภาคกลาง', approximateLat: 13.5283, approximateLon: 99.8134 }),
  provinceLocation({ id: 'samut-prakan', label: 'สมุทรปราการ', region: 'ภาคกลาง', approximateLat: 13.5991, approximateLon: 100.5998 }),
  provinceLocation({ id: 'samut-sakhon', label: 'สมุทรสาคร', region: 'ภาคกลาง', approximateLat: 13.5475, approximateLon: 100.2744 }),
  provinceLocation({ id: 'samut-songkhram', label: 'สมุทรสงคราม', region: 'ภาคกลาง', approximateLat: 13.4146, approximateLon: 100.0023 }),
  provinceLocation({ id: 'saraburi', label: 'สระบุรี', region: 'ภาคกลาง', approximateLat: 14.5289, approximateLon: 100.9101 }),
  provinceLocation({ id: 'sing-buri', label: 'สิงห์บุรี', region: 'ภาคกลาง', approximateLat: 14.8936, approximateLon: 100.3967 }),
  provinceLocation({ id: 'suphan-buri', label: 'สุพรรณบุรี', region: 'ภาคกลาง', approximateLat: 14.4745, approximateLon: 100.1177 }),

  provinceLocation({ id: 'chiang-mai', label: 'เชียงใหม่', region: 'ภาคเหนือ', approximateLat: 18.7883, approximateLon: 98.9853 }),
  provinceLocation({ id: 'chiang-rai', label: 'เชียงราย', region: 'ภาคเหนือ', approximateLat: 19.9105, approximateLon: 99.8406 }),
  provinceLocation({ id: 'kamphaeng-phet', label: 'กำแพงเพชร', region: 'ภาคเหนือ', approximateLat: 16.4828, approximateLon: 99.5220 }),
  provinceLocation({ id: 'lampang', label: 'ลำปาง', region: 'ภาคเหนือ', approximateLat: 18.2888, approximateLon: 99.4909 }),
  provinceLocation({ id: 'lamphun', label: 'ลำพูน', region: 'ภาคเหนือ', approximateLat: 18.5745, approximateLon: 99.0087 }),
  provinceLocation({ id: 'mae-hong-son', label: 'แม่ฮ่องสอน', region: 'ภาคเหนือ', approximateLat: 19.3010, approximateLon: 97.9654 }),
  provinceLocation({ id: 'nan', label: 'น่าน', region: 'ภาคเหนือ', approximateLat: 18.7756, approximateLon: 100.7730 }),
  provinceLocation({ id: 'phayao', label: 'พะเยา', region: 'ภาคเหนือ', approximateLat: 19.1665, approximateLon: 99.9019 }),
  provinceLocation({ id: 'phetchabun', label: 'เพชรบูรณ์', region: 'ภาคเหนือ', approximateLat: 16.4190, approximateLon: 101.1606 }),
  provinceLocation({ id: 'phichit', label: 'พิจิตร', region: 'ภาคเหนือ', approximateLat: 16.4429, approximateLon: 100.3482 }),
  provinceLocation({ id: 'phitsanulok', label: 'พิษณุโลก', region: 'ภาคเหนือ', approximateLat: 16.8211, approximateLon: 100.2659 }),
  provinceLocation({ id: 'phrae', label: 'แพร่', region: 'ภาคเหนือ', approximateLat: 18.1446, approximateLon: 100.1403 }),
  provinceLocation({ id: 'sukhothai', label: 'สุโขทัย', region: 'ภาคเหนือ', approximateLat: 17.0056, approximateLon: 99.8264 }),
  provinceLocation({ id: 'tak', label: 'ตาก', region: 'ภาคเหนือ', approximateLat: 16.8836, approximateLon: 99.1256 }),
  provinceLocation({ id: 'uthai-thani', label: 'อุทัยธานี', region: 'ภาคเหนือ', approximateLat: 15.3835, approximateLon: 100.0246 }),
  provinceLocation({ id: 'uttaradit', label: 'อุตรดิตถ์', region: 'ภาคเหนือ', approximateLat: 17.6201, approximateLon: 100.0993 }),

  provinceLocation({ id: 'amnat-charoen', label: 'อำนาจเจริญ', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 15.8657, approximateLon: 104.6258 }),
  provinceLocation({ id: 'bueng-kan', label: 'บึงกาฬ', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 18.3609, approximateLon: 103.6464 }),
  provinceLocation({ id: 'buriram', label: 'บุรีรัมย์', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 14.9951, approximateLon: 103.1116 }),
  provinceLocation({ id: 'chaiyaphum', label: 'ชัยภูมิ', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 15.8068, approximateLon: 102.0315 }),
  provinceLocation({ id: 'kalasin', label: 'กาฬสินธุ์', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 16.4385, approximateLon: 103.5061 }),
  provinceLocation({ id: 'khon-kaen', label: 'ขอนแก่น', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 16.4419, approximateLon: 102.8350 }),
  provinceLocation({ id: 'loei', label: 'เลย', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 17.4860, approximateLon: 101.7223 }),
  provinceLocation({ id: 'maha-sarakham', label: 'มหาสารคาม', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 16.1851, approximateLon: 103.3026 }),
  provinceLocation({ id: 'mukdahan', label: 'มุกดาหาร', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 16.5453, approximateLon: 104.7235 }),
  provinceLocation({ id: 'nakhon-phanom', label: 'นครพนม', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 17.4108, approximateLon: 104.7784 }),
  provinceLocation({ id: 'nakhon-ratchasima', label: 'นครราชสีมา', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 14.9799, approximateLon: 102.0977 }),
  provinceLocation({ id: 'nong-bua-lam-phu', label: 'หนองบัวลำภู', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 17.2218, approximateLon: 102.4260 }),
  provinceLocation({ id: 'nong-khai', label: 'หนองคาย', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 17.8783, approximateLon: 102.7413 }),
  provinceLocation({ id: 'roi-et', label: 'ร้อยเอ็ด', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 16.0538, approximateLon: 103.6520 }),
  provinceLocation({ id: 'sakon-nakhon', label: 'สกลนคร', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 17.1546, approximateLon: 104.1348 }),
  provinceLocation({ id: 'sisaket', label: 'ศรีสะเกษ', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 15.1186, approximateLon: 104.3220 }),
  provinceLocation({ id: 'surin', label: 'สุรินทร์', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 14.8829, approximateLon: 103.4937 }),
  provinceLocation({ id: 'ubon-ratchathani', label: 'อุบลราชธานี', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 15.2287, approximateLon: 104.8564 }),
  provinceLocation({ id: 'udon-thani', label: 'อุดรธานี', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 17.4138, approximateLon: 102.7872 }),
  provinceLocation({ id: 'yasothon', label: 'ยโสธร', region: 'ภาคตะวันออกเฉียงเหนือ', approximateLat: 15.7959, approximateLon: 104.1451 }),

  provinceLocation({ id: 'chachoengsao', label: 'ฉะเชิงเทรา', region: 'ภาคตะวันออก', approximateLat: 13.6904, approximateLon: 101.0780 }),
  provinceLocation({ id: 'chanthaburi', label: 'จันทบุรี', region: 'ภาคตะวันออก', approximateLat: 12.6096, approximateLon: 102.1045 }),
  provinceLocation({ id: 'chon-buri', label: 'ชลบุรี', region: 'ภาคตะวันออก', approximateLat: 13.3611, approximateLon: 100.9847 }),
  provinceLocation({ id: 'prachin-buri', label: 'ปราจีนบุรี', region: 'ภาคตะวันออก', approximateLat: 14.0509, approximateLon: 101.3723 }),
  provinceLocation({ id: 'rayong', label: 'ระยอง', region: 'ภาคตะวันออก', approximateLat: 12.6814, approximateLon: 101.2816 }),
  provinceLocation({ id: 'sa-kaeo', label: 'สระแก้ว', region: 'ภาคตะวันออก', approximateLat: 13.8240, approximateLon: 102.0646 }),
  provinceLocation({ id: 'trat', label: 'ตราด', region: 'ภาคตะวันออก', approximateLat: 12.2428, approximateLon: 102.5175 }),

  provinceLocation({ id: 'chumphon', label: 'ชุมพร', region: 'ภาคใต้', approximateLat: 10.4930, approximateLon: 99.1800 }),
  provinceLocation({ id: 'krabi', label: 'กระบี่', region: 'ภาคใต้', approximateLat: 8.0863, approximateLon: 98.9063 }),
  provinceLocation({ id: 'nakhon-si-thammarat', label: 'นครศรีธรรมราช', region: 'ภาคใต้', approximateLat: 8.4325, approximateLon: 99.9599 }),
  provinceLocation({ id: 'narathiwat', label: 'นราธิวาส', region: 'ภาคใต้', approximateLat: 6.4255, approximateLon: 101.8253 }),
  provinceLocation({ id: 'pattani', label: 'ปัตตานี', region: 'ภาคใต้', approximateLat: 6.8695, approximateLon: 101.2505 }),
  provinceLocation({ id: 'phang-nga', label: 'พังงา', region: 'ภาคใต้', approximateLat: 8.4501, approximateLon: 98.5255 }),
  provinceLocation({ id: 'phatthalung', label: 'พัทลุง', region: 'ภาคใต้', approximateLat: 7.6167, approximateLon: 100.0740 }),
  provinceLocation({ id: 'phuket', label: 'ภูเก็ต', region: 'ภาคใต้', approximateLat: 7.8804, approximateLon: 98.3923 }),
  provinceLocation({ id: 'ranong', label: 'ระนอง', region: 'ภาคใต้', approximateLat: 9.9529, approximateLon: 98.6085 }),
  provinceLocation({ id: 'satun', label: 'สตูล', region: 'ภาคใต้', approximateLat: 6.6238, approximateLon: 100.0674 }),
  provinceLocation({ id: 'songkhla', label: 'สงขลา', region: 'ภาคใต้', approximateLat: 7.1898, approximateLon: 100.5951 }),
  provinceLocation({ id: 'surat-thani', label: 'สุราษฎร์ธานี', region: 'ภาคใต้', approximateLat: 9.1382, approximateLon: 99.3215 }),
  provinceLocation({ id: 'trang', label: 'ตรัง', region: 'ภาคใต้', approximateLat: 7.5594, approximateLon: 99.6114 }),
  provinceLocation({ id: 'yala', label: 'ยะลา', region: 'ภาคใต้', approximateLat: 6.5411, approximateLon: 101.2804 }),
];

export const weatherLocationPrivacyStatus: WeatherLocationPrivacyStatus = {
  noGps: true,
  noBrowserGeolocation: true,
  noFarmPreciseCoordinates: true,
  noMapPin: true,
  noPrecisePersonalLocationStorage: true,
  allowedPrecision: 'province_or_city_center',
  summary: 'เลือกได้เฉพาะระดับจังหวัดโดยประมาณ ไม่มี GPS ไม่มีหมุดแปลง และไม่เก็บตำแหน่งละเอียด',
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
