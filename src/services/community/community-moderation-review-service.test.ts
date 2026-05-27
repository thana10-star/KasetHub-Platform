import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { describe, expect, test, vi } from 'vitest';
import {
  createCommunityModerationReviewService,
  maskCommunityReporterId,
} from '@/services/community/community-moderation-review-service';

function createRpcClient(result: { data: unknown; error: { code?: string; message: string } | null }) {
  const rpc = vi.fn(async () => result);
  return {
    client: { rpc } as unknown as SupabaseClient,
    rpc,
  };
}

describe('M116.13 community moderation review service', () => {
  test('lists report queue through the admin RPC and maps Thai reason labels', async () => {
    const { client, rpc } = createRpcClient({
      data: [
        {
          id: 'report-spam',
          reason: 'spam',
          reporter_user_id: '00000000-0000-4000-8000-00000000000a',
          target_type: 'post',
          target_id: 'post-1',
          target_preview: 'post preview',
          target_author_display_name: 'User A',
          created_at: '2026-05-27T00:00:00.000Z',
          status: 'pending',
        },
        {
          id: 'report-danger',
          reason: 'dangerous_information',
          reporter_user_id: '00000000-0000-4000-8000-00000000000b',
          target_type: 'comment',
          target_id: 'comment-1',
          target_preview: 'comment preview',
          target_author_display_name: 'User B',
          created_at: '2026-05-27T00:10:00.000Z',
          status: 'reviewed',
        },
        {
          id: 'report-personal',
          reason: 'personal_information',
          reporter_user_id: '00000000-0000-4000-8000-00000000000c',
          target_type: 'post',
          target_id: 'post-2',
          target_preview: 'personal preview',
          created_at: '2026-05-27T00:20:00.000Z',
          status: 'pending',
        },
        {
          id: 'report-inappropriate',
          reason: 'inappropriate',
          reporter_user_id: '00000000-0000-4000-8000-00000000000d',
          target_type: 'post',
          target_id: 'post-3',
          target_preview: 'inappropriate preview',
          created_at: '2026-05-27T00:30:00.000Z',
          status: 'pending',
        },
        {
          id: 'report-other',
          reason: 'other',
          reporter_user_id: '00000000-0000-4000-8000-00000000000e',
          target_type: 'comment',
          target_id: 'comment-2',
          target_preview: 'other preview',
          created_at: '2026-05-27T00:40:00.000Z',
          status: 'pending',
        },
      ],
      error: null,
    });
    const service = createCommunityModerationReviewService({ getClient: () => client });

    const result = await service.listReports();

    expect(rpc).toHaveBeenCalledWith('get_community_report_queue');
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) throw new Error(result.message);
    expect(result.data.map((item) => item.reasonLabel)).toEqual([
      'สแปม',
      'ข้อมูลอันตราย',
      'ข้อมูลส่วนตัว',
      'เนื้อหาไม่เหมาะสม',
      'อื่น ๆ',
    ]);
    expect(result.data[0].reporterUserLabel).toBe('ผู้ใช้ที่แจ้ง 000000...000a');
    expect(result.data[1].targetType).toBe('comment');
  });

  test('maps missing RPC and permission failures to safe user-facing messages', async () => {
    const missingRpc = createCommunityModerationReviewService({
      getClient: () =>
        createRpcClient({
          data: null,
          error: { code: 'PGRST202', message: 'Could not find the function public.get_community_report_queue' },
        }).client,
    });
    const deniedRpc = createCommunityModerationReviewService({
      getClient: () =>
        createRpcClient({
          data: null,
          error: { code: '42501', message: 'not community admin' },
        }).client,
    });

    await expect(missingRpc.listReports()).resolves.toMatchObject({
      ok: false,
      code: 'moderation_rpc_not_ready',
      message: 'ยังไม่ได้เชื่อมต่อคิวรายงานจากฐานข้อมูล',
    });
    await expect(deniedRpc.listReports()).resolves.toMatchObject({
      ok: false,
      code: 'admin_required',
      message: 'ไม่มีสิทธิ์เข้าถึงหน้านี้',
    });
  });

  test('uses RPC actions for reviewed and hide actions without direct report table reads', async () => {
    const { client, rpc } = createRpcClient({ data: null, error: null });
    const service = createCommunityModerationReviewService({ getClient: () => client });

    await expect(service.markReportReviewed('report-1')).resolves.toMatchObject({ ok: true });
    await expect(service.hideReportedPost('post-1')).resolves.toMatchObject({ ok: true });
    await expect(service.hideReportedComment('comment-1')).resolves.toMatchObject({ ok: true });

    expect(rpc).toHaveBeenCalledWith('mark_community_report_reviewed', { target_report_id: 'report-1' });
    expect(rpc).toHaveBeenCalledWith('hide_reported_post', { target_post_id: 'post-1' });
    expect(rpc).toHaveBeenCalledWith('hide_reported_comment', { target_comment_id: 'comment-1' });
  });

  test('does not use service-role keys in the frontend moderation service', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/services/community/community-moderation-review-service.ts'),
      'utf8',
    );

    expect(source).not.toMatch(/SERVICE_ROLE|service_role|service-role/i);
    expect(source).not.toContain(".from('community_reports')");
    expect(maskCommunityReporterId('00000000-0000-4000-8000-00000000000a')).toBe('ผู้ใช้ที่แจ้ง 000000...000a');
  });
});
