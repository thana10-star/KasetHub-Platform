export type SupabaseSqlDraftCategory =
  | 'core_identity'
  | 'guest_memory'
  | 'ai'
  | 'content'
  | 'community'
  | 'crop_prices'
  | 'plant_analysis'
  | 'auth_sync'
  | 'admin_future';

export type SupabaseSqlExpectedArtifact = {
  name: string;
  category: SupabaseSqlDraftCategory;
  note: string;
};

export type SupabaseSqlDraftValidationResult = {
  executionOrder: string[];
  expectedTables: SupabaseSqlExpectedArtifact[];
  expectedPolicies: SupabaseSqlExpectedArtifact[];
  expectedIndexes: SupabaseSqlExpectedArtifact[];
  expectedTriggers: SupabaseSqlExpectedArtifact[];
  manualVerificationChecklist: string[];
  missingDraftNotes: string[];
  stagingExecutionWarnings: string[];
  productionBlockers: string[];
};
