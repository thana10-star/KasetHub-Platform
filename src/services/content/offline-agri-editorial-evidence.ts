import type {
  ArticleEvidenceItemStatus,
  ArticleEvidencePacket,
  ArticleEvidencePacketSummary,
  ArticleHumanApprovalRequirement,
  ArticleReleaseBlocker,
  ArticleReleaseGate,
} from '@/services/content/offline-agri-editorial-evidence.types';
import {
  getArticleEditorialApprovalStateBySlug,
  getArticleEditorialApprovalStates,
  getArticleFinalPublishBlockerLabel,
  getArticleReviewerRoleLabel,
} from '@/services/content/offline-agri-editorial-review';

const humanApprovalRequirement: ArticleHumanApprovalRequirement = {
  explicitHumanApprovalFlag: false,
  releaseReviewerPlaceholder: 'release reviewer pending',
  releaseTimestampPlaceholder: 'release timestamp pending',
  releaseNotePlaceholder: 'release note pending',
  required: true,
  missingFields: ['approval_flag', 'release_reviewer', 'release_timestamp', 'release_note'],
};

const releaseBlockerLabels: Record<ArticleReleaseBlocker, string> = {
  signoff_pending: getArticleFinalPublishBlockerLabel('signoff_pending'),
  source_metadata_placeholder: getArticleFinalPublishBlockerLabel('source_metadata_placeholder'),
  image_review_pending: getArticleFinalPublishBlockerLabel('image_review_pending'),
  final_human_review_missing: getArticleFinalPublishBlockerLabel('final_human_review_missing'),
  safety_disclaimer_required: getArticleFinalPublishBlockerLabel('safety_disclaimer_required'),
  second_pilot_draft_template_only: getArticleFinalPublishBlockerLabel('second_pilot_draft_template_only'),
  no_official_publish_in_m69: getArticleFinalPublishBlockerLabel('no_official_publish_in_m69'),
  metadata_incomplete: 'evidence metadata ยังไม่ครบ',
  release_human_approval_missing: 'ยังไม่มี explicit human approval',
  release_reviewer_placeholder_required: 'ต้องมี release reviewer',
  release_timestamp_placeholder_required: 'ต้องมี release timestamp',
  release_note_placeholder_required: 'ต้องมี release note',
  automatic_publish_forbidden: 'ห้าม publish อัตโนมัติจาก metadata',
  no_final_publish_in_m70: 'M70 ยังไม่อนุญาต final publish',
};

function mapEvidenceStatus(isSimulatedComplete: boolean, currentStatus: string): ArticleEvidenceItemStatus {
  if (isSimulatedComplete) {
    return 'completed_simulated';
  }

  if (currentStatus.includes('pending')) {
    return 'pending_review';
  }

  if (currentStatus.includes('placeholder') || currentStatus.includes('planned')) {
    return 'placeholder';
  }

  return 'missing';
}

function buildReleaseGate(articleSlug: string, isSimulatedComplete: boolean): ArticleReleaseGate {
  const blockers: ArticleReleaseBlocker[] = [
    'release_human_approval_missing',
    'release_reviewer_placeholder_required',
    'release_timestamp_placeholder_required',
    'release_note_placeholder_required',
    'automatic_publish_forbidden',
    'no_final_publish_in_m70',
  ];

  if (!isSimulatedComplete) {
    blockers.unshift('metadata_incomplete', 'signoff_pending', 'source_metadata_placeholder', 'image_review_pending');
  }

  return {
    articleSlug,
    finalPublishAllowed: false,
    automaticPublishAllowed: false,
    humanApprovalRequired: true,
    metadataCompletionMode: isSimulatedComplete ? 'simulated_complete' : 'current_placeholders',
    releaseReviewerPlaceholder: humanApprovalRequirement.releaseReviewerPlaceholder,
    releaseTimestampPlaceholder: humanApprovalRequirement.releaseTimestampPlaceholder,
    releaseNotePlaceholder: humanApprovalRequirement.releaseNotePlaceholder,
    blockers: Array.from(new Set(blockers)),
    approvalRequirement: humanApprovalRequirement,
  };
}

export function buildArticleEvidencePacket(articleSlug = 'soil-types-before-planting', isSimulatedComplete = false): ArticleEvidencePacket {
  const state = getArticleEditorialApprovalStateBySlug(articleSlug);

  if (!state) {
    throw new Error(`Unknown article evidence packet slug: ${articleSlug}`);
  }

  const sourceEvidence = state.sourceMetadata.map((source) => ({
    id: `${source.id}-evidence`,
    articleSlug,
    labelTh: source.sourceTitle,
    status: mapEvidenceStatus(isSimulatedComplete, `${source.freshnessStatus}-${source.sourceConfidence}`),
    required: source.required,
    noteTh: source.fieldApplicabilityNoteTh,
    sourceMetadataId: source.id,
    sourceType: source.sourceType,
    citationPlaceholder: isSimulatedComplete ? 'simulated-citation-still-needs-release' : source.citationPlaceholder,
    freshnessDatePlaceholder: isSimulatedComplete ? 'simulated-reviewed-date-not-release-date' : source.reviewedDate,
  }));

  const imageEvidence = state.imageReviews.map((image) => ({
    id: `${image.id}-evidence`,
    articleSlug,
    labelTh: image.assetKind === 'cover' ? 'cover image evidence' : 'inline image evidence',
    status: mapEvidenceStatus(isSimulatedComplete, image.status),
    required: image.required,
    noteTh: image.promptNoteTh,
    imageReviewId: image.id,
    plannedPath: image.plannedPath,
    altTextTh: image.altTextTh,
    maxSizeKbTarget: image.maxSizeKbTarget,
  }));

  const reviewerEvidence = state.signoffs.map((signoff) => ({
    id: `${signoff.id}-evidence`,
    articleSlug,
    labelTh: getArticleReviewerRoleLabel(signoff.role),
    status: mapEvidenceStatus(isSimulatedComplete, signoff.status),
    required: signoff.required,
    noteTh: signoff.noteTh,
    signoffId: signoff.id,
    role: signoff.role,
    reviewerNamePlaceholder: isSimulatedComplete ? `${signoff.role} simulated complete` : signoff.reviewerNamePlaceholder,
  }));

  const evidenceItems = [...sourceEvidence, ...imageEvidence, ...reviewerEvidence];
  const completedEvidenceCount = evidenceItems.filter((item) => item.status === 'completed_simulated').length;
  const missingEvidenceCount = evidenceItems.length - completedEvidenceCount;

  return {
    articleSlug,
    titleTh: state.titleTh,
    packetId: `${articleSlug}-m70-evidence-packet`,
    sourceEvidence,
    imageEvidence,
    reviewerEvidence,
    safetyDisclaimerConfirmed: state.safetyDisclaimersTh.length > 0,
    freshnessDatePlaceholder: isSimulatedComplete ? 'simulated-freshness-date-still-needs-release' : 'freshness date pending',
    escalationNoteTh: 'ต้องถามหน่วยงานเกษตร/ผู้เชี่ยวชาญในพื้นที่ก่อนใช้เป็นคำแนะนำจริง',
    completedEvidenceCount,
    missingEvidenceCount,
    releaseGate: buildReleaseGate(articleSlug, isSimulatedComplete),
    finalPublishAllowed: false,
    isFinalOfficialArticle: false,
    noNetworkRequired: true,
    simulation: {
      metadataCompleted: isSimulatedComplete,
      reviewCompleted: isSimulatedComplete,
      stillBlockedByHumanRelease: true,
    },
  };
}

export function buildSimulatedCompleteArticleEvidencePacket(articleSlug = 'soil-types-before-planting') {
  return buildArticleEvidencePacket(articleSlug, true);
}

export function getArticleEvidencePacketSummary(): ArticleEvidencePacketSummary {
  const packets = getArticleEditorialApprovalStates().map((state) => buildArticleEvidencePacket(state.articleSlug));
  const simulatedPacket = buildSimulatedCompleteArticleEvidencePacket('soil-types-before-planting');

  return {
    packetCount: packets.length,
    completedEvidenceCount: packets.reduce((total, packet) => total + packet.completedEvidenceCount, 0),
    missingEvidenceCount: packets.reduce((total, packet) => total + packet.missingEvidenceCount, 0),
    finalPublishAllowedCount: packets.filter((packet) => packet.finalPublishAllowed).length,
    packets,
    simulatedPacket,
  };
}

export function getArticleReleaseBlockerLabel(blocker: ArticleReleaseBlocker) {
  return releaseBlockerLabels[blocker];
}

export function canReleaseArticleFromEvidencePacket(packet: ArticleEvidencePacket) {
  return {
    canRelease: false,
    finalPublishAllowed: false,
    humanApprovalRequired: true,
    blockers: packet.releaseGate.blockers,
  };
}
