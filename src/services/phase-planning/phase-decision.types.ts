import type { AppRoute } from '@/types/kaset';

export type NextPhaseOptionId =
  | 'real_supabase_staging'
  | 'real_phone_auth_staging'
  | 'real_guest_sync_staging'
  | 'real_ai_text_proxy'
  | 'real_plant_vision_proxy'
  | 'pwa_offline_mobile_shell'
  | 'closed_test_preparation';

export type PhaseRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type PhaseDependencyStatus = 'ready' | 'partial' | 'missing' | 'blocked';

export type PhaseReadinessScore = {
  score: number;
  label: string;
  blockerCount: number;
  warningCount: number;
};

export type PhaseDependency = {
  id: string;
  label: string;
  detail: string;
  status: PhaseDependencyStatus;
  route?: AppRoute;
};

export type NextPhaseOption = {
  id: NextPhaseOptionId;
  rank: number;
  title: string;
  shortLabel: string;
  summary: string;
  recommendedWhen: string;
  readinessScore: PhaseReadinessScore;
  riskLevel: PhaseRiskLevel;
  benefits: string[];
  risks: string[];
  blockers: string[];
  prerequisites: PhaseDependency[];
  recommendedBranch: string;
  primaryRoute?: AppRoute;
};

export type PhaseRecommendation = {
  recommendedOptionId: NextPhaseOptionId;
  title: string;
  summary: string;
  recommendedOrder: NextPhaseOptionId[];
  rationale: string[];
  acceleratorNote: string;
  guardrails: string[];
};

export type PhaseExecutionTrack = {
  id: string;
  branchName: string;
  label: string;
  purpose: string;
  allowedChanges: string[];
  forbiddenChanges: string[];
  mergeRules: string[];
  rollbackRules: string[];
  testCommands: string[];
  previewStrategy: string;
};

export type PhaseRiskRegisterItem = {
  id: string;
  title: string;
  level: PhaseRiskLevel;
  owner: string;
  mitigation: string;
  stopCondition: string;
};

export type PhaseDecisionPlan = {
  generatedAt: string;
  milestone: 'M36';
  overallReadiness: PhaseReadinessScore;
  recommendation: PhaseRecommendation;
  options: NextPhaseOption[];
  executionTracks: PhaseExecutionTrack[];
  riskRegister: PhaseRiskRegisterItem[];
  productionBlockers: string[];
  safeNextSteps: string[];
};
