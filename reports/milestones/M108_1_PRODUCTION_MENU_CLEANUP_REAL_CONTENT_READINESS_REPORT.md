# M108.1 Production Menu Cleanup + Real Content Readiness Report

## 1. Summary

M108.1 completes a narrow production-facing cleanup pass for the normal app routes.

The work removes visible M-number, milestone, readiness, QA, debug, prototype, and test wording from the main farmer-facing surfaces while keeping internal/admin/QA/staging routes available by direct access and existing internal surfaces.

No broad features were added. No route access was removed. No Supabase writes, cloud sync, GPS, upload, OCR, payment, production AI provider, or Farm Records storage/schema behavior was enabled.

## 2. What Was Already Done Before The Restart

The interrupted working tree already contained M108 Alpha Feedback Intake + Blocker Triage changes:

- `docs/release/alpha-feedback/` was present as an untracked feedback-intake package.
- `reports/milestones/M108_ALPHA_FEEDBACK_INTAKE_BLOCKER_TRIAGE_REPORT.md` was present as an untracked M108 report.
- Release docs and index files had M108 links/notes.
- `dist/index.html` and `tsconfig.app.tsbuildinfo` were already modified build artifacts.

Those changes were not overwritten. They were treated as existing work from the interrupted run.

## 3. Completed After Restart

- Inspected `git status --short` and `git diff --name-only` before editing.
- Identified that the existing dirty docs were M108 alpha-feedback work, not M108.1 cleanup.
- Removed the rendered internal advanced section from `/app/profile`.
- Removed visible internal AI scenario/proxy/status controls from `/app/ai`.
- Removed visible calculator QA and AI preview controls from `/app/calculators`.
- Replaced Farm Records visible prototype/readiness/test wording with production-safe planning, checklist, and ownership-check copy.
- Replaced the Home hero milestone badge with a product badge.
- Updated route and service tests to assert the new production-facing behavior.
- Added this M108.1 report.
- Added `docs/ux/PRODUCTION_MENU_CLEANUP_M108_1.md`.

## 4. Files Modified For M108.1

- `src/components/kaset/HeroCard.tsx`
- `src/routes/AIPage.tsx`
- `src/routes/AIPage.test.tsx`
- `src/routes/CalculatorsPage.tsx`
- `src/routes/CalculatorsPage.test.tsx`
- `src/routes/FarmRecordsDebugPage.tsx`
- `src/routes/FarmRecordsDebugPage.test.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/services/farm-records/farm-records-sync-consent-gate.ts`
- `src/services/farm-records/farm-records-sync-consent-prototype.ts`
- `src/services/farm-records/farm-records-sync-consent-prototype.test.ts`
- `docs/ux/PRODUCTION_MENU_CLEANUP_M108_1.md`
- `reports/milestones/M108_1_PRODUCTION_MENU_CLEANUP_REAL_CONTENT_READINESS_REPORT.md`

Existing M108 files already dirty before restart and preserved:

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/release/V1_RELEASE_BLOCKER_LOG_M104.md`
- `docs/release/alpha-launch/ALPHA_FEEDBACK_TRIAGE_PLAN_M107.md`
- `docs/release/alpha-launch/ALPHA_LAUNCH_INDEX_M107.md`
- `docs/release/v1-package/FINAL_OWNER_ACTIONS_M106.md`
- `docs/release/alpha-feedback/`
- `reports/milestones/M108_ALPHA_FEEDBACK_INTAKE_BLOCKER_TRIAGE_REPORT.md`
- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## 5. Verification

Commands run after the M108.1 code cleanup:

- `npm run lint`: passed.
- `npm run build`: passed. Vite still reports the existing large chunk warning.
- `npm run test`: passed, 38 files and 335 tests.

Production preview route smoke run at `http://127.0.0.1:4173`:

- `/app`: passed.
- `/app/ai`: passed.
- `/app/weather`: passed.
- `/app/calculators`: passed.
- `/app/my-farm`: passed.
- `/app/farm-records`: passed.
- `/app/help`: passed.
- `/app/profile`: passed.

The smoke pass confirmed each route loaded and visible text did not include M-number, milestone, readiness, QA, debug, prototype, or test wording.

- `git diff --check`: passed with line-ending warnings only.

## 6. Remaining Issues

- No M108.1 blocker remains open.
- The existing Vite large chunk warning remains unchanged.
- The worktree still contains pre-existing M108 alpha-feedback docs/build changes from the interrupted run.
