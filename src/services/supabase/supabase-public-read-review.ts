import type {
  SupabasePublicReadReview,
  SupabasePublicReadTableReviewStatus,
} from '@/services/supabase/supabase-public-read-review.types';

function tableStatusLabel(status: SupabasePublicReadTableReviewStatus) {
  const labels: Record<SupabasePublicReadTableReviewStatus, string> = {
    pending_result: 'pending result',
    empty_table_ok: 'empty table OK',
    read_ok: 'read OK',
    rls_or_policy_blocked: 'RLS/policy blocked',
    table_missing: 'table missing',
    needs_review: 'needs review',
  };

  return labels[status];
}

export function buildSupabasePublicReadReview(): SupabasePublicReadReview {
  const publicTables = ['articles', 'videos', 'crop_price_snapshots'] as const;

  return {
    milestone: 'M44',
    status: 'pending',
    statusLabel: 'pending operator probe',
    statusTone: 'warning',
    publicReadVerificationStatus: 'pending: waiting for /app/supabase-readonly-probe table results',
    rlsReviewStatus: 'pending: waiting for anon/RLS dashboard review evidence',
    noUnsafeBehaviorStatus: 'pending: no public write evidence has been submitted yet',
    summary:
      'M44 is ready to review the real kasethub-staging read-only probe, but the operator must provide the actual table results before this can be marked success.',
    operatorInstructions: [
      'Use local .env.local only; do not commit it.',
      'Confirm VITE_ENABLE_SUPABASE=true and VITE_ENABLE_SUPABASE_DRY_RUN_NETWORK_CHECK=true only for the read-only check.',
      'Confirm VITE_ENABLE_AUTH=false and VITE_ENABLE_CLOUD_SYNC=false.',
      'Open /app/supabase-readonly-probe and record the result for articles, videos, and crop_price_snapshots.',
      'Review Supabase table security for RLS and confirm no public write policy exists.',
    ],
    tableReviews: publicTables.map((table) => ({
      table,
      status: 'pending_result',
      statusLabel: tableStatusLabel('pending_result'),
      expectedAccess: 'public/read-safe anon select only',
      observedResult: 'not provided yet',
      reviewNote: 'Expected results may be empty table OK, read OK, RLS/policy blocked, or table missing.',
    })),
    rlsChecklist: [
      {
        id: 'public-read-allowed',
        label: 'Public read tables allowed',
        status: 'pending',
        evidenceNeeded: 'Probe result for articles, videos, and crop_price_snapshots.',
      },
      {
        id: 'no-public-write',
        label: 'No public write policy',
        status: 'pending',
        evidenceNeeded: 'Supabase policy review showing anon cannot insert/update/delete/upsert.',
      },
      {
        id: 'anon-limited',
        label: 'Anon access limited',
        status: 'pending',
        evidenceNeeded: 'Dashboard/RLS review showing anon access is limited to read-safe public tables.',
      },
      {
        id: 'user-owned-protected',
        label: 'User-owned tables protected',
        status: 'pending',
        evidenceNeeded: 'RLS review for profiles, guest memory, farm records, saved items, community writes, and AI credits.',
      },
      {
        id: 'service-role-not-used',
        label: 'Service-role not used',
        status: 'pending',
        evidenceNeeded: 'Confirm probe used only Project URL and anon/public key.',
      },
      {
        id: 'staging-only',
        label: 'Staging only',
        status: 'pending',
        evidenceNeeded: 'Confirm target project is kasethub-staging, not production.',
      },
    ],
    blockers: [
      'Actual read-only probe results have not been provided yet.',
      'RLS/private-table review evidence has not been provided yet.',
      'No-public-write policy evidence has not been provided yet.',
      'Auth and cloud sync must remain disabled until M44 is reviewed.',
    ],
    safetyNotes: [
      'No real keys in repo.',
      'No .env.local commit.',
      'No service-role key.',
      'No writes from the app.',
      'No auth enablement.',
      'No cloud sync.',
      'No uploads.',
      'No AI API calls.',
      'No automatic migrations.',
      'No destructive SQL changes.',
    ],
    nextSafeStep:
      'Run the M43 read-only probe locally against kasethub-staging, capture the three table results, review RLS/no-public-write evidence, and keep auth/cloud sync disabled.',
    docs: [
      'docs/M44_SUPABASE_PUBLIC_READ_VERIFICATION.md',
      'docs/M44_RLS_PUBLIC_READ_REVIEW_CHECKLIST.md',
      'reports/milestones/M44_SUPABASE_PUBLIC_READ_RLS_PROBE_REVIEW_REPORT.md',
    ],
  };
}
