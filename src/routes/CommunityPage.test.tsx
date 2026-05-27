import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { CommunityPage } from '@/routes/CommunityPage';
import {
  applyCommunityLikeUiState,
  formatCommunityTime,
  getCommunityAuthorDisplayName,
  getCommunityComposerStatusLabel,
  getCommunityComposerSubmitLabel,
  getCommunityEmailLocalPart,
  getCommunityWriteStatusCopy,
  getSafeCommunityComments,
  reconcileCommunityPostsAfterLikeRefresh,
} from '@/routes/community-page-helpers';
import { communitySignInGateMessage } from '@/services/community/community-service';
import type {
  CommunityActionResult,
  CommunityComment,
  CommunityPost,
  CommunityListPostsResult,
  CommunityReadiness,
  CommunityService,
} from '@/services/community/community.types';
import { communityFallbackPostCategory } from '@/services/community/community.types';

function readinessForTest(overrides: Partial<CommunityReadiness> = {}): CommunityReadiness {
  return {
    path: 'gated',
    canReadPublishedPosts: true,
    canWrite: false,
    canUploadImage: false,
    canCreateNotifications: false,
    writesFeatureFlagEnabled: false,
    hasAuthenticatedUser: false,
    backendServiceReady: true,
    writeGateMessage: 'ชุมชนพร้อมเชื่อมต่อฐานข้อมูลแล้ว เหลือทดสอบบัญชีและสิทธิ์ก่อนเปิดโพสต์จริง',
    imageGateMessage: 'แนบรูปจะเปิดใช้งานหลังตั้งค่าพื้นที่เก็บรูป',
    blockers: [],
    ...overrides,
  };
}

function createNoopCommunityService(readiness: CommunityReadiness): CommunityService {
  const gated = async <T,>(): Promise<CommunityActionResult<T>> => ({
    ok: false,
    code: 'feature_flag_disabled',
    message: readiness.writeGateMessage,
  });

  return {
    getReadiness: () => readiness,
    listPosts: async (): Promise<CommunityListPostsResult> => ({ posts: [], readiness }),
    createPost: async () => gated(),
    hideOwnPost: async () => gated(),
    deleteOwnPost: async () => gated(),
    listComments: async () => ({ ok: true, data: [] }),
    createComment: async () => gated(),
    createReply: async () => gated(),
    hideOwnComment: async () => gated(),
    likePost: async () => gated(),
    unlikePost: async () => gated(),
    likeComment: async () => gated(),
    unlikeComment: async () => gated(),
    reportPost: async () => gated(),
    reportComment: async () => gated(),
    listNotifications: async () => gated(),
    markNotificationRead: async () => gated(),
  };
}

describe('M114 Community route', () => {
  const basePost: CommunityPost = {
    id: 'post-1',
    authorUserId: 'user-a',
    contentText: 'real staging post',
    category: communityFallbackPostCategory,
    status: 'published',
    likeCount: 0,
    commentCount: 0,
    reportCount: 0,
    createdAt: '2026-05-26T00:00:00.000Z',
    updatedAt: '2026-05-26T00:00:00.000Z',
    likedByCurrentUser: false,
  };

  const baseComment: CommunityComment = {
    id: 'comment-1',
    postId: 'post-1',
    authorUserId: 'user-b',
    authorDisplayName: 'User B',
    contentText: 'real comment',
    status: 'published',
    likeCount: 0,
    replyCount: 1,
    reportCount: 0,
    createdAt: '2026-05-26T13:39:00.000Z',
    updatedAt: '2026-05-26T13:39:00.000Z',
    likedByCurrentUser: false,
    ownedByCurrentUser: false,
  };

  const baseReply: CommunityComment = {
    ...baseComment,
    id: 'reply-1',
    parentCommentId: 'comment-1',
    authorDisplayName: 'User A',
    contentText: 'one-level reply',
    likeCount: 1,
    replyCount: 0,
    createdAt: '2026-05-26T13:40:00.000Z',
    updatedAt: '2026-05-26T13:40:00.000Z',
  };

  test('renders the gated Community Feed V1 staging foundation without fake engagement', () => {
    const html = renderToString(
      <MemoryRouter>
        <CommunityPage />
      </MemoryRouter>,
    );

    expect(html).toContain('ชุมชนเกษตร');
    expect(html).toContain('อ่าน แบ่งปัน และถามปัญหาเกษตรกับคนทำเกษตร');
    expect(html).toContain('เขียนโพสต์');
    expect(html).toContain('เล่าเรื่องฟาร์ม ถามปัญหาพืช หรือแชร์ประสบการณ์');
    expect(html).toContain('ยังไม่เปิดเขียนโพสต์');
    expect(html).toContain('ตอนนี้อ่านและแชร์ได้ก่อน ระบบเขียนโพสต์จะเปิดหลังตั้งค่าบัญชี');
    expect(html).toContain('เปิดใช้งานหลังตั้งค่าบัญชี');
    expect(html).toContain('แนบรูปได้เมื่อเปิดเขียนโพสต์');
    expect(html).toContain('โพสต์ล่าสุด');
    expect(html).toContain('ยังไม่มีโพสต์ชุมชนจริง');
    expect(html).toContain('ไม่ใช้โพสต์ปลอม');
    expect(html).not.toContain('เปิดเขียนหลังตรวจสอบความปลอดภัย');
    expect(html).not.toContain('เปิดเขียนหลังตรวจความปลอดภัย');
    expect(html).not.toContain('ทดสอบ staging');
    expect(html).not.toContain('คุณสายฝน');
    expect(html).not.toContain('ตัวอย่าง 18 นาที');
  });

  test('renders categories, safety copy, share options, report summary, and notification gate', () => {
    const html = renderToString(
      <MemoryRouter>
        <CommunityPage />
      </MemoryRouter>,
    );

    expect(html).toContain('ปัญหาพืช');
    expect(html).toContain('ดินและปุ๋ย');
    expect(html).toContain('น้ำและระบบน้ำ');
    expect(html).toContain('อากาศ');
    expect(html).toContain('ราคาเกษตร');
    expect(html).toContain('เครื่องมือ/แอพ');
    expect(html).toContain('เรื่องเล่าจากฟาร์ม');
    expect(html).toContain('อื่น ๆ');
    expect((html.match(/น้ำและระบบน้ำ/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(html).toContain('flex flex-wrap gap-2');
    expect(html).toContain('อย่าใส่เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวสำคัญ');
    expect(html).toContain('ข้อมูลจากชุมชนควรตรวจสอบก่อนนำไปใช้จริง');
    expect(html).toContain('เรื่องสารเคมีควรตรวจฉลากและคำแนะนำเจ้าหน้าที่ก่อนใช้');
    expect(html).toContain('แชร์ชุมชน');
    expect(html).toContain('LINE');
    expect(html).toContain('Facebook');
    expect(html).toContain('รายงานโพสต์หรือคอมเมนต์');
    expect(html).toContain('ปุ่มรายงานในแต่ละโพสต์จะเปิดหน้าต่างเลือกเหตุผลแยกต่างหาก');
    expect(html).toContain('แจ้งเตือนในแอป');
    expect(html).toContain('/app/notifications');
  });

  test('shows auth-required state when staging flag is true but no real user is signed in', () => {
    const readiness = readinessForTest({
      writesFeatureFlagEnabled: true,
      hasAuthenticatedUser: false,
      writeGateMessage: communitySignInGateMessage,
    });

    const html = renderToString(
      <MemoryRouter>
        <CommunityPage
          readinessOverride={readiness}
          serviceOverride={createNoopCommunityService(readiness)}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('เข้าสู่ระบบเพื่อเขียนโพสต์');
    expect(html).toContain('เข้าสู่ระบบก่อนใช้งานชุมชน');
    expect(html).toContain('/app/login?next=/app/community');
    expect(html).toContain('ยังไม่มีโพสต์ชุมชนจริง');
    expect(html).not.toContain('คุณสายฝน');
  });

  test('renders compact post actions, comment actions, and readable time text', () => {
    const readiness = readinessForTest({
      path: 'real',
      canWrite: true,
      canUploadImage: true,
      writesFeatureFlagEnabled: true,
      hasAuthenticatedUser: true,
      writeGateMessage: 'ready',
      imageGateMessage: 'ready',
    });
    const post = {
      ...basePost,
      authorDisplayName: 'User A',
      contentText: 'real staging post with actions',
      likeCount: 1,
      commentCount: 2,
      createdAt: '2026-05-26T13:37:00.000Z',
      updatedAt: '2026-05-26T13:37:00.000Z',
      likedByCurrentUser: true,
      ownedByCurrentUser: true,
    };

    const html = renderToString(
      <MemoryRouter>
        <CommunityPage
          initialCommentsByPost={{
            'post-1': [baseComment, baseReply],
          }}
          initialOpenCommentsByPost={{ 'post-1': true }}
          initialPosts={[post]}
          readinessOverride={readiness}
          serviceOverride={createNoopCommunityService(readiness)}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('data-testid="community-post-actions"');
    expect(html).toContain('min-h-9 gap-1.5 px-3 text-xs');
    expect(html).toMatch(/ถูกใจ\s*(?:<!-- -->)?1/);
    expect(html).toContain('rounded-full bg-kaset-deep px-1.5 text-[11px] font-extrabold leading-4 text-white');
    expect(html).toMatch(/คอมเมนต์(?:<\/span>)?<span[^>]*>2/);
    expect(html).toContain('แชร์');
    expect(html).toContain('รายงาน');
    expect(html).toContain('ตอบกลับ');
    expect(html).toContain('ซ่อน');
    expect(html).toContain('ลบ');
    expect(html).toContain(formatCommunityTime(post.createdAt));
    expect(html).toContain(formatCommunityTime(baseComment.createdAt));
    expect(html).toContain(formatCommunityTime(baseReply.createdAt));
    expect(html).not.toContain(post.createdAt);
    expect(html).not.toContain(baseComment.createdAt);
    expect(html).not.toContain('เหตุผลรายงาน</label>');
    expect(html).not.toContain('<select');
  });

  test('shows backend comment count on a closed post card without opening comments first', () => {
    const readiness = readinessForTest({
      path: 'real',
      canWrite: true,
      canUploadImage: true,
      writesFeatureFlagEnabled: true,
      hasAuthenticatedUser: true,
      writeGateMessage: 'ready',
      imageGateMessage: 'ready',
    });
    const post = {
      ...basePost,
      commentCount: 3,
    };

    const html = renderToString(
      <MemoryRouter>
        <CommunityPage
          initialOpenCommentsByPost={{}}
          initialPosts={[post]}
          readinessOverride={readiness}
          serviceOverride={createNoopCommunityService(readiness)}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('คอมเมนต์');
    expect(html).toMatch(/คอมเมนต์(?:<\/span>)?<span[^>]*>3/);
    expect(html).not.toContain('ยังไม่มีคอมเมนต์จริง');
  });

  test('renders privacy-safe author display names without public full emails', () => {
    const readiness = readinessForTest({
      path: 'real',
      canWrite: true,
      canUploadImage: true,
      writesFeatureFlagEnabled: true,
      hasAuthenticatedUser: true,
      writeGateMessage: 'ready',
      imageGateMessage: 'ready',
    });

    const html = renderToString(
      <MemoryRouter>
        <CommunityPage
          authSessionOverride={{
            isConfigured: true,
            canUseAuth: true,
            isSignedIn: true,
            userId: 'user-a',
            email: 'community-user-a@test.local',
            message: 'signed in',
          }}
          initialPosts={[
            {
              ...basePost,
              authorDisplayName: undefined,
              ownedByCurrentUser: true,
            },
            {
              ...basePost,
              id: 'post-2',
              authorUserId: 'user-b',
              authorDisplayName: undefined,
              ownedByCurrentUser: false,
            },
          ]}
          readinessOverride={readiness}
          serviceOverride={createNoopCommunityService(readiness)}
        />
      </MemoryRouter>,
    );

    expect(getCommunityEmailLocalPart('community-user-a@test.local')).toBe('community-user-a');
    expect(getCommunityAuthorDisplayName({ authorDisplayName: 'Somchai', ownedByCurrentUser: false })).toBe('Somchai');
    expect(getCommunityAuthorDisplayName({ ownedByCurrentUser: false })).toBe('สมาชิก KasetHub');
    expect(html).toContain('community-user-a');
    expect(html).toContain('สมาชิก KasetHub');
    expect(html).not.toContain('community-user-a@test.local');
    expect(html).not.toContain('ผู้ใช้ KasetHub');
  });

  test('renders the report dialog with reasons, note, and submit button when opened', () => {
    const readiness = readinessForTest({
      path: 'real',
      canWrite: true,
      canUploadImage: true,
      writesFeatureFlagEnabled: true,
      hasAuthenticatedUser: true,
      writeGateMessage: 'ready',
      imageGateMessage: 'ready',
    });

    const html = renderToString(
      <MemoryRouter>
        <CommunityPage
          initialPosts={[basePost]}
          initialReportDialogTarget={{ type: 'post', id: 'post-1' }}
          readinessOverride={readiness}
          serviceOverride={createNoopCommunityService(readiness)}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('รายงานโพสต์');
    expect(html).toContain('เลือกเหตุผลที่ต้องการแจ้ง ทีมงานจะตรวจสอบ');
    expect(html).toContain('สแปม');
    expect(html).toContain('ข้อมูลอันตราย');
    expect(html).toContain('ข้อมูลส่วนตัว');
    expect(html).toContain('เนื้อหาไม่เหมาะสม');
    expect(html).toContain('value="inappropriate"');
    expect(html).not.toContain('value="inappropriate_content"');
    expect(html).toContain('อื่น ๆ');
    expect(html).toContain('รายละเอียดเพิ่มเติม (ถ้ามี)');
    expect(html).toContain('ส่งรายงาน');
    expect(html).toContain('ยกเลิก');
  });

  test('renders a friendly gated message inside the report dialog when reports cannot write yet', () => {
    const readiness = readinessForTest();

    const html = renderToString(
      <MemoryRouter>
        <CommunityPage
          initialPosts={[basePost]}
          initialReportDialogTarget={{ type: 'post', id: 'post-1' }}
          readinessOverride={readiness}
          serviceOverride={createNoopCommunityService(readiness)}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('รายงานโพสต์');
    expect(html).toContain('ตอนนี้อ่านและแชร์ได้ก่อน ระบบเขียนโพสต์จะเปิดหลังตั้งค่าบัญชี');
    expect(html).toContain('disabled=""');
  });

  test('renders composer submit/status copy by write state without technical gate language', () => {
    const disabledReadiness = readinessForTest();
    const signedOutReadiness = readinessForTest({
      writesFeatureFlagEnabled: true,
      hasAuthenticatedUser: false,
      writeGateMessage: communitySignInGateMessage,
    });
    const enabledReadiness = readinessForTest({
      path: 'real',
      canWrite: true,
      canUploadImage: true,
      writesFeatureFlagEnabled: true,
      hasAuthenticatedUser: true,
      writeGateMessage: 'ready',
      imageGateMessage: 'ready',
    });

    expect(getCommunityComposerStatusLabel(disabledReadiness)).toBe('ยังไม่เปิดเขียนโพสต์');
    expect(getCommunityComposerSubmitLabel(disabledReadiness)).toBe('เปิดใช้งานหลังตั้งค่าบัญชี');
    expect(getCommunityWriteStatusCopy(disabledReadiness)).toBe(
      'ตอนนี้อ่านและแชร์ได้ก่อน ระบบเขียนโพสต์จะเปิดหลังตั้งค่าบัญชี',
    );
    expect(getCommunityComposerStatusLabel(signedOutReadiness)).toBe('เข้าสู่ระบบก่อน');
    expect(getCommunityComposerSubmitLabel(signedOutReadiness)).toBe('เข้าสู่ระบบเพื่อเขียนโพสต์');
    expect(getCommunityComposerStatusLabel(enabledReadiness)).toBe('พร้อมใช้งาน');
    expect(getCommunityComposerSubmitLabel(enabledReadiness)).toBe('ส่งโพสต์');

    const html = renderToString(
      <MemoryRouter>
        <CommunityPage
          readinessOverride={enabledReadiness}
          serviceOverride={createNoopCommunityService(enabledReadiness)}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('พร้อมใช้งาน');
    expect(html).toContain('ส่งโพสต์');
    expect(html).not.toContain('เปิดเขียนหลังตรวจสอบความปลอดภัย');
    expect(html).not.toContain('เปิดเขียนหลังตรวจความปลอดภัย');
    expect(html).not.toContain('ทดสอบ staging');
  });

  test('updates like count locally only after a successful like/unlike state change', () => {
    const liked = applyCommunityLikeUiState([basePost], 'post-1', true);
    expect(liked[0]).toMatchObject({
      likedByCurrentUser: true,
      likeCount: 1,
    });

    const duplicateLike = applyCommunityLikeUiState(liked, 'post-1', true);
    expect(duplicateLike[0]).toMatchObject({
      likedByCurrentUser: true,
      likeCount: 1,
    });

    const unliked = applyCommunityLikeUiState(duplicateLike, 'post-1', false);
    expect(unliked[0]).toMatchObject({
      likedByCurrentUser: false,
      likeCount: 0,
    });
  });

  test('preserves optimistic like count when backend post counters are stale', () => {
    const currentPosts = applyCommunityLikeUiState([basePost], 'post-1', true);
    const staleRefresh: CommunityPost[] = [
      {
        ...basePost,
        likedByCurrentUser: true,
        likeCount: 0,
      },
    ];

    expect(reconcileCommunityPostsAfterLikeRefresh(currentPosts, staleRefresh, 'post-1', true)[0]).toMatchObject({
      likedByCurrentUser: true,
      likeCount: 1,
    });
  });

  test('keeps the locally updated post if a refresh omits it after like success', () => {
    const currentPosts = applyCommunityLikeUiState([basePost], 'post-1', true);

    expect(reconcileCommunityPostsAfterLikeRefresh(currentPosts, [], 'post-1', true)[0]).toMatchObject({
      id: 'post-1',
      likedByCurrentUser: true,
      likeCount: 1,
    });
  });

  test('keeps comment rendering safe for undefined or empty comment arrays', () => {
    expect(getSafeCommunityComments(undefined)).toEqual([]);
    expect(getSafeCommunityComments(null)).toEqual([]);
    expect(getSafeCommunityComments([])).toEqual([]);
  });
});
