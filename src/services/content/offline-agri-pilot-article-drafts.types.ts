import type { AppRoute } from '@/types/kaset';
import type { OfflineAgriArticleImageAspectRatio } from '@/services/content/offline-agri-article.types';

export type PilotArticleDraftStatus = 'reviewed_draft_candidate' | 'final_review_pending' | 'ready_for_publish_future';

export type PilotArticleDraftSectionKind =
  | 'intro'
  | 'comparison_table'
  | 'observe_by_touch_water'
  | 'broad_use_cases'
  | 'basic_improvement_ideas'
  | 'mistakes_to_avoid'
  | 'ask_expert'
  | 'related_tools'
  | 'summary';

export type PilotArticleDraftSourcePlaceholder = {
  id: string;
  labelTh: string;
  status: 'placeholder_only' | 'reviewed_future';
  required: boolean;
  noteTh: string;
};

export type PilotArticleDraftImageRequirement = {
  id: string;
  labelTh: string;
  plannedPath: string;
  aspectRatio: OfflineAgriArticleImageAspectRatio;
  altTextTh: string;
  status: 'planned_only' | 'reviewed_future';
  required: boolean;
};

export type PilotArticleDraftSection = {
  id: string;
  kind: PilotArticleDraftSectionKind;
  headingTh: string;
  bodyTh: string[];
  bulletsTh?: string[];
  relatedRoute?: AppRoute;
};

export type PilotArticleDraftComparisonRow = {
  soilTypeTh: string;
  easyObservationTh: string;
  waterBehaviorTh: string;
  broadUseCaseTh: string;
  cautiousImprovementIdeaTh: string;
};

export type PilotArticleDraftReviewMetadata = {
  editorialStatus: PilotArticleDraftStatus;
  reviewerPlaceholder: string;
  lastReviewedPlaceholder: string;
  sourcePlaceholders: PilotArticleDraftSourcePlaceholder[];
  imageRequirements: PilotArticleDraftImageRequirement[];
  safetyDisclaimersTh: string[];
  publishBlockers: string[];
  reviewChecklistTh: string[];
};

export type OfflineAgriPilotArticleDraft = {
  id: string;
  slug: string;
  titleTh: string;
  reasonTh: string;
  status: PilotArticleDraftStatus;
  summaryTh: string;
  sections: PilotArticleDraftSection[];
  comparisonRows: PilotArticleDraftComparisonRow[];
  relatedRoutes: AppRoute[];
  review: PilotArticleDraftReviewMetadata;
  isFinalOfficialArticle: false;
  fullPublishAllowed: false;
  noNetworkRequired: true;
};

export type PilotArticleDraftWorkflowSummary = {
  pilotCount: number;
  finalPublishAllowedCount: number;
  blockedCount: number;
  drafts: OfflineAgriPilotArticleDraft[];
  noNetworkRequired: true;
};
