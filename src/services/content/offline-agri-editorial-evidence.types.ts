import type {
  ArticleFinalPublishBlocker,
  ArticleReviewerRole,
} from '@/services/content/offline-agri-editorial-review.types';

export type ArticleEvidenceItemStatus =
  | 'missing'
  | 'placeholder'
  | 'pending_review'
  | 'completed_simulated';

export type ArticleReleaseBlocker =
  | ArticleFinalPublishBlocker
  | 'metadata_incomplete'
  | 'release_human_approval_missing'
  | 'release_reviewer_placeholder_required'
  | 'release_timestamp_placeholder_required'
  | 'release_note_placeholder_required'
  | 'automatic_publish_forbidden'
  | 'no_final_publish_in_m70';

export type ArticleEvidenceItem = {
  id: string;
  articleSlug: string;
  labelTh: string;
  status: ArticleEvidenceItemStatus;
  required: boolean;
  noteTh: string;
};

export type ArticleSourceEvidence = ArticleEvidenceItem & {
  sourceMetadataId: string;
  sourceType: string;
  citationPlaceholder: string;
  freshnessDatePlaceholder: string;
};

export type ArticleImageEvidence = ArticleEvidenceItem & {
  imageReviewId: string;
  plannedPath: string;
  altTextTh: string;
  maxSizeKbTarget: number;
};

export type ArticleReviewerEvidence = ArticleEvidenceItem & {
  signoffId: string;
  role: ArticleReviewerRole;
  reviewerNamePlaceholder: string;
};

export type ArticleHumanApprovalRequirement = {
  explicitHumanApprovalFlag: false;
  releaseReviewerPlaceholder: string;
  releaseTimestampPlaceholder: string;
  releaseNotePlaceholder: string;
  required: true;
  missingFields: Array<'approval_flag' | 'release_reviewer' | 'release_timestamp' | 'release_note'>;
};

export type ArticleReleaseGate = {
  articleSlug: string;
  finalPublishAllowed: false;
  automaticPublishAllowed: false;
  humanApprovalRequired: true;
  metadataCompletionMode: 'current_placeholders' | 'simulated_complete';
  releaseReviewerPlaceholder: string;
  releaseTimestampPlaceholder: string;
  releaseNotePlaceholder: string;
  blockers: ArticleReleaseBlocker[];
  approvalRequirement: ArticleHumanApprovalRequirement;
};

export type ArticleEvidencePacket = {
  articleSlug: string;
  titleTh: string;
  packetId: string;
  sourceEvidence: ArticleSourceEvidence[];
  imageEvidence: ArticleImageEvidence[];
  reviewerEvidence: ArticleReviewerEvidence[];
  safetyDisclaimerConfirmed: boolean;
  freshnessDatePlaceholder: string;
  escalationNoteTh: string;
  completedEvidenceCount: number;
  missingEvidenceCount: number;
  releaseGate: ArticleReleaseGate;
  finalPublishAllowed: false;
  isFinalOfficialArticle: false;
  noNetworkRequired: true;
  simulation: {
    metadataCompleted: boolean;
    reviewCompleted: boolean;
    stillBlockedByHumanRelease: true;
  };
};

export type ArticleEvidencePacketSummary = {
  packetCount: number;
  completedEvidenceCount: number;
  missingEvidenceCount: number;
  finalPublishAllowedCount: number;
  packets: ArticleEvidencePacket[];
  simulatedPacket: ArticleEvidencePacket;
};
