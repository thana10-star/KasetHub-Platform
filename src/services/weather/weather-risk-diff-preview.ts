import type { WeatherRiskRuleDiffPreview } from '@/services/weather/weather-risk-release-audit.types';
import { weatherRiskRuleVersionFixtures } from '@/services/weather/weather-risk-review-fixtures';

export const weatherRiskRuleDiffPreviews: WeatherRiskRuleDiffPreview[] = weatherRiskRuleVersionFixtures.map((version) => ({
  id: `${version.ruleId}-diff-preview`,
  ruleId: version.ruleId,
  versionId: version.versionId,
  title: `${version.title} diff preview`,
  changes: [
    {
      kind: 'threshold_change',
      before: 'เบื้องต้น: ใช้ข้อความกว้างตาม M78',
      after: 'จำลองการปรับ threshold wording ก่อน expert review',
      riskNote: 'การเปลี่ยน threshold อาจทำให้เตือนแรงหรืออ่อนเกินไป ต้อง review',
    },
    {
      kind: 'wording_change',
      before: 'คำเตือนทั่วไป',
      after: 'จำลองข้อความที่ชัดขึ้นแต่ยังไม่สั่งการ',
      riskNote: 'ห้ามเปลี่ยนเป็นคำสั่งให้ทำ/ไม่ทำงานเกษตรแบบเฉพาะเจาะจง',
    },
    {
      kind: 'disclaimer_change',
      before: 'คำแนะนำเบื้องต้น ไม่แทนผู้เชี่ยวชาญ',
      after: 'ยังต้องคง disclaimer เดิมทุกครั้ง',
      riskNote: 'CMS หรือ automation ห้ามลบ disclaimer',
    },
    {
      kind: 'blocked_action_change',
      before: 'block product/dose/label override',
      after: 'ยัง block product/dose/label override',
      riskNote: 'ห้ามเพิ่ม sponsor หรือคำแนะนำสินค้า',
    },
    {
      kind: 'risk_level_mapping_change',
      before: 'low/watch/caution/high',
      after: 'จำลอง mapping ใหม่ที่ยังไม่อนุมัติ',
      riskNote: 'risk level mapping ต้องมี false-positive/negative review',
    },
  ],
  reviewed: false,
  planningOnly: true,
  noPersistence: true,
}));

export function getWeatherRiskDiffPreviewSummary() {
  return {
    previews: weatherRiskRuleDiffPreviews,
    previewCount: weatherRiskRuleDiffPreviews.length,
    allPlanningOnly: weatherRiskRuleDiffPreviews.every((preview) => preview.planningOnly),
    allUnreviewed: weatherRiskRuleDiffPreviews.every((preview) => preview.reviewed === false),
    includesThresholdChanges: weatherRiskRuleDiffPreviews.every((preview) =>
      preview.changes.some((change) => change.kind === 'threshold_change'),
    ),
    includesDisclaimerChanges: weatherRiskRuleDiffPreviews.every((preview) =>
      preview.changes.some((change) => change.kind === 'disclaimer_change'),
    ),
  };
}
