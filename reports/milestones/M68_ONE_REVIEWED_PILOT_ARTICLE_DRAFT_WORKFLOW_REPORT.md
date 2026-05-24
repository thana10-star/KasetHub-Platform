# M68 One Reviewed Pilot Article Draft Workflow Report

## Summary

M68 adds the first local-only reviewed pilot article draft workflow for KasetHub offline agriculture content. The pilot article `soil-types-before-planting` now has richer Thai draft content, source/review placeholders, image needs, editorial checklist, safety disclaimers, and publish blockers while staying clearly marked as draft/review-needed.

No Supabase writes, backend CMS writes, AI article generation, real image generation, external image/CDN loading, sponsor/affiliate injection, official government/loan/chemical claims, or final official article publishing were added.

## Files Changed

Pilot draft services:

- `src/services/content/offline-agri-pilot-article-drafts.types.ts`
- `src/services/content/offline-agri-pilot-article-drafts.ts`
- `src/services/content/offline-agri-pilot-article-drafts.test.ts`

Routes and UI:

- `src/routes/OfflinePilotArticleDraftReviewPage.tsx`
- `src/routes/OfflineAgriArticleDetailPage.tsx`
- `src/routes/OfflineArticleFullContentReadinessPage.tsx`
- `src/routes/OfflineArticleQAPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/M68_PILOT_ARTICLE_DRAFT_WORKFLOW.md`
- `docs/M68_SOIL_TYPES_PILOT_ARTICLE_REVIEW_NOTES.md`
- `docs/OFFLINE_ARTICLE_FULL_CONTENT_TEMPLATE.md`
- `docs/OFFLINE_ARTICLE_PUBLISH_READINESS_GATE.md`
- `docs/OFFLINE_ARTICLE_SOURCE_REVIEW_PLACEHOLDERS.md`
- `docs/AGRICULTURE_ARTICLE_SAFETY_POLICY.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/pilot-draft-review`

## Pilot Article Notes

Pilot article:

- Slug: `soil-types-before-planting`
- Title: `ดิน 6 ชนิด รู้จักก่อนปลูก`
- Status: `reviewed_draft_candidate`
- Final publish: blocked

The draft includes simple Thai sections for why soil type matters, a six-soil comparison, touch/water observation, broad use examples, cautious improvement ideas, mistakes to avoid, expert escalation, related app tools, and summary.

The draft avoids exact fertilizer/chemical prescriptions and avoids official claims that would require source confirmation.

## Review / Source Placeholders

M68 adds placeholders for:

- local observation
- soil test/lab confirmation
- local agriculture office or expert review
- reviewer placeholder
- last reviewed placeholder
- planned image requirements

These are placeholders only and cannot unlock final publish readiness.

## Publish Gate Notes

The pilot remains blocked by:

- `final_human_review_missing`
- `source_placeholders_not_filled`
- `last_reviewed_date_required`
- `image_assets_not_reviewed`
- `publish_gate_must_remain_blocked_in_m68`

The article detail route shows the richer draft and review metadata, but it still displays review-needed copy and publish blockers.

## Tests

Vitest coverage includes:

- pilot draft exists
- pilot draft has required sections
- pilot draft keeps safety disclaimer
- pilot draft does not mark final publish
- pilot draft has source placeholders
- pilot draft has image requirements
- publish gate remains blocked
- non-pilot articles remain unchanged

Result:

- 9 test files passed.
- 115 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 9 files, 115 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering.

Checked routes:

- `/app/articles/offline/soil-types-before-planting` passed.
- `/app/articles/pilot-draft-review` passed.
- `/app/articles/full-content-readiness` passed.
- `/app/articles/offline-qa` passed.
- `/app/articles/offline` passed.
- `/app/admin` passed.
- `/app/qa` passed.

## Known Limitations

- The pilot is still draft-only and not final official content.
- Source placeholders are not filled with final reviewed citations.
- No real expert review has occurred yet.
- No real article images are generated or bundled.
- No Supabase CMS rows, writes, or migrations.
- No backend CMS workflow.
- No AI article generation.
- No sponsor or affiliate injection.
- No official finance, loan, government, crop, fertilizer, or chemical claims are introduced.

## Next Recommended Milestone

M69 should add pilot article editorial QA polish: reviewer sign-off fixtures, final source metadata shape, image asset checklist validation, optional second low-risk pilot draft, and tests proving source/review gates still block final publish until human review is complete.
