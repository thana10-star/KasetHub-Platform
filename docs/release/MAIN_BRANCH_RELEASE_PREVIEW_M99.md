# Main Branch Release Preview M99

## 1. What Was Merged Into Main

`main` is at merge commit `45793c7 Merge branch 'staging/supabase'`.

The merge brings the M83-M98.1 work into `origin/main`, including the local-first Farm Records chain, My Farm, Basic Farm Records Mode, production-facing copy, elder-friendly settings/navigation/help, and calculator mobile UX improvements.

## 2. Key Farmer-facing Capabilities Now In Main

- Compact Home with My Farm, AI, tools/calculators, and weather discovery.
- `ฟาร์มของฉัน` bottom-nav entry and simplified My Farm hub.
- Local-first Farm Records with basic mode, add plot, income/expense, harvest, activity recording, export/restore, and disabled sync consent areas.
- Harvest/yield and cost-per-kg readiness inside Farm Records.
- Profile/settings with language/help/support placeholders, data/privacy links, and collapsed internal tools.
- `/app/help` farmer start guide and `/app/field-test-feedback` static/local field-test checklist.
- Calculator mobile improvements for crop selection, planting distance, fertilizer/fertigation planning, and label-only chemical calculation.

## 3. Routes Checked

HTTP 200 checks passed locally at `http://127.0.0.1:5173`:

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

## 4. Known Warnings

- `npm run build` still reports the known Vite large chunk warning.
- `git diff --check` passed with line-ending warnings only.
- Running `npm run build` refreshed generated files: `dist/index.html` and `tsconfig.app.tsbuildinfo`.

## 5. Known Limitations

- Browser connector was unavailable in Codex, so no in-app mobile screenshots or console log inspection were completed.
- No Cloudflare production/main URL was found in repo docs/config during this pass.
- Cloudflare Pages deployment status could not be verified from Codex and should be checked manually by the project owner.

## 6. Manual Mobile QA Notes

Project owner should spot-check the production/main deployment on mobile Safari:

- Home remains compact and production-facing.
- My Farm keeps heavy details secondary/collapsed.
- Farm Records shows the three basic actions first.
- Calculator crop selector looks tappable and calculator forms do not horizontally scroll.
- Profile advanced/internal section remains secondary.
- Bottom nav labels fit: `หน้าแรก`, `ฟาร์มของฉัน`, `เครื่องมือ`, `ถาม AI`, `โปรไฟล์`.

## 7. Next Recommended Milestone

M100 should be a deliberately scoped planning milestone based on release-preview findings, not a broad feature expansion. Good candidates are production deployment checklist hardening, mobile screenshot QA follow-up, or one narrow farmer-flow polish item.
