export type SupabaseStagingChecklistCategory =
  | 'project_creation'
  | 'sql_execution'
  | 'post_sql_verification'
  | 'safety_blocker';

export type SupabaseStagingChecklistItem = {
  id: string;
  category: SupabaseStagingChecklistCategory;
  title: string;
  detail: string;
  evidence?: string;
};

export type SupabaseStagingProjectChecklist = {
  milestone: 'M40';
  recommendedProjectName: string;
  regionGuidance: string;
  schemaSqlPath: string;
  rlsSqlPath: string;
  projectCreationChecklist: SupabaseStagingChecklistItem[];
  sqlExecutionChecklist: SupabaseStagingChecklistItem[];
  postSqlVerificationChecklist: SupabaseStagingChecklistItem[];
  blockers: SupabaseStagingChecklistItem[];
  notices: string[];
  docLinks: Array<{
    label: string;
    path: string;
  }>;
};

