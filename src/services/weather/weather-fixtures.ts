import type {
  AgricultureWeatherRisk,
  CropWorkRecommendation,
  WeatherAlertMock,
  WeatherForecastDay,
  WeatherForecastHour,
  WeatherLocation,
  WeatherLocationForecast,
  WeatherSource,
} from '@/services/weather/weather.types';

export const weatherDemoNotice = 'ข้อมูลตัวอย่างในเครื่องเท่านั้น ยังไม่ใช่ข้อมูลพยากรณ์จริง';

export const weatherDisclaimer =
  'ยังไม่ใช่ข้อมูลพยากรณ์จริง สภาพอากาศจริงอาจเปลี่ยนตามพื้นที่ เวลา และแหล่งข้อมูล ควรตรวจสอบแหล่งพยากรณ์ทางการก่อนตัดสินใจทำงานในแปลง';

export const weatherRiskLabels: Record<AgricultureWeatherRisk, string> = {
  heavy_rain: 'ฝนตกหนัก',
  drought: 'แล้ง/น้ำน้อย',
  heat: 'อากาศร้อน',
  high_uv: 'แดดแรง UV สูง',
  strong_wind: 'ลมแรง',
  high_humidity: 'ความชื้นสูง',
  disease_risk: 'เสี่ยงโรคพืช',
  good_spraying_window: 'ช่วงพ่นเหมาะ',
  good_harvest_window: 'ช่วงเก็บเกี่ยวเหมาะ',
};

export const weatherRiskTone: Record<AgricultureWeatherRisk, 'green' | 'gold' | 'sky' | 'rose' | 'neutral'> = {
  heavy_rain: 'sky',
  drought: 'gold',
  heat: 'rose',
  high_uv: 'gold',
  strong_wind: 'sky',
  high_humidity: 'sky',
  disease_risk: 'rose',
  good_spraying_window: 'green',
  good_harvest_window: 'green',
};

export const weatherSources: WeatherSource[] = [
  {
    id: 'demo-weather-source',
    label: 'ข้อมูลตัวอย่าง',
    shortLabel: 'demo',
    sourceType: 'demo',
    reliabilityLevel: 'demo_sample',
    status: 'fixture_only',
    attributionLabel: 'ข้อมูลตัวอย่างสำหรับทดสอบ UX เท่านั้น',
    plannedUse: 'ใช้เป็น fixture ในเครื่องก่อนเชื่อมต่อแหล่งพยากรณ์จริง',
  },
];

export const futureWeatherSources: WeatherSource[] = [
  {
    id: 'tmd-future',
    label: 'TMD / กรมอุตุนิยมวิทยา',
    shortLabel: 'TMD',
    sourceType: 'tmd',
    reliabilityLevel: 'future_official',
    status: 'planned',
    attributionLabel: 'แหล่งข้อมูลทางการในอนาคต',
    plannedUse: 'พิจารณาใช้สำหรับข้อมูลพยากรณ์และประกาศเตือนภัยเมื่อมีข้อตกลงและวิธีเชื่อมต่อที่เหมาะสม',
  },
  {
    id: 'open-meteo-future',
    label: 'Open-Meteo',
    shortLabel: 'Open-Meteo',
    sourceType: 'open_meteo',
    reliabilityLevel: 'future_provider',
    status: 'planned',
    attributionLabel: 'แหล่งข้อมูล provider ในอนาคต',
    plannedUse: 'ใช้เป็นตัวเลือกพยากรณ์แบบ API หลังมี caching, attribution, และข้อจำกัดการใช้งานชัดเจน',
  },
  {
    id: 'weather-provider-future',
    label: 'weather provider',
    shortLabel: 'provider',
    sourceType: 'weather_provider',
    reliabilityLevel: 'future_provider',
    status: 'planned',
    attributionLabel: 'ผู้ให้บริการข้อมูลอากาศในอนาคต',
    plannedUse: 'ใช้เปรียบเทียบคุณภาพ ราคา SLA และ coverage ก่อนเชื่อมต่อจริง',
  },
];

export const weatherLocations: WeatherLocation[] = [
  { id: 'bangkok-demo', label: 'กรุงเทพฯ', province: 'กรุงเทพฯ', region: 'ภาคกลาง', isDefault: true },
  { id: 'chiang-mai-demo', label: 'เชียงใหม่', province: 'เชียงใหม่', region: 'ภาคเหนือ' },
  { id: 'nakhon-ratchasima-demo', label: 'นครราชสีมา', province: 'นครราชสีมา', region: 'ภาคตะวันออกเฉียงเหนือ' },
  { id: 'yasothon-demo', label: 'ยโสธร', province: 'ยโสธร', region: 'ภาคตะวันออกเฉียงเหนือ' },
  { id: 'chanthaburi-demo', label: 'จันทบุรี', province: 'จันทบุรี', region: 'ภาคตะวันออก' },
  { id: 'surat-thani-demo', label: 'สุราษฎร์ธานี', province: 'สุราษฎร์ธานี', region: 'ภาคใต้' },
];

const dayNames = ['วันนี้', 'พรุ่งนี้', 'อีก 2 วัน', 'อีก 3 วัน', 'อีก 4 วัน', 'อีก 5 วัน', 'อีก 6 วัน'];

const makeDailyForecast = (
  locationId: string,
  base: {
    conditionLabel: string;
    minTempC: number;
    maxTempC: number;
    rainChancePercent: number;
    humidityPercent: number;
    windKph: number;
    uvIndex: number;
    risks: AgricultureWeatherRisk[];
    summary: string;
    iconTone: WeatherForecastDay['iconTone'];
  },
): WeatherForecastDay[] =>
  dayNames.map((dayName, index) => ({
    id: `${locationId}-day-${index + 1}`,
    dateLabel: `ตัวอย่าง ${dayName}`,
    dayName,
    conditionLabel: index === 0 ? base.conditionLabel : index % 3 === 0 ? 'มีเมฆและฝนบางช่วง' : base.conditionLabel,
    iconTone: index % 4 === 0 ? base.iconTone : index % 4 === 1 ? 'cloud' : index % 4 === 2 ? 'rain' : 'sun',
    minTempC: base.minTempC + (index % 2),
    maxTempC: base.maxTempC + (index % 3) - 1,
    rainChancePercent: Math.min(95, Math.max(5, base.rainChancePercent + (index - 2) * 5)),
    humidityPercent: Math.min(95, Math.max(45, base.humidityPercent + (index % 3) * 3 - 2)),
    windKph: Math.max(4, base.windKph + (index % 4) * 2 - 2),
    uvIndex: Math.max(3, Math.min(12, base.uvIndex + (index % 3) - 1)),
    risks: index === 0 ? base.risks : index % 2 === 0 ? base.risks.slice(0, 2) : base.risks.slice(-2),
    summary: index === 0 ? base.summary : 'ข้อมูลตัวอย่างสำหรับดูแนวโน้ม ไม่ใช่พยากรณ์จริง',
  }));

const makeHourlyForecast = (
  locationId: string,
  rainBase: number,
  tempBase: number,
  humidityBase: number,
  risks: AgricultureWeatherRisk[],
): WeatherForecastHour[] =>
  ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((timeLabel, index) => ({
    id: `${locationId}-hour-${index + 1}`,
    timeLabel,
    temperatureC: tempBase + Math.max(0, index - 1),
    rainChancePercent: Math.min(95, Math.max(5, rainBase + (index % 3) * 8 - 6)),
    humidityPercent: Math.min(95, Math.max(40, humidityBase + (index % 2) * 4)),
    windKph: 8 + index * 2,
    riskIds: index === 2 || index === 3 ? risks : risks.slice(0, 1),
  }));

const makeRecommendations = (
  locationId: string,
  items: Array<Omit<CropWorkRecommendation, 'id'>>,
): CropWorkRecommendation[] =>
  items.map((item, index) => ({
    ...item,
    id: `${locationId}-recommendation-${index + 1}`,
  }));

const demoSource = weatherSources[0];

const buildForecast = (
  location: WeatherLocation,
  base: Parameters<typeof makeDailyForecast>[1],
  recommendations: Array<Omit<CropWorkRecommendation, 'id'>>,
): WeatherLocationForecast => {
  const daily = makeDailyForecast(location.id, base);

  return {
    location,
    source: demoSource,
    reliabilityLevel: demoSource.reliabilityLevel,
    updatedAtLabel: 'อัปเดตตัวอย่างในเครื่อง',
    today: daily[0],
    hourly: makeHourlyForecast(location.id, base.rainChancePercent, base.maxTempC - 3, base.humidityPercent, base.risks),
    daily,
    recommendations: makeRecommendations(location.id, recommendations),
    alerts: [],
    demoNotice: weatherDemoNotice,
    disclaimer: weatherDisclaimer,
  };
};

export const weatherForecasts: WeatherLocationForecast[] = [
  buildForecast(
    weatherLocations[0],
    {
      conditionLabel: 'ร้อน มีฝนเย็นบางพื้นที่',
      iconTone: 'heat',
      minTempC: 28,
      maxTempC: 36,
      rainChancePercent: 45,
      humidityPercent: 72,
      windKph: 14,
      uvIndex: 10,
      risks: ['heat', 'high_uv', 'high_humidity'],
      summary: 'ตัวอย่าง: ช่วงเที่ยงแดดแรง ควรทำงานหนักช่วงเช้าหรือเย็น และดื่มน้ำบ่อย ๆ',
    },
    [
      {
        title: 'เลี่ยงงานกลางแดดช่วงเที่ยง',
        detail: 'ตัวอย่างคำแนะนำ: ถ้าต้องพ่นหรือใส่ปุ๋ย ให้ดูช่วงเช้าหรือเย็นแทนช่วงแดดแรง',
        actionLabel: 'ระวังความร้อน',
        priority: 'caution',
        riskIds: ['heat', 'high_uv'],
      },
      {
        title: 'ยังพอเก็บเกี่ยวช่วงเช้าได้',
        detail: 'ตัวอย่าง: โอกาสฝนเช้าไม่สูงมาก แต่ควรเตรียมผ้าคลุมหรือที่พักผลผลิต',
        actionLabel: 'ตรวจท้องฟ้าก่อนเริ่มงาน',
        priority: 'good',
        riskIds: ['good_harvest_window'],
      },
    ],
  ),
  buildForecast(
    weatherLocations[1],
    {
      conditionLabel: 'เมฆมาก ฝนบ่าย',
      iconTone: 'rain',
      minTempC: 23,
      maxTempC: 31,
      rainChancePercent: 62,
      humidityPercent: 78,
      windKph: 10,
      uvIndex: 7,
      risks: ['heavy_rain', 'high_humidity', 'disease_risk'],
      summary: 'ตัวอย่าง: ความชื้นสูงหลังฝนอาจเพิ่มความเสี่ยงโรคใบ ควรเดินสำรวจแปลงหลังฝนหยุด',
    },
    [
      {
        title: 'เฝ้าระวังโรคพืชหลังฝน',
        detail: 'ตัวอย่าง: ตรวจใบล่างและบริเวณที่อากาศถ่ายเทน้อยหลังฝนตกต่อเนื่อง',
        actionLabel: 'เดินสำรวจแปลง',
        priority: 'caution',
        riskIds: ['high_humidity', 'disease_risk'],
      },
      {
        title: 'ไม่เหมาะกับการพ่นสารช่วงบ่าย',
        detail: 'ตัวอย่าง: ฝนบ่ายอาจชะล้างสาร ควรรอหน้าต่างอากาศนิ่งและไม่มีฝน',
        actionLabel: 'เลื่อนการพ่น',
        priority: 'avoid',
        riskIds: ['heavy_rain'],
      },
    ],
  ),
  buildForecast(
    weatherLocations[2],
    {
      conditionLabel: 'แดดแรง ลมปานกลาง',
      iconTone: 'sun',
      minTempC: 25,
      maxTempC: 35,
      rainChancePercent: 28,
      humidityPercent: 58,
      windKph: 18,
      uvIndex: 11,
      risks: ['drought', 'heat', 'high_uv'],
      summary: 'ตัวอย่าง: ฝนน้อยและแดดแรง ควรตรวจความชื้นดินก่อนให้น้ำเพิ่ม',
    },
    [
      {
        title: 'ตรวจความชื้นดินก่อนให้น้ำ',
        detail: 'ตัวอย่าง: ถ้าดินแห้งลึกหลายเซนติเมตร ค่อยวางแผนให้น้ำช่วงเช้าหรือเย็น',
        actionLabel: 'ระวังน้ำน้อย',
        priority: 'caution',
        riskIds: ['drought', 'heat'],
      },
      {
        title: 'ลมเริ่มแรง ไม่ควรพ่นละอองละเอียด',
        detail: 'ตัวอย่าง: ลมอาจพัดละอองออกนอกแปลง ควรรอช่วงลมนิ่งกว่า',
        actionLabel: 'เช็กลมก่อนพ่น',
        priority: 'avoid',
        riskIds: ['strong_wind'],
      },
    ],
  ),
  buildForecast(
    weatherLocations[3],
    {
      conditionLabel: 'ฝนสลับแดด',
      iconTone: 'rain',
      minTempC: 24,
      maxTempC: 33,
      rainChancePercent: 55,
      humidityPercent: 75,
      windKph: 12,
      uvIndex: 8,
      risks: ['heavy_rain', 'high_humidity', 'good_spraying_window'],
      summary: 'ตัวอย่าง: อาจมีช่วงเช้าอากาศเปิด ก่อนฝนช่วงบ่าย เหมาะกับงานสั้นที่เตรียมแผนสำรองไว้',
    },
    [
      {
        title: 'ช่วงเช้าเป็นหน้าต่างทำงานสั้น',
        detail: 'ตัวอย่าง: ถ้าจำเป็นต้องพ่น ควรเลือกช่วงเช้าที่ลมนิ่งและดูโอกาสฝนซ้ำ',
        actionLabel: 'พ่นเฉพาะเมื่อจำเป็น',
        priority: 'caution',
        riskIds: ['good_spraying_window'],
      },
      {
        title: 'เตรียมระบายน้ำในนาข้าว',
        detail: 'ตัวอย่าง: ฝนบ่ายอาจเพิ่มระดับน้ำ ควรตรวจทางระบายน้ำและคันนา',
        actionLabel: 'ตรวจคันนา',
        priority: 'caution',
        riskIds: ['heavy_rain'],
      },
    ],
  ),
  buildForecast(
    weatherLocations[4],
    {
      conditionLabel: 'ชื้นสูง มีฝนกระจาย',
      iconTone: 'storm',
      minTempC: 25,
      maxTempC: 32,
      rainChancePercent: 70,
      humidityPercent: 86,
      windKph: 16,
      uvIndex: 6,
      risks: ['heavy_rain', 'high_humidity', 'disease_risk', 'strong_wind'],
      summary: 'ตัวอย่าง: สวนผลไม้ควรเฝ้าระวังเชื้อราและกิ่งหักจากลมแรงบางช่วง',
    },
    [
      {
        title: 'สวนผลไม้ควรระวังโรคจากความชื้น',
        detail: 'ตัวอย่าง: ตรวจทรงพุ่มที่ทึบ กิ่งแน่น และผลที่มีรอยช้ำหลังฝน',
        actionLabel: 'ตรวจทรงพุ่ม',
        priority: 'caution',
        riskIds: ['high_humidity', 'disease_risk'],
      },
      {
        title: 'งดพ่นเมื่อฝนหรือลมแรง',
        detail: 'ตัวอย่าง: รอช่วงอากาศนิ่งและใบแห้งก่อนตัดสินใจพ่นสาร',
        actionLabel: 'เลื่อนงานพ่น',
        priority: 'avoid',
        riskIds: ['heavy_rain', 'strong_wind'],
      },
    ],
  ),
  buildForecast(
    weatherLocations[5],
    {
      conditionLabel: 'ฝนหนักบางช่วง',
      iconTone: 'storm',
      minTempC: 24,
      maxTempC: 31,
      rainChancePercent: 78,
      humidityPercent: 88,
      windKph: 20,
      uvIndex: 5,
      risks: ['heavy_rain', 'strong_wind', 'high_humidity', 'disease_risk'],
      summary: 'ตัวอย่าง: ฝนและลมแรงอาจกระทบงานสวน ควรยึดอุปกรณ์และระวังน้ำขัง',
    },
    [
      {
        title: 'ตรวจทางน้ำและพื้นที่ต่ำ',
        detail: 'ตัวอย่าง: เปิดทางระบายน้ำและย้ายปุ๋ยหรือเมล็ดพันธุ์ออกจากพื้นที่เสี่ยงน้ำขัง',
        actionLabel: 'กันน้ำขัง',
        priority: 'caution',
        riskIds: ['heavy_rain'],
      },
      {
        title: 'ยังไม่เหมาะกับการเก็บเกี่ยวตากแดด',
        detail: 'ตัวอย่าง: ฝนหนักทำให้ผลผลิตชื้น ควรรอช่วงอากาศเปิดก่อนเก็บหรือตาก',
        actionLabel: 'เลื่อนเก็บเกี่ยว',
        priority: 'avoid',
        riskIds: ['heavy_rain', 'high_humidity'],
      },
    ],
  ),
];

export const weatherAlertMocks: WeatherAlertMock[] = [
  {
    id: 'weather-alert-heavy-rain-demo',
    title: 'ฝนตกหนักตัวอย่าง',
    body: 'ข้อมูลตัวอย่าง: บางพื้นที่มีโอกาสฝนหนัก ควรตรวจทางระบายน้ำและเก็บเครื่องมือเข้าที่ร่ม',
    locationLabel: 'สุราษฎร์ธานี',
    riskId: 'heavy_rain',
    severity: 'warning',
    route: '/app/weather',
    demoLabel: 'demo/mock',
  },
  {
    id: 'weather-alert-heat-demo',
    title: 'อากาศร้อนจัดตัวอย่าง',
    body: 'ข้อมูลตัวอย่าง: ช่วงเที่ยงแดดแรง ควรพักเป็นช่วงและดื่มน้ำบ่อย ๆ',
    locationLabel: 'กรุงเทพฯ',
    riskId: 'heat',
    severity: 'warning',
    route: '/app/weather',
    demoLabel: 'demo/mock',
  },
  {
    id: 'weather-alert-humidity-demo',
    title: 'ความชื้นสูง เสี่ยงโรคพืชตัวอย่าง',
    body: 'ข้อมูลตัวอย่าง: ความชื้นสูงหลังฝนอาจเพิ่มความเสี่ยงโรคพืช ควรสำรวจใบและโคนต้น',
    locationLabel: 'จันทบุรี',
    riskId: 'disease_risk',
    severity: 'info',
    route: '/app/weather',
    demoLabel: 'demo/mock',
  },
];

export const weatherForecastsWithAlerts: WeatherLocationForecast[] = weatherForecasts.map((forecast) => ({
  ...forecast,
  alerts: weatherAlertMocks.filter((alert) => alert.locationLabel === forecast.location.label),
}));
