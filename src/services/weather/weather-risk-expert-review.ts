import type {
  WeatherRiskExpertApprovalGate,
  WeatherRiskPrescriptiveBlocker,
  WeatherRiskRuleVersion,
} from '@/services/weather/weather-risk-expert-review.types';
import { weatherRiskRuleVersionFixtures } from '@/services/weather/weather-risk-review-fixtures';

export function buildWeatherRiskPrescriptiveBlockers(version: WeatherRiskRuleVersion): WeatherRiskPrescriptiveBlocker[] {
  const blockers: WeatherRiskPrescriptiveBlocker[] = [
    {
      id: 'm79-prescriptive-disabled',
      label: 'M79 ยังปิดคำแนะนำเชิงสั่งการ',
      reason: 'แม้ metadata จะครบในอนาคต M79 ยังเป็น readiness layer เท่านั้น',
      blocking: true,
    },
  ];

  if (version.sourceMetadata.some((source) => !source.filled)) {
    blockers.push({
      id: 'sources-not-filled',
      label: 'ยังไม่มี source metadata ครบ',
      reason: 'ต้องเติมแหล่งอ้างอิง เจ้าของแหล่งข้อมูล วันที่ตรวจทาน และข้อจำกัดการใช้งาน',
      blocking: true,
    });
  }

  if (version.reviewerSignoffs.some((signoff) => signoff.status !== 'approved')) {
    blockers.push({
      id: 'reviewers-pending',
      label: 'ผู้ตรวจทานยังไม่อนุมัติครบ',
      reason: 'ต้องมี agronomy, crop protection, weather data และ safety reviewer ครบก่อน',
      blocking: true,
    });
  }

  if (!version.reviewerSignoffs.some((signoff) => signoff.role === 'safety_reviewer' && signoff.status === 'approved')) {
    blockers.push({
      id: 'safety-reviewer-required',
      label: 'ต้องมี safety reviewer',
      reason: 'กฎที่เกี่ยวกับการพ่นยา โรคพืช หรือความปลอดภัยต้องผ่านผู้ตรวจความปลอดภัย',
      blocking: true,
    });
  }

  if (!version.ruleLocked) {
    blockers.push({
      id: 'rule-version-not-locked',
      label: 'ยังไม่ lock rule version',
      reason: 'ต้องล็อกเวอร์ชันก่อนอนุญาตให้ใช้ใน production flow',
      blocking: true,
    });
  }

  if (
    version.falsePositiveExamples.some((example) => !example.reviewed) ||
    version.falseNegativeExamples.some((example) => !example.reviewed)
  ) {
    blockers.push({
      id: 'false-positive-negative-not-reviewed',
      label: 'ยังไม่ review false positive/false negative',
      reason: 'ต้องตรวจตัวอย่างเตือนเกินจริงและเตือนต่ำเกินจริงก่อน',
      blocking: true,
    });
  }

  if (!version.releaseGateApproved) {
    blockers.push({
      id: 'release-gate-not-approved',
      label: 'release gate ยังไม่อนุมัติ',
      reason: 'ต้องมีขั้นอนุมัติแยกต่างหากก่อนใช้เป็นคำแนะนำเชิงสั่งการ',
      blocking: true,
    });
  }

  return blockers;
}

export function buildWeatherRiskExpertApprovalGate(version: WeatherRiskRuleVersion): WeatherRiskExpertApprovalGate {
  const sourcesFilled = version.sourceMetadata.every((source) => source.filled);
  const allRequiredSignoffsComplete = version.reviewerSignoffs.every((signoff) => signoff.status === 'approved');
  const safetyReviewerApproved = version.reviewerSignoffs.some(
    (signoff) => signoff.role === 'safety_reviewer' && signoff.status === 'approved',
  );
  const falsePositiveNegativeReviewed =
    version.falsePositiveExamples.every((example) => example.reviewed) &&
    version.falseNegativeExamples.every((example) => example.reviewed);

  return {
    ruleId: version.ruleId,
    versionId: version.versionId,
    canShowGeneralCaution: true,
    prescriptiveAllowed: false,
    sourcesFilled,
    allRequiredSignoffsComplete,
    safetyReviewerApproved,
    ruleVersionLocked: version.ruleLocked,
    falsePositiveNegativeReviewed,
    releaseGateApproved: version.releaseGateApproved,
    blockers: buildWeatherRiskPrescriptiveBlockers(version),
    noProductRecommendation: true,
    noChemicalDose: true,
    noGpsRequired: true,
  };
}

export function getWeatherRiskExpertReviewSummary() {
  const versions = weatherRiskRuleVersionFixtures;
  const gates = versions.map((version) => buildWeatherRiskExpertApprovalGate(version));

  return {
    versions,
    gates,
    versionCount: versions.length,
    sourcePlaceholderCount: versions.reduce((total, version) => total + version.sourceMetadata.length, 0),
    pendingSignoffCount: versions.reduce(
      (total, version) => total + version.reviewerSignoffs.filter((signoff) => signoff.status === 'pending').length,
      0,
    ),
    falsePositiveCount: versions.reduce((total, version) => total + version.falsePositiveExamples.length, 0),
    falseNegativeCount: versions.reduce((total, version) => total + version.falseNegativeExamples.length, 0),
    allPrescriptiveBlocked: gates.every((gate) => !gate.prescriptiveAllowed && gate.blockers.length > 0),
    noProductRecommendation: versions.every((version) => version.noProductRecommendation),
    noChemicalDose: versions.every((version) => version.noChemicalDose),
    noGpsRequired: versions.every((version) => version.noGpsRequired),
  };
}
