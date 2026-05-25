# M66 Offline Article Content QA + CMS Contract Report

## Summary

M66 hardens the M65 offline agriculture article library with editorial QA checklists, safety/disclaimer checks, image metadata QA, article version fixtures, and local CMS override contract validation.

No Supabase writes, backend CMS writes, AI article generation, real image generation, external image/CDN loading, sponsor/affiliate injection, or required network calls were added.

## Files Changed

Article QA and CMS contract services:

- `src/services/content/offline-agri-article-qa.types.ts`
- `src/services/content/offline-agri-article-qa.ts`
- `src/services/content/offline-agri-cms-override.types.ts`
- `src/services/content/offline-agri-cms-override.ts`
- `src/services/content/offline-agri-article-qa.test.ts`

Routes and UI:

- `src/routes/OfflineArticleQAPage.tsx`
- `src/routes/OfflineAgriArticlesPage.tsx`
- `src/routes/OfflineAgriArticleDetailPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`
- `src/services/qa/mvp-readiness.types.ts`

Docs:

- `docs/OFFLINE_ARTICLE_CONTENT_QA.md`
- `docs/OFFLINE_ARTICLE_CMS_OVERRIDE_RULES.md`
- `docs/OFFLINE_ARTICLE_VERSIONING_PLAN.md`
- `docs/OFFLINE_ARTICLE_IMAGE_QA_CHECKLIST.md`
- `docs/OFFLINE_AGRICULTURE_ARTICLE_LIBRARY.md`
- `docs/OFFLINE_ARTICLE_IMAGE_ASSET_FRAMEWORK.md`
- `docs/HYBRID_OFFLINE_CMS_CONTENT_STRATEGY.md`
- `docs/AGRICULTURE_ARTICLE_SAFETY_POLICY.md`
- `docs/CONTENT_MANAGEMENT_FOUNDATION.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/offline-qa`

## QA Checklist Notes

M66 checks:

- title exists
- summary exists
- category exists
- outline sections exist
- required disclaimers exist
- image metadata exists
- no external image URL
- finance articles have finance disclaimer
- fertilizer/chemical articles have label disclaimer
- body readiness is clear
- source status is clear

`/app/articles/offline-qa` shows article count, category count, QA score summary, articles needing full content, planned image warnings, disclaimer coverage, CMS override rules, and a no-network/offline-safe notice.

## CMS Override Notes

Future CMS overrides are allowed to extend body content and update title/summary only when the CMS version is newer.

CMS overrides are blocked when they:

- remove required safety disclaimers
- replace offline images with external URLs in offline mode
- miss freshness dates for seasonal/finance/government content
- use a mismatched `futureCmsKey`

Invalid CMS overrides keep the bundled offline article as fallback.

## Versioning Notes

Each article now has local `ArticleVersionInfo` fixtures with:

- version id
- content status
- editorial owner placeholder
- last reviewed date placeholder
- future CMS key
- offline fallback priority
- offline fallback availability

Current content stays `outline_only` or `starter_content`. M66 does not mark any article as official full publish.

## Image QA Notes

Image QA validates planned cover metadata, local path, Thai alt text, future prompt note, aspect ratio, and offline size warning.

Warnings are expected because images remain planned placeholders. No real images, generated images, CDN paths, or heavy files were added.

## Tests

Vitest coverage includes:

- every article passes minimum QA without fail status
- article QA detects missing required disclaimer
- CMS override cannot remove safety disclaimer
- CMS override cannot replace offline image with external URL in offline mode
- finance CMS override requires freshness date
- article version info exists for every article
- offline fallback remains available if CMS override is invalid

Expected result:

- 7 test files passed.
- 99 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 7 files, 99 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering with UTF-8 output decoding.

Checked routes:

- `/app/articles/offline` passed.
- `/app/articles/offline-qa` passed.
- `/app/articles/offline/soil-types-before-planting` passed.
- `/app/articles` passed.
- `/app/admin` passed.
- `/app/qa` passed.

## Known Limitations

- Articles are still outlines and starter snippets, not full official articles.
- QA is service-level and route-render checked, not a full browser/component test suite.
- No real Supabase CMS rows exist yet.
- No CMS fetch or override runtime exists yet.
- No image files are generated or uploaded.
- No AI article generation.
- No sponsor/affiliate integration.
- No official finance, loan, or government program facts are hardcoded.

## Next Recommended Milestone

M67 should add offline article full-content drafting readiness: reviewed article body templates, source-review placeholders, field-expert escalation notes, and tests proving full articles cannot publish without source/review/safety metadata.

