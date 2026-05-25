# M67 Offline Article Full-content Drafting Readiness Report

## Summary

M67 prepares KasetHub to add full offline agriculture article bodies safely. The app now has pilot full-content draft templates, source-review placeholders, expert escalation notes, image requirements, and publish-readiness gates that block incomplete or risky content from being marked ready.

No Supabase writes, backend CMS writes, AI article generation, real image generation, external image/CDN loading, sponsor/affiliate injection, official finance/loan/government facts, or full official article publishing were added.

## Files Changed

Full-content readiness services:

- `src/services/content/offline-agri-full-article.types.ts`
- `src/services/content/offline-agri-full-article-template.ts`
- `src/services/content/offline-agri-full-article-readiness.ts`
- `src/services/content/offline-agri-full-article-readiness.test.ts`

Routes and UI:

- `src/routes/OfflineArticleFullContentReadinessPage.tsx`
- `src/routes/OfflineAgriArticleDetailPage.tsx`
- `src/routes/OfflineAgriArticlesPage.tsx`
- `src/routes/OfflineArticleQAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/OFFLINE_ARTICLE_FULL_CONTENT_TEMPLATE.md`
- `docs/OFFLINE_ARTICLE_PUBLISH_READINESS_GATE.md`
- `docs/OFFLINE_ARTICLE_SOURCE_REVIEW_PLACEHOLDERS.md`
- `docs/OFFLINE_ARTICLE_EXPERT_ESCALATION_NOTES.md`
- `docs/OFFLINE_ARTICLE_CONTENT_QA.md`
- `docs/OFFLINE_ARTICLE_VERSIONING_PLAN.md`
- `docs/AGRICULTURE_ARTICLE_SAFETY_POLICY.md`
- `docs/HYBRID_OFFLINE_CMS_CONTENT_STRATEGY.md`
- `docs/CONTENT_MANAGEMENT_FOUNDATION.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/full-content-readiness`

## Pilot Articles

M67 adds full-content draft templates for:

- `soil-types-before-planting`
- `npk-label-basics`
- `rice-cost-profit-per-rai`
- `cassava-plant-spacing-per-rai`
- `farm-break-even-price`

Where a requested pilot slug does not yet exist as a bundled offline article, the template maps to an existing offline fallback outline until a reviewed dedicated article exists.

## Publish Gate Notes

The publish gate blocks `ready_for_full_publish` unless:

- source placeholders are filled
- safety disclaimers remain present
- reviewer metadata is completed
- last reviewed date exists
- image metadata is valid
- finance/government freshness date exists where applicable
- fertilizer/chemical content includes label warning
- risky topics include expert escalation notes

All M67 pilot templates remain `draft_template` and `canMarkReadyForFullPublish: false`.

## Source / Review Notes

Templates include placeholders for soil tests, labels, local agriculture references, farmer records, price sources, official program references, and expert reviews. These are placeholders only; no official source text or facts were committed.

## Expert Escalation Notes

Risk tags cover fertilizer/chemical safety, finance/government decisions, yield/profit expectations, crop health, and local conditions. Risky templates must show expert escalation before future full publishing.

## Tests

Vitest coverage now includes:

- pilot templates exist
- full article cannot publish without source placeholders
- finance article cannot publish without freshness date
- fertilizer/chemical article cannot publish without label warning
- expert escalation note required for risky topics
- image requirements must exist
- offline article fallback remains available
- non-pilot articles remain outline/starter content

Result:

- 8 test files passed.
- 107 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 8 files, 107 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering because the in-app Browser runtime reported `iab` unavailable.

Checked routes:

- `/app/articles/full-content-readiness` passed.
- `/app/articles/offline-qa` passed.
- `/app/articles/offline` passed.
- `/app/articles/offline/soil-types-before-planting` passed.
- `/app/admin` passed.
- `/app/qa` passed.

## Known Limitations

- No final full official article bodies yet.
- No real source review content is filled.
- No real expert review has occurred.
- No real article images are generated or bundled.
- No Supabase CMS rows, writes, or migrations.
- No backend CMS workflow.
- No AI article generation.
- No sponsor or affiliate injection.
- Finance, loan, government, crop, fertilizer, and chemical facts remain intentionally placeholder-bound.

## Next Recommended Milestone

M68 should add one reviewed pilot article draft workflow in local-only mode: choose a single low-risk topic, fill source/review placeholders with safe internal references, keep publish blocked until editorial review is represented, and verify that CMS/disclaimer gates still cannot be bypassed.
