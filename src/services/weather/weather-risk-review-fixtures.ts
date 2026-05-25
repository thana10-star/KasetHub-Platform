import { weatherAgriRiskRules } from '@/services/weather/weather-agri-risk-rules';
import type { WeatherAgriRiskCategory } from '@/services/weather/weather-agri-risk.types';
import type {
  WeatherRiskFalseNegativeExample,
  WeatherRiskFalsePositiveExample,
  WeatherRiskReviewerRole,
  WeatherRiskReviewerSignoff,
  WeatherRiskRuleVersion,
  WeatherRiskSourceMetadata,
} from '@/services/weather/weather-risk-expert-review.types';

export const weatherRiskReviewerRoleLabels: Record<WeatherRiskReviewerRole, string> = {
  agronomy_expert: 'ผู้เชี่ยวชาญเกษตร',
  crop_protection_expert: 'ผู้เชี่ยวชาญอารักขาพืช',
  weather_data_reviewer: 'ผู้ตรวจข้อมูลอากาศ',
  safety_reviewer: 'ผู้ตรวจความปลอดภัย',
};

export const weatherRiskRequiredReviewerRoles: WeatherRiskReviewerRole[] = [
  'agronomy_expert',
  'crop_protection_expert',
  'weather_data_reviewer',
  'safety_reviewer',
];

function buildSourceMetadata(category: WeatherAgriRiskCategory): WeatherRiskSourceMetadata[] {
  return [
    {
      id: `${category}-weather-source`,
      title: 'แหล่งข้อมูลอากาศและความหมายของตัวแปร',
      sourceType: 'weather_data',
      ownerPlaceholder: 'รอระบุเจ้าของแหล่งข้อมูล/ผู้ให้บริการ',
      citationPlaceholder: 'รอ citation หรือเอกสาร API ที่ตรวจทาน',
      reviewedDatePlaceholder: 'รอวันที่ตรวจทาน',
      freshnessStatus: 'placeholder',
      sourceConfidence: 'unknown',
      fieldApplicabilityNote: 'ต้องยืนยันว่าค่าพยากรณ์เหมาะกับการสื่อสารระดับจังหวัด/เมือง ไม่ใช่พิกัดแปลง',
      required: true,
      filled: false,
    },
    {
      id: `${category}-agronomy-source`,
      title: 'หลักเกณฑ์เกษตรที่เกี่ยวข้อง',
      sourceType: 'agronomy_reference',
      ownerPlaceholder: 'รอผู้เชี่ยวชาญเกษตร/หน่วยงานตรวจทาน',
      citationPlaceholder: 'รอเอกสารอ้างอิงที่ใช้กำหนดเกณฑ์',
      reviewedDatePlaceholder: 'รอวันที่ตรวจทาน',
      freshnessStatus: 'placeholder',
      sourceConfidence: 'unknown',
      fieldApplicabilityNote: 'ต้องระบุข้อจำกัดตามพืช พื้นที่ ฤดู และวิธีปฏิบัติจริง',
      required: true,
      filled: false,
    },
    {
      id: `${category}-safety-source`,
      title: 'ความปลอดภัยและข้อความเตือน',
      sourceType: 'safety_reference',
      ownerPlaceholder: 'รอ safety reviewer ตรวจข้อความ',
      citationPlaceholder: 'รอหลักฐานว่าข้อความไม่แทนฉลาก/ผู้เชี่ยวชาญ',
      reviewedDatePlaceholder: 'รอวันที่ตรวจทาน',
      freshnessStatus: 'placeholder',
      sourceConfidence: 'unknown',
      fieldApplicabilityNote: 'ต้องไม่สั่งการ ไม่แนะนำสินค้า ไม่บอกอัตราสาร และไม่รับประกันผล',
      required: true,
      filled: false,
    },
  ];
}

function buildReviewerSignoffs(ruleId: string): WeatherRiskReviewerSignoff[] {
  return weatherRiskRequiredReviewerRoles.map((role) => ({
    id: `${ruleId}-${role}`,
    role,
    status: 'pending',
    reviewerPlaceholder: 'รอชื่อผู้ตรวจทาน',
    reviewedAtPlaceholder: 'รอเวลาอนุมัติ',
    note: 'ยังไม่อนุมัติให้ใช้เป็นคำแนะนำเชิงสั่งการ',
    required: true,
  }));
}

const falsePositiveExamples: Record<WeatherAgriRiskCategory, WeatherRiskFalsePositiveExample> = {
  spraying_risk: {
    id: 'spraying-false-positive',
    scenario: 'ระบบเตือนลม/ฝนสูง แต่แปลงจริงสงบและไม่มีฝน',
    whyItMatters: 'อาจทำให้ผู้ใช้เลื่อนงานโดยไม่จำเป็น',
    mitigationNote: 'ต้องบอกให้ตรวจสภาพจริงและฉลากเสมอ',
    reviewed: false,
  },
  irrigation_timing: {
    id: 'irrigation-false-positive',
    scenario: 'ระบบเตือนอากาศร้อนฝนน้อย แต่ดินในแปลงยังชื้น',
    whyItMatters: 'อาจทำให้ให้น้ำเกินความจำเป็น',
    mitigationNote: 'ต้องย้ำให้ตรวจความชื้นดินจริงก่อน',
    reviewed: false,
  },
  disease_pressure: {
    id: 'disease-false-positive',
    scenario: 'ความชื้นสูงแต่ไม่มีอาการโรคจริงในแปลง',
    whyItMatters: 'อาจทำให้ผู้ใช้กังวลหรือใช้สารโดยไม่จำเป็น',
    mitigationNote: 'ต้องห้ามวินิจฉัยโรคหรือสั่งใช้ยา',
    reviewed: false,
  },
  heat_stress: {
    id: 'heat-false-positive',
    scenario: 'อุณหภูมิสูงแต่พืชไม่ได้แสดงอาการเครียด',
    whyItMatters: 'อาจทำให้เปลี่ยนแผนงานโดยไม่จำเป็น',
    mitigationNote: 'ต้องให้เป็นการเฝ้าดูทั่วไปเท่านั้น',
    reviewed: false,
  },
  field_work_risk: {
    id: 'field-work-false-positive',
    scenario: 'พยากรณ์ฝนสูงแต่เส้นทางเข้าแปลงยังปลอดภัย',
    whyItMatters: 'อาจทำให้เลื่อนงานเกษตรที่ทำได้จริง',
    mitigationNote: 'ต้องชวนดูทางเข้าแปลงและสภาพจริง',
    reviewed: false,
  },
  harvest_drying_risk: {
    id: 'harvest-false-positive',
    scenario: 'ความชื้นสูงแต่มีโรงเรือนหรือพื้นที่ตากที่ควบคุมได้',
    whyItMatters: 'อาจประเมินความเสี่ยงการตากสูงเกินจริง',
    mitigationNote: 'ต้องระบุว่าเป็นตัวอย่างกว้าง ไม่แทนเงื่อนไขรับซื้อ',
    reviewed: false,
  },
};

const falseNegativeExamples: Record<WeatherAgriRiskCategory, WeatherRiskFalseNegativeExample> = {
  spraying_risk: {
    id: 'spraying-false-negative',
    scenario: 'ระบบไม่เตือน แต่เกิดฝน/ลมเฉพาะพื้นที่หลังพ่นยา',
    whyItMatters: 'อาจทำให้ผู้ใช้เชื่อว่าปลอดภัยเกินไป',
    mitigationNote: 'ต้องบอกว่าพยากรณ์คลาดเคลื่อนได้และฉลากมาก่อนเสมอ',
    reviewed: false,
  },
  irrigation_timing: {
    id: 'irrigation-false-negative',
    scenario: 'ระบบไม่เตือน แต่ดินทรายหรือแปลงเฉพาะจุดแห้งเร็ว',
    whyItMatters: 'อาจทำให้พลาดการตรวจน้ำในแปลง',
    mitigationNote: 'ต้องให้ตรวจแปลงจริง ไม่สั่งงด/ให้ชลประทาน',
    reviewed: false,
  },
  disease_pressure: {
    id: 'disease-false-negative',
    scenario: 'ระบบบอกเสี่ยงต่ำ แต่โรคเกิดจากปัจจัยอื่นในแปลง',
    whyItMatters: 'อาจทำให้ผู้ใช้ละเลยอาการจริง',
    mitigationNote: 'ต้องย้ำว่าการ์ดไม่ใช่การวินิจฉัยโรค',
    reviewed: false,
  },
  heat_stress: {
    id: 'heat-false-negative',
    scenario: 'อุณหภูมิเฉลี่ยไม่สูงมาก แต่แปลงจริงร้อนจัดช่วงสั้น',
    whyItMatters: 'อาจพลาดการวางแผนงานกลางแจ้ง',
    mitigationNote: 'ต้องแนะนำให้ดูสภาพจริงและสุขภาพคนทำงาน',
    reviewed: false,
  },
  field_work_risk: {
    id: 'field-work-false-negative',
    scenario: 'ระบบไม่เตือน แต่ทางเข้าแปลงเละจากฝนก่อนหน้า',
    whyItMatters: 'อาจเสี่ยงต่อเครื่องมือหรือความปลอดภัย',
    mitigationNote: 'ต้องให้ตรวจเส้นทางและเครื่องมือก่อนทำงาน',
    reviewed: false,
  },
  harvest_drying_risk: {
    id: 'harvest-false-negative',
    scenario: 'ระบบไม่เตือน แต่ฝนเฉพาะพื้นที่ทำให้การตากเสียหาย',
    whyItMatters: 'อาจวางแผนตาก/เก็บเกี่ยวมั่นใจเกินไป',
    mitigationNote: 'ต้องย้ำให้ตรวจพยากรณ์ล่าสุดและพื้นที่จริง',
    reviewed: false,
  },
};

export const weatherRiskRuleVersionFixtures: WeatherRiskRuleVersion[] = weatherAgriRiskRules.map((rule) => ({
  ruleId: rule.id,
  versionId: `${rule.id}-v2026-05-m79`,
  category: rule.category,
  title: rule.title,
  status: 'planning_only',
  sourceMetadata: buildSourceMetadata(rule.category),
  reviewerSignoffs: buildReviewerSignoffs(rule.id),
  falsePositiveExamples: [falsePositiveExamples[rule.category]],
  falseNegativeExamples: [falseNegativeExamples[rule.category]],
  prescriptiveAllowed: false,
  planningOnly: true,
  ruleLocked: false,
  releaseGateApproved: false,
  noProductRecommendation: true,
  noChemicalDose: true,
  noGpsRequired: true,
}));
