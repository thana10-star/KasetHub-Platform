import type {
  ArticleEditorialApprovalState,
  ArticleEditorialReviewSummary,
  ArticleFinalPublishBlocker,
  ArticleImageAssetReview,
  ArticleReviewSignoff,
  ArticleReviewerRole,
  ArticleSourceMetadata,
} from '@/services/content/offline-agri-editorial-review.types';
import { findOfflineAgriPilotArticleDraftBySlug, getOfflineAgriPilotArticleDrafts } from '@/services/content/offline-agri-pilot-article-drafts';

const reviewerRoleLabels: Record<ArticleReviewerRole, string> = {
  content_editor: 'บรรณาธิการเนื้อหา',
  agriculture_expert: 'ผู้เชี่ยวชาญเกษตร',
  safety_reviewer: 'ผู้ตรวจความปลอดภัย',
  image_reviewer: 'ผู้ตรวจภาพประกอบ',
};

const finalPublishBlockerLabels: Record<ArticleFinalPublishBlocker, string> = {
  signoff_pending: 'ยังมี sign-off รอผู้ตรวจจริง',
  source_metadata_placeholder: 'source metadata ยังเป็น placeholder',
  image_review_pending: 'ภาพยังไม่ผ่าน image review',
  final_human_review_missing: 'ยังไม่มี human review รอบสุดท้าย',
  safety_disclaimer_required: 'ต้องคงคำเตือนความปลอดภัยไว้',
  second_pilot_draft_template_only: 'pilot ที่สองยังเป็น draft template เท่านั้น',
  no_official_publish_in_m69: 'M69 ยังไม่อนุญาตให้ publish final',
};

const soilSafetyDisclaimers = [
  'ข้อมูลนี้เป็นความรู้เบื้องต้น',
  'ควรตรวจสอบกับหน่วยงานเกษตร/ผู้เชี่ยวชาญในพื้นที่',
  'ยังไม่ใช่บทความฉบับตรวจทานสุดท้าย',
];

const createPendingSignoffs = (articleSlug: string): ArticleReviewSignoff[] => [
  {
    id: `${articleSlug}-content-editor-signoff`,
    articleSlug,
    role: 'content_editor',
    reviewerNamePlaceholder: 'content editor pending',
    status: 'pending',
    required: true,
    noteTh: 'ตรวจภาษา โครงสร้าง และความชัดเจนสำหรับผู้อ่านสูงวัย',
  },
  {
    id: `${articleSlug}-agriculture-expert-signoff`,
    articleSlug,
    role: 'agriculture_expert',
    reviewerNamePlaceholder: 'agriculture expert pending',
    status: 'pending',
    required: true,
    noteTh: 'ยืนยันว่าเนื้อหาไม่กลายเป็นคำแนะนำเฉพาะแปลงหรือคำแนะนำทางวิชาการสุดท้าย',
  },
  {
    id: `${articleSlug}-safety-reviewer-signoff`,
    articleSlug,
    role: 'safety_reviewer',
    reviewerNamePlaceholder: 'safety reviewer pending',
    status: 'pending',
    required: true,
    noteTh: 'ตรวจคำเตือน ความไม่แน่นอน และการไม่ให้สูตรปุ๋ย/สารเคมี',
  },
  {
    id: `${articleSlug}-image-reviewer-signoff`,
    articleSlug,
    role: 'image_reviewer',
    reviewerNamePlaceholder: 'image reviewer pending',
    status: 'pending',
    required: true,
    noteTh: 'ตรวจภาพ planned asset, alt text, ขนาดไฟล์ และการไม่ใช้ภาพจาก CDN ภายนอก',
  },
];

const sourceMetadataByArticle: Record<string, ArticleSourceMetadata[]> = {
  'soil-types-before-planting': [
    {
      id: 'soil-types-source-local-observation-m69',
      articleSlug: 'soil-types-before-planting',
      sourceTitle: 'Local soil observation note',
      sourceType: 'local_observation',
      sourceOwnerOrganization: 'KasetHub editorial placeholder',
      reviewedDate: 'pending',
      freshnessStatus: 'placeholder',
      sourceConfidence: 'placeholder',
      citationPlaceholder: 'pending-local-observation-review',
      fieldApplicabilityNoteTh: 'ใช้เป็นหลักฐานประกอบการสังเกตทั่วไปเท่านั้น ไม่ใช่ผลตรวจดินทางการ',
      required: true,
    },
    {
      id: 'soil-types-source-soil-test-m69',
      articleSlug: 'soil-types-before-planting',
      sourceTitle: 'Soil test or lab confirmation placeholder',
      sourceType: 'soil_test',
      sourceOwnerOrganization: 'Local lab or agriculture office pending',
      reviewedDate: 'pending',
      freshnessStatus: 'placeholder',
      sourceConfidence: 'placeholder',
      citationPlaceholder: 'pending-soil-test-confirmation',
      fieldApplicabilityNoteTh: 'ต้องเติมแหล่งตรวจจริงก่อนกล่าวถึงดินเปรี้ยว ดินเค็ม หรือปัญหาเคมีของดิน',
      required: true,
    },
    {
      id: 'soil-types-source-expert-review-m69',
      articleSlug: 'soil-types-before-planting',
      sourceTitle: 'Local agriculture office review placeholder',
      sourceType: 'expert_review',
      sourceOwnerOrganization: 'Local agriculture office pending',
      reviewedDate: 'pending',
      freshnessStatus: 'placeholder',
      sourceConfidence: 'placeholder',
      citationPlaceholder: 'pending-local-expert-review',
      fieldApplicabilityNoteTh: 'ต้องตรวจว่าเนื้อหาไม่เหมาแทนคำแนะนำเฉพาะพื้นที่',
      required: true,
    },
  ],
  'soil-ph-reading-yourself': [
    {
      id: 'soil-ph-source-method-m69',
      articleSlug: 'soil-ph-reading-yourself',
      sourceTitle: 'Soil pH reading method placeholder',
      sourceType: 'future_reference',
      sourceOwnerOrganization: 'KasetHub editorial placeholder',
      reviewedDate: 'pending',
      freshnessStatus: 'placeholder',
      sourceConfidence: 'placeholder',
      citationPlaceholder: 'pending-ph-reading-source',
      fieldApplicabilityNoteTh: 'ต้องมีแหล่งอ้างอิงจริงก่อนเขียนวิธีอ่านค่า pH เป็นบทความเต็ม',
      required: true,
    },
  ],
};

const imageReviewsByArticle: Record<string, ArticleImageAssetReview[]> = {
  'soil-types-before-planting': [
    {
      id: 'soil-types-cover-review-m69',
      articleSlug: 'soil-types-before-planting',
      assetKind: 'cover',
      plannedPath: 'public/assets/articles/soil/soil-types-before-planting-cover.webp',
      altTextTh: 'ภาพตัวอย่างดินหลายชนิดสำหรับสังเกตก่อนปลูก',
      aspectRatio: '16:9',
      maxSizeKbTarget: 180,
      promptNoteTh: 'ภาพควรเป็นตัวอย่างพื้นผิวดินหลายชนิดแบบไม่ระบุสินค้า ไม่ใส่โลโก้ และไม่ทำให้เข้าใจว่าเป็นผลตรวจจริง',
      status: 'planned_only',
      required: true,
    },
    {
      id: 'soil-types-touch-test-review-m69',
      articleSlug: 'soil-types-before-planting',
      assetKind: 'inline',
      plannedPath: 'public/assets/articles/soil/soil-types-before-planting-touch-test.webp',
      altTextTh: 'มือกำลังสังเกตเนื้อดินอย่างง่าย',
      aspectRatio: '4:3',
      maxSizeKbTarget: 140,
      promptNoteTh: 'ภาพสาธิตการจับดินต้องปลอดภัย ไม่ใช้ข้อความยืนยันชนิดดินแบบเด็ดขาด',
      status: 'planned_only',
      required: true,
    },
  ],
  'soil-ph-reading-yourself': [
    {
      id: 'soil-ph-cover-review-m69',
      articleSlug: 'soil-ph-reading-yourself',
      assetKind: 'cover',
      plannedPath: 'public/assets/articles/soil/soil-ph-reading-yourself-cover.webp',
      altTextTh: 'ภาพตัวอย่างการอ่านค่า pH ดินแบบพื้นฐาน',
      aspectRatio: '16:9',
      maxSizeKbTarget: 180,
      promptNoteTh: 'ภาพต้องไม่แสดงยี่ห้อชุดทดสอบ ไม่แนะนำผลิตภัณฑ์ และไม่สรุปผล pH เป็นคำแนะนำปรับดิน',
      status: 'planned_only',
      required: true,
    },
  ],
};

function buildBlockers(articleSlug: string): ArticleFinalPublishBlocker[] {
  const draft = findOfflineAgriPilotArticleDraftBySlug(articleSlug);
  const blockers: ArticleFinalPublishBlocker[] = [
    'signoff_pending',
    'source_metadata_placeholder',
    'image_review_pending',
    'final_human_review_missing',
    'safety_disclaimer_required',
    'no_official_publish_in_m69',
  ];

  if (draft?.status === 'draft_template') {
    blockers.splice(1, 0, 'second_pilot_draft_template_only');
  }

  return blockers;
}

export function getArticleEditorialApprovalStates(): ArticleEditorialApprovalState[] {
  return getOfflineAgriPilotArticleDrafts().map((draft) => ({
    articleSlug: draft.slug,
    titleTh: draft.titleTh,
    editorialStatus: draft.status === 'draft_template' ? 'draft_template' : 'reviewed_draft_candidate',
    isFinalOfficialArticle: false,
    finalPublishAllowed: false,
    signoffs: createPendingSignoffs(draft.slug),
    sourceMetadata: sourceMetadataByArticle[draft.slug] ?? [],
    imageReviews: imageReviewsByArticle[draft.slug] ?? [],
    safetyDisclaimersTh: draft.review.safetyDisclaimersTh.length > 0 ? draft.review.safetyDisclaimersTh : soilSafetyDisclaimers,
    blockers: buildBlockers(draft.slug),
    offlineFallbackArticleSlug: draft.offlineFallbackArticleSlug,
  }));
}

export function getArticleEditorialApprovalStateBySlug(slug: string) {
  return getArticleEditorialApprovalStates().find((state) => state.articleSlug === slug);
}

export function getArticleEditorialReviewSummary(): ArticleEditorialReviewSummary {
  const states = getArticleEditorialApprovalStates();

  return {
    articleCount: states.length,
    pendingSignoffCount: states.flatMap((state) => state.signoffs).filter((signoff) => signoff.status === 'pending').length,
    sourcePlaceholderCount: states
      .flatMap((state) => state.sourceMetadata)
      .filter((source) => source.freshnessStatus === 'placeholder' || source.sourceConfidence === 'placeholder').length,
    imageReviewPendingCount: states.flatMap((state) => state.imageReviews).filter((image) => image.status !== 'reviewed_future').length,
    finalPublishAllowedCount: states.filter((state) => state.finalPublishAllowed).length,
    states,
  };
}

export function getArticleReviewerRoleLabel(role: ArticleReviewerRole) {
  return reviewerRoleLabels[role];
}

export function getArticleFinalPublishBlockerLabel(blocker: ArticleFinalPublishBlocker) {
  return finalPublishBlockerLabels[blocker];
}

export function validateArticleImageAssetReview(image: ArticleImageAssetReview) {
  const blockers: ArticleFinalPublishBlocker[] = [];

  if (!image.plannedPath || image.plannedPath.startsWith('http') || image.plannedPath.startsWith('//')) {
    blockers.push('image_review_pending');
  }

  if (!image.altTextTh || image.altTextTh.length < 6) {
    blockers.push('image_review_pending');
  }

  if (image.status !== 'reviewed_future') {
    blockers.push('image_review_pending');
  }

  return {
    validForFuturePublish: blockers.length === 0,
    blockers: Array.from(new Set(blockers)),
  };
}

export function canArticlePassFinalEditorialApproval(slug: string) {
  const state = getArticleEditorialApprovalStateBySlug(slug);

  if (!state) {
    return {
      canPublish: false,
      blockers: ['final_human_review_missing'] as ArticleFinalPublishBlocker[],
    };
  }

  return {
    canPublish: false,
    blockers: state.blockers,
  };
}
