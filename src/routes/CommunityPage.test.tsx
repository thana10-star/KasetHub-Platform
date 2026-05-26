import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { CommunityPage } from '@/routes/CommunityPage';
import { communitySignInGateMessage } from '@/services/community/community-service';
import type {
  CommunityActionResult,
  CommunityListPostsResult,
  CommunityReadiness,
  CommunityService,
} from '@/services/community/community.types';

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
    hideOwnComment: async () => gated(),
    likePost: async () => gated(),
    unlikePost: async () => gated(),
    reportPost: async () => gated(),
    reportComment: async () => gated(),
    listNotifications: async () => gated(),
    markNotificationRead: async () => gated(),
  };
}

describe('M114 Community route', () => {
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
    expect(html).toContain('ชุมชนพร้อมเชื่อมต่อฐานข้อมูลแล้ว เหลือทดสอบบัญชีและสิทธิ์ก่อนเปิดโพสต์จริง');
    expect(html).toContain('ตอนนี้อ่านและแชร์ได้ก่อน');
    expect(html).toContain('เปิดเขียนหลังตรวจความปลอดภัย');
    expect(html).toContain('แนบรูปจะเปิดใช้งานหลังตั้งค่าพื้นที่เก็บรูป');
    expect(html).toContain('โพสต์ล่าสุด');
    expect(html).toContain('ยังไม่มีโพสต์ชุมชนจริง');
    expect(html).toContain('ไม่ใช้โพสต์ปลอม');
    expect(html).not.toContain('คุณสายฝน');
    expect(html).not.toContain('ตัวอย่าง 18 นาที');
  });

  test('renders categories, safety copy, share options, report reasons, and notification gate', () => {
    const html = renderToString(
      <MemoryRouter>
        <CommunityPage />
      </MemoryRouter>,
    );

    expect(html).toContain('ปัญหาพืช');
    expect(html).toContain('ดินและปุ๋ย');
    expect(html).toContain('เรื่องเล่าจากฟาร์ม');
    expect(html).toContain('อย่าใส่เบอร์โทร ที่อยู่ หรือข้อมูลส่วนตัวสำคัญ');
    expect(html).toContain('ข้อมูลจากชุมชนควรตรวจสอบก่อนนำไปใช้จริง');
    expect(html).toContain('เรื่องสารเคมีควรตรวจฉลากและคำแนะนำเจ้าหน้าที่ก่อนใช้');
    expect(html).toContain('แชร์ชุมชน');
    expect(html).toContain('LINE');
    expect(html).toContain('Facebook');
    expect(html).toContain('สแปม');
    expect(html).toContain('ข้อมูลอันตราย');
    expect(html).toContain('ข้อมูลส่วนตัว');
    expect(html).toContain('เนื้อหาไม่เหมาะสม');
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

    expect(html).toContain(communitySignInGateMessage);
    expect(html).toContain('ยังไม่มีโพสต์ชุมชนจริง');
    expect(html).not.toContain('คุณสายฝน');
  });
});
