# M72 Offline Article CMS Persistence Contract Report

## Summary

M72 plans the backend-owned CMS persistence contract for KasetHub offline/online agriculture articles. The app now has local-only CMS persistence planning types, role rules, read/write contracts, release audit write requirements, migration checklist, fallback policy, tests, docs, and an in-app CMS persistence route.

No Supabase writes, migrations, backend CMS writes, real CMS fetches, AI article generation, image uploads, sponsor/affiliate injection, or production article publishing were added.

## Files Changed

CMS persistence contract services:

- `src/services/content/offline-agri-cms-persistence.types.ts`
- `src/services/content/offline-agri-cms-persistence.ts`
- `src/services/content/offline-agri-cms-persistence.test.ts`

Routes and UI:

- `src/routes/OfflineArticleCmsPersistencePlanPage.tsx`
- `src/routes/OfflineArticleReleaseAuditPage.tsx`
- `src/routes/OfflineArticleEditorialEvidencePage.tsx`
- `src/routes/OfflineArticleEditorialReviewPage.tsx`
- `src/routes/OfflineArticleQAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/NextPhasePage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/OFFLINE_ARTICLE_CMS_PERSISTENCE_CONTRACT.md`
- `docs/OFFLINE_ARTICLE_CMS_ROLE_RULES.md`
- `docs/OFFLINE_ARTICLE_CMS_MIGRATION_CHECKLIST.md`
- `docs/OFFLINE_ARTICLE_CMS_FALLBACK_POLICY.md`
- `docs/HYBRID_OFFLINE_CMS_CONTENT_STRATEGY.md`
- `docs/OFFLINE_ARTICLE_RELEASE_AUDIT_READINESS.md`
- `docs/OFFLINE_ARTICLE_HUMAN_RELEASE_GATE.md`
- `docs/OFFLINE_ARTICLE_CMS_OVERRIDE_RULES.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/cms-persistence-plan`

## CMS Role Notes

M72 defines roles:

- `viewer`
- `content_editor`
- `agriculture_expert`
- `safety_reviewer`
- `image_reviewer`
- `release_manager`
- `admin`

Rules keep viewer read-only, content editor draft-only, expert/reviewer roles scoped to their own sign-off areas, release manager blocked without evidence and audit requirements, and admin blocked from silent human-gate bypass. Automation cannot final publish.

## Persistence Contract Notes

Future table planning covers:

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

Read planning keeps public reads limited to reviewed/published content. Draft, review, release, and audit records remain editor/reviewer/admin scoped. Release audit writes are backend-owned only.

## Fallback Policy Notes

Bundled offline articles remain the fallback when CMS is unavailable or invalid. CMS override cannot remove required disclaimers, cannot use external image URLs for offline mode, and cannot replace the human release gate.

## Migration Checklist Notes

The migration checklist includes schema review, role/RLS review, release audit write contract review, offline fallback tests, and rollback planning. M72 does not run migrations.

## Tests

Vitest coverage includes:

- viewer cannot edit
- automation cannot final publish
- admin cannot silently bypass human release gate
- release manager remains blocked without evidence packet
- offline fallback remains available when CMS is invalid
- CMS publish contract requires release audit write
- CMS override cannot remove disclaimers
- migration checklist includes rollback

Result:

- 13 test files passed.
- 149 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 13 files, 149 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173`. The Browser plugin reported no available `iab` session, so checks used a local Edge headless DevTools DOM fallback.

Checked routes:

- `/app/articles/cms-persistence-plan` passed.
- `/app/articles/release-audit` passed.
- `/app/articles/editorial-evidence` passed.
- `/app/articles/offline-qa` passed.
- `/app/admin` passed.
- `/app/next-phase` passed.
- `/app/qa` passed.

## Known Limitations

- No Supabase tables, rows, migrations, or RLS policies were created.
- No backend CMS write/read endpoint exists.
- No CMS content fetch or cache exists.
- No image upload or real asset review exists.
- No production article publishing exists.
- No AI article generation.
- No sponsor or affiliate injection.
- Role contracts are local planning fixtures only.

## Next Recommended Milestone

M73 should add a staging-only CMS migration dry-run checklist and SQL review pack: table DDL draft review, RLS policy draft review, rollback script planning, seed fixture plan, and tests proving frontend code still cannot write CMS records or publish articles.
