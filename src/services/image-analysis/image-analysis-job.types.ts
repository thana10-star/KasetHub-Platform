import type { AIRequestPlan } from '@/services/ai/ai-request.types';
import type { PlantImageAnalysisStoragePlan, PlantMediaObject } from '@/services/storage/storage.types';

export type PlantImageAnalysisJobStatus =
  | 'pending_upload'
  | 'uploaded'
  | 'moderation_pending'
  | 'ready_for_ai'
  | 'ai_processing'
  | 'completed'
  | 'failed'
  | 'deletion_requested';

export type PlantImageAnalysisJobResult = {
  diseaseName?: string;
  confidence?: number;
  symptoms: string[];
  causes: string[];
  treatmentSuggestions: string[];
  safetyDisclaimers: string[];
  linkedFarmRecordId?: string;
  linkedSavedItemId?: string;
  completedAt?: string;
  metadata: Record<string, unknown>;
};

export type PlantImageAnalysisJob = {
  id: string;
  status: PlantImageAnalysisJobStatus;
  ownerUserId?: string;
  guestSessionId?: string;
  mediaObjectId?: string;
  mediaObject?: PlantMediaObject;
  requestPlan: AIRequestPlan;
  creditCost: number;
  creditReserved: boolean;
  moderationStatus: PlantMediaObject['moderationStatus'];
  result?: PlantImageAnalysisJobResult;
  errorCode?: string;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
};

export type PlantImageAnalysisJobLifecyclePreview = {
  job: PlantImageAnalysisJob;
  lifecycle: Array<{
    status: PlantImageAnalysisJobStatus;
    title: string;
    description: string;
    backendOwned: boolean;
  }>;
  requiredBackendSteps: string[];
  failureRollbackNotes: string[];
  storagePlan: PlantImageAnalysisStoragePlan;
};

export type PlantImageAnalysisJobPlannerInput = {
  uploadPlan: PlantImageAnalysisStoragePlan;
  aiRequestPlan: AIRequestPlan;
  creditCost: number;
  userSession: {
    mode: 'guest' | 'authenticated' | 'unknown';
    ownerUserId?: string;
    guestSessionId?: string;
    canUpload: boolean;
  };
};
