import type { WeatherRiskReviewerRole } from '@/services/weather/weather-risk-expert-review.types';

export type WeatherRiskAuditStatus = 'planning_only' | 'blocked' | 'stale_warning' | 'review_placeholder';

export type WeatherRiskReleaseAuditEvent = {
  id: string;
  ruleId: string;
  versionId: string;
  eventType:
    | 'reviewed_source_simulated'
    | 'release_attempt_blocked'
    | 'automation_bypass_blocked'
    | 'cms_publish_blocked'
    | 'safety_reviewer_pending'
    | 'stale_review_detected'
    | 'rule_reverted';
  title: string;
  detail: string;
  actorLabel: string;
  createdAt: string;
  status: WeatherRiskAuditStatus;
  planningOnly: true;
  noSupabaseWrite: true;
};

export type WeatherRiskReviewerHistory = {
  id: string;
  ruleId: string;
  versionId: string;
  role: WeatherRiskReviewerRole;
  eventType: 'reviewer_assigned' | 'reviewer_changed' | 'safety_reviewer_pending' | 'rule_reverted' | 'stale_review' | 'release_blocked';
  fromStatus?: string;
  toStatus: string;
  actorLabel: string;
  changedAt: string;
  note: string;
  staleReviewWarning: boolean;
  planningOnly: true;
};

export type WeatherRiskRuleDiffChangeKind =
  | 'threshold_change'
  | 'wording_change'
  | 'disclaimer_change'
  | 'blocked_action_change'
  | 'risk_level_mapping_change';

export type WeatherRiskRuleDiffPreview = {
  id: string;
  ruleId: string;
  versionId: string;
  title: string;
  changes: Array<{
    kind: WeatherRiskRuleDiffChangeKind;
    before: string;
    after: string;
    riskNote: string;
  }>;
  reviewed: false;
  planningOnly: true;
  noPersistence: true;
};

export type WeatherRiskReleaseBlocker = {
  id: string;
  label: string;
  reason: string;
  blocking: true;
};

export type WeatherRiskReviewedSourceSimulation = {
  id: string;
  title: string;
  sourceKind: 'weather_reference' | 'agriculture_office_review' | 'expert_review' | 'stale_source_warning' | 'conflicting_source';
  status: WeatherRiskAuditStatus;
  note: string;
  officialApproval: false;
  productionReviewed: false;
  planningOnly: true;
};

export type WeatherRiskHumanApprovalGate = {
  id: string;
  ruleId: string;
  versionId: string;
  humanApprovalRequired: true;
  releaseApproved: false;
  releaseReviewerPlaceholderRequired: true;
  releaseTimestampPlaceholderRequired: true;
  releaseNotePlaceholderRequired: true;
  automationBypassAllowed: false;
  cmsBypassAllowed: false;
  finalPrescriptiveAllowed: false;
  planningOnly: true;
  blockers: WeatherRiskReleaseBlocker[];
  noProductRecommendation: true;
  noChemicalDose: true;
  noGpsRequired: true;
};
