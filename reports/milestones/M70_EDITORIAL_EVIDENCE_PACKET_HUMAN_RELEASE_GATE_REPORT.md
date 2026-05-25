# M70 Editorial Evidence Packet + Human Release Gate Report

## Summary

M70 adds a local-only editorial evidence packet workflow and explicit human release gate for offline agriculture articles. The app can now show source evidence, reviewer evidence, image evidence, safety confirmation, release blockers, and a safe completion simulation proving that metadata completion still cannot publish an article automatically.

No Supabase writes, backend CMS writes, AI article generation, real image generation, sponsor/affiliate injection, official finance/loan/government claims, or production article publishing were added.

## Files Changed

Editorial evidence services:

- `src/services/content/offline-agri-editorial-evidence.types.ts`
- `src/services/content/offline-agri-editorial-evidence.ts`
- `src/services/content/offline-agri-editorial-evidence.test.ts`

Routes and UI:

- `src/routes/OfflineArticleEditorialEvidencePage.tsx`
- `src/routes/OfflineAgriArticleDetailPage.tsx`
- `src/routes/OfflineArticleEditorialReviewPage.tsx`
- `src/routes/OfflineArticleFullContentReadinessPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/OFFLINE_ARTICLE_EDITORIAL_EVIDENCE_PACKET.md`
- `docs/OFFLINE_ARTICLE_HUMAN_RELEASE_GATE.md`
- `docs/OFFLINE_ARTICLE_FINAL_REVIEW_POLICY.md`
- `docs/OFFLINE_ARTICLE_EDITORIAL_REVIEW_WORKFLOW.md`
- `docs/OFFLINE_ARTICLE_PUBLISH_READINESS_GATE.md`
- `docs/AGRICULTURE_ARTICLE_SAFETY_POLICY.md`
- `docs/HYBRID_OFFLINE_CMS_CONTENT_STRATEGY.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/editorial-evidence`

## Evidence Packet Notes

M70 defines:

- `ArticleEvidencePacket`
- `ArticleEvidenceItem`
- `ArticleSourceEvidence`
- `ArticleImageEvidence`
- `ArticleReviewerEvidence`
- `ArticleReleaseGate`
- `ArticleHumanApprovalRequirement`

The evidence packet supports source placeholder completion, reviewer placeholder completion, image requirement status, safety disclaimer confirmation, freshness date placeholders, escalation notes, release blockers, and final human approval requirements.

## Human Release Gate Notes

The human release gate keeps final publish blocked even when metadata is simulated complete.

Future final release requires:

- explicit human approval flag
- release reviewer placeholder
- release timestamp placeholder
- release note placeholder

M70 keeps `finalPublishAllowed: false` in every state.

## Tests

Vitest coverage includes:

- evidence packet exists
- release gate exists
- final publish is blocked even when metadata is simulated complete
- human approval is required
- release reviewer placeholder is required
- release timestamp placeholder is required
- release note placeholder is required
- pilot article remains non-final
- safety disclaimer is still required

Result:

- 11 test files passed.
- 133 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 11 files, 133 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering.

Checked routes:

- `/app/articles/editorial-evidence` passed.
- `/app/articles/editorial-review` passed.
- `/app/articles/full-content-readiness` passed.
- `/app/articles/offline/soil-types-before-planting` passed.
- `/app/admin` passed.
- `/app/qa` passed.

## Known Limitations

- No article is final or official yet.
- Human release approval is not implemented beyond local placeholders.
- Source evidence and reviewer evidence are local fixtures only.
- Image evidence is planned only; no real image generation or bundled image asset is added.
- No Supabase CMS rows, writes, or migrations.
- No backend CMS workflow or release audit table.
- No AI article generation.
- No sponsor or affiliate injection.
- No official finance, loan, government, crop, fertilizer, or chemical claims are added.

## Next Recommended Milestone

M71 should add offline article release audit readiness: local audit event fixtures, attempted-release blocked states, reviewer change history placeholders, release diff preview, and tests proving CMS or automation cannot bypass the human release gate.
