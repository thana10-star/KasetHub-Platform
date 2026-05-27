import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import App from '@/app/App';
import { CommunityModerationPage } from '@/routes/CommunityModerationPage';
import type { SupabaseAuthSessionSnapshot } from '@/services/auth/supabase-auth-session';
import type { CommunityModerationReportQueueItem } from '@/services/community/community-moderation-review-service';

const signedOutSession: SupabaseAuthSessionSnapshot = {
  isConfigured: true,
  canUseAuth: true,
  isSignedIn: false,
  message: 'signed out',
};

const nonAdminSession: SupabaseAuthSessionSnapshot = {
  isConfigured: true,
  canUseAuth: true,
  isSignedIn: true,
  userId: '00000000-0000-4000-8000-00000000000b',
  userIdMasked: '000000...000b',
  email: 'farmer@example.com',
  message: 'signed in',
};

const adminSession: SupabaseAuthSessionSnapshot = {
  isConfigured: true,
  canUseAuth: true,
  isSignedIn: true,
  userId: '00000000-0000-4000-8000-00000000000a',
  userIdMasked: '000000...000a',
  email: 'owner@example.com',
  message: 'signed in',
};

function queueItem(
  overrides: Partial<CommunityModerationReportQueueItem> = {},
): CommunityModerationReportQueueItem {
  return {
    id: 'report-1',
    reason: 'spam',
    reasonLabel: 'สแปม',
    reporterUserId: '00000000-0000-4000-8000-00000000000b',
    reporterUserLabel: 'ผู้ใช้ที่แจ้ง 000000...000b',
    targetType: 'post',
    targetId: 'post-1',
    targetPreview: 'โพสต์ที่ถูกรายงานจาก staging',
    targetAuthorDisplayName: 'User A',
    createdAt: '2026-05-27T00:00:00.000Z',
    status: 'pending',
    ...overrides,
  };
}

function renderModerationPage(
  authSessionOverride: SupabaseAuthSessionSnapshot,
  items: CommunityModerationReportQueueItem[] = [],
) {
  return renderToString(
    <MemoryRouter>
      <CommunityModerationPage
        adminEmailsOverride={['owner@example.com']}
        authSessionOverride={authSessionOverride}
        initialQueueResult={{ ok: true, data: items }}
      />
    </MemoryRouter>,
  );
}

describe('M116.13 Community moderation review dashboard', () => {
  test('route /app/community-moderation renders a signed-out admin gate', () => {
    const html = renderToString(
      <MemoryRouter initialEntries={['/app/community-moderation']}>
        <App />
      </MemoryRouter>,
    );

    expect(html).toContain('ตรวจรายงานชุมชน');
    expect(html).toContain('เข้าสู่ระบบก่อนดูรายงานชุมชน');
    expect(html).toContain('/app/login?next=/app/community-moderation');
  });

  test('signed-out users see login-required state and no report data', () => {
    const html = renderModerationPage(signedOutSession, [queueItem()]);

    expect(html).toContain('เข้าสู่ระบบก่อนดูรายงานชุมชน');
    expect(html).not.toContain('โพสต์ที่ถูกรายงานจาก staging');
  });

  test('signed-in non-admin users see no-access state and no report data', () => {
    const html = renderModerationPage(nonAdminSession, [queueItem()]);

    expect(html).toContain('ไม่มีสิทธิ์เข้าถึงหน้านี้');
    expect(html).not.toContain('โพสต์ที่ถูกรายงานจาก staging');
  });

  test('admin users see dashboard title, summary cards, and empty queue state', () => {
    const html = renderModerationPage(adminSession);

    expect(html).toContain('ตรวจรายงานชุมชน');
    expect(html).toContain('รายงานทั้งหมด');
    expect(html).toContain('รอตรวจสอบ');
    expect(html).toContain('โพสต์ถูกรายงาน');
    expect(html).toContain('คอมเมนต์ถูกรายงาน');
    expect(html).toContain('ยังไม่มีรายงานรอตรวจสอบ');
  });

  test('report reason codes display Thai labels in the queue', () => {
    const html = renderModerationPage(adminSession, [
      queueItem({ id: 'report-spam', reason: 'spam', reasonLabel: 'สแปม' }),
      queueItem({
        id: 'report-danger',
        reason: 'dangerous_information',
        reasonLabel: 'ข้อมูลอันตราย',
        targetId: 'post-2',
      }),
      queueItem({
        id: 'report-personal',
        reason: 'personal_information',
        reasonLabel: 'ข้อมูลส่วนตัว',
        targetId: 'post-3',
      }),
      queueItem({
        id: 'report-inappropriate',
        reason: 'inappropriate',
        reasonLabel: 'เนื้อหาไม่เหมาะสม',
        targetId: 'post-4',
      }),
      queueItem({ id: 'report-other', reason: 'other', reasonLabel: 'อื่น ๆ', targetId: 'post-5' }),
    ]);

    expect(html).toContain('สแปม');
    expect(html).toContain('ข้อมูลอันตราย');
    expect(html).toContain('ข้อมูลส่วนตัว');
    expect(html).toContain('เนื้อหาไม่เหมาะสม');
    expect(html).toContain('อื่น ๆ');
  });

  test('report list displays post and comment previews without full private email', () => {
    const html = renderModerationPage(adminSession, [
      queueItem({
        id: 'report-post',
        targetType: 'post',
        targetId: 'post-1',
        targetPreview: 'ตัวอย่างโพสต์',
        targetAuthorDisplayName: 'reporter@example.com',
      }),
      queueItem({
        id: 'report-comment',
        targetType: 'comment',
        targetId: 'comment-1',
        targetPreview: 'ตัวอย่างคอมเมนต์',
        targetAuthorDisplayName: 'User B',
      }),
    ]);

    expect(html).toContain('ตัวอย่างโพสต์');
    expect(html).toContain('ตัวอย่างคอมเมนต์');
    expect(html).toContain('โพสต์');
    expect(html).toContain('คอมเมนต์');
    expect(html).toContain('ผู้เขียนในชุมชน');
    expect(html).not.toContain('reporter@example.com');
  });

  test('review and hide actions render as safe status/hide controls', () => {
    const html = renderModerationPage(adminSession, [
      queueItem({ id: 'report-post', targetType: 'post', targetId: 'post-1' }),
      queueItem({ id: 'report-comment', targetType: 'comment', targetId: 'comment-1' }),
    ]);

    expect(html).toContain('ดูรายละเอียด');
    expect(html).toContain('ทำเครื่องหมายว่าตรวจแล้ว');
    expect(html).toContain('ซ่อนโพสต์');
    expect(html).toContain('ซ่อนคอมเมนต์');
    expect(html).toContain('/app/community');
  });

  test('backend-not-connected state renders safe setup copy', () => {
    const html = renderToString(
      <MemoryRouter>
        <CommunityModerationPage
          adminEmailsOverride={['owner@example.com']}
          authSessionOverride={adminSession}
          initialQueueResult={{
            ok: false,
            code: 'moderation_rpc_not_ready',
            message: 'ยังไม่ได้เชื่อมต่อคิวรายงานจากฐานข้อมูล',
          }}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('ยังไม่ได้เชื่อมต่อคิวรายงานจากฐานข้อมูล');
    expect(html).toContain('SQL draft');
  });
});
