import {
  weatherAgriRiskBlockedActions,
  weatherAgriRiskDisclaimers,
} from '@/services/weather/weather-agri-risk-boundary';
import type {
  WeatherAgriRiskAssessment,
  WeatherAgriRiskAssessmentInput,
  WeatherAgriRiskCard,
  WeatherAgriRiskCategory,
  WeatherAgriRiskLevel,
  WeatherAgriRiskRule,
  WeatherAgriRiskSignal,
} from '@/services/weather/weather-agri-risk.types';
import type { WeatherAdapterResult, WeatherForecastDay } from '@/services/weather/weather.types';

const riskLevelRank: Record<WeatherAgriRiskLevel, number> = {
  low: 0,
  watch: 1,
  caution: 2,
  high: 3,
};

export const weatherAgriRiskRules: WeatherAgriRiskRule[] = [
  {
    id: 'spraying-rain-wind-basic',
    category: 'spraying_risk',
    title: 'ฝนหรือลมก่อนพ่นยา',
    level: 'caution',
    thresholdLabel: 'เบื้องต้น: ฝนปานกลางขึ้นไป หรือลมค่อนข้างแรง',
    signalIds: ['rainChancePercent', 'precipitationMm', 'windKph'],
    note: 'ใช้เตือนให้ตรวจฝน ลม และฉลากจริง ไม่ใช่คำสั่งพ่นหรือหยุดพ่น',
    planningOnly: true,
    expertReviewed: false,
  },
  {
    id: 'irrigation-dry-hot-basic',
    category: 'irrigation_timing',
    title: 'อากาศร้อนและฝนน้อย',
    level: 'watch',
    thresholdLabel: 'เบื้องต้น: อุณหภูมิสูงและโอกาสฝนต่ำ',
    signalIds: ['maxTempC', 'rainChancePercent'],
    note: 'ใช้ชวนดูความชื้นดินจริงก่อนตัดสินใจให้น้ำ',
    planningOnly: true,
    expertReviewed: false,
  },
  {
    id: 'disease-humidity-rain-basic',
    category: 'disease_pressure',
    title: 'ความชื้นสูงหรือฝนหลายวัน',
    level: 'watch',
    thresholdLabel: 'เบื้องต้น: ความชื้นสูง หรือมีฝนต่อเนื่องหลายวัน',
    signalIds: ['humidityPercent', 'multiDayRainCount'],
    note: 'ใช้เตือนให้สังเกตแปลง ไม่ใช่การวินิจฉัยโรคหรือสั่งใช้ยา',
    planningOnly: true,
    expertReviewed: false,
  },
  {
    id: 'heat-stress-basic',
    category: 'heat_stress',
    title: 'อุณหภูมิสูง',
    level: 'caution',
    thresholdLabel: 'เบื้องต้น: อุณหภูมิสูงช่วงกลางวัน',
    signalIds: ['maxTempC'],
    note: 'ใช้เตือนเรื่องความร้อนต่อพืชและคนทำงานแบบทั่วไป',
    planningOnly: true,
    expertReviewed: false,
  },
  {
    id: 'field-work-rain-wind-basic',
    category: 'field_work_risk',
    title: 'ฝนหรือลมกระทบงานแปลง',
    level: 'caution',
    thresholdLabel: 'เบื้องต้น: ฝนมาก ลมแรง หรือพยากรณ์เก่า',
    signalIds: ['rainChancePercent', 'precipitationMm', 'windKph', 'forecastStale'],
    note: 'ใช้เตือนให้ดูสภาพทางเข้าแปลง เครื่องมือ และความปลอดภัย',
    planningOnly: true,
    expertReviewed: false,
  },
  {
    id: 'harvest-drying-rain-humidity-basic',
    category: 'harvest_drying_risk',
    title: 'ฝนและความชื้นกระทบการตากแห้ง',
    level: 'watch',
    thresholdLabel: 'เบื้องต้น: โอกาสฝนหรือความชื้นสูง',
    signalIds: ['rainChancePercent', 'humidityPercent'],
    note: 'ใช้เตือนเรื่องแผนตากแห้ง/เก็บเกี่ยวแบบกว้าง ไม่ใช่คำแนะนำราคาหรือคุณภาพรับซื้อ',
    planningOnly: true,
    expertReviewed: false,
  },
];

function maxRiskLevel(levels: WeatherAgriRiskLevel[]): WeatherAgriRiskLevel {
  return levels.reduce<WeatherAgriRiskLevel>(
    (highest, level) => (riskLevelRank[level] > riskLevelRank[highest] ? level : highest),
    'low',
  );
}

function minimumRiskLevel(level: WeatherAgriRiskLevel, minimum: WeatherAgriRiskLevel) {
  return riskLevelRank[level] < riskLevelRank[minimum] ? minimum : level;
}

function countRainyDays(days: WeatherForecastDay[]) {
  return days.slice(0, 4).filter((day) => (day.rainChancePercent >= 50 || (day.precipitationMm ?? 0) >= 2)).length;
}

function buildSignals(input: WeatherAgriRiskAssessmentInput): Record<string, WeatherAgriRiskSignal> {
  const forecast = input.forecast;
  const today = forecast.today;
  const current = forecast.current;
  const multiDayRainCount = countRainyDays(forecast.daily);
  const forecastStale = Boolean(input.cacheStatus?.isStale || forecast.isStale);

  return {
    rainChancePercent: {
      id: 'rainChancePercent',
      label: 'โอกาสฝนวันนี้',
      value: today.rainChancePercent,
      unit: '%',
      source: 'today',
      planningOnly: true,
    },
    precipitationMm: {
      id: 'precipitationMm',
      label: 'ปริมาณฝนโดยประมาณ',
      value: current?.precipitationMm ?? today.precipitationMm ?? 0,
      unit: 'มม.',
      source: current ? 'current' : 'today',
      planningOnly: true,
    },
    windKph: {
      id: 'windKph',
      label: 'ความเร็วลม',
      value: Math.round(current?.windKph ?? today.windKph),
      unit: 'กม./ชม.',
      source: current ? 'current' : 'today',
      planningOnly: true,
    },
    humidityPercent: {
      id: 'humidityPercent',
      label: 'ความชื้น',
      value: current?.humidityPercent ?? today.humidityPercent,
      unit: '%',
      source: current ? 'current' : 'today',
      planningOnly: true,
    },
    maxTempC: {
      id: 'maxTempC',
      label: 'อุณหภูมิสูงสุด',
      value: Math.round(current?.temperatureC ?? today.maxTempC),
      unit: '°C',
      source: current ? 'current' : 'today',
      planningOnly: true,
    },
    multiDayRainCount: {
      id: 'multiDayRainCount',
      label: 'จำนวนวันฝนเด่นใน 4 วัน',
      value: multiDayRainCount,
      unit: 'วัน',
      source: 'daily',
      planningOnly: true,
    },
    forecastStale: {
      id: 'forecastStale',
      label: 'ข้อมูลพยากรณ์เก่า',
      value: forecastStale,
      source: 'cache',
      planningOnly: true,
    },
  };
}

function signalNumber(signals: Record<string, WeatherAgriRiskSignal>, id: string) {
  const value = signals[id]?.value;
  return typeof value === 'number' ? value : 0;
}

function signalBool(signals: Record<string, WeatherAgriRiskSignal>, id: string) {
  return signals[id]?.value === true;
}

function getSignals(signals: Record<string, WeatherAgriRiskSignal>, ids: string[]) {
  return ids.map((id) => signals[id]).filter(Boolean);
}

function buildCard(input: {
  category: WeatherAgriRiskCategory;
  title: string;
  level: WeatherAgriRiskLevel;
  summary: string;
  signals: WeatherAgriRiskSignal[];
  suggestedChecks: string[];
  stale: boolean;
}): WeatherAgriRiskCard {
  const level = input.stale ? minimumRiskLevel(input.level, 'caution') : input.level;

  return {
    id: input.category,
    category: input.category,
    title: input.title,
    level,
    summary: input.stale
      ? `${input.summary} ข้อมูลพยากรณ์อาจเก่า ควรตรวจสอบซ้ำก่อนตัดสินใจ`
      : input.summary,
    signals: input.signals,
    boundaryNote: 'เบื้องต้นเท่านั้น ไม่ใช่คำสั่งปฏิบัติ ไม่แทนฉลากหรือผู้เชี่ยวชาญ',
    suggestedChecks: input.suggestedChecks,
    planningOnly: true,
    noPrescription: true,
  };
}

function buildRiskCards(signals: Record<string, WeatherAgriRiskSignal>): WeatherAgriRiskCard[] {
  const rainChance = signalNumber(signals, 'rainChancePercent');
  const precipitation = signalNumber(signals, 'precipitationMm');
  const wind = signalNumber(signals, 'windKph');
  const humidity = signalNumber(signals, 'humidityPercent');
  const maxTemp = signalNumber(signals, 'maxTempC');
  const multiDayRain = signalNumber(signals, 'multiDayRainCount');
  const stale = signalBool(signals, 'forecastStale');

  const sprayingLevel: WeatherAgriRiskLevel =
    wind >= 24 || rainChance >= 70 || precipitation >= 8
      ? 'high'
      : wind >= 15 || rainChance >= 40 || precipitation >= 2
        ? 'caution'
        : 'low';

  const irrigationLevel: WeatherAgriRiskLevel =
    maxTemp >= 35 && rainChance <= 20 ? 'caution' : maxTemp >= 33 && rainChance <= 35 ? 'watch' : 'low';

  const diseaseLevel: WeatherAgriRiskLevel =
    humidity >= 85 && multiDayRain >= 2 ? 'caution' : humidity >= 80 || multiDayRain >= 2 ? 'watch' : 'low';

  const heatLevel: WeatherAgriRiskLevel = maxTemp >= 37 ? 'high' : maxTemp >= 34 ? 'caution' : maxTemp >= 32 ? 'watch' : 'low';

  const fieldWorkLevel: WeatherAgriRiskLevel =
    precipitation >= 10 || wind >= 28 ? 'high' : rainChance >= 60 || precipitation >= 4 || wind >= 20 ? 'caution' : 'low';

  const harvestDryingLevel: WeatherAgriRiskLevel =
    rainChance >= 70 || humidity >= 88 ? 'high' : rainChance >= 50 || humidity >= 80 ? 'caution' : 'low';

  return [
    buildCard({
      category: 'spraying_risk',
      title: 'ก่อนพ่นยาให้ดูฝนและลม',
      level: sprayingLevel,
      summary: 'ฝนหรือลมอาจทำให้งานพ่นยาไม่เหมาะสม ต้องตรวจฉลากและสภาพจริงก่อนเสมอ',
      signals: getSignals(signals, ['rainChancePercent', 'precipitationMm', 'windKph']),
      suggestedChecks: ['ดูท้องฟ้าและลมจริงในแปลง', 'อ่านฉลากจริง', 'ถามผู้เชี่ยวชาญในพื้นที่เมื่อไม่แน่ใจ'],
      stale,
    }),
    buildCard({
      category: 'irrigation_timing',
      title: 'จังหวะให้น้ำแบบกว้าง',
      level: irrigationLevel,
      summary: 'อากาศร้อนและฝนน้อยเป็นสัญญาณให้ตรวจความชื้นดินจริง ไม่ใช่คำสั่งให้น้ำทันที',
      signals: getSignals(signals, ['maxTempC', 'rainChancePercent']),
      suggestedChecks: ['จับดินหรือดูความชื้นจริง', 'ดูชนิดดินและระยะพืช', 'ตรวจแหล่งน้ำก่อนตัดสินใจ'],
      stale,
    }),
    buildCard({
      category: 'disease_pressure',
      title: 'ความชื้นและฝนต่อเนื่อง',
      level: diseaseLevel,
      summary: 'ความชื้นสูงหรือฝนหลายวันอาจเพิ่มแรงกดดันโรคในบางพืช ควรสังเกตอาการจริง',
      signals: getSignals(signals, ['humidityPercent', 'multiDayRainCount']),
      suggestedChecks: ['เดินดูใบ โคนต้น และแปลง', 'ถ่ายรูปอาการไว้เปรียบเทียบ', 'ถามเจ้าหน้าที่เกษตรเมื่อพบอาการผิดปกติ'],
      stale,
    }),
    buildCard({
      category: 'heat_stress',
      title: 'ความร้อนต่อพืชและคนทำงาน',
      level: heatLevel,
      summary: 'อุณหภูมิสูงอาจทำให้พืชและคนทำงานเครียดจากความร้อน ควรวางแผนงานกลางแจ้งอย่างระมัดระวัง',
      signals: getSignals(signals, ['maxTempC']),
      suggestedChecks: ['หลีกเลี่ยงช่วงร้อนจัดถ้าทำได้', 'เตรียมน้ำดื่มและพักเป็นช่วง', 'ดูอาการเหี่ยวหรือใบไหม้ในแปลง'],
      stale,
    }),
    buildCard({
      category: 'field_work_risk',
      title: 'งานแปลงและการเข้าแปลง',
      level: fieldWorkLevel,
      summary: 'ฝน ลม และข้อมูลที่เก่าอาจกระทบการเข้าแปลง เครื่องมือ หรือความปลอดภัยของคนทำงาน',
      signals: getSignals(signals, ['rainChancePercent', 'precipitationMm', 'windKph', 'forecastStale']),
      suggestedChecks: ['ดูทางเข้าแปลงและดินเละ', 'ตรวจเครื่องมือก่อนออกงาน', 'เช็กพยากรณ์ล่าสุดจากแหล่งทางการ'],
      stale,
    }),
    buildCard({
      category: 'harvest_drying_risk',
      title: 'ตากแห้งหรือเก็บเกี่ยว',
      level: harvestDryingLevel,
      summary: 'ฝนและความชื้นสูงอาจกระทบการตากแห้งหรือแผนเก็บเกี่ยว ต้องดูสภาพจริงและข้อกำหนดผู้รับซื้อ',
      signals: getSignals(signals, ['rainChancePercent', 'humidityPercent']),
      suggestedChecks: ['ดูพื้นที่ตากและหลังคาสำรอง', 'ตรวจความชื้นผลผลิตตามวิธีที่เหมาะสม', 'ตรวจเงื่อนไขผู้รับซื้อจากแหล่งจริง'],
      stale,
    }),
  ];
}

export function assessWeatherAgriRisk(input: WeatherAgriRiskAssessmentInput): WeatherAgriRiskAssessment {
  const signals = buildSignals(input);
  const cards = buildRiskCards(signals);

  return {
    id: `weather-agri-risk-${input.forecast.location.id}`,
    locationLabel: input.forecast.location.label,
    sourceLabel: input.forecast.source.label,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    forecastStale: signalBool(signals, 'forecastStale'),
    overallLevel: maxRiskLevel(cards.map((card) => card.level)),
    cards,
    disclaimers: weatherAgriRiskDisclaimers,
    blockedActions: weatherAgriRiskBlockedActions,
    noGps: true,
    noPreciseLocation: true,
    noProductRecommendation: true,
    noChemicalDose: true,
    noGuaranteedOutcome: true,
    planningOnly: true,
    expertReviewed: false,
  };
}

export function assessWeatherAgriRiskFromAdapter(result: WeatherAdapterResult): WeatherAgriRiskAssessment {
  return assessWeatherAgriRisk({
    forecast: result.forecast,
    cacheStatus: result.cacheStatus,
  });
}

export function getWeatherAgriRiskRuleSummary() {
  return {
    categories: [...new Set(weatherAgriRiskRules.map((rule) => rule.category))],
    rules: weatherAgriRiskRules,
    planningOnly: weatherAgriRiskRules.every((rule) => rule.planningOnly),
    expertReviewed: false,
    blockedActions: weatherAgriRiskBlockedActions,
    disclaimers: weatherAgriRiskDisclaimers,
  };
}
