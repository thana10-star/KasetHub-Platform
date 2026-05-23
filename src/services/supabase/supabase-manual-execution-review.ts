import { summarizeSupabaseSetupProgress } from '@/services/supabase/supabase-setup-progress';
import type { SupabaseManualExecutionReview } from '@/services/supabase/supabase-manual-execution-review.types';
import type { SupabaseSetupProgressState } from '@/services/supabase/supabase-setup-progress.types';

export const supabaseManualExecutionReviewStatusOptions: SupabaseManualExecutionReview['statusOptions'] = [
  {
    status: 'pending',
    label: 'pending',
    detail: 'รอผล manual setup จาก Supabase Dashboard หรือ screenshot/error ที่ user ส่งมา',
  },
  {
    status: 'success',
    label: 'success',
    detail: 'schema SQL และ RLS SQL สำเร็จ tables/RLS ตรวจแล้ว และไม่มี public write policy',
  },
  {
    status: 'needs_sql_fix',
    label: 'needs SQL fix',
    detail: 'พบ SQL error ที่ต้องแก้แบบ minimal และรันด้วยมืออีกครั้งบน staging เท่านั้น',
  },
  {
    status: 'blocked',
    label: 'blocked',
    detail: 'หยุดก่อน เพราะ project/env/secret/RLS state ยังไม่ปลอดภัยพอสำหรับขั้นต่อไป',
  },
];

export function buildSupabaseManualExecutionReview(
  setupState?: SupabaseSetupProgressState,
): SupabaseManualExecutionReview {
  const setupProgress = summarizeSupabaseSetupProgress(setupState);
  const setupComplete = setupProgress.completedCount === setupProgress.totalCount;

  return {
    milestone: 'M42',
    status: 'pending',
    statusLabel: 'pending',
    statusTone: 'warning',
    statusDetail: setupComplete
      ? 'local M41 checklist ครบแล้ว แต่ยังรอหลักฐานจาก Supabase Dashboard เพื่อสรุปผล M42'
      : 'ยังรอผล manual Supabase staging execution และหลักฐานจากผู้ทำ setup',
    nextSafeStep: 'ส่งผล manual setup หรือ SQL error มาให้ review ก่อนเปิด auth/cloud sync',
    requestedEvidence: [
      'Supabase project created? yes/no',
      'schema SQL ran successfully? yes/no',
      'RLS SQL ran successfully? yes/no',
      'screenshots or copied SQL errors, if any',
      'tables appear in Table Editor? yes/no',
      'RLS appears enabled? yes/no',
    ],
    blockers: [
      'ยังไม่มีผล manual execution ที่ยืนยันจาก Dashboard',
      'ยังไม่มี screenshot หรือ copied SQL error สำหรับ review',
      'ยังไม่ควรเปิด auth หรือ cloud sync จนกว่า M42 review จะเป็น success',
    ],
    sqlErrorNotes: [
      'No SQL error has been provided in the repo yet.',
      'If an error is provided, document the exact text and propose the smallest safe correction.',
    ],
    proposedFixNotes: [
      'No schema/RLS change is proposed until an exact SQL error is reviewed.',
      'Do not run SQL automatically from the app or Codex.',
    ],
    safetyNotes: [
      'No real keys in repo.',
      'No .env.local commit.',
      'No service-role key in frontend.',
      'No auth enablement.',
      'No cloud sync.',
      'No app data writes.',
      'No destructive SQL unless explicitly instructed and reviewed.',
    ],
    statusOptions: supabaseManualExecutionReviewStatusOptions,
    docPath: 'docs/M42_SUPABASE_MANUAL_EXECUTION_REVIEW.md',
    reportPath: 'reports/milestones/M42_SUPABASE_MANUAL_STAGING_EXECUTION_REVIEW_REPORT.md',
  };
}
