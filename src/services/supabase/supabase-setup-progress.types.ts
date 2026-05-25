export type SupabaseSetupProgressStepId =
  | 'projectCreated'
  | 'envAdded'
  | 'schemaSqlRun'
  | 'rlsSqlRun'
  | 'tablesVerified'
  | 'stagingVerified';

export type SupabaseSetupProgressState = Record<SupabaseSetupProgressStepId, boolean> & {
  updatedAt: string | null;
};

export type SupabaseSetupProgressPatch = Partial<Record<SupabaseSetupProgressStepId, boolean>>;

export type SupabaseSetupProgressStep = {
  id: SupabaseSetupProgressStepId;
  label: string;
  detail: string;
  blocker: string;
};

export type SupabaseSetupProgressSummary = {
  state: SupabaseSetupProgressState;
  steps: SupabaseSetupProgressStep[];
  completedCount: number;
  totalCount: number;
  completionPercent: number;
  completedStepIds: SupabaseSetupProgressStepId[];
  nextStep: SupabaseSetupProgressStep | null;
  blockers: string[];
  nextSafeStep: string;
  safetyNotes: string[];
};
