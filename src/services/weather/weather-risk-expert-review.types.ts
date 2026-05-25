import type { WeatherAgriRiskCategory } from '@/services/weather/weather-agri-risk.types';

export type WeatherRiskRuleVersionStatus = 'planning_only' | 'review_candidate' | 'expert_review_pending' | 'release_blocked';

export type WeatherRiskReviewStatus = 'pending' | 'changes_requested' | 'approved';

export type WeatherRiskReviewerRole =
  | 'agronomy_expert'
  | 'crop_protection_expert'
  | 'weather_data_reviewer'
  | 'safety_reviewer';

export type WeatherRiskSourceMetadata = {
  id: string;
  title: string;
  sourceType: 'weather_data' | 'agronomy_reference' | 'field_observation' | 'safety_reference' | 'local_expert_review';
  ownerPlaceholder: string;
  citationPlaceholder: string;
  reviewedDatePlaceholder: string;
  freshnessStatus: 'placeholder' | 'needs_review' | 'reviewed';
  sourceConfidence: 'unknown' | 'low' | 'medium' | 'high';
  fieldApplicabilityNote: string;
  required: true;
  filled: boolean;
};

export type WeatherRiskReviewerSignoff = {
  id: string;
  role: WeatherRiskReviewerRole;
  status: WeatherRiskReviewStatus;
  reviewerPlaceholder: string;
  reviewedAtPlaceholder: string;
  note: string;
  required: true;
};

export type WeatherRiskFalsePositiveExample = {
  id: string;
  scenario: string;
  whyItMatters: string;
  mitigationNote: string;
  reviewed: boolean;
};

export type WeatherRiskFalseNegativeExample = {
  id: string;
  scenario: string;
  whyItMatters: string;
  mitigationNote: string;
  reviewed: boolean;
};

export type WeatherRiskPrescriptiveBlocker = {
  id: string;
  label: string;
  reason: string;
  blocking: true;
};

export type WeatherRiskRuleVersion = {
  ruleId: string;
  versionId: string;
  category: WeatherAgriRiskCategory;
  title: string;
  status: WeatherRiskRuleVersionStatus;
  sourceMetadata: WeatherRiskSourceMetadata[];
  reviewerSignoffs: WeatherRiskReviewerSignoff[];
  falsePositiveExamples: WeatherRiskFalsePositiveExample[];
  falseNegativeExamples: WeatherRiskFalseNegativeExample[];
  prescriptiveAllowed: false;
  planningOnly: true;
  ruleLocked: boolean;
  releaseGateApproved: boolean;
  noProductRecommendation: true;
  noChemicalDose: true;
  noGpsRequired: true;
};

export type WeatherRiskExpertApprovalGate = {
  ruleId: string;
  versionId: string;
  canShowGeneralCaution: true;
  prescriptiveAllowed: false;
  sourcesFilled: boolean;
  allRequiredSignoffsComplete: boolean;
  safetyReviewerApproved: boolean;
  ruleVersionLocked: boolean;
  falsePositiveNegativeReviewed: boolean;
  releaseGateApproved: boolean;
  blockers: WeatherRiskPrescriptiveBlocker[];
  noProductRecommendation: true;
  noChemicalDose: true;
  noGpsRequired: true;
};
