# M116.1 Community Like Count Strategy

Date: 2026-05-26

## Problem

Owner staging retest still saw the visible like count stay at `0` after clicking Like.

The safest assumption is that the UI cannot rely only on `community_posts.like_count` during staging. That denormalized field may be stale if the database has no trigger maintaining it, or if the refreshed feed read returns before a backend counter catches up.

## Options

1. Compute visible counts from readable `community_likes` rows.
2. Add a database trigger to maintain `community_posts.like_count`.
3. Add a backend/RPC count endpoint that returns RLS-safe counts.

## Current M116.1 Choice

For staging UI reliability, the app uses a two-layer approach:

- `listPosts()` counts readable rows from `community_likes` for authenticated users when RLS permits it.
- After a successful like/unlike, the UI applies an action-derived local count immediately and reconciles any backend refresh without letting a stale `like_count = 0` overwrite the successful action.

This does not fake engagement because the visible count changes only after the service action succeeds.

## Future Backend Recommendation

Before public production launch, choose one backend-owned count path:

- database trigger for `community_posts.like_count`, or
- controlled RPC/Edge Function for counts and notification creation.

Do not expose service-role keys in the frontend.
