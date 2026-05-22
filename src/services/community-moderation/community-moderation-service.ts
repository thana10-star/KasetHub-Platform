import {
  communityReportReasonLabels,
  moderationActionLabels,
  moderationStatusLabels,
} from '@/services/community-moderation/community-moderation-fixtures';
import type {
  CommunityModerationState,
  CommunityReport,
  CommunityReportReason,
  HiddenContentRecord,
  ModerationAction,
  ModerationStatus,
  ModeratorQueueItem,
  ReportPostInput,
} from '@/services/community-moderation/community-moderation.types';

const communityModerationStorageKey = 'kasethub.communityModeration.v1';
const communityModerationChangedEvent = 'kasethub:community-moderation-changed';
const currentVersion = 1;

export const communityModerationLocalOnlyNotice =
  'รายงานนี้ยังเป็นข้อมูลในเครื่องเท่านั้น ยังไม่มีผู้ดูแลระบบจริงในเวอร์ชันนี้ และไม่มีการส่งข้อมูลไป backend';

function now() {
  return new Date().toISOString();
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function createDefaultState(): CommunityModerationState {
  return {
    version: currentVersion,
    reports: [],
    hiddenPosts: [],
    migrations: [],
    updatedAt: now(),
  };
}

function safeParseJson<T>(rawValue: string | null): T | undefined {
  if (!rawValue) {
    return undefined;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return undefined;
  }
}

function isReportReason(reason: unknown): reason is CommunityReportReason {
  return typeof reason === 'string' && reason in communityReportReasonLabels;
}

function isModerationStatus(status: unknown): status is ModerationStatus {
  return typeof status === 'string' && status in moderationStatusLabels;
}

function normalizeRecordMetadata(metadata: unknown): Record<string, unknown> {
  return metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? (metadata as Record<string, unknown>) : {};
}

function normalizeReport(input: Partial<CommunityReport>): CommunityReport | undefined {
  if (!input.postId || !isReportReason(input.reason)) {
    return undefined;
  }

  const timestamp = now();

  return {
    id: input.id || `community-report:${input.postId}:${timestamp}`,
    postId: input.postId,
    reason: input.reason,
    note: typeof input.note === 'string' ? input.note : '',
    status: isModerationStatus(input.status) ? input.status : 'pending_review',
    createdAt: input.createdAt || timestamp,
    updatedAt: input.updatedAt || timestamp,
    sourceRoute: input.sourceRoute || '/app/community',
    metadata: normalizeRecordMetadata(input.metadata),
  };
}

function normalizeHiddenPost(input: Partial<HiddenContentRecord>): HiddenContentRecord | undefined {
  if (!input.postId) {
    return undefined;
  }

  const reason = input.reason === 'user_hidden' || isReportReason(input.reason) ? input.reason : 'user_hidden';
  const timestamp = now();

  return {
    id: input.id || `hidden-content:${input.postId}`,
    postId: input.postId,
    hiddenAt: input.hiddenAt || timestamp,
    reason,
    note: typeof input.note === 'string' ? input.note : '',
    sourceRoute: input.sourceRoute || '/app/community',
    metadata: normalizeRecordMetadata(input.metadata),
  };
}

export function migrateCommunityModerationState(input: unknown): CommunityModerationState {
  const fallback = createDefaultState();

  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const partial = input as Partial<CommunityModerationState>;
  const reports = Array.isArray(partial.reports)
    ? partial.reports
        .map((report) => normalizeReport(report))
        .filter((report): report is CommunityReport => Boolean(report))
    : [];
  const hiddenPosts = Array.isArray(partial.hiddenPosts)
    ? partial.hiddenPosts
        .map((hiddenPost) => normalizeHiddenPost(hiddenPost))
        .filter((hiddenPost): hiddenPost is HiddenContentRecord => Boolean(hiddenPost))
    : [];

  return {
    version: currentVersion,
    reports,
    hiddenPosts,
    migrations: Array.isArray(partial.migrations) ? partial.migrations : [],
    updatedAt: partial.updatedAt || now(),
  };
}

function getStoredState() {
  if (!canUseStorage()) {
    return createDefaultState();
  }

  return migrateCommunityModerationState(
    safeParseJson<CommunityModerationState>(window.localStorage.getItem(communityModerationStorageKey)),
  );
}

function notifyCommunityModerationChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(communityModerationChangedEvent));
  }
}

function persistState(state: CommunityModerationState) {
  const nextState = {
    ...state,
    updatedAt: now(),
  };

  if (!canUseStorage()) {
    return nextState;
  }

  try {
    window.localStorage.setItem(communityModerationStorageKey, JSON.stringify(nextState));
    notifyCommunityModerationChanged();
    return nextState;
  } catch {
    return state;
  }
}

export function getCommunityModerationState() {
  return getStoredState();
}

export function reportPost(postId: string, reason: CommunityReportReason, note = '') {
  return reportCommunityPost({
    postId,
    reason,
    note,
  });
}

export function reportCommunityPost(input: ReportPostInput) {
  const state = getStoredState();
  const timestamp = now();
  const report: CommunityReport = {
    id: `community-report:${input.postId}:${Date.now()}`,
    postId: input.postId,
    reason: input.reason,
    note: input.note?.trim() || '',
    status: 'pending_review',
    createdAt: timestamp,
    updatedAt: timestamp,
    sourceRoute: input.sourceRoute || '/app/community',
    metadata: input.metadata || {},
  };

  return persistState({
    ...state,
    reports: [report, ...state.reports],
  });
}

export function hidePost(postId: string, reason: CommunityReportReason | 'user_hidden' = 'user_hidden', note = '') {
  const state = getStoredState();
  const timestamp = now();
  const hiddenPost: HiddenContentRecord = {
    id: `hidden-content:${postId}`,
    postId,
    hiddenAt: timestamp,
    reason,
    note,
    sourceRoute: '/app/community',
    metadata: {},
  };

  return persistState({
    ...state,
    hiddenPosts: [hiddenPost, ...state.hiddenPosts.filter((item) => item.postId !== postId)],
  });
}

export function unhidePost(postId: string) {
  const state = getStoredState();

  return persistState({
    ...state,
    hiddenPosts: state.hiddenPosts.filter((item) => item.postId !== postId),
  });
}

export function isPostHidden(postId: string) {
  return getStoredState().hiddenPosts.some((item) => item.postId === postId);
}

export function getReports() {
  return getStoredState().reports;
}

export function getHiddenPosts() {
  return getStoredState().hiddenPosts;
}

export function clearLocalModerationDemo() {
  const nextState = createDefaultState();

  if (!canUseStorage()) {
    return nextState;
  }

  try {
    window.localStorage.removeItem(communityModerationStorageKey);
    notifyCommunityModerationChanged();
  } catch {
    return getStoredState();
  }

  return nextState;
}

export function createLocalModeratorQueueItems(reports: CommunityReport[]): ModeratorQueueItem[] {
  return reports.map((report) => {
    const recommendedAction: ModerationAction =
      report.reason === 'chemical_or_pesticide_risk' || report.reason === 'dangerous_advice'
        ? 'show_warning'
        : 'future_admin_review';

    return {
      id: `queue:${report.id}`,
      postId: report.postId,
      title: `รายงานจากเครื่องนี้: ${communityReportReasonLabels[report.reason]}`,
      excerpt: report.note || 'ไม่มีบันทึกเพิ่มเติม',
      reason: report.reason,
      status: report.status,
      recommendedAction,
      createdAt: report.createdAt,
      source: 'local_report',
      notes: moderationActionLabels[recommendedAction],
    };
  });
}

export function subscribeCommunityModeration(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === communityModerationStorageKey) {
      listener();
    }
  };

  window.addEventListener(communityModerationChangedEvent, listener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(communityModerationChangedEvent, listener);
    window.removeEventListener('storage', storageListener);
  };
}
