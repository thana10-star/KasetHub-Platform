import type { SupabaseClient } from '@supabase/supabase-js';
import {
  communityReportReasonLabels,
  isCommunityReportReason,
  type CommunityReportReason,
} from '@/services/community/community.types';
import { getSupabaseClient } from '@/services/supabase/supabase-client';

export type CommunityModerationTargetType = 'post' | 'comment';
export type CommunityModerationReportStatus = 'pending' | 'reviewed' | 'dismissed' | 'action_taken';

export type CommunityModerationReportQueueItem = {
  id: string;
  reason: CommunityReportReason;
  reasonLabel: string;
  note?: string;
  reporterUserId?: string;
  reporterUserLabel: string;
  targetType: CommunityModerationTargetType;
  targetId: string;
  targetPreview: string;
  targetAuthorDisplayName?: string;
  createdAt: string;
  status: CommunityModerationReportStatus;
  reviewedAt?: string;
};

export type CommunityModerationResult<T = void> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      code: 'supabase_not_ready' | 'admin_required' | 'moderation_rpc_not_ready' | 'supabase_action_failed';
      message: string;
    };

export type CommunityModerationReviewService = {
  listReports(): Promise<CommunityModerationResult<CommunityModerationReportQueueItem[]>>;
  markReportReviewed(reportId: string): Promise<CommunityModerationResult>;
  hideReportedPost(postId: string): Promise<CommunityModerationResult>;
  hideReportedComment(commentId: string): Promise<CommunityModerationResult>;
};

type CommunityModerationServiceDependencies = {
  getClient?: () => SupabaseClient | null;
};

type SupabaseFailure = {
  code?: string;
  message?: string;
};

type CommunityReportQueueRow = {
  id?: unknown;
  report_id?: unknown;
  reason?: unknown;
  note?: unknown;
  reporter_user_id?: unknown;
  target_type?: unknown;
  target_id?: unknown;
  post_id?: unknown;
  comment_id?: unknown;
  target_preview?: unknown;
  target_author_display_name?: unknown;
  created_at?: unknown;
  status?: unknown;
  reviewed_at?: unknown;
};

const moderationQueueUnavailableMessage = 'ยังไม่ได้เชื่อมต่อคิวรายงานจากฐานข้อมูล';
const moderationActionFailureMessage = 'ดำเนินการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function maskCommunityReporterId(userId: string | undefined) {
  if (!userId) return 'ผู้ใช้ที่แจ้ง';
  if (userId.length <= 10) return `ผู้ใช้ที่แจ้ง ${userId.slice(0, 3)}...`;
  return `ผู้ใช้ที่แจ้ง ${userId.slice(0, 6)}...${userId.slice(-4)}`;
}

function toReportStatus(value: unknown): CommunityModerationReportStatus {
  const status = asString(value);
  if (status === 'reviewed' || status === 'dismissed' || status === 'action_taken') return status;
  return 'pending';
}

function toTargetType(row: CommunityReportQueueRow): CommunityModerationTargetType {
  const targetType = asString(row.target_type);
  if (targetType === 'comment') return 'comment';
  if (targetType === 'post') return 'post';
  return asString(row.comment_id) ? 'comment' : 'post';
}

function mapReportQueueRow(row: CommunityReportQueueRow): CommunityModerationReportQueueItem {
  const reason = isCommunityReportReason(row.reason) ? row.reason : 'other';
  const targetType = toTargetType(row);
  const targetId = asString(row.target_id) ?? asString(targetType === 'comment' ? row.comment_id : row.post_id) ?? '';
  const reporterUserId = asString(row.reporter_user_id);

  return {
    id: asString(row.id) ?? asString(row.report_id) ?? '',
    reason,
    reasonLabel: communityReportReasonLabels[reason],
    note: asString(row.note),
    reporterUserId,
    reporterUserLabel: maskCommunityReporterId(reporterUserId),
    targetType,
    targetId,
    targetPreview: asString(row.target_preview) ?? 'ไม่มีตัวอย่างเนื้อหา',
    targetAuthorDisplayName: asString(row.target_author_display_name),
    createdAt: asString(row.created_at) ?? '',
    status: toReportStatus(row.status),
    reviewedAt: asString(row.reviewed_at),
  };
}

function mapModerationFailure(error: SupabaseFailure | null | undefined): Extract<CommunityModerationResult<never>, { ok: false }> {
  const message = error?.message?.toLowerCase() ?? '';

  if (
    error?.code === 'PGRST202' ||
    error?.code === '42883' ||
    message.includes('could not find the function') ||
    message.includes('function') && message.includes('does not exist')
  ) {
    return {
      ok: false,
      code: 'moderation_rpc_not_ready',
      message: moderationQueueUnavailableMessage,
    };
  }

  if (error?.code === '42501' || message.includes('not community admin') || message.includes('permission denied')) {
    return {
      ok: false,
      code: 'admin_required',
      message: 'ไม่มีสิทธิ์เข้าถึงหน้านี้',
    };
  }

  return {
    ok: false,
    code: 'supabase_action_failed',
    message: moderationActionFailureMessage,
  };
}

function getClientOrFailure(client: SupabaseClient | null): CommunityModerationResult<SupabaseClient> {
  if (!client) {
    return {
      ok: false,
      code: 'supabase_not_ready',
      message: 'ยังไม่ได้เชื่อมต่อ Supabase staging',
    };
  }

  return { ok: true, data: client };
}

export function createCommunityModerationReviewService(
  dependencies: CommunityModerationServiceDependencies = {},
): CommunityModerationReviewService {
  const deps = {
    getClient: dependencies.getClient ?? getSupabaseClient,
  };

  return {
    async listReports() {
      const clientResult = getClientOrFailure(deps.getClient());
      if (!clientResult.ok) return clientResult;

      const { data, error } = await clientResult.data.rpc('get_community_report_queue');
      if (error) return mapModerationFailure(error);

      const rows = Array.isArray(data) ? (data as CommunityReportQueueRow[]) : [];
      return {
        ok: true,
        data: rows.map(mapReportQueueRow).filter((item) => item.id && item.targetId),
      };
    },

    async markReportReviewed(reportId: string) {
      const clientResult = getClientOrFailure(deps.getClient());
      if (!clientResult.ok) return clientResult;

      const { error } = await clientResult.data.rpc('mark_community_report_reviewed', {
        target_report_id: reportId,
      });
      return error ? mapModerationFailure(error) : { ok: true, data: undefined };
    },

    async hideReportedPost(postId: string) {
      const clientResult = getClientOrFailure(deps.getClient());
      if (!clientResult.ok) return clientResult;

      const { error } = await clientResult.data.rpc('hide_reported_post', {
        target_post_id: postId,
      });
      return error ? mapModerationFailure(error) : { ok: true, data: undefined };
    },

    async hideReportedComment(commentId: string) {
      const clientResult = getClientOrFailure(deps.getClient());
      if (!clientResult.ok) return clientResult;

      const { error } = await clientResult.data.rpc('hide_reported_comment', {
        target_comment_id: commentId,
      });
      return error ? mapModerationFailure(error) : { ok: true, data: undefined };
    },
  };
}
