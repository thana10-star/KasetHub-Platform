import type { SupabaseManualExecutionReview } from '@/services/supabase/supabase-manual-execution-review.types';

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

export function buildSupabaseManualExecutionReview(): SupabaseManualExecutionReview {
  return {
    milestone: 'M42',
    status: 'success',
    statusLabel: 'success',
    statusTone: 'success',
    statusDetail: 'kasethub-staging created, schema SQL succeeded, 23 tables are visible, RLS SQL succeeded, and RLS is enabled from Supabase table security.',
    nextSafeStep: 'บันทึกผลสำเร็จแล้ว และยังหยุดก่อนเปิด auth/cloud sync จนกว่า milestone ถัดไปจะ review',
    verifiedResults: [
      'Supabase project created: yes',
      'Project name: kasethub-staging',
      'Schema SQL ran successfully: yes',
      'Tables visible in Table Editor: yes',
      'Table count: 23',
      'RLS policy SQL ran successfully: yes',
      'RLS enabled: yes, confirmed from Supabase table security',
      'SQL errors: none',
    ],
    requestedEvidence: [
      'Supabase project created? yes/no',
      'schema SQL ran successfully? yes/no',
      'RLS SQL ran successfully? yes/no',
      'screenshots or copied SQL errors, if any',
      'tables appear in Table Editor? yes/no',
      'RLS appears enabled? yes/no',
    ],
    blockers: [],
    sqlErrorNotes: [
      'SQL errors: none reported.',
      'No minimal SQL correction is needed for M42.',
    ],
    proposedFixNotes: [
      'No schema/RLS change is proposed.',
      'Do not run SQL automatically from the app or Codex.',
      'Keep future SQL changes manual, reviewed, and staging-only.',
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
