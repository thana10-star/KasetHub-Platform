# M114.1 Community Auth Entry + Staging Login Surface Report

Date: 2026-05-26

## 1. Summary

M114.1 adds a clear sign-in path for Community staging tests. `/app/community` can now point unauthenticated testers to `/app/login?next=/app/community`, and `/app/profile` has a visible account entry for the same flow.

Production community writes remain controlled by `VITE_ENABLE_COMMUNITY_WRITES=false` by default. No secrets or service-role keys were added.

## 2. Auth Audit Result

1. Existing login page before M114.1: no real user-facing login page existed. `/app/auth` and related routes were mock/planning/status surfaces.
2. Supabase email/password sign-in before M114.1: not supported in the app UI. M114.1 adds it through `auth.signInWithPassword`.
3. Phone auth status: phone auth remains local mock/staging-planned. Existing phone OTP routes are preserved.
4. Current Supabase user session: M114.1 adds `supabase-auth-session.ts`, which uses the existing Supabase anon client and `auth.getUser()`, plus Supabase auth session persistence.
5. Safest small login surface: a minimal `/app/login` route for prepared staging accounts, linked from Community and Profile.

## 3. Files Created

- `src/routes/LoginPage.tsx`
- `src/routes/LoginPage.test.tsx`
- `src/services/auth/supabase-auth-session.ts`
- `reports/milestones/M114_1_COMMUNITY_AUTH_ENTRY_STAGING_LOGIN_SURFACE_REPORT.md`

## 4. Files Modified

- `README.md`
- `src/app/App.tsx`
- `src/routes/CommunityPage.tsx`
- `src/routes/CommunityPage.test.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/ProfilePage.test.tsx`
- `src/services/community/community-service.test.ts`
- `src/services/qa/route-registry.ts`
- `src/services/supabase/supabase-client.ts`
- `src/types/kaset.ts`

## 5. Login Route Behavior

`/app/login` shows:

- Title: `เข้าสู่ระบบ`
- Subtitle: `ใช้บัญชีทดสอบเพื่อโพสต์ คอมเมนต์ หรือกดไลก์ในชุมชน`
- Email field
- Password field
- Sign-in button
- Signed-in state with email when available
- Sign-out button when signed in
- Return link to Community, honoring `next=/app/community`

It does not store passwords manually and uses Supabase anon auth only.

## 6. Community Auth Entry Behavior

When Community writes are enabled but no real user is signed in, `/app/community` now shows:

- `เข้าสู่ระบบก่อนใช้งานชุมชน`
- Copy explaining sign-in is needed to post, comment, like, or report
- Button to `/app/login?next=/app/community`

When signed in, Community shows a small `เข้าสู่ระบบแล้ว` indicator and enables write controls only if the write flag and readiness checks pass.

## 7. Profile Auth Entry Behavior

`/app/profile` now includes a clean account card:

- Signed out: `เข้าสู่ระบบ`, with copy `ใช้สำหรับชุมชนและฟีเจอร์ที่ต้องมีบัญชี`, linking to `/app/login`
- Signed in: `เข้าสู่ระบบแล้ว`, with email if available, and a sign-out button

## 8. Session Handling

`src/services/auth/supabase-auth-session.ts` provides:

- Get cached session snapshot for immediate UI state
- Fetch current Supabase user via `auth.getUser()`
- Sign in with email/password via `auth.signInWithPassword`
- Sign out via `auth.signOut`
- Subscribe to auth state changes

`src/services/supabase/supabase-client.ts` now enables Supabase auth persistence and token refresh for staging login continuity. The client still uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## 9. Tests/Checks Run

Passed:

- `npm run lint`
- `npm run build`
- `npm run test`
- Targeted tests: `npm run test -- LoginPage CommunityPage ProfilePage community-service`
- Browser route smoke on `http://127.0.0.1:5173`
- `git diff --check`

Route smoke passed:

- `/app/login`
- `/app/community`
- `/app/profile`
- `/app`
- `/app/prices`
- `/app/ai`
- `/app/weather`

Build note: Vite still reports the existing large chunk warning. Build succeeds.

## 10. Owner Staging Test Steps

1. Deploy staging with Supabase URL, anon key, `VITE_ENABLE_SUPABASE=true`, `VITE_ENABLE_AUTH=true`, and Community writes enabled only in staging.
2. Open `/app/community`.
3. Tap `เข้าสู่ระบบ`.
4. Sign in with a prepared staging email/password test account.
5. Confirm the app returns to Community.
6. Create a post, comment, like/unlike, report, and test own hide/delete.
7. Sign out from `/app/profile` or `/app/login`.
8. Confirm signed-out users cannot write.

## 11. Known Limitations

- This is not a broad account system.
- Phone auth remains staged/planned through existing routes.
- No password reset or sign-up flow was added.
- Community notifications remain backend-needed.
- Production writes remain disabled unless a later owner-approved milestone changes the production environment.

## 12. Next Recommended Milestone

M115 should capture the owner’s mobile staging evidence for the full login-to-community flow, then address any real-device login/session issues before considering backend notification creation.

## Completion Checklist

- Scope matched M114.1 only: yes.
- `/app/login` created: yes.
- Community login entry added: yes.
- Profile login entry added: yes.
- Supabase anon auth only: yes.
- No service-role exposure: yes.
- No secrets committed: yes.
- Production writes remain controlled by `VITE_ENABLE_COMMUNITY_WRITES`: yes.
- lint/build/test passed: yes.
- route smoke passed: yes.
- M114.1 report created: yes.
