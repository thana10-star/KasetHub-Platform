# M116.2 Cloudflare Build Fix: Remove Direct jsdom Test Dependency Report

Date: 2026-05-26

## Cloudflare Build Error

Cloudflare Pages failed during `npm run build` with:

```text
src/routes/CommunityPage.interaction.test.tsx(6,23): error TS2307: Cannot find module 'jsdom' or its corresponding type declarations.
```

## Root Cause

`CommunityPage.interaction.test.tsx` imported `JSDOM` directly. That made the TypeScript build depend on a test-only DOM package being installed in the Cloudflare clean environment.

The test only needed to preserve Community regression coverage for comment typing and stale like-count state. It did not need a full DOM runtime.

## Files Modified

- `src/routes/CommunityPage.interaction.test.tsx`
- `src/routes/CommunityPage.tsx`
- `src/routes/community-page-helpers.ts`

## jsdom Dependency Avoided

Yes.

The direct `jsdom` import was removed. No `jsdom` or `@types/jsdom` project dependency is required.

The Community interaction regression tests now use pure helper functions for:

- Thai comment text extraction.
- Comment draft update and submit text trimming.
- malformed input event safety.
- stale like-count reconciliation.
- safe comment arrays.

## Checks Run

- `npm run lint` passed.
- `npm run build` passed with the existing large chunk warning.
- `npm run test` passed: 44 files, 371 tests.
- Route smoke passed on local port 5174:
  - `/app/community`
  - `/app`
  - `/app/prices`
  - `/app/ai`
  - `/app/weather`
  - `/app/profile`
- Browser route smoke showed no blank roots and no console errors.
- `git diff --check` passed.

## Deployment Note

Cloudflare should no longer fail on `Cannot find module 'jsdom'` because the test file no longer imports it and the project does not require a direct jsdom dependency.

No app Community behavior was changed beyond reusing the extracted helper functions already matching the M116.1 logic. Production Community writes remain controlled by `VITE_ENABLE_COMMUNITY_WRITES=false`.
