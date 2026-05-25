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
  return {
    milestone: 'M44',
    status: 'success',
    statusLabel: 'success',
    statusTone: 'success',
    publicReadVerificationStatus: 'passed: all public/read-safe tables returned empty table OK with count 0',
    rlsReviewStatus: 'passed: RLS remains enabled after the staging public SELECT patch',
    noUnsafeBehaviorStatus: 'passed: no unsafe public write behavior observed',
    summary:
      'M44 public read verification passed on kasethub-staging. articles, videos, and crop_price_snapshots returned empty table OK with count 0, auth/cloud sync stayed disabled, and no writes or service-role key were used.',
    operatorInstructions: [
      'Keep .env.local local only and uncommitted.',
      'Keep VITE_ENABLE_AUTH=false and VITE_ENABLE_CLOUD_SYNC=false.',
      'Keep service-role keys out of frontend env.',
      'Do not write data from the app until a later reviewed milestone explicitly enables writes.',
      'Treat the manual staging SELECT grant/policy patch as staging-only evidence for public reads.',
    ],
    tableReviews: [
      {
        table: 'articles',
        status: 'empty_table_ok',
        statusLabel: tableStatusLabel('empty_table_ok'),
        expectedAccess: 'public/read-safe anon and authenticated SELECT only',
        observedResult: 'empty table OK, count 0',
        reviewNote: 'Read-only public probe passed after the manual staging SELECT grant/policy patch.',
      },
      {
        table: 'videos',
        status: 'empty_table_ok',
        statusLabel: tableStatusLabel('empty_table_ok'),
        expectedAccess: 'public/read-safe anon and authenticated SELECT only',
        observedResult: 'empty table OK, count 0',
        reviewNote: 'Read-only public probe passed after the manual staging SELECT grant/policy patch.',
      },
      {
        table: 'crop_price_snapshots',
        status: 'empty_table_ok',
        statusLabel: tableStatusLabel('empty_table_ok'),
        expectedAccess: 'public/read-safe anon and authenticated SELECT only',
        observedResult: 'empty table OK, count 0',
        reviewNote: 'Read-only public probe passed after the manual staging SELECT grant/policy patch.',
      },
    ],
    rlsChecklist: [
      {
        id: 'public-read-allowed',
        label: 'Public read tables allowed',
        status: 'pass',
        evidenceNeeded: 'articles, videos, and crop_price_snapshots returned empty table OK with count 0.',
      },
      {
        id: 'no-public-write',
        label: 'No public write policy',
        status: 'pass',
        evidenceNeeded: 'No unsafe public write behavior was observed during M44 review.',
      },
      {
        id: 'anon-limited',
        label: 'Anon access limited',
        status: 'pass',
        evidenceNeeded: 'Anon public read was limited to the three reviewed read-safe tables.',
      },
      {
        id: 'user-owned-protected',
        label: 'User-owned tables protected',
        status: 'pass',
        evidenceNeeded: 'RLS remains enabled; no unsafe private/user-owned table exposure was reported in M44.',
      },
      {
        id: 'service-role-not-used',
        label: 'Service-role not used',
        status: 'pass',
        evidenceNeeded: 'Operator confirmed service-role key used: no.',
      },
      {
        id: 'staging-only',
        label: 'Staging only',
        status: 'pass',
        evidenceNeeded: 'Operator confirmed results came from kasethub-staging.',
      },
    ],
    blockers: [],
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
      'Manual staging SQL grant/policy patch allowed anon/authenticated SELECT only on articles, videos, and crop_price_snapshots.',
    ],
    nextSafeStep:
      'Keep auth/cloud sync disabled and plan the next reviewed milestone for either focused private-table RLS evidence or phone auth staging prep.',
    docs: [
      'docs/M44_SUPABASE_PUBLIC_READ_VERIFICATION.md',
      'docs/M44_RLS_PUBLIC_READ_REVIEW_CHECKLIST.md',
      'reports/milestones/M44_SUPABASE_PUBLIC_READ_RLS_PROBE_REVIEW_REPORT.md',
    ],
  };
}
