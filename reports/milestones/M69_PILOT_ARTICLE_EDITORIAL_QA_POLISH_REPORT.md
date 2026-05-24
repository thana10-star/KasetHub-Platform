# M69 Pilot Article Editorial QA Polish Report

## Summary

M69 polishes the pilot offline article editorial QA workflow before any article can be marked final. The app now has local-only reviewer sign-off fixtures, source metadata placeholders, image asset review fixtures, an editorial review route, and a second low-risk pilot draft template.

No Supabase writes, backend CMS writes, AI article generation, real image generation, external image/CDN loading, sponsor/affiliate injection, official finance/loan/government facts, or final official article publishing were added.

## Files Changed

Editorial review services:

- `src/services/content/offline-agri-editorial-review.types.ts`
- `src/services/content/offline-agri-editorial-review.ts`
- `src/services/content/offline-agri-editorial-review.test.ts`
- `src/services/content/offline-agri-pilot-article-drafts.types.ts`
- `src/services/content/offline-agri-pilot-article-drafts.ts`
- `src/services/content/offline-agri-pilot-article-drafts.test.ts`

Routes and UI:

- `src/routes/OfflineArticleEditorialReviewPage.tsx`
- `src/routes/OfflineAgriArticleDetailPage.tsx`
- `src/routes/OfflinePilotArticleDraftReviewPage.tsx`
- `src/routes/OfflineArticleFullContentReadinessPage.tsx`
- `src/routes/OfflineArticleQAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/OFFLINE_ARTICLE_EDITORIAL_REVIEW_WORKFLOW.md`
- `docs/OFFLINE_ARTICLE_SOURCE_METADATA_STANDARD.md`
- `docs/OFFLINE_ARTICLE_IMAGE_REVIEW_STANDARD.md`
- `docs/M69_SECOND_LOW_RISK_PILOT_DRAFT_PLAN.md`
- `docs/M68_PILOT_ARTICLE_DRAFT_WORKFLOW.md`
- `docs/M68_SOIL_TYPES_PILOT_ARTICLE_REVIEW_NOTES.md`
- `docs/OFFLINE_ARTICLE_PUBLISH_READINESS_GATE.md`
- `docs/AGRICULTURE_ARTICLE_SAFETY_POLICY.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/editorial-review`

## Editorial Signoff Notes

M69 defines reviewer roles:

- `content_editor`
- `agriculture_expert`
- `safety_reviewer`
- `image_reviewer`

For `soil-types-before-planting`, all four sign-offs are present and remain `pending`.

## Source Metadata Notes

M69 adds source metadata placeholders with source title, source type, owner/organization, reviewed date, freshness status, confidence, citation placeholder, and field applicability note.

All source metadata remains placeholder-only and blocks final publish.

## Image Review Notes

Image review fixtures include cover/inline kind, planned offline path, Thai alt text, aspect ratio, max size target, prompt note, and review status.

All image reviews remain `planned_only`; no real image generation or external image loading was added.

## Second Pilot Draft Notes

M69 adds a second low-risk draft template:

- Slug: `soil-ph-reading-yourself`
- Title: `อ่านค่า pH ดิน ด้วยตัวเอง`
- Status: `draft_template`
- Fallback mapping: `soil-types-before-planting`

The second pilot exists for QA workflow coverage only and is blocked from final publishing.

## Tests

Vitest coverage includes:

- pilot signoff fixtures exist
- all signoffs remain pending
- final publish remains blocked
- source metadata shape exists
- image review checklist blocks when image is not reviewed
- second pilot draft exists
- no article is marked final publish
- detail route data still has safety disclaimers

Result:

- 10 test files passed.
- 124 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 10 files, 124 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering.

Checked routes:

- `/app/articles/editorial-review` passed.
- `/app/articles/pilot-draft-review` passed.
- `/app/articles/full-content-readiness` passed.
- `/app/articles/offline/soil-types-before-planting` passed.
- `/app/articles/offline-qa` passed.
- `/app/admin` passed.
- `/app/qa` passed.

## Known Limitations

- No article is final or official yet.
- All reviewer sign-offs are pending.
- Source metadata remains placeholder-only.
- Image assets are planned only and not generated or bundled.
- No Supabase CMS rows, writes, or migrations.
- No backend CMS workflow.
- No AI article generation.
- No sponsor or affiliate injection.
- No official finance, loan, government, crop, fertilizer, or chemical claims are added.

## Next Recommended Milestone

M70 should add a local-only editorial evidence packet for the soil pilot: source metadata completion fixtures, reviewer sign-off simulation, image asset preflight fixtures, and proof that final publish still requires a distinct human-approved release step.
