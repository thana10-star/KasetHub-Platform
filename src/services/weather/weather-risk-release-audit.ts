import type {
  WeatherRiskHumanApprovalGate,
  WeatherRiskReleaseAuditEvent,
  WeatherRiskReleaseBlocker,
  WeatherRiskReviewedSourceSimulation,
} from '@/services/weather/weather-risk-release-audit.types';
import type { WeatherRiskRuleVersion } from '@/services/weather/weather-risk-expert-review.types';
import { weatherRiskRuleVersionFixtures } from '@/services/weather/weather-risk-review-fixtures';

const primaryVersion = weatherRiskRuleVersionFixtures[0];

export const weatherRiskReviewedSourceSimulations: WeatherRiskReviewedSourceSimulation[] = [
  {
    id: 'thai-weather-reference-placeholder',
    title: 'Thai weather reference placeholder',
    sourceKind: 'weather_reference',
    status: 'review_placeholder',
    note: 'รอแหล่งข้อมูลอากาศไทยหรือเอกสาร provider ที่ตรวจทานแล้ว',
    officialApproval: false,
    productionReviewed: false,
    planningOnly: true,
  },
  {
    id: 'agriculture-office-review-placeholder',
    title: 'Agriculture office review placeholder',
    sourceKind: 'agriculture_office_review',
    status: 'review_placeholder',
    note: 'รอการตรวจจากหน่วยงานเกษตรหรือผู้เชี่ยวชาญพื้นที่',
    officialApproval: false,
    productionReviewed: false,
    planningOnly: true,
  },
  {
    id: 'expert-review-placeholder',
    title: 'Expert review placeholder',
    sourceKind: 'expert_review',
    status: 'review_placeholder',
    note: 'รอผู้เชี่ยวชาญลงชื่อและระบุขอบเขตการใช้งาน',
    officialApproval: false,
    productionReviewed: false,
    planningOnly: true,
  },
  {
    id: 'stale-source-warning',
    title: 'Stale-source warning',
    sourceKind: 'stale_source_warning',
    status: 'stale_warning',
    note: 'source ที่เก่าเกินไปต้องถูกเตือนและห้ามใช้อนุมัติ production',
    officialApproval: false,
    productionReviewed: false,
    planningOnly: true,
  },
  {
    id: 'conflicting-source-example',
    title: 'Conflicting-source example',
    sourceKind: 'conflicting_source',
    status: 'blocked',
    note: 'ถ้าแหล่งข้อมูลขัดกัน ต้อง block release จนกว่าจะมี reviewer ตัดสิน',
    officialApproval: false,
    productionReviewed: false,
    planningOnly: true,
  },
];

export const weatherRiskReleaseAuditEvents: WeatherRiskReleaseAuditEvent[] = [
  {
    id: 'audit-reviewed-source-simulated',
    ruleId: primaryVersion.ruleId,
    versionId: primaryVersion.versionId,
    eventType: 'reviewed_source_simulated',
    title: 'จำลอง reviewed-source placeholder',
    detail: 'ยังไม่ใช่ official approval และยังไม่ใช่ production-reviewed source',
    actorLabel: 'local fixture',
    createdAt: '2026-05-24T10:00:00.000Z',
    status: 'review_placeholder',
    planningOnly: true,
    noSupabaseWrite: true,
  },
  {
    id: 'audit-release-attempt-blocked',
    ruleId: primaryVersion.ruleId,
    versionId: primaryVersion.versionId,
    eventType: 'release_attempt_blocked',
    title: 'release attempt blocked',
    detail: 'ยังไม่มี human approval gate, reviewer, timestamp, release note',
    actorLabel: 'local fixture',
    createdAt: '2026-05-24T10:05:00.000Z',
    status: 'blocked',
    planningOnly: true,
    noSupabaseWrite: true,
  },
  {
    id: 'audit-automation-bypass-blocked',
    ruleId: primaryVersion.ruleId,
    versionId: primaryVersion.versionId,
    eventType: 'automation_bypass_blocked',
    title: 'automation bypass blocked',
    detail: 'automation หรือ CMS ไม่สามารถเปลี่ยน rule เป็น prescriptive ได้',
    actorLabel: 'local fixture',
    createdAt: '2026-05-24T10:10:00.000Z',
    status: 'blocked',
    planningOnly: true,
    noSupabaseWrite: true,
  },
  {
    id: 'audit-cms-publish-blocked',
    ruleId: primaryVersion.ruleId,
    versionId: primaryVersion.versionId,
    eventType: 'cms_publish_blocked',
    title: 'CMS publish blocked',
    detail: 'CMS override อย่างเดียวห้ามปล่อยกฎเป็นคำแนะนำเชิงสั่งการ',
    actorLabel: 'local fixture',
    createdAt: '2026-05-24T10:15:00.000Z',
    status: 'blocked',
    planningOnly: true,
    noSupabaseWrite: true,
  },
  {
    id: 'audit-stale-review-detected',
    ruleId: primaryVersion.ruleId,
    versionId: primaryVersion.versionId,
    eventType: 'stale_review_detected',
    title: 'stale review warning',
    detail: 'review เก่าต้องเตือนและ block release',
    actorLabel: 'local fixture',
    createdAt: '2026-05-24T10:20:00.000Z',
    status: 'stale_warning',
    planningOnly: true,
    noSupabaseWrite: true,
  },
  {
    id: 'audit-rule-reverted',
    ruleId: primaryVersion.ruleId,
    versionId: primaryVersion.versionId,
    eventType: 'rule_reverted',
    title: 'rule reverted to planning-only',
    detail: 'จำลองการ revert หลังพบ wording ที่อาจดูเหมือนคำสั่ง',
    actorLabel: 'local fixture',
    createdAt: '2026-05-24T10:25:00.000Z',
    status: 'blocked',
    planningOnly: true,
    noSupabaseWrite: true,
  },
];

export function buildWeatherRiskReleaseBlockers(version: WeatherRiskRuleVersion): WeatherRiskReleaseBlocker[] {
  return [
    {
      id: `${version.ruleId}-human-approval-required`,
      label: 'ต้องมี human approval',
      reason: 'กฎอากาศห้ามกลายเป็นคำแนะนำเชิงสั่งการจาก automation หรือ CMS',
      blocking: true,
    },
    {
      id: `${version.ruleId}-release-reviewer-required`,
      label: 'ต้องมี release reviewer',
      reason: 'ต้องมีผู้อนุมัติ release แยกจาก reviewer fixtures',
      blocking: true,
    },
    {
      id: `${version.ruleId}-release-timestamp-required`,
      label: 'ต้องมี release timestamp',
      reason: 'ต้องรู้ว่าอนุมัติเมื่อไรเพื่อ audit/rollback',
      blocking: true,
    },
    {
      id: `${version.ruleId}-release-note-required`,
      label: 'ต้องมี release note',
      reason: 'ต้องอธิบายว่าปล่อย rule version นี้ด้วยเหตุผลใด',
      blocking: true,
    },
    {
      id: `${version.ruleId}-automation-cms-blocked`,
      label: 'automation/CMS bypass ถูก block',
      reason: 'ระบบอัตโนมัติหรือ CMS override ห้ามเปิด prescriptive mode',
      blocking: true,
    },
  ];
}

export function buildWeatherRiskHumanApprovalGate(version: WeatherRiskRuleVersion): WeatherRiskHumanApprovalGate {
  return {
    id: `${version.ruleId}-human-approval-gate`,
    ruleId: version.ruleId,
    versionId: version.versionId,
    humanApprovalRequired: true,
    releaseApproved: false,
    releaseReviewerPlaceholderRequired: true,
    releaseTimestampPlaceholderRequired: true,
    releaseNotePlaceholderRequired: true,
    automationBypassAllowed: false,
    cmsBypassAllowed: false,
    finalPrescriptiveAllowed: false,
    planningOnly: true,
    blockers: buildWeatherRiskReleaseBlockers(version),
    noProductRecommendation: true,
    noChemicalDose: true,
    noGpsRequired: true,
  };
}

export function getWeatherRiskReleaseAuditSummary() {
  const gates = weatherRiskRuleVersionFixtures.map((version) => buildWeatherRiskHumanApprovalGate(version));

  return {
    sourceSimulations: weatherRiskReviewedSourceSimulations,
    events: weatherRiskReleaseAuditEvents,
    gates,
    auditEventCount: weatherRiskReleaseAuditEvents.length,
    releaseBlocked: gates.every((gate) => !gate.finalPrescriptiveAllowed && !gate.releaseApproved),
    automationBypassBlocked: gates.every((gate) => !gate.automationBypassAllowed),
    cmsBypassBlocked: gates.every((gate) => !gate.cmsBypassAllowed),
    staleReviewWarnings: weatherRiskReleaseAuditEvents.filter((event) => event.status === 'stale_warning'),
    planningOnlyBadge: 'planning-only',
    noProductRecommendation: gates.every((gate) => gate.noProductRecommendation),
    noChemicalDose: gates.every((gate) => gate.noChemicalDose),
    noGpsRequired: gates.every((gate) => gate.noGpsRequired),
    noSupabaseWrite: weatherRiskReleaseAuditEvents.every((event) => event.noSupabaseWrite),
  };
}
