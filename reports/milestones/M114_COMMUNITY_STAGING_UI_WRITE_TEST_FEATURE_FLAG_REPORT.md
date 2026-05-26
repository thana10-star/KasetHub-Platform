# M114 Community Staging UI Write Test + Feature Flag Report

Date: 2026-05-26

## 1. Is Production Still Disabled?

Yes. Production community writes remain disabled by default. No production env files were changed, and no real `.env.local` or secrets were committed.

## 2. Is `.env.example` Still False?

Yes. `.env.example` still contains:

```env
VITE_ENABLE_COMMUNITY_WRITES=false
```

## 3. Is The Staging Flag Guide Created?

Yes:

- `docs/community/COMMUNITY_STAGING_WRITE_FLAG_ENABLEMENT_M114.md`

It explains staging-only enablement, rollback, two-user checks, and the production false rule.

## 4. Is The UI Write Checklist Created?

Yes:

- `docs/community/COMMUNITY_STAGING_UI_WRITE_TEST_CHECKLIST_M114.md`

It covers User A, User B, anonymous behavior, image validation, report, own hide/delete, no fake data, and notification copy.

## 5. Is `/app/community` Ready For `flag=true` Staging Test?

Yes, for controlled staging testing after the owner sets `VITE_ENABLE_COMMUNITY_WRITES=true` in staging/preview only and signs in with real staging accounts.

The page now:

- Keeps read/share/gated mode when the flag is false.
- Shows auth-required copy when the flag is true but no real Supabase user is detected.
- Enables composer, comment, like/unlike, report, and own hide/delete only when readiness says writes are safe.
- Loads real published posts through the service adapter.
- Shows a real empty state when no posts are returned.
- Validates one image as JPG/PNG/WebP and max 3MB before upload.
- Maps Thai report labels to database reason codes through the service layer.
- Refreshes the feed after comment and like/unlike actions.
- Reads current-user likes so the UI can offer unlike during staging tests.

## 6. What UI/Service Gaps Remain?

- Owner still needs to run the real staging UI test with User A and User B.
- Like/reply notification creation is still backend-needed and not created by the browser.
- Individual post URLs are not implemented yet; share targets `/app/community`.
- Production launch still needs owner approval after staging UI evidence.

## 7. Were Any Small Fixes Applied?

Yes.

- `/app/community` was connected to the existing feature-flagged community service adapter.
- The UI now has real action handlers behind the flag/auth gate.
- `listPosts()` now reads the current user's likes through RLS so unlike can be tested from the UI.
- Tests were updated for default gating, auth-required state, image gate behavior, current-user liked state, and M114 docs.
- README was updated with the M114 production-disabled safety note.

## 8. Are Notifications Still Backend-Needed?

Yes. Like/reply notifications are not faked and are not inserted client-side. They remain deferred to a backend/server-created path that can verify actor, recipient, ownership, and rate limits.

## 9. Tests/Checks Run

Passed:

- `npm run lint`
- `npm run build`
- `npm run test`
- Targeted community tests: `npm run test -- community-service CommunityPage`
- Browser route smoke on `http://127.0.0.1:5173`
- `git diff --check`

Route smoke passed:

- `/app/community`
- `/app/notifications`
- `/app`
- `/app/prices`
- `/app/calculators`
- `/app/ai`
- `/app/weather`
- `/app/profile`

Build note: Vite still reports the existing large chunk warning after build; it did not fail the build.

## 10. Owner Steps To Test Staging

1. Confirm the deployment is staging/preview only.
2. Confirm M113 RLS/storage evidence remains valid.
3. Set `VITE_ENABLE_COMMUNITY_WRITES=true` only in staging/preview.
4. Redeploy staging/preview.
5. Sign in as User A and create a text post.
6. Create a post with one valid image.
7. Confirm invalid file type and oversized image are blocked.
8. Sign in as User B.
9. Confirm User B can read, comment, like, unlike, and report.
10. Confirm User B cannot edit/delete User A content or delete/overwrite User A image.
11. If any issue appears, set the flag back to false and redeploy staging.

## 11. Next Recommended Milestone

M115 should capture owner staging UI evidence, fix any real staging defects found during User A/User B testing, and decide whether to add a backend notification function before any production-write consideration.

## Files Created/Modified

Created:

- `docs/community/COMMUNITY_STAGING_WRITE_FLAG_ENABLEMENT_M114.md`
- `docs/community/COMMUNITY_STAGING_UI_WRITE_TEST_CHECKLIST_M114.md`
- `reports/milestones/M114_COMMUNITY_STAGING_UI_WRITE_TEST_FEATURE_FLAG_REPORT.md`

Modified:

- `README.md`
- `src/routes/CommunityPage.tsx`
- `src/routes/CommunityPage.test.tsx`
- `src/services/community/community-service.ts`
- `src/services/community/community-service.test.ts`

## Completion Checklist

- Scope matched M114 only: yes.
- Staging flag enablement guide created: yes.
- UI write test checklist created: yes.
- Production remains disabled: yes.
- `.env.example` keeps false: yes.
- No secrets committed: yes.
- No service-role exposure: yes.
- Flag/auth gate verified: yes.
- UI/service tests updated: yes.
- No fake community data: yes.
- Notifications not faked: yes.
- lint/build/test passed: yes.
- route smoke passed: yes.
- M114 report created: yes.
