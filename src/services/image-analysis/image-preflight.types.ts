export type ImagePreflightIssueSeverity = 'pass' | 'info' | 'warning' | 'error';

export type ImagePreflightIssueCode =
  | 'supported_file'
  | 'unsupported_file'
  | 'file_size_ok'
  | 'file_very_large'
  | 'file_too_large'
  | 'dimensions_ok'
  | 'too_small'
  | 'very_large_dimensions'
  | 'dimension_read_failed'
  | 'possible_blurry_placeholder'
  | 'local_only';

export type ImagePreflightIssue = {
  code: ImagePreflightIssueCode;
  severity: ImagePreflightIssueSeverity;
  title: string;
  message: string;
};

export type PlantPhotoChecklistItem = {
  id: string;
  label: string;
  tip: string;
  status: 'not_checked';
};

export type ImagePreflightReadinessLevel = 'ready' | 'usable_with_warnings' | 'retake_recommended' | 'blocked';

export type ImagePreflightResult = {
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  width?: number;
  height?: number;
  readinessScore: number;
  readinessLevel: ImagePreflightReadinessLevel;
  readinessLabel: string;
  canAnalyzeMock: boolean;
  issues: ImagePreflightIssue[];
  checklist: PlantPhotoChecklistItem[];
  privacyNotice: string;
  createdAt: string;
};
