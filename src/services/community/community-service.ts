import type { SupabaseClient } from '@supabase/supabase-js';
import { publicEnv } from '@/config/env';
import { getAuthOwnershipStatus } from '@/services/auth/auth-ownership-status';
import {
  communityStorageGateMessage,
  uploadCommunityPostImage,
} from '@/services/community/community-storage-service';
import type {
  CommunityActionResult,
  CommunityComment,
  CommunityGateCode,
  CommunityImageMetadata,
  CommunityListPostsResult,
  CommunityPost,
  CommunityPostCategory,
  CommunityReadiness,
  CommunityReportReason,
  CommunityService,
  CreateCommunityCommentInput,
  CreateCommunityPostInput,
  ReportCommunityInput,
} from '@/services/community/community.types';
import { communityPostCategories } from '@/services/community/community.types';
import { getSupabaseClient } from '@/services/supabase/supabase-client';
import { getSupabaseStatus } from '@/services/supabase/supabase-status';

export const communityWriteGateMessage = 'ชุมชนพร้อมเชื่อมต่อฐานข้อมูลแล้ว เหลือทดสอบบัญชีและสิทธิ์ก่อนเปิดโพสต์จริง';
export const communityReadOnlyGateMessage = 'ตอนนี้อ่านและแชร์ได้ก่อน';
export const communitySignInGateMessage = 'เข้าสู่ระบบก่อนโพสต์ คอมเมนต์ หรือกดไลก์';

const backendNotVerifiedGateMessage =
  'ชุมชนจริงยังไม่เปิดเขียนข้อมูล เพราะบัญชีผู้ใช้, RLS, storage และ notification backend ยังไม่ผ่านการตรวจบน staging';

type CommunityAuthenticatedUser = {
  id: string;
  displayName?: string;
};

type CommunityPostRow = {
  id: string;
  author_user_id: string;
  author_display_name: string | null;
  content_text: string;
  category: string;
  image_path: string | null;
  image_mime_type: CommunityImageMetadata['mimeType'] | null;
  image_size_bytes: number | null;
  image_width: number | null;
  image_height: number | null;
  status: CommunityPost['status'];
  like_count: number | null;
  comment_count: number | null;
  report_count: number | null;
  created_at: string;
  updated_at: string;
};

type CommunityCommentRow = {
  id: string;
  post_id: string;
  author_user_id: string;
  author_display_name: string | null;
  content_text: string;
  status: CommunityComment['status'];
  report_count: number | null;
  created_at: string;
  updated_at: string;
};

type CommunityServiceDependencies = {
  getClient?: () => SupabaseClient | null;
  getCurrentUser?: (client: SupabaseClient) => Promise<CommunityAuthenticatedUser | null>;
  createPostId?: () => string;
  uploadImage?: typeof uploadCommunityPostImage;
};

type SupabaseFailure = {
  message?: string;
  code?: string;
  name?: string;
};

const communityPostSelect =
  'id, author_user_id, author_display_name, content_text, category, image_path, image_mime_type, image_size_bytes, image_width, image_height, status, like_count, comment_count, report_count, created_at, updated_at';

const communityCommentSelect =
  'id, post_id, author_user_id, author_display_name, content_text, status, report_count, created_at, updated_at';

function createPostId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `community-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getWriteGateCode(readiness: CommunityReadiness): CommunityGateCode {
  if (!readiness.writesFeatureFlagEnabled) return 'feature_flag_disabled';
  if (!readiness.hasAuthenticatedUser) return 'auth_session_required';
  return 'backend_not_verified';
}

function getWriteGateMessage(readiness: Pick<CommunityReadiness, 'writesFeatureFlagEnabled' | 'hasAuthenticatedUser'>) {
  if (!readiness.writesFeatureFlagEnabled) {
    return `${communityWriteGateMessage} ${communityReadOnlyGateMessage}`;
  }

  if (!readiness.hasAuthenticatedUser) {
    return communitySignInGateMessage;
  }

  return backendNotVerifiedGateMessage;
}

function failure(
  code: CommunityGateCode,
  message: string,
): Extract<CommunityActionResult<never>, { ok: false }> {
  return {
    ok: false,
    code,
    message,
  };
}

function gatedResult(
  readiness: CommunityReadiness,
  code: CommunityGateCode = getWriteGateCode(readiness),
  message = getWriteGateMessage(readiness),
): Extract<CommunityActionResult<never>, { ok: false }> {
  return failure(code, message);
}

function supabaseFailure(error: SupabaseFailure | null | undefined, fallback: string) {
  return failure('supabase_write_failed', error?.message ? `${fallback}: ${error.message}` : fallback);
}

function toCommunityPostCategory(value: string | null | undefined): CommunityPostCategory {
  return communityPostCategories.includes(value as CommunityPostCategory)
    ? value as CommunityPostCategory
    : communityPostCategories[6];
}

function toPublishedPostStatus(value: CommunityPost['status'] | null | undefined): CommunityPost['status'] {
  return value ?? 'published';
}

function toPublishedCommentStatus(value: CommunityComment['status'] | null | undefined): CommunityComment['status'] {
  return value ?? 'published';
}

function mapPostRow(row: CommunityPostRow, currentUserId?: string): CommunityPost {
  return {
    id: row.id ?? '',
    authorUserId: row.author_user_id ?? '',
    authorDisplayName: row.author_display_name ?? undefined,
    contentText: row.content_text ?? '',
    category: toCommunityPostCategory(row.category),
    image: row.image_path && row.image_mime_type && row.image_size_bytes
      ? {
          imagePath: row.image_path,
          mimeType: row.image_mime_type,
          sizeBytes: row.image_size_bytes,
          width: row.image_width ?? undefined,
          height: row.image_height ?? undefined,
        }
      : undefined,
    status: toPublishedPostStatus(row.status),
    likeCount: row.like_count ?? 0,
    commentCount: row.comment_count ?? 0,
    reportCount: row.report_count ?? 0,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? row.created_at ?? '',
    ownedByCurrentUser: currentUserId ? row.author_user_id === currentUserId : undefined,
  };
}

function mapCommentRow(row: CommunityCommentRow, currentUserId?: string): CommunityComment {
  return {
    id: row.id ?? '',
    postId: row.post_id ?? '',
    authorUserId: row.author_user_id ?? '',
    authorDisplayName: row.author_display_name ?? undefined,
    contentText: row.content_text ?? '',
    status: toPublishedCommentStatus(row.status),
    reportCount: row.report_count ?? 0,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? row.created_at ?? '',
    ownedByCurrentUser: currentUserId ? row.author_user_id === currentUserId : undefined,
  };
}

function toReportReasonDbCode(reason: CommunityReportReason) {
  return reason === 'inappropriate_content' ? 'inappropriate' : reason;
}

async function getDefaultCurrentUser(client: SupabaseClient): Promise<CommunityAuthenticatedUser | null> {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  const displayName =
    typeof data.user.user_metadata?.display_name === 'string'
      ? data.user.user_metadata.display_name
      : undefined;

  return {
    id: data.user.id,
    displayName,
  };
}

async function requireWriteContext(
  readiness: CommunityReadiness,
  deps: Required<Pick<CommunityServiceDependencies, 'getClient' | 'getCurrentUser'>>,
): Promise<
  | { ok: true; client: SupabaseClient; user: CommunityAuthenticatedUser }
  | Extract<CommunityActionResult<never>, { ok: false }>
> {
  if (!readiness.writesFeatureFlagEnabled) {
    return gatedResult(readiness, 'feature_flag_disabled');
  }

  const client = deps.getClient();
  if (!client) {
    return failure('supabase_not_ready', 'ยังเชื่อมต่อฐานข้อมูลชุมชนไม่ได้');
  }

  const user = await deps.getCurrentUser(client);
  if (!user) {
    return failure('auth_session_required', communitySignInGateMessage);
  }

  return { ok: true, client, user };
}

export function getCommunityReadiness(): CommunityReadiness {
  const supabaseStatus = getSupabaseStatus();
  const authStatus = getAuthOwnershipStatus();
  const writesFeatureFlagEnabled = publicEnv.enableCommunityWrites;
  const hasAuthenticatedUser = authStatus.realSupabaseSessionDetected;
  const canWrite = writesFeatureFlagEnabled && hasAuthenticatedUser && supabaseStatus.canCreateClient;
  const writeGateMessage = getWriteGateMessage({ writesFeatureFlagEnabled, hasAuthenticatedUser });

  return {
    path: canWrite ? 'real' : 'gated',
    canReadPublishedPosts: supabaseStatus.canCreateClient,
    canWrite,
    canUploadImage: canWrite,
    canCreateNotifications: false,
    writesFeatureFlagEnabled,
    hasAuthenticatedUser,
    backendServiceReady: true,
    writeGateMessage,
    imageGateMessage: communityStorageGateMessage,
    blockers: [
      ...(!writesFeatureFlagEnabled
        ? [
            {
              code: 'feature_flag_disabled' as const,
              label: 'COMMUNITY_WRITES_ENABLED ปิดเป็นค่าเริ่มต้น',
              detail:
                'ตอนนี้อ่านและแชร์ได้ก่อน เพราะ VITE_ENABLE_COMMUNITY_WRITES=false และ production ยังต้องปิด public writes',
            },
          ]
        : []),
      ...(!supabaseStatus.canCreateClient
        ? [
            {
              code: 'supabase_not_ready' as const,
              label: 'ยังไม่เชื่อมต่อ Supabase สำหรับชุมชน',
              detail: 'ต้องมี staging Supabase URL และ anon key ที่ปลอดภัยก่อนทดสอบ adapter เขียนข้อมูล',
            },
          ]
        : []),
      ...(!hasAuthenticatedUser
        ? [
            {
              code: 'auth_session_required' as const,
              label: 'ต้องเข้าสู่ระบบก่อนเขียนโพสต์',
              detail: 'adapter เขียนข้อมูลต้องใช้ real Supabase Auth session เพื่อให้ RLS ตรวจ auth.uid()',
            },
          ]
        : []),
      {
        code: 'notification_backend_needed',
        label: 'แจ้งเตือนชุมชนยังต้องสร้างจาก backend',
        detail: 'like/reply notification ยังไม่สร้างจาก browser เพราะต้องมี backend function ตรวจ actor, recipient, ownership และ rate limit',
      },
    ],
  };
}

export function createCommunityService(
  readiness: CommunityReadiness = getCommunityReadiness(),
  dependencies: CommunityServiceDependencies = {},
): CommunityService {
  const deps = {
    getClient: dependencies.getClient ?? getSupabaseClient,
    getCurrentUser: dependencies.getCurrentUser ?? getDefaultCurrentUser,
    createPostId: dependencies.createPostId ?? createPostId,
    uploadImage: dependencies.uploadImage ?? uploadCommunityPostImage,
  };

  return {
    getReadiness() {
      return readiness;
    },

    async listPosts(): Promise<CommunityListPostsResult> {
      const client = deps.getClient();

      if (!client) {
        return {
          posts: [],
          readiness,
        };
      }

      const currentUser = await deps.getCurrentUser(client);
      const { data, error } = await client
        .from('community_posts')
        .select(communityPostSelect)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        return {
          posts: [],
          readiness,
        };
      }

      const postRows = Array.isArray(data) ? data : [];
      const posts = postRows.map((row) => mapPostRow(row as CommunityPostRow, currentUser?.id));
      if (!currentUser || posts.length === 0) {
        return {
          posts,
          readiness,
        };
      }

      const postIds = posts.map((post) => post.id).filter(Boolean);
      if (postIds.length === 0) {
        return {
          posts,
          readiness,
        };
      }

      const likeCountsByPost = new Map<string, number>();
      const { data: allLikeRows, error: allLikeError } = await client
        .from('community_likes')
        .select('post_id')
        .in('post_id', postIds);

      if (!allLikeError && Array.isArray(allLikeRows)) {
        for (const row of allLikeRows) {
          const postId = (row as { post_id?: string }).post_id;
          if (postId) {
            likeCountsByPost.set(postId, (likeCountsByPost.get(postId) ?? 0) + 1);
          }
        }
      }

      const { data: likedRows } = await client
        .from('community_likes')
        .select('post_id')
        .eq('user_id', currentUser.id)
        .in('post_id', postIds);
      const likedPostIds = new Set(
        (Array.isArray(likedRows) ? likedRows : []).map((row) => (row as { post_id: string }).post_id),
      );

      return {
        posts: posts.map((post) => ({
          ...post,
          likeCount: likeCountsByPost.has(post.id) ? likeCountsByPost.get(post.id) ?? 0 : post.likeCount,
          likedByCurrentUser: likedPostIds.has(post.id),
        })),
        readiness,
      };
    },

    async createPost(input: CreateCommunityPostInput) {
      const context = await requireWriteContext(readiness, deps);
      if (!context.ok) return context;

      const contentText = input.contentText.trim();
      if (!contentText) {
        return failure('invalid_input', 'กรุณาเขียนข้อความโพสต์');
      }

      const postId = deps.createPostId();
      const image = input.image
        ? await deps.uploadImage(input.image, {
            client: context.client,
            userId: context.user.id,
            postId,
            writesEnabled: readiness.canUploadImage,
          })
        : undefined;

      if (image && !image.ok) {
        return image;
      }

      const imageData = image?.ok ? image.data : undefined;
      const { data, error } = await context.client
        .from('community_posts')
        .insert({
          id: postId,
          author_user_id: context.user.id,
          author_display_name: input.authorDisplayName ?? context.user.displayName ?? null,
          content_text: contentText,
          category: input.category,
          image_path: imageData?.imagePath ?? null,
          image_mime_type: imageData?.mimeType ?? null,
          image_size_bytes: imageData?.sizeBytes ?? null,
          image_width: imageData?.width ?? null,
          image_height: imageData?.height ?? null,
          status: 'published',
        })
        .select(communityPostSelect)
        .single();

      if (error || !data) {
        return supabaseFailure(error, 'โพสต์ชุมชนไม่สำเร็จ');
      }

      return {
        ok: true,
        data: mapPostRow(data as CommunityPostRow, context.user.id),
      };
    },

    async hideOwnPost(postId: string) {
      const context = await requireWriteContext(readiness, deps);
      if (!context.ok) return context;

      const { error } = await context.client.from('community_posts').update({ status: 'hidden' }).eq('id', postId);
      return error ? supabaseFailure(error, 'ซ่อนโพสต์ไม่สำเร็จ') : { ok: true, data: undefined };
    },

    async deleteOwnPost(postId: string) {
      const context = await requireWriteContext(readiness, deps);
      if (!context.ok) return context;

      const { error } = await context.client.from('community_posts').update({ status: 'deleted' }).eq('id', postId);
      return error ? supabaseFailure(error, 'ลบโพสต์ไม่สำเร็จ') : { ok: true, data: undefined };
    },

    async listComments(postId: string) {
      const client = deps.getClient();
      if (!client) return { ok: true, data: [] };

      const currentUser = await deps.getCurrentUser(client);
      const { data, error } = await client
        .from('community_comments')
        .select(communityCommentSelect)
        .eq('post_id', postId)
        .eq('status', 'published')
        .order('created_at', { ascending: true });

      if (error) {
        return supabaseFailure(error, 'โหลดคอมเมนต์ไม่สำเร็จ');
      }

      return {
        ok: true,
        data: (Array.isArray(data) ? data : []).map((row) => mapCommentRow(row as CommunityCommentRow, currentUser?.id)),
      };
    },

    async createComment(postId: string, input: CreateCommunityCommentInput) {
      const context = await requireWriteContext(readiness, deps);
      if (!context.ok) return context;

      const contentText = input.contentText.trim();
      if (!contentText) {
        return failure('invalid_input', 'กรุณาเขียนคอมเมนต์');
      }

      const { data, error } = await context.client
        .from('community_comments')
        .insert({
          post_id: postId,
          author_user_id: context.user.id,
          author_display_name: context.user.displayName ?? null,
          content_text: contentText,
          status: 'published',
        })
        .select(communityCommentSelect)
        .single();

      if (error || !data) {
        return supabaseFailure(error, 'ส่งคอมเมนต์ไม่สำเร็จ');
      }

      return {
        ok: true,
        data: mapCommentRow(data as CommunityCommentRow, context.user.id),
      };
    },

    async hideOwnComment(commentId: string) {
      const context = await requireWriteContext(readiness, deps);
      if (!context.ok) return context;

      const { error } = await context.client.from('community_comments').update({ status: 'hidden' }).eq('id', commentId);
      return error ? supabaseFailure(error, 'ซ่อนคอมเมนต์ไม่สำเร็จ') : { ok: true, data: undefined };
    },

    async likePost(postId: string) {
      const context = await requireWriteContext(readiness, deps);
      if (!context.ok) return context;

      const { error } = await context.client.from('community_likes').insert({
        post_id: postId,
        user_id: context.user.id,
      });

      if (error) {
        const duplicate = error.code === '23505' || error.message?.toLowerCase().includes('duplicate');
        return duplicate ? { ok: true, data: undefined } : supabaseFailure(error, 'กดไลก์ไม่สำเร็จ');
      }

      return { ok: true, data: undefined };
    },

    async unlikePost(postId: string) {
      const context = await requireWriteContext(readiness, deps);
      if (!context.ok) return context;

      const { error } = await context.client
        .from('community_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', context.user.id);

      return error ? supabaseFailure(error, 'ยกเลิกไลก์ไม่สำเร็จ') : { ok: true, data: undefined };
    },

    async reportPost(postId: string, input: ReportCommunityInput) {
      const context = await requireWriteContext(readiness, deps);
      if (!context.ok) return context;

      if (!input.reason) {
        return failure('invalid_input', 'กรุณาเลือกเหตุผลรายงาน');
      }

      const { error } = await context.client.from('community_reports').insert({
        post_id: postId,
        comment_id: null,
        reporter_user_id: context.user.id,
        reason: toReportReasonDbCode(input.reason),
        note: input.note?.trim() || null,
      });

      return error ? supabaseFailure(error, 'ส่งรายงานไม่สำเร็จ') : { ok: true, data: undefined };
    },

    async reportComment(commentId: string, input: ReportCommunityInput) {
      const context = await requireWriteContext(readiness, deps);
      if (!context.ok) return context;

      if (!input.reason) {
        return failure('invalid_input', 'กรุณาเลือกเหตุผลรายงาน');
      }

      const { error } = await context.client.from('community_reports').insert({
        post_id: null,
        comment_id: commentId,
        reporter_user_id: context.user.id,
        reason: toReportReasonDbCode(input.reason),
        note: input.note?.trim() || null,
      });

      return error ? supabaseFailure(error, 'ส่งรายงานไม่สำเร็จ') : { ok: true, data: undefined };
    },

    async listNotifications() {
      return gatedResult(
        readiness,
        'notification_backend_needed',
        'การแจ้งเตือน like/reply ต้องสร้างจาก backend ที่ตรวจ ownership แล้ว',
      );
    },

    async markNotificationRead(_notificationId?: string) {
      void _notificationId;
      return gatedResult(
        readiness,
        'notification_backend_needed',
        'การแจ้งเตือน like/reply ต้องสร้างจาก backend ที่ตรวจ ownership แล้ว',
      );
    },
  };
}

export const communityService = createCommunityService();
