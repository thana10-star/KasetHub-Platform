export type PlantMediaBucketName = 'plant-analysis-temp' | 'plant-analysis-saved' | 'expert-review-attachments';

export type PlantMediaModerationStatus =
  | 'not_started'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_review'
  | 'deleted';

export type PlantMediaAccessPolicy = {
  visibility: 'private';
  ownerScoped: true;
  signedUrlsRequired: true;
  signedUrlTtlSeconds: number;
  canPublicRead: false;
  consentRequired: true;
  notes: string[];
};

export type PlantMediaDeletionRequest = {
  id: string;
  mediaObjectId: string;
  ownerUserId?: string;
  guestSessionId?: string;
  reason: 'user_requested' | 'retention_expired' | 'moderation_rejected' | 'admin_policy';
  status: 'requested' | 'scheduled' | 'completed' | 'rejected';
  requestedAt: string;
  completedAt?: string;
  metadata: Record<string, unknown>;
};

export type PlantMediaObject = {
  id: string;
  ownerUserId?: string;
  guestSessionId?: string;
  bucketName: PlantMediaBucketName;
  objectPath: string;
  signedUrlExpiresAt?: string;
  thumbnailPath?: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  checksum?: string;
  moderationStatus: PlantMediaModerationStatus;
  deletionRequestedAt?: string;
  linkedFarmRecordId?: string;
  linkedSavedItemId?: string;
  analysisJobId?: string;
  accessPolicy: PlantMediaAccessPolicy;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
};

export type LocalPlantImageMetadata = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  checksum?: string;
  ownerUserId?: string;
  guestSessionId?: string;
  sourceRoute?: string;
};

export type PlantImageAnalysisStoragePlan = {
  proposedBucket: PlantMediaBucketName;
  proposedObjectPath: string;
  proposedThumbnailPath: string;
  privacyPolicy: PlantMediaAccessPolicy;
  signedUrlPolicy: {
    issueOnlyFromBackend: true;
    defaultTtlSeconds: number;
    maxTtlSeconds: number;
    userCanSharePublicly: false;
  };
  moderationRequirement: {
    required: true;
    initialStatus: PlantMediaModerationStatus;
    checks: string[];
  };
  deletionPolicy: {
    userDeletionRequired: true;
    tempRetentionHours: number;
    savedRetention: 'until_user_deletes_or_policy_requires';
    cascadeTargets: string[];
  };
  warnings: string[];
  previewMediaObject: PlantMediaObject;
};
