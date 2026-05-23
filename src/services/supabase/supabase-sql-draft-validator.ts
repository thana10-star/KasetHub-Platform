import type {
  SupabaseSqlDraftValidationResult,
  SupabaseSqlExpectedArtifact,
} from '@/services/supabase/supabase-sql-draft-validator.types';

const expectedTables: SupabaseSqlExpectedArtifact[] = [
  { name: 'profiles', category: 'core_identity', note: 'farmer profile and auth provider summary' },
  { name: 'saved_items', category: 'guest_memory', note: 'synced saved article/video/post/price records' },
  { name: 'likes', category: 'guest_memory', note: 'synced local likes' },
  { name: 'followed_topics', category: 'guest_memory', note: 'synced followed crop/topic records' },
  { name: 'farm_records', category: 'guest_memory', note: 'My Farm records and future analysis links' },
  { name: 'recent_ai_questions', category: 'ai', note: 'consent-aware AI history' },
  { name: 'ai_credit_balances', category: 'ai', note: 'future server-owned credit balance' },
  { name: 'ai_credit_transactions', category: 'ai', note: 'future server-owned credit ledger' },
  { name: 'rewarded_ad_events', category: 'ai', note: 'future reward verification records' },
  { name: 'ai_question_logs', category: 'ai', note: 'AI safety and usage log preview' },
  { name: 'share_events', category: 'guest_memory', note: 'future share/referral event log' },
  { name: 'notifications', category: 'guest_memory', note: 'user-owned notification records' },
  { name: 'community_posts', category: 'community', note: 'visible community post draft' },
  { name: 'community_comments', category: 'community', note: 'visible community comments draft' },
  { name: 'articles', category: 'content', note: 'published article/content draft' },
  { name: 'videos', category: 'content', note: 'YouTube/imported video metadata draft' },
  { name: 'crop_price_watches', category: 'crop_prices', note: 'user-owned crop watch preferences' },
  { name: 'crop_price_snapshots', category: 'crop_prices', note: 'public reference price snapshots' },
  { name: 'plant_media', category: 'plant_analysis', note: 'private plant media metadata' },
  { name: 'plant_analysis_jobs', category: 'plant_analysis', note: 'future image-analysis job lifecycle' },
  { name: 'plant_analysis_results', category: 'plant_analysis', note: 'future AI/expert result rows' },
  { name: 'auth_link_events', category: 'auth_sync', note: 'phone/LINE/Google account link audit events' },
  { name: 'guest_sync_events', category: 'auth_sync', note: 'future guest-to-cloud sync dry-run/audit rows' },
];

const ownCrudPolicies = [
  'saved_items',
  'likes',
  'followed_topics',
  'farm_records',
  'crop_price_watches',
].flatMap((table) => [`${table}_select_own`, `${table}_insert_own`, `${table}_update_own`, `${table}_delete_own`]);

const expectedPolicyNames = [
  'profiles_select_own',
  'profiles_insert_own',
  'profiles_update_own',
  ...ownCrudPolicies,
  'recent_ai_questions_select_own',
  'recent_ai_questions_insert_own',
  'recent_ai_questions_delete_own',
  'ai_credit_balances_select_own',
  'ai_credit_transactions_select_own',
  'rewarded_ad_events_select_own',
  'ai_question_logs_select_own',
  'ai_question_logs_delete_own',
  'notifications_select_own',
  'notifications_update_own',
  'community_posts_public_read_visible',
  'community_posts_insert_own',
  'community_posts_update_own',
  'community_posts_delete_own',
  'community_comments_public_read_visible',
  'community_comments_insert_own',
  'community_comments_update_own',
  'community_comments_delete_own',
  'articles_public_read_published',
  'videos_public_read_visible',
  'crop_price_snapshots_public_read',
  'plant_media_select_own',
  'plant_analysis_jobs_select_own',
  'plant_analysis_results_select_own',
  'plant_analysis_results_delete_own',
  'auth_link_events_select_own',
  'guest_sync_events_select_own',
];

const expectedPolicies: SupabaseSqlExpectedArtifact[] = expectedPolicyNames.map((name) => ({
  name,
  category:
    name.includes('crop_price')
      ? 'crop_prices'
      : name.includes('community')
        ? 'community'
        : name.includes('article') || name.includes('video')
          ? 'content'
          : name.includes('plant_')
            ? 'plant_analysis'
            : name.includes('auth_') || name.includes('guest_sync')
              ? 'auth_sync'
              : name.includes('ai_') || name.includes('rewarded')
                ? 'ai'
                : 'guest_memory',
  note: 'Expected RLS policy name in M18 policy draft',
}));

const expectedIndexes: SupabaseSqlExpectedArtifact[] = [
  'profiles_phone_number_idx',
  'profiles_crop_focus_gin_idx',
  'saved_items_user_id_idx',
  'saved_items_item_lookup_idx',
  'saved_items_saved_at_idx',
  'likes_user_id_idx',
  'likes_item_lookup_idx',
  'followed_topics_user_id_idx',
  'followed_topics_topic_lookup_idx',
  'farm_records_user_id_idx',
  'farm_records_crop_name_idx',
  'recent_ai_questions_user_id_idx',
  'ai_credit_transactions_user_id_idx',
  'rewarded_ad_events_user_id_idx',
  'ai_question_logs_user_id_idx',
  'share_events_source_ref_idx',
  'notifications_user_id_idx',
  'community_posts_moderation_status_idx',
  'community_comments_post_id_idx',
  'articles_published_at_idx',
  'articles_title_body_search_idx',
  'videos_video_id_idx',
  'videos_published_at_idx',
  'crop_price_watches_user_id_idx',
  'crop_price_snapshots_crop_date_idx',
  'crop_price_snapshots_market_idx',
  'plant_media_owner_user_id_idx',
  'plant_media_checksum_idx',
  'plant_analysis_jobs_status_idx',
  'plant_analysis_jobs_owner_status_idx',
  'plant_analysis_results_job_id_idx',
  'auth_link_events_user_id_idx',
  'guest_sync_events_status_idx',
].map((name) => ({
  name,
  category:
    name.includes('crop_price')
      ? 'crop_prices'
      : name.includes('community')
        ? 'community'
        : name.includes('article') || name.includes('video')
          ? 'content'
          : name.includes('plant_')
            ? 'plant_analysis'
            : name.includes('auth_') || name.includes('guest_sync')
              ? 'auth_sync'
              : name.includes('ai_') || name.includes('rewarded')
                ? 'ai'
                : 'guest_memory',
  note: 'Expected index or lookup helper in M18 schema draft',
}));

const expectedTriggers: SupabaseSqlExpectedArtifact[] = [
  'set_updated_at',
  'set_profiles_updated_at',
  'set_saved_items_updated_at',
  'set_followed_topics_updated_at',
  'set_farm_records_updated_at',
  'set_ai_credit_balances_updated_at',
  'set_notifications_updated_at',
  'set_community_posts_updated_at',
  'set_community_comments_updated_at',
  'set_articles_updated_at',
  'set_videos_updated_at',
  'set_crop_price_watches_updated_at',
  'set_plant_media_updated_at',
  'set_plant_analysis_jobs_updated_at',
].map((name) => ({
  name,
  category: name.includes('plant') ? 'plant_analysis' : name.includes('crop') ? 'crop_prices' : 'core_identity',
  note: name === 'set_updated_at' ? 'shared trigger function' : 'updated_at trigger expected in schema draft',
}));

export function validateSupabaseSqlDraft(): SupabaseSqlDraftValidationResult {
  return {
    executionOrder: [
      '1. Confirm Supabase project is staging, not production.',
      '2. Confirm no service-role key is in frontend env.',
      '3. Run supabase/migrations/0001_kasethub_core_schema.sql manually.',
      '4. Run supabase/policies/0001_kasethub_rls_policies.sql manually.',
      '5. Verify tables, constraints, indexes, triggers, and RLS in Supabase Dashboard.',
      '6. Keep auth, cloud sync, Edge Functions, uploads, imports, and writes disabled until later milestones.',
    ],
    expectedTables,
    expectedPolicies,
    expectedIndexes,
    expectedTriggers,
    manualVerificationChecklist: [
      'Tables created',
      'Foreign keys and unique constraints present',
      'updated_at trigger function and triggers created',
      'RLS enabled on every drafted table',
      'Public read policies limited to published/visible/reference data',
      'User-owned policies use auth.uid()',
      'Backend-only operations have no browser write policy',
      'Storage/image-analysis tables are metadata planning only',
      'Crop price snapshot/watch tables are present',
      'Community moderation-visible post/comment policies are present',
      'Admin/audit placeholders are documented but not enabled as real admin auth',
      'Auth providers are not enabled yet',
      'Edge Functions are not deployed yet',
    ],
    missingDraftNotes: [
      'M21-M24 future tables such as crop_price_sources, crop_price_import_jobs, community_reports, moderation_actions, admin_roles, admin_audit_logs, review task tables, and ai_safety_review_logs are documented for later migrations but are not part of the M18 SQL file.',
      'M43 public-read probes use articles, videos, and crop_price_snapshots only; no extra public_readiness_checks table is required.',
      'Profile bootstrap trigger is intentionally commented out until auth provider behavior is selected and tested.',
    ],
    stagingExecutionWarnings: [
      'Stop if the project name, URL, or dashboard environment looks like production.',
      'Run schema SQL before RLS policy SQL.',
      'Do not paste or expose service-role keys in the app, docs, screenshots, or browser env.',
      'Do not enable auth or cloud sync during SQL verification.',
      'Do not seed private user data during the first staging execution.',
      'If any RLS policy fails review, stop and fix staging before production planning.',
    ],
    productionBlockers: [
      'No production migration until staging SQL and RLS pass manual verification.',
      'No real auth until RLS is tested with anon, owner, other-user, and future role contexts.',
      'No cloud sync until consent, merge, idempotency, rollback, and audit rules are implemented server-side.',
      'No admin/moderation actions until RBAC and append-only audit logs exist.',
      'No AI/image upload/import jobs until Edge Function/service-role boundaries are implemented.',
    ],
  };
}
