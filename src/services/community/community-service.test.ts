import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, test, vi } from 'vitest';
import { createCommunityService, getCommunityReadiness } from '@/services/community/community-service';
import {
  listCommunityNotifications,
  markCommunityNotificationRead,
} from '@/services/community/community-notification-service';
import {
  communityImagePolicy,
  uploadCommunityPostImage,
  validateCommunityImageFile,
} from '@/services/community/community-storage-service';
import type { CommunityReadiness } from '@/services/community/community.types';
import {
  communityReportAlreadySubmittedMessage,
  communityFallbackPostCategory,
  communityPostCategories,
  communityReportInvalidReasonMessage,
  communityReportReasons,
  communityReportSignInRequiredMessage,
  communityReportSubmitFailureMessage,
} from '@/services/community/community.types';
import { mvpRouteGroups } from '@/services/qa/route-registry';

type MockQueryResult = {
  data: unknown;
  error: { message: string; code?: string } | null;
};

type MockQuery = PromiseLike<MockQueryResult> & {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  in: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
};

function enabledReadiness(): CommunityReadiness {
  return {
    path: 'real',
    canReadPublishedPosts: true,
    canWrite: true,
    canUploadImage: true,
    canCreateNotifications: false,
    writesFeatureFlagEnabled: true,
    hasAuthenticatedUser: true,
    backendServiceReady: true,
    writeGateMessage: 'ready',
    imageGateMessage: 'ready',
    blockers: [],
  };
}

function createQueryMock(result: MockQueryResult): MockQuery {
  const query = {} as MockQuery;
  query.select = vi.fn(() => query);
  query.eq = vi.fn(() => query);
  query.in = vi.fn(() => query);
  query.order = vi.fn(() => query);
  query.limit = vi.fn(() => query);
  query.insert = vi.fn(() => query);
  query.update = vi.fn(() => query);
  query.delete = vi.fn(() => query);
  query.single = vi.fn(() => Promise.resolve(result));
  query.then = (onFulfilled, onRejected) => Promise.resolve(result).then(onFulfilled, onRejected);
  return query;
}

function createClientMock(query: MockQuery) {
  const from = vi.fn(() => query);
  const client = {
    from,
    auth: {
      getUser: vi.fn(),
    },
    storage: {
      from: vi.fn(),
    },
  } as unknown as SupabaseClient;

  return { client, from };
}

const userA = { id: '00000000-0000-4000-8000-00000000000a', displayName: 'User A' };
const userAWithEmailOnly = {
  id: '00000000-0000-4000-8000-00000000000a',
  email: 'community-user-a@test.local',
};

describe('M114 gated community staging service contract', () => {
  test('exposes the V1 categories without fake engagement data', async () => {
    const service = createCommunityService(getCommunityReadiness(), {
      getClient: () => null,
    });
    const result = await service.listPosts();

    expect(communityPostCategories).toEqual([
      'ปัญหาพืช',
      'ดินและปุ๋ย',
      'น้ำและระบบน้ำ',
      'อากาศ',
      'ราคาเกษตร',
      'เครื่องมือ/แอพ',
      'เรื่องเล่าจากฟาร์ม',
      'อื่น ๆ',
    ]);
    expect(communityFallbackPostCategory).toBe('อื่น ๆ');
    expect(result.posts).toEqual([]);
    expect(result.readiness.path).toBe('gated');
    expect(result.readiness.canWrite).toBe(false);
    expect(result.readiness.writesFeatureFlagEnabled).toBe(false);
    expect(result.readiness.backendServiceReady).toBe(true);
  });

  test('gates write operations behind the default-off community write flag', async () => {
    const service = createCommunityService();

    await expect(service.createPost({ contentText: 'hello', category: 'อื่น ๆ' })).resolves.toMatchObject({
      ok: false,
      code: 'feature_flag_disabled',
    });
    await expect(service.createComment('post-1', { contentText: 'reply' })).resolves.toMatchObject({
      ok: false,
      code: 'feature_flag_disabled',
    });
    await expect(service.createReply('post-1', 'comment-1', { contentText: 'reply' })).resolves.toMatchObject({
      ok: false,
      code: 'feature_flag_disabled',
    });
    await expect(service.likePost('post-1')).resolves.toMatchObject({
      ok: false,
      code: 'feature_flag_disabled',
    });
    await expect(service.likeComment('comment-1')).resolves.toMatchObject({
      ok: false,
      code: 'feature_flag_disabled',
    });
    await expect(service.unlikeComment('comment-1')).resolves.toMatchObject({
      ok: false,
      code: 'feature_flag_disabled',
    });
    await expect(service.reportPost('post-1', { reason: 'spam' })).resolves.toMatchObject({
      ok: false,
      code: 'feature_flag_disabled',
    });
    await expect(service.listNotifications()).resolves.toMatchObject({
      ok: false,
      code: 'notification_backend_needed',
    });
  });

  test('requires auth when the write flag is enabled', async () => {
    const query = createQueryMock({ data: null, error: null });
    const { client } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => null,
    });

    await expect(service.createPost({ contentText: 'hello', category: communityFallbackPostCategory })).resolves.toMatchObject({
      ok: false,
      code: 'auth_session_required',
    });
    await expect(service.createReply('post-1', 'comment-1', { contentText: 'reply' })).resolves.toMatchObject({
      ok: false,
      code: 'auth_session_required',
    });
    await expect(service.likeComment('comment-1')).resolves.toMatchObject({
      ok: false,
      code: 'auth_session_required',
    });
    await expect(service.reportPost('post-1', { reason: 'spam' })).resolves.toMatchObject({
      ok: false,
      code: 'auth_session_required',
      message: communityReportSignInRequiredMessage,
    });
  });

  test('lists published posts from Supabase without fake fallback posts', async () => {
    const query = createQueryMock({ data: [], error: null });
    const { client, from } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.listPosts()).resolves.toMatchObject({
      posts: [],
    });
    expect(from).toHaveBeenCalledWith('community_posts');
    expect(query.eq).toHaveBeenCalledWith('status', 'published');
  });

  test('maps the water category from Supabase rows', async () => {
    const query = createQueryMock({
      data: [
        {
          id: 'post-water-1',
          author_user_id: userA.id,
          author_display_name: 'User A',
          content_text: 'ระบบน้ำหยดในแปลงผัก',
          category: 'น้ำและระบบน้ำ',
          image_path: null,
          image_mime_type: null,
          image_size_bytes: null,
          image_width: null,
          image_height: null,
          status: 'published',
          like_count: 0,
          comment_count: 0,
          report_count: 0,
          created_at: '2026-05-26T00:00:00.000Z',
          updated_at: '2026-05-26T00:00:00.000Z',
        },
      ],
      error: null,
    });
    const { client } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => null,
    });

    await expect(service.listPosts()).resolves.toMatchObject({
      posts: [
        {
          id: 'post-water-1',
          category: 'น้ำและระบบน้ำ',
        },
      ],
    });
  });

  test('counts published top-level comments and replies for post cards before opening comments', async () => {
    const postQuery = createQueryMock({
      data: [
        {
          id: 'post-1',
          author_user_id: userA.id,
          author_display_name: 'User A',
          content_text: 'real post with comments',
          category: communityFallbackPostCategory,
          image_path: null,
          image_mime_type: null,
          image_size_bytes: null,
          image_width: null,
          image_height: null,
          status: 'published',
          like_count: 0,
          comment_count: 0,
          report_count: 0,
          created_at: '2026-05-26T00:00:00.000Z',
          updated_at: '2026-05-26T00:00:00.000Z',
        },
      ],
      error: null,
    });
    const commentQuery = createQueryMock({
      data: [
        { post_id: 'post-1' },
        { post_id: 'post-1' },
      ],
      error: null,
    });
    const from = vi.fn((table: string) => {
      if (table === 'community_comments') return commentQuery;
      return postQuery;
    });
    const client = {
      from,
      auth: {
        getUser: vi.fn(),
      },
      storage: {
        from: vi.fn(),
      },
    } as unknown as SupabaseClient;
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => null,
    });

    await expect(service.listPosts()).resolves.toMatchObject({
      posts: [
        {
          id: 'post-1',
          commentCount: 2,
        },
      ],
    });
    expect(from).toHaveBeenCalledWith('community_comments');
    expect(commentQuery.eq).toHaveBeenCalledWith('status', 'published');
    expect(commentQuery.in).toHaveBeenCalledWith('post_id', ['post-1']);
  });

  test('marks posts liked by the current user for staging unlike tests', async () => {
    const postQuery = createQueryMock({
      data: [
        {
          id: 'post-1',
          author_user_id: '00000000-0000-4000-8000-00000000000b',
          author_display_name: 'User B',
          content_text: 'real staging post',
          category: communityFallbackPostCategory,
          image_path: null,
          image_mime_type: null,
          image_size_bytes: null,
          image_width: null,
          image_height: null,
          status: 'published',
          like_count: 0,
          comment_count: 0,
          report_count: 0,
          created_at: '2026-05-26T00:00:00.000Z',
          updated_at: '2026-05-26T00:00:00.000Z',
        },
      ],
      error: null,
    });
    const allLikesQuery = createQueryMock({ data: [{ post_id: 'post-1' }, { post_id: 'post-1' }], error: null });
    const ownLikesQuery = createQueryMock({ data: [{ post_id: 'post-1' }], error: null });
    let likeQueryCount = 0;
    const from = vi.fn((table: string) => {
      if (table !== 'community_likes') return postQuery;
      likeQueryCount += 1;
      return likeQueryCount === 1 ? allLikesQuery : ownLikesQuery;
    });
    const client = {
      from,
      auth: {
        getUser: vi.fn(),
      },
      storage: {
        from: vi.fn(),
      },
    } as unknown as SupabaseClient;
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.listPosts()).resolves.toMatchObject({
      posts: [
        {
          id: 'post-1',
          likeCount: 2,
          likedByCurrentUser: true,
        },
      ],
    });
    expect(from).toHaveBeenCalledWith('community_posts');
    expect(from).toHaveBeenCalledWith('community_likes');
    expect(allLikesQuery.in).toHaveBeenCalledWith('post_id', ['post-1']);
    expect(ownLikesQuery.eq).toHaveBeenCalledWith('user_id', userA.id);
    expect(ownLikesQuery.in).toHaveBeenCalledWith('post_id', ['post-1']);
  });

  test('lists comments with reply counts and comment-like state when staging SQL is applied', async () => {
    const commentsQuery = createQueryMock({
      data: [
        {
          id: 'comment-1',
          post_id: 'post-1',
          parent_comment_id: null,
          author_user_id: '00000000-0000-4000-8000-00000000000b',
          author_display_name: null,
          content_text: 'top-level comment',
          status: 'published',
          report_count: 0,
          created_at: '2026-05-26T00:00:00.000Z',
          updated_at: '2026-05-26T00:00:00.000Z',
        },
        {
          id: 'reply-1',
          post_id: 'post-1',
          parent_comment_id: 'comment-1',
          author_user_id: userA.id,
          author_display_name: 'User A',
          content_text: 'one-level reply',
          status: 'published',
          report_count: 0,
          created_at: '2026-05-26T00:01:00.000Z',
          updated_at: '2026-05-26T00:01:00.000Z',
        },
      ],
      error: null,
    });
    const allCommentLikesQuery = createQueryMock({
      data: [{ comment_id: 'comment-1' }, { comment_id: 'comment-1' }],
      error: null,
    });
    const ownCommentLikesQuery = createQueryMock({
      data: [{ comment_id: 'comment-1' }],
      error: null,
    });
    let likeQueryCount = 0;
    const from = vi.fn((table: string) => {
      if (table !== 'community_comment_likes') return commentsQuery;
      likeQueryCount += 1;
      return likeQueryCount === 1 ? allCommentLikesQuery : ownCommentLikesQuery;
    });
    const client = {
      from,
      auth: {
        getUser: vi.fn(),
      },
      storage: {
        from: vi.fn(),
      },
    } as unknown as SupabaseClient;
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.listComments('post-1')).resolves.toMatchObject({
      ok: true,
      data: [
        {
          id: 'comment-1',
          likeCount: 2,
          replyCount: 1,
          likedByCurrentUser: true,
        },
        {
          id: 'reply-1',
          parentCommentId: 'comment-1',
          replyCount: 0,
        },
      ],
    });
    expect(commentsQuery.select).toHaveBeenCalledWith(expect.stringContaining('parent_comment_id'));
    expect(allCommentLikesQuery.in).toHaveBeenCalledWith('comment_id', ['comment-1', 'reply-1']);
    expect(ownCommentLikesQuery.eq).toHaveBeenCalledWith('user_id', userA.id);
  });

  test('creates a post through the Supabase adapter when flag and auth are ready', async () => {
    const query = createQueryMock({
      data: {
        id: 'post-1',
        author_user_id: userA.id,
        author_display_name: 'User A',
        content_text: 'hello community',
        category: communityFallbackPostCategory,
        image_path: null,
        image_mime_type: null,
        image_size_bytes: null,
        image_width: null,
        image_height: null,
        status: 'published',
        like_count: 0,
        comment_count: 0,
        report_count: 0,
        created_at: '2026-05-26T00:00:00.000Z',
        updated_at: '2026-05-26T00:00:00.000Z',
      },
      error: null,
    });
    const { client, from } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
      createPostId: () => 'post-1',
    });

    await expect(service.createPost({ contentText: ' hello community ', category: communityFallbackPostCategory })).resolves.toMatchObject({
      ok: true,
      data: {
        id: 'post-1',
        authorUserId: userA.id,
        contentText: 'hello community',
      },
    });
    expect(from).toHaveBeenCalledWith('community_posts');
    expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({
      id: 'post-1',
      author_user_id: userA.id,
      author_display_name: 'User A',
      content_text: 'hello community',
      category: communityFallbackPostCategory,
    }));
  });

  test('creates posts and comments with a sanitized email local-part display name when no profile name exists', async () => {
    const postQuery = createQueryMock({
      data: {
        id: 'post-1',
        author_user_id: userAWithEmailOnly.id,
        author_display_name: 'community-user-a',
        content_text: 'hello community',
        category: communityFallbackPostCategory,
        image_path: null,
        image_mime_type: null,
        image_size_bytes: null,
        image_width: null,
        image_height: null,
        status: 'published',
        like_count: 0,
        comment_count: 0,
        report_count: 0,
        created_at: '2026-05-26T00:00:00.000Z',
        updated_at: '2026-05-26T00:00:00.000Z',
      },
      error: null,
    });
    const commentQuery = createQueryMock({
      data: {
        id: 'comment-1',
        post_id: 'post-1',
        parent_comment_id: null,
        author_user_id: userAWithEmailOnly.id,
        author_display_name: 'community-user-a',
        content_text: 'reply',
        status: 'published',
        report_count: 0,
        created_at: '2026-05-26T00:00:00.000Z',
        updated_at: '2026-05-26T00:00:00.000Z',
      },
      error: null,
    });
    let queryCount = 0;
    const from = vi.fn((table: string) => {
      if (table !== 'community_comments') return postQuery;
      queryCount += 1;
      return queryCount === 1 ? commentQuery : commentQuery;
    });
    const client = {
      from,
      auth: {
        getUser: vi.fn(),
      },
      storage: {
        from: vi.fn(),
      },
    } as unknown as SupabaseClient;
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userAWithEmailOnly,
      createPostId: () => 'post-1',
    });

    await expect(service.createPost({ contentText: 'hello community', category: communityFallbackPostCategory })).resolves.toMatchObject({
      ok: true,
      data: {
        authorDisplayName: 'community-user-a',
      },
    });
    expect(postQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
      author_display_name: 'community-user-a',
    }));

    await expect(service.createComment('post-1', { contentText: 'reply' })).resolves.toMatchObject({
      ok: true,
      data: {
        authorDisplayName: 'community-user-a',
      },
    });
    expect(commentQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
      author_display_name: 'community-user-a',
    }));
    expect(JSON.stringify(postQuery.insert.mock.calls)).not.toContain('community-user-a@test.local');
    expect(JSON.stringify(commentQuery.insert.mock.calls)).not.toContain('community-user-a@test.local');
  });

  test('prefers an owned profile display_name over auth metadata and email when creating a post', async () => {
    const profileQuery = createQueryMock({
      data: {
        display_name: 'สวนลุงสมชาย',
      },
      error: null,
    });
    const postQuery = createQueryMock({
      data: {
        id: 'post-1',
        author_user_id: userA.id,
        author_display_name: 'สวนลุงสมชาย',
        content_text: 'hello community',
        category: communityFallbackPostCategory,
        image_path: null,
        image_mime_type: null,
        image_size_bytes: null,
        image_width: null,
        image_height: null,
        status: 'published',
        like_count: 0,
        comment_count: 0,
        report_count: 0,
        created_at: '2026-05-26T00:00:00.000Z',
        updated_at: '2026-05-26T00:00:00.000Z',
      },
      error: null,
    });
    const from = vi.fn((table: string) => (table === 'profiles' ? profileQuery : postQuery));
    const client = {
      from,
      auth: {
        getUser: vi.fn(async () => ({
          data: {
            user: {
              id: userA.id,
              email: 'community-user-a@test.local',
              user_metadata: {
                display_name: 'Metadata Name',
              },
            },
          },
          error: null,
        })),
      },
      storage: {
        from: vi.fn(),
      },
    } as unknown as SupabaseClient;
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      createPostId: () => 'post-1',
    });

    await expect(service.createPost({ contentText: 'hello community', category: communityFallbackPostCategory })).resolves.toMatchObject({
      ok: true,
      data: {
        authorDisplayName: 'สวนลุงสมชาย',
      },
    });
    expect(from).toHaveBeenCalledWith('profiles');
    expect(profileQuery.select).toHaveBeenCalledWith('display_name');
    expect(profileQuery.eq).toHaveBeenCalledWith('id', userA.id);
    expect(postQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
      author_display_name: 'สวนลุงสมชาย',
    }));
  });

  test('creates a comment through the Supabase adapter when flag and auth are ready', async () => {
    const query = createQueryMock({
      data: {
        id: 'comment-1',
        post_id: 'post-1',
        parent_comment_id: null,
        author_user_id: userA.id,
        author_display_name: 'User A',
        content_text: 'reply',
        status: 'published',
        report_count: 0,
        created_at: '2026-05-26T00:00:00.000Z',
        updated_at: '2026-05-26T00:00:00.000Z',
      },
      error: null,
    });
    const { client } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.createComment('post-1', { contentText: ' reply ' })).resolves.toMatchObject({
      ok: true,
      data: {
        id: 'comment-1',
        contentText: 'reply',
      },
    });
    expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({
      post_id: 'post-1',
      parent_comment_id: null,
      author_user_id: userA.id,
      content_text: 'reply',
    }));
    expect(query.select).toHaveBeenCalledWith(expect.stringContaining('parent_comment_id'));
  });

  test('creates a one-level reply with parent_comment_id when flag and auth are ready', async () => {
    const parentQuery = createQueryMock({
      data: {
        id: 'comment-1',
        post_id: 'post-1',
        parent_comment_id: null,
        status: 'published',
      },
      error: null,
    });
    const insertQuery = createQueryMock({
      data: {
        id: 'reply-1',
        post_id: 'post-1',
        parent_comment_id: 'comment-1',
        author_user_id: userA.id,
        author_display_name: 'User A',
        content_text: 'reply to comment',
        status: 'published',
        report_count: 0,
        created_at: '2026-05-26T00:00:00.000Z',
        updated_at: '2026-05-26T00:00:00.000Z',
      },
      error: null,
    });
    let commentQueryCount = 0;
    const from = vi.fn((table: string) => {
      if (table !== 'community_comments') return createQueryMock({ data: null, error: null });
      commentQueryCount += 1;
      return commentQueryCount === 1 ? parentQuery : insertQuery;
    });
    const client = {
      from,
      auth: {
        getUser: vi.fn(),
      },
      storage: {
        from: vi.fn(),
      },
    } as unknown as SupabaseClient;
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.createReply('post-1', 'comment-1', { contentText: ' reply to comment ' })).resolves.toMatchObject({
      ok: true,
      data: {
        id: 'reply-1',
        parentCommentId: 'comment-1',
        contentText: 'reply to comment',
      },
    });
    expect(parentQuery.select).toHaveBeenCalledWith('id, post_id, parent_comment_id, status');
    expect(insertQuery.insert).toHaveBeenCalledWith(expect.objectContaining({
      post_id: 'post-1',
      parent_comment_id: 'comment-1',
      author_user_id: userA.id,
      content_text: 'reply to comment',
    }));
  });

  test('blocks nested replies in the service before inserting', async () => {
    const parentQuery = createQueryMock({
      data: {
        id: 'reply-1',
        post_id: 'post-1',
        parent_comment_id: 'comment-1',
        status: 'published',
      },
      error: null,
    });
    const { client } = createClientMock(parentQuery);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.createReply('post-1', 'reply-1', { contentText: 'nested' })).resolves.toMatchObject({
      ok: false,
      code: 'invalid_input',
    });
    expect(parentQuery.insert).not.toHaveBeenCalled();
  });

  test('handles duplicate likes as already liked and can unlike own like', async () => {
    const duplicateLikeQuery = createQueryMock({
      data: null,
      error: { code: '23505', message: 'duplicate key value violates unique constraint' },
    });
    const { client } = createClientMock(duplicateLikeQuery);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.likePost('post-1')).resolves.toMatchObject({ ok: true });
    expect(duplicateLikeQuery.insert).toHaveBeenCalledWith({
      post_id: 'post-1',
      user_id: userA.id,
    });

    const unlikeQuery = createQueryMock({ data: null, error: null });
    const { client: unlikeClient } = createClientMock(unlikeQuery);
    const unlikeService = createCommunityService(enabledReadiness(), {
      getClient: () => unlikeClient,
      getCurrentUser: async () => userA,
    });

    await expect(unlikeService.unlikePost('post-1')).resolves.toMatchObject({ ok: true });
    expect(unlikeQuery.delete).toHaveBeenCalled();
    expect(unlikeQuery.eq).toHaveBeenCalledWith('post_id', 'post-1');
    expect(unlikeQuery.eq).toHaveBeenCalledWith('user_id', userA.id);
  });

  test('handles comment likes as the current user and can unlike them', async () => {
    const duplicateLikeQuery = createQueryMock({
      data: null,
      error: { code: '23505', message: 'duplicate key value violates unique constraint' },
    });
    const { client } = createClientMock(duplicateLikeQuery);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.likeComment('comment-1')).resolves.toMatchObject({ ok: true });
    expect(duplicateLikeQuery.insert).toHaveBeenCalledWith({
      comment_id: 'comment-1',
      user_id: userA.id,
    });

    const unlikeQuery = createQueryMock({ data: null, error: null });
    const { client: unlikeClient } = createClientMock(unlikeQuery);
    const unlikeService = createCommunityService(enabledReadiness(), {
      getClient: () => unlikeClient,
      getCurrentUser: async () => userA,
    });

    await expect(unlikeService.unlikeComment('comment-1')).resolves.toMatchObject({ ok: true });
    expect(unlikeQuery.delete).toHaveBeenCalled();
    expect(unlikeQuery.eq).toHaveBeenCalledWith('comment_id', 'comment-1');
    expect(unlikeQuery.eq).toHaveBeenCalledWith('user_id', userA.id);
  });

  test.each(communityReportReasons)('reports posts with the database-safe %s reason code', async (reason) => {
    const query = createQueryMock({ data: null, error: null });
    const { client } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.reportPost('post-1', { reason, note: ' report note ' })).resolves.toMatchObject({ ok: true });
    expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({
      post_id: 'post-1',
      comment_id: null,
      reporter_user_id: userA.id,
      reason,
      note: 'report note',
    }));
  });

  test.each(communityReportReasons)('reports comments with the database-safe %s reason code', async (reason) => {
    const query = createQueryMock({ data: null, error: null });
    const { client } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.reportComment('comment-1', { reason })).resolves.toMatchObject({ ok: true });
    expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({
      post_id: null,
      comment_id: 'comment-1',
      reporter_user_id: userA.id,
      reason,
    }));
  });

  test('rejects unknown report reasons before attempting insert', async () => {
    const query = createQueryMock({ data: null, error: null });
    const { client } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.reportPost('post-1', { reason: 'เนื้อหาไม่เหมาะสม' as never })).resolves.toMatchObject({
      ok: false,
      code: 'invalid_input',
      message: communityReportInvalidReasonMessage,
    });
    await expect(service.reportComment('comment-1', { reason: 'inappropriate_content' as never })).resolves.toMatchObject({
      ok: false,
      code: 'invalid_input',
      message: communityReportInvalidReasonMessage,
    });
    expect(query.insert).not.toHaveBeenCalled();
  });

  test('maps duplicate report database errors to already-reported copy', async () => {
    const query = createQueryMock({
      data: null,
      error: { code: '23505', message: 'duplicate key value violates unique constraint "community_reports_unique_post_report"' },
    });
    const { client } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.reportPost('post-1', { reason: 'spam' })).resolves.toMatchObject({
      ok: false,
      code: 'duplicate_report',
      message: communityReportAlreadySubmittedMessage,
    });
  });

  test('maps Supabase report insert failures to friendly retry copy', async () => {
    const query = createQueryMock({
      data: null,
      error: { code: '23514', message: 'violates check constraint "community_reports_reason_check"' },
    });
    const { client } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.reportPost('post-1', { reason: 'spam' })).resolves.toMatchObject({
      ok: false,
      code: 'supabase_write_failed',
      message: communityReportSubmitFailureMessage,
    });
  });

  test('documents one-image policy while upload remains disabled', async () => {
    expect(communityImagePolicy.bucketName).toBe('community-post-images');
    expect(communityImagePolicy.maxImagesPerPost).toBe(1);
    expect(communityImagePolicy.maxSizeBytes).toBe(3 * 1024 * 1024);
    expect(communityImagePolicy.storageEnabled).toBe(false);

    const file = new File(['x'], 'post.jpg', { type: 'image/jpeg' });
    expect(validateCommunityImageFile(file)).toMatchObject({ ok: true });
    await expect(uploadCommunityPostImage(file)).resolves.toMatchObject({
      ok: false,
      code: 'storage_not_ready',
    });

    const wrongType = new File(['x'], 'post.gif', { type: 'image/gif' });
    expect(validateCommunityImageFile(wrongType)).toMatchObject({
      ok: false,
      code: 'storage_not_ready',
    });

    const oversized = new File([new Uint8Array(communityImagePolicy.maxSizeBytes + 1)], 'post.jpg', {
      type: 'image/jpeg',
    });
    expect(validateCommunityImageFile(oversized)).toMatchObject({
      ok: false,
      code: 'storage_not_ready',
    });
  });

  test('uploads community images to the user/post folder when staging writes are enabled', async () => {
    const upload = vi.fn(async () => ({ data: { path: 'ok' }, error: null }));
    const storageClient = {
      storage: {
        from: vi.fn(() => ({ upload })),
      },
    } as unknown as Pick<SupabaseClient, 'storage'>;
    const file = new File(['x'], 'post photo.jpg', { type: 'image/jpeg' });

    await expect(
      uploadCommunityPostImage(file, {
        client: storageClient,
        userId: userA.id,
        postId: 'post-1',
        writesEnabled: false,
      }),
    ).resolves.toMatchObject({
      ok: false,
      code: 'storage_not_ready',
    });

    await expect(
      uploadCommunityPostImage(file, {
        client: storageClient,
        userId: userA.id,
        postId: 'post-1',
        writesEnabled: true,
        fileNamePrefix: 'fixed',
      }),
    ).resolves.toMatchObject({
      ok: true,
      data: {
        imagePath: `${userA.id}/post-1/fixed-post-photo.jpg`,
      },
    });
    expect(storageClient.storage.from).toHaveBeenCalledWith('community-post-images');
    expect(upload).toHaveBeenCalledWith(`${userA.id}/post-1/fixed-post-photo.jpg`, file, {
      contentType: 'image/jpeg',
      upsert: false,
    });
  });

  test('keeps notification creation/read behavior backend-needed until verified', async () => {
    await expect(listCommunityNotifications()).resolves.toMatchObject({
      ok: false,
      code: 'notification_backend_needed',
    });
    await expect(markCommunityNotificationRead('notification-1')).resolves.toMatchObject({
      ok: false,
      code: 'notification_backend_needed',
    });
  });

  test('route smoke list keeps community and preserved app routes', () => {
    const routeList = mvpRouteGroups.flatMap((group) => group.routes.map((route) => route.route));
    const readiness = getCommunityReadiness();

    expect(readiness.path).toBe('gated');
    expect(routeList).toContain('/app');
    expect(routeList).toContain('/app/community');
    expect(routeList).toContain('/app/prices');
    expect(routeList).toContain('/app/calculators');
    expect(routeList).toContain('/app/ai');
    expect(routeList).toContain('/app/weather');
    expect(routeList).toContain('/app/my-farm');
    expect(routeList).toContain('/app/farm-records');
    expect(routeList).toContain('/app/help');
    expect(routeList).toContain('/app/profile');
    expect(routeList).toContain('/app/login');
    expect(routeList).toContain('/app/notifications');
  });

  test('ships staging SQL/docs without frontend service-role env keys', () => {
    const root = process.cwd();
    const sqlPath = join(root, 'supabase/sql/community_v1_schema_m110.sql');
    const verificationPath = join(root, 'docs/community/COMMUNITY_STAGING_VERIFICATION_M110.md');
    const notificationPath = join(root, 'docs/community/COMMUNITY_NOTIFICATION_STRATEGY_M110.md');
    const appliedStatusPath = join(root, 'docs/community/COMMUNITY_STAGING_APPLIED_STATUS_M112.md');
    const twoUserPath = join(root, 'docs/community/COMMUNITY_TWO_USER_RLS_TEST_M112.md');
    const adapterReadinessPath = join(root, 'docs/community/COMMUNITY_WRITE_ADAPTER_READINESS_M112.md');
    const evidencePath = join(root, 'docs/community/COMMUNITY_TWO_USER_EVIDENCE_STATUS_M113.md');
    const stagingFlagGuidePath = join(root, 'docs/community/COMMUNITY_STAGING_WRITE_FLAG_ENABLEMENT_M114.md');
    const uiChecklistPath = join(root, 'docs/community/COMMUNITY_STAGING_UI_WRITE_TEST_CHECKLIST_M114.md');
    const commentReplyLikeSqlPath = join(root, 'supabase/sql/community_comment_replies_likes_m116_3.sql');
    const commentReplyLikeDocPath = join(root, 'docs/community/COMMUNITY_COMMENT_REPLY_LIKE_M116_3.md');
    const authorDisplayDocPath = join(root, 'docs/community/COMMUNITY_AUTHOR_DISPLAY_NAME_M116_6.md');
    const envExample = readFileSync(join(root, '.env.example'), 'utf8');
    const envSource = readFileSync(join(root, 'src/config/env.ts'), 'utf8');
    const sql = readFileSync(sqlPath, 'utf8');

    expect(existsSync(sqlPath)).toBe(true);
    expect(existsSync(verificationPath)).toBe(true);
    expect(existsSync(notificationPath)).toBe(true);
    expect(existsSync(appliedStatusPath)).toBe(true);
    expect(existsSync(twoUserPath)).toBe(true);
    expect(existsSync(adapterReadinessPath)).toBe(true);
    expect(existsSync(evidencePath)).toBe(true);
    expect(existsSync(stagingFlagGuidePath)).toBe(true);
    expect(existsSync(uiChecklistPath)).toBe(true);
    expect(existsSync(commentReplyLikeSqlPath)).toBe(true);
    expect(existsSync(commentReplyLikeDocPath)).toBe(true);
    expect(existsSync(authorDisplayDocPath)).toBe(true);
    expect(sql).toContain('community_posts');
    expect(sql).toContain('community_notifications');
    expect(sql).toContain('community-post-images');
    expect(sql).toContain('enable row level security');
    expect(envExample).toContain('VITE_ENABLE_COMMUNITY_WRITES=false');
    expect(envExample).not.toMatch(/VITE_.*SERVICE/i);
    expect(envSource).not.toMatch(/SERVICE_ROLE/i);
  });
});
