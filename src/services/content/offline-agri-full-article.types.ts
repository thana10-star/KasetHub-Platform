import type { AppRoute } from '@/types/kaset';
import type {
  OfflineAgriArticleCategory,
  OfflineAgriArticleImageAspectRatio,
  OfflineAgriArticleSafetyNote,
} from '@/services/content/offline-agri-article.types';

export type FullArticleDraftStatus =
  | 'draft_template'
  | 'source_review_pending'
  | 'expert_review_pending'
  | 'ready_for_full_publish';

export type FullArticleSectionBlock =
  | 'intro'
  | 'key_points'
  | 'practical_steps'
  | 'calculation_tool_links'
  | 'common_mistakes'
  | 'safety_warnings'
  | 'local_context_notes'
  | 'when_to_ask_expert'
  | 'summary'
  | 'related_app_actions';

export type FullArticleSourceStatus = 'placeholder_empty' | 'filled_future';

export type FullArticleSourceType =
  | 'extension_office'
  | 'soil_test'
  | 'label'
  | 'price_source'
  | 'official_program'
  | 'farmer_record'
  | 'expert_review';

export type FullArticleReviewerRole = 'editor' | 'agronomist' | 'finance_reviewer' | 'local_expert';

export type FullArticleRiskType =
  | 'fertilizer_chemical'
  | 'finance_government'
  | 'yield_profit'
  | 'crop_health'
  | 'local_conditions';

export type FullArticleSectionTemplate = {
  id: string;
  block: FullArticleSectionBlock;
  headingTh: string;
  purposeTh: string;
  outlineBulletsTh: string[];
  required: boolean;
  sourcePlaceholderIds: string[];
  relatedRoute?: AppRoute;
};

export type FullArticleSourcePlaceholder = {
  id: string;
  labelTh: string;
  required: boolean;
  status: FullArticleSourceStatus;
  sourceType: FullArticleSourceType;
  noteTh: string;
};

export type FullArticleReviewRequirement = {
  id: string;
  labelTh: string;
  required: boolean;
  status: 'missing' | 'placeholder_ready' | 'filled_future';
  reviewerRole: FullArticleReviewerRole;
  noteTh: string;
};

export type FullArticleExpertEscalationNote = {
  id: string;
  riskType: FullArticleRiskType;
  required: boolean;
  noteTh: string;
};

export type FullArticleImageRequirement = {
  id: string;
  labelTh: string;
  required: boolean;
  plannedPath: string;
  aspectRatio: OfflineAgriArticleImageAspectRatio;
  altTextTh: string;
  sizeLimitKb: number;
  status: 'planned_only' | 'ready_future';
};

export type FullArticleBodyTemplate = {
  id: string;
  pilotSlug: string;
  sourceArticleSlug: string;
  titleTh: string;
  category: OfflineAgriArticleCategory;
  draftStatus: FullArticleDraftStatus;
  futureCmsKey: string;
  outlineToFullBodyMapping: Array<{
    outlineHeadingTh: string;
    targetBlock: FullArticleSectionBlock;
  }>;
  sections: FullArticleSectionTemplate[];
  sourcePlaceholders: FullArticleSourcePlaceholder[];
  reviewRequirements: FullArticleReviewRequirement[];
  expertEscalationNotes: FullArticleExpertEscalationNote[];
  imageRequirements: FullArticleImageRequirement[];
  relatedCalculatorRoutes: AppRoute[];
  relatedAppRoutes: AppRoute[];
  safetyNoteTypes: Array<OfflineAgriArticleSafetyNote['type']>;
  freshnessRequired: boolean;
  freshnessDatePlaceholder?: string;
  lastReviewedDatePlaceholder: string;
  offlineFallbackArticleSlug: string;
};

export type FullArticlePublishReadinessGate = {
  templateId: string;
  pilotSlug: string;
  titleTh: string;
  draftStatus: FullArticleDraftStatus;
  canMarkReadyForFullPublish: boolean;
  status: 'blocked' | 'ready_future';
  blockers: string[];
  warnings: string[];
  passedChecks: string[];
  fallbackAvailable: boolean;
  sourcePlaceholderCount: number;
  filledSourceCount: number;
  imageRequirementCount: number;
  expertEscalationCount: number;
};

export type FullArticleReadinessSummary = {
  pilotCount: number;
  blockedCount: number;
  readyFutureCount: number;
  gates: FullArticlePublishReadinessGate[];
  pilotTemplates: FullArticleBodyTemplate[];
  noNetworkRequired: true;
  noOfficialFullArticlePublished: true;
};
