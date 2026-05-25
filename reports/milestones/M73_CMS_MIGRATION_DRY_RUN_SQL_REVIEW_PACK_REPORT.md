# M73 CMS Migration Dry-run Checklist + SQL Review Pack Report

## Summary

M73 prepares the first dry-run CMS database migration review pack for KasetHub offline/online article persistence. The app now has local-only migration review planning types, table review fixtures, RLS review planning, rollback planning, seed fixture planning, publish safety gates, docs, tests, and an in-app CMS migration review route.

No migrations, Supabase writes, backend CMS writes, production article publishing, AI article generation, image upload, sponsor/affiliate injection, or real CMS fetches were added.

## Files Changed

CMS migration dry-run services:

- `src/services/content/offline-agri-cms-migration-review.types.ts`
- `src/services/content/offline-agri-cms-migration-review.ts`
- `src/services/content/offline-agri-cms-migration-review.test.ts`

Routes and UI:

- `src/routes/OfflineArticleCmsMigrationReviewPage.tsx`
- `src/routes/OfflineArticleCmsPersistencePlanPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/OFFLINE_ARTICLE_CMS_MIGRATION_DRY_RUN.md`
- `docs/OFFLINE_ARTICLE_CMS_RLS_REVIEW_PLAN.md`
- `docs/OFFLINE_ARTICLE_CMS_SEED_FIXTURE_PLAN.md`
- `docs/OFFLINE_ARTICLE_CMS_ROLLBACK_PLAN.md`
- `docs/OFFLINE_ARTICLE_CMS_PERSISTENCE_CONTRACT.md`
- `docs/OFFLINE_ARTICLE_CMS_ROLE_RULES.md`
- `docs/OFFLINE_ARTICLE_CMS_MIGRATION_CHECKLIST.md`
- `docs/OFFLINE_ARTICLE_CMS_FALLBACK_POLICY.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/cms-migration-review`

## Migration Review Notes

M73 plans review metadata for:

- `articles`
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

Each table review includes owner, write source, read scope, RLS expectation, rollback note, seed strategy, audit requirement, status, and blockers.

## RLS Review Notes

RLS dry-run planning covers:

- viewer/public cannot write
- editor cannot bypass release gate
- release manager cannot bypass audit requirement
- automation/service accounts cannot final publish directly
- public reads only approved published content
- unpublished drafts are blocked from anon/public

No real RLS execution occurs.

## Rollback Notes

The rollback plan requires migration id tracking, dependency order, rollback SQL for article/release/audit tables, offline fallback preservation, and proof that frontend code has no CMS write path.

## Seed Fixture Notes

Seed fixture planning covers:

- starter offline article import
- article categories
- article review fixtures
- release gate fixtures
- fallback article fixtures

All seed plans keep `noRealInsert: true`.

## Tests

Vitest coverage includes:

- migration review includes rollback
- migration review includes RLS notes
- public content remains read-only
- drafts remain blocked
- frontend cannot write CMS rows
- automation cannot final publish
- seed fixture plan exists
- publish safety gate still blocks incomplete content

Result:

- 14 test files passed.
- 157 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 14 files, 157 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173`. The Browser plugin reported no available `iab` session, so checks used a local Edge headless DevTools DOM fallback.

Checked routes:

- `/app/articles/cms-migration-review` passed.
- `/app/articles/cms-persistence-plan` passed.
- `/app/articles/release-audit` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No migrations were run.
- No Supabase tables, rows, RLS policies, or seed rows were created.
- No backend CMS endpoint exists.
- No CMS fetch or CMS cache exists.
- No image upload or real asset review exists.
- No production article publishing exists.
- No AI article generation.
- No sponsor or affiliate injection.
- SQL review pack remains local planning data only.

## Next Recommended Milestone

M74 should add CMS SQL draft artifacts in planning-only mode: checked-in draft SQL files or docs for table DDL, RLS policies, rollback scripts, and seed fixtures, plus tests proving those drafts remain unexecuted and frontend code still cannot publish or write CMS records.
