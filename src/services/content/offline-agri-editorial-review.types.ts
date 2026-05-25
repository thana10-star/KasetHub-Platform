export type ArticleReviewerRole =
  | 'content_editor'
  | 'agriculture_expert'
  | 'safety_reviewer'
  | 'image_reviewer';

export type ArticleReviewSignoff = {
  id: string;
  articleSlug: string;
  role: ArticleReviewerRole;
  reviewerNamePlaceholder: string;
  status: 'pending' | 'approved_future' | 'changes_requested_future';
  required: boolean;
  noteTh: string;
};

export type ArticleSourceMetadata = {
  id: string;
  articleSlug: string;
  sourceTitle: string;
  sourceType: 'local_observation' | 'soil_test' | 'expert_review' | 'internal_editorial_note' | 'future_reference';
  sourceOwnerOrganization: string;
  reviewedDate: string;
  freshnessStatus: 'placeholder' | 'needs_review' | 'reviewed_future';
  sourceConfidence: 'placeholder' | 'low' | 'medium' | 'high_future';
  citationPlaceholder: string;
  fieldApplicabilityNoteTh: string;
  required: boolean;
};

export type ArticleImageAssetReview = {
  id: string;
  articleSlug: string;
  assetKind: 'cover' | 'inline';
  plannedPath: string;
  altTextTh: string;
  aspectRatio: '16:9' | '4:3';
  maxSizeKbTarget: number;
  promptNoteTh: string;
  status: 'not_created' | 'planned_only' | 'reviewed_future';
  required: boolean;
};

export type ArticleFinalPublishBlocker =
  | 'signoff_pending'
  | 'source_metadata_placeholder'
  | 'image_review_pending'
  | 'final_human_review_missing'
  | 'safety_disclaimer_required'
  | 'second_pilot_draft_template_only'
  | 'no_official_publish_in_m69';

export type ArticleEditorialApprovalState = {
  articleSlug: string;
  titleTh: string;
  editorialStatus: 'draft_template' | 'reviewed_draft_candidate' | 'final_review_pending_future';
  isFinalOfficialArticle: false;
  finalPublishAllowed: false;
  signoffs: ArticleReviewSignoff[];
  sourceMetadata: ArticleSourceMetadata[];
  imageReviews: ArticleImageAssetReview[];
  safetyDisclaimersTh: string[];
  blockers: ArticleFinalPublishBlocker[];
  offlineFallbackArticleSlug?: string;
};

export type ArticleEditorialReviewSummary = {
  articleCount: number;
  pendingSignoffCount: number;
  sourcePlaceholderCount: number;
  imageReviewPendingCount: number;
  finalPublishAllowedCount: number;
  states: ArticleEditorialApprovalState[];
};
