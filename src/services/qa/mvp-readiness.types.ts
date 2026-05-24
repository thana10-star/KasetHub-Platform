import type { AppRoute } from '@/types/kaset';

export type MvpRouteGroupId =
  | 'core_app'
  | 'agriculture_calculators'
  | 'content_youtube'
  | 'ai_plant_analysis'
  | 'prices_crop_watch'
  | 'community_moderation'
  | 'auth_account_sync'
  | 'supabase_staging'
  | 'admin_qa';

export type MvpReadinessStatus =
  | 'ready_mock'
  | 'needs_backend'
  | 'needs_real_api'
  | 'blocked'
  | 'documentation_only';

export type MvpRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type MvpRouteItem = {
  route: string;
  label: string;
  milestone: string;
  notes: string;
  manualCheckPath?: AppRoute | string;
};

export type MvpRouteGroup = {
  id: MvpRouteGroupId;
  label: string;
  description: string;
  routes: MvpRouteItem[];
};

export type MvpModuleReadiness = {
  id: MvpRouteGroupId;
  name: string;
  status: MvpReadinessStatus;
  riskLevel: MvpRiskLevel;
  summary: string;
  currentStorageMode: string;
  mockBoundaries: string[];
  nextAction: string;
  routes: string[];
};

export type MvpStorageReadinessItem = {
  label: string;
  status: MvpReadinessStatus;
  detail: string;
};

export type MvpNextPhaseOption = {
  id: string;
  label: string;
  description: string;
  risk: MvpRiskLevel;
};

export type MvpReadinessAudit = {
  generatedAt: string;
  overallStatus: 'internal_mvp_ready' | 'prototype_only' | 'production_blocked';
  overallLabel: string;
  routeCount: number;
  routeGroups: MvpRouteGroup[];
  modules: MvpModuleReadiness[];
  statusCounts: Record<MvpReadinessStatus, number>;
  highRiskCount: number;
  storageMode: string;
  storageReadiness: MvpStorageReadinessItem[];
  productionBlockers: string[];
  nextRecommendedMilestones: string[];
  nextPhaseOptions: MvpNextPhaseOption[];
  qaChecklist: string[];
};
