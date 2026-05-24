import type { AppRoute } from '@/types/kaset';
import type { CalculatorCategory } from '@/services/agri-calculators/agri-calculator.types';
import type {
  CalculatorAIExplanationAllowedAction,
  CalculatorAIExplanationBlockedAction,
  CalculatorAIExplanationRisk,
} from '@/services/agri-calculators/calculator-ai-explanation.types';
import type { CalculatorResultSummary } from '@/services/agri-calculators/calculator-result-summary.types';
import type { CropCalculatorKey } from '@/services/agri-calculators/crop-calculator-profile.types';

export type CalculatorAIPolicyVersionStatus = 'draft' | 'review_ready' | 'active' | 'retired';

export type CalculatorAISafetyDecisionStatus =
  | 'ready_for_backend_policy_check'
  | 'requires_human_escalation'
  | 'rejected_before_ai';

export type CalculatorAIExecutionRequest = {
  summary: CalculatorResultSummary;
  calculatorType: CalculatorCategory;
  cropKey?: CropCalculatorKey | string;
  cropLabel?: string;
  requestedActions?: ReadonlyArray<CalculatorAIExplanationAllowedAction | CalculatorAIExplanationBlockedAction>;
  userQuestion?: string;
  policyVersionId?: string;
  promptTemplateVersionId?: string;
  requestedAt: string;
  sourceRoute: AppRoute;
  sourceSurface: 'calculator_result' | 'saved_result' | 'qa_preview' | 'admin_preview';
  localOnlyPreview: true;
};

export type CalculatorAIExecutionSnapshot = Readonly<{
  snapshotId: string;
  sourceSummaryId: string;
  calculatorType: CalculatorCategory;
  calculatorLabel: string;
  calculatorRoute: AppRoute;
  cropKey?: CropCalculatorKey | string;
  cropLabel?: string;
  inputRecap: readonly string[];
  resultValues: readonly string[];
  warningRecap: readonly string[];
  safetyDisclaimer: string;
  lockedAt: string;
  lockHash: string;
  immutable: true;
  aiReceivesExplanationOnlySnapshot: true;
  aiCanRecomputeFormulas: false;
  aiCanMutateOutputs: false;
  aiMustEchoLockedResultValuesOnly: true;
  allowedEchoValues: readonly string[];
}>;

export type CalculatorAIEscalationRule = {
  id: string;
  trigger: string;
  action: string;
  requiredHumanReview: boolean;
  severity: CalculatorAIExplanationRisk;
};

export type CalculatorAIPolicyVersion = {
  id: string;
  promptTemplateVersionId: string;
  status: CalculatorAIPolicyVersionStatus;
  locale: 'th-TH';
  effectiveFrom: string;
  description: string;
  allowedActionIds: CalculatorAIExplanationAllowedAction[];
  blockedActionIds: CalculatorAIExplanationBlockedAction[];
  escalationTriggerIds: string[];
  bannedResponseCategories: string[];
  sponsorSeparationRules: string[];
  auditRequirementIds: string[];
};

export type CalculatorAISafetyDecision = {
  status: CalculatorAISafetyDecisionStatus;
  riskLevel: CalculatorAIExplanationRisk;
  reasons: string[];
  blockedActionIds: CalculatorAIExplanationBlockedAction[];
  escalationRuleIds: string[];
  bannedCategoryMatches: string[];
  invalidRequestReasons: string[];
  deterministicSnapshotRequired: true;
  noRealAICall: true;
};

export type CalculatorAIRateLimitPlan = {
  dailyExplanationLimit: number;
  rewardedAdUnlockLimit: number;
  repeatedRequestWindowMinutes: number;
  repeatedRequestMaxCount: number;
  maxPromptPayloadChars: number;
  maxUserQuestionChars: number;
  maxResultRecapLines: number;
  oversizedPayloadAction: 'reject_before_ai';
  invalidCropProfileAction: 'reject_or_clear_crop_context';
  spamPreventionRules: string[];
  rewardAdBoundary: string;
};

export type CalculatorAIAbuseScenario = {
  id: string;
  label: string;
  detection: string;
  action: 'reject' | 'rate_limit' | 'escalate' | 'audit';
  severity: CalculatorAIExplanationRisk;
  userCopy: string;
};

export type CalculatorAIAuditLogPlan = {
  requiredFields: string[];
  redactedFields: string[];
  forbiddenFields: string[];
  retentionDays: number;
  safetyEventTriggers: string[];
  futureTables: string[];
  noBackendWriteInM56: true;
};

export type CalculatorAIBackendArchitectureReview = {
  requestId: string;
  snapshot: CalculatorAIExecutionSnapshot;
  policyVersion: CalculatorAIPolicyVersion;
  safetyDecision: CalculatorAISafetyDecision;
  rateLimitPlan: CalculatorAIRateLimitPlan;
  auditLogPlan: CalculatorAIAuditLogPlan;
  escalationRules: CalculatorAIEscalationRule[];
  abuseScenarios: CalculatorAIAbuseScenario[];
  pipelineSteps: string[];
  futureBackendStages: string[];
  noRealAICall: true;
  backendWritesEnabled: false;
  supabaseWritesEnabled: false;
};

