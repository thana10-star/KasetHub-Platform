import type {
  WeatherAgriRiskBlockedAction,
  WeatherAgriRiskCategory,
  WeatherAgriRiskDisclaimer,
  WeatherAgriRiskLevel,
} from '@/services/weather/weather-agri-risk.types';

export const weatherAgriRiskCategoryLabels: Record<WeatherAgriRiskCategory, string> = {
  spraying_risk: 'ความเสี่ยงก่อนพ่นยา',
  irrigation_timing: 'จังหวะให้น้ำ',
  disease_pressure: 'แรงกดดันโรคจากความชื้น',
  heat_stress: 'ความร้อนต่อพืช/คนทำงาน',
  field_work_risk: 'ความเสี่ยงงานแปลง',
  harvest_drying_risk: 'ความเสี่ยงตากแห้ง/เก็บเกี่ยว',
};

export const weatherAgriRiskLevelLabels: Record<WeatherAgriRiskLevel, string> = {
  low: 'ต่ำ',
  watch: 'เฝ้าดู',
  caution: 'ระวัง',
  high: 'สูง',
};

export const weatherAgriRiskLevelTone: Record<WeatherAgriRiskLevel, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  low: 'success',
  watch: 'info',
  caution: 'warning',
  high: 'danger',
};

export const weatherAgriRiskDisclaimers: WeatherAgriRiskDisclaimer[] = [
  {
    id: 'general-only',
    text: 'คำแนะนำเบื้องต้น ไม่แทนผู้เชี่ยวชาญ',
    required: true,
  },
  {
    id: 'not-official-threshold',
    text: 'เกณฑ์นี้เป็นแผนเบื้องต้น ไม่ใช่เกณฑ์ทางการหรือคำสั่งปฏิบัติ',
    required: true,
  },
  {
    id: 'label-first',
    text: 'งานที่เกี่ยวกับสารเคมีต้องอ่านฉลากจริงก่อนใช้เสมอ',
    required: true,
  },
  {
    id: 'forecast-uncertainty',
    text: 'พยากรณ์อากาศอาจคลาดเคลื่อนได้ ควรตรวจสอบสภาพจริงและแหล่งทางการเพิ่มเติม',
    required: true,
  },
];

export const weatherAgriRiskBlockedActions: WeatherAgriRiskBlockedAction[] = [
  {
    id: 'product-recommendation',
    label: 'แนะนำสินค้า/สปอนเซอร์',
    reason: 'M78 ต้องไม่แนะนำผลิตภัณฑ์หรือแทรก sponsor/affiliate',
    blocked: true,
  },
  {
    id: 'chemical-dose',
    label: 'บอกอัตราสารเคมีหรือปุ๋ยเฉพาะ',
    reason: 'เกณฑ์อากาศเบื้องต้นไม่ใช่ฉลากหรือคำแนะนำผู้เชี่ยวชาญ',
    blocked: true,
  },
  {
    id: 'label-override',
    label: 'สั่งให้ทำขัดกับฉลาก',
    reason: 'ฉลากจริงและคำแนะนำผู้เชี่ยวชาญต้องมาก่อนเสมอ',
    blocked: true,
  },
  {
    id: 'guaranteed-outcome',
    label: 'รับประกันผลผลิต/ความปลอดภัย/กำไร',
    reason: 'อากาศเป็นพยากรณ์และมีความไม่แน่นอน',
    blocked: true,
  },
];

export function getWeatherAgriRiskBoundarySummary() {
  return {
    disclaimers: weatherAgriRiskDisclaimers,
    blockedActions: weatherAgriRiskBlockedActions,
    noProductRecommendation: true,
    noChemicalDose: true,
    noSponsorRecommendation: true,
    noGuaranteedOutcome: true,
    noLabelOverride: true,
    expertReviewRequired: true,
  };
}
