# M99 Release Preview QA / Main Branch Smoke Pass Report

## 1. Summary

M99 confirms that the merged `main` branch is ready for release preview smoke testing.

The pass verified Git state, lint/build/test, route HTTP 200 coverage, and static farmer-facing QA expectations. No release-blocking code fixes were needed.

## 2. Git/Main Branch Status

- `git branch --show-current`: `main`
- `git log --oneline --decorate -8` shows `45793c7 (HEAD -> main, origin/main) Merge branch 'staging/supabase'`.
- `git ls-remote origin refs/heads/main` returned `45793c788f4c8475d8947e28bc7de3ed75a2965f`.
- Initial `git status --short` was clean before running build.
- After `npm run build`, generated files were dirty: `dist/index.html` and `tsconfig.app.tsbuildinfo`.

## 3. Files Created

- `docs/release/MAIN_BRANCH_RELEASE_PREVIEW_M99.md`
- `reports/milestones/M99_RELEASE_PREVIEW_QA_MAIN_BRANCH_SMOKE_PASS_REPORT.md`

## 4. Files Modified

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`

Build-generated files were also refreshed by `npm run build`.

## 5. Verification Commands Run

- `git branch --show-current`
- `git status --short`
- `git log --oneline --decorate -8`
- `git branch -vv`
- `git remote -v`
- `git ls-remote origin refs/heads/main`
- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`

Results:

- `npm run lint` passed.
- `npm run build` passed. This runs `tsc -b`; no separate `npm run typecheck` script exists. Vite reported the known large chunk warning.
- `npm run test` passed: 34 test files, 325 tests.
- `git diff --check` passed with line-ending warnings only.

## 6. Route HTTP Smoke Results

Dev server was already available at `http://127.0.0.1:5173`.

Required farmer-facing routes returned HTTP 200:

- `/app`
- `/app/my-farm`
- `/app/farm-records`
- `/app/calculators`
- `/app/calculators/plant-spacing`
- `/app/calculators/fertilizer`
- `/app/calculators/yield-estimate`
- `/app/calculators/cost`
- `/app/calculators/spray-mix`
- `/app/weather`
- `/app/ai`
- `/app/help`
- `/app/profile`
- `/app/field-test-feedback`

Registered internal/status sample routes returned HTTP 200:

- `/app/admin`
- `/app/qa`
- `/app/articles/full-content-readiness`
- `/app/weather/risk-review`
- `/app/ai-text-status`
- `/app/calculators/ai-adapter-status`
- `/app/ai-proxy-status`
- `/app/auth/status`
- `/app/account-preview`
- `/app/guest-sync-status`
- `/app/supabase-readiness`
- `/app/next-phase`

## 7. Cloudflare/Main Deploy Status

Git remote is `https://github.com/thana10-star/KasetHub-Platform.git`, and `origin/main` points to the latest merge commit.

No Cloudflare production/main URL was found in repo docs/config during this pass, and Cloudflare Pages deployment status could not be checked from Codex.

Project owner should manually confirm:

- GitHub `main` shows merge commit `45793c7`.
- Cloudflare Pages main deploy succeeded.
- Production/main app opens and reflects the merged M83-M98.1 work.

## 8. Farmer-facing QA Findings

Static/code review and existing tests indicate:

- `/app` remains compact and production-facing.
- `/app/my-farm` keeps the first screen simple and moves heavier details lower/collapsed.
- `/app/farm-records` starts with Basic Farm Records Mode and the three main actions: `เพิ่มแปลง`, `บันทึกรายรับ/รายจ่าย`, and `บันทึกผลผลิต`.
- Activity recording remains available as a secondary action.
- Advanced/export/restore/sync content remains lower or in advanced/data-control areas.
- `/app/calculators` now prioritizes useful tools, crop selector affordance, plant spacing, and fertilizer/fertigation planning.
- `/app/profile` remains settings-first, with internal tools collapsed/secondary.
- `/app/help` stays short, Thai-first, and practical.

No release-blocking farmer-facing copy or route issue was found.

## 9. Mobile QA Findings Or Limitation

The Browser connector was unavailable again (`agent.browsers.list()` returned `[]`).

Codex could not complete:

- mobile screenshots
- live horizontal-scroll inspection
- console-error inspection
- visual bottom-nav fit inspection

Fallback verification used:

- route HTTP 200 checks
- automated tests
- static layout/code review
- previous project-owner mobile pass for M98.1

## 10. Fixes Applied

No code fixes were applied in M99.

Only release documentation and concise project status docs were added/updated.

## 11. Known Limitations

- Cloudflare Pages status still needs manual owner verification.
- Browser/mobile visual QA could not be performed inside Codex.
- Generated build artifacts changed after `npm run build`.
- Existing Vite large chunk warning remains.

## 12. Next Recommended Milestone

M100 should stay deliberately scoped after release preview. Recommended options:

- production/main deployment checklist and rollback notes
- owner-provided mobile screenshot QA follow-up
- one small farmer-flow polish item discovered during real preview

M100 should not start broad backend/cloud sync/AI/Farm Records schema work without a separate plan.
