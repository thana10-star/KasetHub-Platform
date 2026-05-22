export type ImageUploadState = 'idle' | 'selecting' | 'preview' | 'analyzing' | 'complete' | 'failed';

export type PlantImageModerationStatus = 'not_started' | 'pending_future' | 'approved_mock' | 'rejected_mock';

export type PlantAnalysisWarningCode =
  | 'unsupported_file'
  | 'file_too_large'
  | 'image_blurry'
  | 'no_plant_detected'
  | 'low_confidence'
  | 'local_only';

export type PlantAnalysisWarning = {
  code: PlantAnalysisWarningCode;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
};

export type PlantAnalysisSafetyNotice = {
  title: string;
  message: string;
  severity: 'info' | 'warning';
};

export type PlantAnalysisConfidence = {
  score: number;
  level: 'สูง' | 'ปานกลาง' | 'ต่ำ';
  label: string;
};

export type PlantAnalysisImage = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  previewUrl: string;
  selectedAt: string;
  backendUploadId?: string;
  moderationStatus: PlantImageModerationStatus;
  deletionRequested: boolean;
};

export type PlantAnalysisResult = {
  id: string;
  cropName: string;
  diseaseName: string;
  confidence: PlantAnalysisConfidence;
  symptoms: string[];
  causes: string[];
  treatmentSuggestions: string[];
  warnings: PlantAnalysisWarning[];
  safetyNotice: PlantAnalysisSafetyNotice;
  severe: boolean;
  estimatedCreditCost: number;
  analyzedAt: string;
};

export type PlantAnalysisSession = {
  id: string;
  status: ImageUploadState;
  images: PlantAnalysisImage[];
  result?: PlantAnalysisResult;
  warnings: PlantAnalysisWarning[];
  createdAt: string;
  updatedAt: string;
  backendUploadId?: string;
  moderationStatus: PlantImageModerationStatus;
  deletionRequested: boolean;
};

export type ImageValidationResult = {
  valid: boolean;
  warnings: PlantAnalysisWarning[];
};
