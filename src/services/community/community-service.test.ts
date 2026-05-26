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
import { communityPostCategories } from '@/services/community/community.types';
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

describe('M114 gated community staging service contract', () => {
  test('exposes the V1 categories without fake engagement data', async () => {
    const service = createCommunityService(getCommunityReadiness(), {
      getClient: () => null,
    });
    const result = await service.listPosts();

    expect(communityPostCategories).toContain('ปัญหาพืช');
    expect(communityPostCategories).toContain('เรื่องเล่าจากฟาร์ม');
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
    await expect(service.likePost('post-1')).resolves.toMatchObject({
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

    await expect(service.createPost({ contentText: 'hello', category: communityPostCategories[6] })).resolves.toMatchObject({
      ok: false,
      code: 'auth_session_required',
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

  test('marks posts liked by the current user for staging unlike tests', async () => {
    const postQuery = createQueryMock({
      data: [
        {
          id: 'post-1',
          author_user_id: '00000000-0000-4000-8000-00000000000b',
          author_display_name: 'User B',
          content_text: 'real staging post',
          category: communityPostCategories[6],
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

  test('creates a post through the Supabase adapter when flag and auth are ready', async () => {
    const query = createQueryMock({
      data: {
        id: 'post-1',
        author_user_id: userA.id,
        author_display_name: 'User A',
        content_text: 'hello community',
        category: communityPostCategories[6],
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

    await expect(service.createPost({ contentText: ' hello community ', category: communityPostCategories[6] })).resolves.toMatchObject({
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
      content_text: 'hello community',
      category: communityPostCategories[6],
    }));
  });

  test('creates a comment through the Supabase adapter when flag and auth are ready', async () => {
    const query = createQueryMock({
      data: {
        id: 'comment-1',
        post_id: 'post-1',
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
      author_user_id: userA.id,
      content_text: 'reply',
    }));
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

  test('reports posts with database reason codes instead of Thai labels', async () => {
    const query = createQueryMock({ data: null, error: null });
    const { client } = createClientMock(query);
    const service = createCommunityService(enabledReadiness(), {
      getClient: () => client,
      getCurrentUser: async () => userA,
    });

    await expect(service.reportPost('post-1', { reason: 'inappropriate_content' })).resolves.toMatchObject({ ok: true });
    expect(query.insert).toHaveBeenCalledWith(expect.objectContaining({
      post_id: 'post-1',
      reporter_user_id: userA.id,
      reason: 'inappropriate',
    }));
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
    expect(sql).toContain('community_posts');
    expect(sql).toContain('community_notifications');
    expect(sql).toContain('community-post-images');
    expect(sql).toContain('enable row level security');
    expect(envExample).toContain('VITE_ENABLE_COMMUNITY_WRITES=false');
    expect(envExample).not.toMatch(/VITE_.*SERVICE/i);
    expect(envSource).not.toMatch(/SERVICE_ROLE/i);
  });
});
