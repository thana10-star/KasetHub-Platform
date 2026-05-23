export type SupabaseReadinessArea =
  | 'env_readiness'
  | 'feature_flags'
  | 'sql_migration_draft'
  | 'rls_policy_draft'
  | 'schema_docs'
  | 'auth_boundary'
  | 'guest_sync_boundary'
  | 'storage_image_analysis'
  | 'ai_proxy_backend'
  | 'admin_role_planning'
  | 'crop_price_schema'
  | 'community_moderation_schema';

export type SupabaseReadinessStatus = 'pass' | 'warn' | 'block';

export type SupabaseReadinessLevel = 'not_ready' | 'staging_planning' | 'limited_staging_ready';

export type SupabaseReadinessItem = {
  id: string;
  area: SupabaseReadinessArea;
  title: string;
  detail: string;
  status: SupabaseReadinessStatus;
  evidence: string;
  nextAction?: string;
};

export type SupabaseReadinessAreaSummary = {
  area: SupabaseReadinessArea;
  label: string;
  total: number;
  passed: number;
  warnings: number;
  blockers: number;
  status: SupabaseReadinessStatus;
};

export type SupabaseReadinessAction = {
  id: string;
  priority: 'now' | 'next' | 'later';
  title: string;
  detail: string;
};

export type SupabaseProductionBlocker = {
  id: string;
  area: SupabaseReadinessArea;
  title: string;
  detail: string;
};

export type SupabaseReadinessAudit = {
  generatedAt: string;
  score: number;
  level: SupabaseReadinessLevel;
  levelLabel: string;
  notices: string[];
  items: SupabaseReadinessItem[];
  passedItems: SupabaseReadinessItem[];
  warningItems: SupabaseReadinessItem[];
  blockerItems: SupabaseReadinessItem[];
  areaSummaries: SupabaseReadinessAreaSummary[];
  recommendedNextActions: SupabaseReadinessAction[];
  productionBlockers: SupabaseProductionBlocker[];
};
