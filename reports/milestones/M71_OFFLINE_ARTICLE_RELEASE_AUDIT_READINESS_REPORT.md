# M71 Offline Article Release Audit Readiness Report

## Summary

M71 adds a local-only release audit readiness layer for offline agriculture articles. The app now has release audit event fixtures, blocked release attempts, reviewer change history placeholders, release diff previews, and automation bypass checks proving CMS or automation cannot bypass the human release gate.

No Supabase writes, backend CMS writes, AI article generation, real image generation, external image/CDN loading, sponsor/affiliate injection, or production article publishing were added.

## Files Changed

Release audit services:

- `src/services/content/offline-agri-release-audit.types.ts`
- `src/services/content/offline-agri-release-audit.ts`
- `src/services/content/offline-agri-release-audit.test.ts`

Routes and UI:

- `src/routes/OfflineArticleReleaseAuditPage.tsx`
- `src/routes/OfflineAgriArticleDetailPage.tsx`
- `src/routes/OfflineArticleEditorialEvidencePage.tsx`
- `src/routes/OfflineArticleEditorialReviewPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/OFFLINE_ARTICLE_RELEASE_AUDIT_READINESS.md`
- `docs/OFFLINE_ARTICLE_RELEASE_DIFF_PREVIEW.md`
- `docs/OFFLINE_ARTICLE_AUTOMATION_BYPASS_POLICY.md`
- `docs/OFFLINE_ARTICLE_EDITORIAL_EVIDENCE_PACKET.md`
- `docs/OFFLINE_ARTICLE_HUMAN_RELEASE_GATE.md`
- `docs/OFFLINE_ARTICLE_FINAL_REVIEW_POLICY.md`
- `docs/HYBRID_OFFLINE_CMS_CONTENT_STRATEGY.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/release-audit`

## Release Audit Notes

M71 defines:

- `ArticleReleaseAuditEvent`
- `ArticleReleaseAttempt`
- `ArticleReleaseBlockedReason`
- `ArticleReviewerChangeHistory`
- `ArticleReleaseDiffPreview`
- `ArticleReleaseAuditStatus`
- `ArticleAutomationBypassAttempt`

Release audit fixtures cover attempted publish, blocked publish, reviewer change, disclaimer change, image review pending, CMS override-only publish attempts, and automation bypass attempts.

All release attempts remain blocked and `finalPublishAllowed` remains `false`.

## Diff Preview Notes

The local diff preview shows before/after summary, disclaimer changes, source metadata changes, reviewer status changes, and image review changes. It is preview-only and does not persist data.

## Automation Bypass Notes

Automation and CMS override attempts are explicitly blocked. CMS-only changes do not count as human release approval, and automation cannot set final publish.

## Tests

Vitest coverage includes:

- release attempt blocked without human approval
- automation bypass blocked
- reviewer history fixtures exist
- release diff preview generated
- disclaimer change tracked
- image review pending blocks publish
- CMS override alone cannot publish
- final publish remains false

Result:

- 12 test files passed.
- 141 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 12 files, 141 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173`. The Browser plugin reported no available `iab` session, so checks used a local Edge headless DevTools DOM fallback.

Checked routes:

- `/app/articles/release-audit` passed.
- `/app/articles/editorial-evidence` passed.
- `/app/articles/editorial-review` passed.
- `/app/articles/offline/soil-types-before-planting` passed.
- `/app/admin` passed.
- `/app/qa` passed.

## Known Limitations

- No article is final or official yet.
- Release audit events are local fixtures only.
- No release audit rows, release attempts, reviewer history, diff previews, or automation bypass events are written to Supabase.
- No backend CMS workflow exists yet.
- No real image assets are reviewed or generated.
- No AI article generation.
- No sponsor or affiliate injection.
- No production article publishing.

## Next Recommended Milestone

M72 should add offline article CMS persistence contract planning: backend-owned article release audit schemas, editor-only CMS roles, release audit write contract, migration review checklist, and tests proving offline fallback and human release gates remain required before any CMS publish flow.
