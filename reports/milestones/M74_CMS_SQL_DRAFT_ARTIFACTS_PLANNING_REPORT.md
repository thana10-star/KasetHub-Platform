# M74 CMS SQL Draft Artifacts Planning Report

## Summary

M74 adds checked-in planning-only CMS SQL draft artifacts for future KasetHub offline/online article persistence. The repository now includes schema, RLS, seed, rollback, and README draft files under `supabase/drafts/cms/`, plus a local registry service, tests, docs, and an in-app SQL draft review route.

No migrations were run, no SQL was executed, no Supabase writes, backend CMS writes, production article publishing, AI article generation, image upload, sponsor/affiliate injection, or frontend CMS write path was added.

## Files Changed

SQL draft artifacts:

- `supabase/drafts/cms/0002_cms_articles_schema_draft.sql`
- `supabase/drafts/cms/0002_cms_articles_rls_draft.sql`
- `supabase/drafts/cms/0002_cms_articles_seed_draft.sql`
- `supabase/drafts/cms/0002_cms_articles_rollback_draft.sql`
- `supabase/drafts/cms/README.md`

SQL draft registry:

- `src/services/content/offline-agri-cms-sql-draft.types.ts`
- `src/services/content/offline-agri-cms-sql-draft.ts`
- `src/services/content/offline-agri-cms-sql-draft.test.ts`

Routes and UI:

- `src/routes/OfflineArticleCmsSqlDraftsPage.tsx`
- `src/routes/OfflineArticleCmsMigrationReviewPage.tsx`
- `src/routes/OfflineArticleCmsPersistencePlanPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/OFFLINE_ARTICLE_CMS_SQL_DRAFT_ARTIFACTS.md`
- `docs/OFFLINE_ARTICLE_CMS_SQL_REVIEW_CHECKLIST.md`
- `docs/OFFLINE_ARTICLE_CMS_MIGRATION_DRY_RUN.md`
- `docs/OFFLINE_ARTICLE_CMS_RLS_REVIEW_PLAN.md`
- `docs/OFFLINE_ARTICLE_CMS_ROLLBACK_PLAN.md`
- `docs/OFFLINE_ARTICLE_CMS_SEED_FIXTURE_PLAN.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/cms-sql-drafts`

## SQL Draft Files

All draft files live under:

- `supabase/drafts/cms/`

They are intentionally not placed under `supabase/migrations/`.

Every draft includes:

- `PLANNING ONLY`
- `DO NOT RUN`
- `DO NOT DEPLOY`
- `REVIEW REQUIRED`

The schema draft covers:

- `article_versions`
- `article_full_body_versions`
- `article_source_reviews`
- `article_expert_reviews`
- `article_image_assets`
- `article_release_gates`
- `article_release_audit_events`
- `article_release_attempts`
- `article_reviewer_history`
- `article_cms_overrides`

## RLS Draft Notes

The RLS draft is planning-only and includes policy intentions for:

- public read only released/published articles
- editors draft only
- reviewers scoped to their own review tables
- release manager blocked without audit requirements
- automation blocked from final publish
- admin blocked from silent human release gate bypass
- service role reserved for backend-only use

No RLS policy was executed.

## Rollback Draft Notes

The rollback draft records dependency-order table drops for future review and warns that no destructive rollback should run without backup, operator review, and offline fallback preservation.

No rollback script was executed.

## Tests

Vitest coverage includes:

- SQL drafts registered
- every draft has planning-only warnings
- drafts are not under `supabase/migrations`
- execution status is `not_executed`
- migration remains blocked
- frontend cannot write CMS records
- final publish remains blocked
- rollback draft exists

Result:

- 15 test files passed.
- 165 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 15 files, 165 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173`. The in-app Browser runtime reported no available `iab` session, so checks used a local Edge headless DevTools DOM fallback.

Checked routes:

- `/app/articles/cms-sql-drafts` passed.
- `/app/articles/cms-migration-review` passed.
- `/app/articles/cms-persistence-plan` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- SQL drafts are not reviewed production migrations.
- No Supabase tables, rows, policies, or migrations were created.
- No backend CMS write/read endpoint exists.
- No CMS content fetch or cache exists.
- No image upload or real asset review exists.
- No production article publishing exists.
- No AI article generation.
- No sponsor or affiliate injection.
- Human release gate remains local planning only.

## Next Recommended Milestone

M75 should add a staging SQL review readiness pass before any migration execution: static SQL lint/review notes, dependency verification, RLS scenario matrix, backup/rollback operator checklist, and proof that the app still cannot execute SQL or publish CMS content from the frontend.
