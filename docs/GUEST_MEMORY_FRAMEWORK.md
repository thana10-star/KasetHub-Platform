# Guest Memory Framework

## Purpose

KasetHub should be useful before login. Guest Memory stores helpful actions locally first: saved articles, saved videos, saved community posts, likes, followed crops/topics, My Farm records, and recent AI questions. Later, users can be invited to create an account with phone or LINE to sync this data across devices.

## Core Files

- `src/services/guest-memory/guest-memory.types.ts`
- `src/services/guest-memory/guest-memory-service.ts`
- `src/hooks/useGuestMemory.ts`

The service uses a versioned localStorage schema with safe parse, default state fallback, migration placeholder, and defensive persistence.

## Adding a New Saved Item Type

1. Add the type to `SavedItemType` if it is not already covered.
2. Call `saveItem()` with:
   - `itemType`
   - `itemId`
   - `title`
   - `summary`
   - `sourceRoute`
   - `tags`
   - `metadata`
3. Use `isSaved()` to render saved state.
4. Use `unsaveItem()` to remove it.

For future unknown features, use `future` first, then promote to a dedicated type when the product pattern stabilizes.

## Adding a Feature to Guest Memory

Use the hook in a screen or component:

```tsx
const { saveItem, isSaved, toggleLike, followTopic } = useGuestMemory();
```

Keep feature metadata structured and small. Store enough information to render an offline-friendly summary, but avoid storing large images, secrets, tokens, or raw API responses.

For M10 plant image analysis, store lightweight result metadata only. Do not store raw uploaded photos or large base64 thumbnails in Guest Memory. Use file name, result summary, confidence, and a thumbnail tone marker until real storage exists.

## Supabase Sync Future

Guest Memory maps cleanly to future cloud tables:

- `guest_profiles` or authenticated `profiles`
- `saved_items`
- `liked_items`
- `followed_topics`
- `recent_ai_questions`
- `farm_history_records`
- `plant_analysis_records`
- `plant_analysis_images` in future cloud storage metadata
- `memory_migrations`

When auth exists, the app can upload local memory after consent, merge by `itemType + itemId`, and preserve local timestamps. Server-side sync should handle deduplication, device IDs, and conflict resolution.

M05 adds `createGuestToCloudSyncPlan()` as a no-network planner. It estimates what would be uploaded after signup and mirrors the intended conflict rules:

- Saved items merge by `itemType + itemId`.
- Likes use OR/true wins.
- Followed topics merge by topic ID.
- Farm records keep both unless the same `localId` exists.
- AI question history is optional and consent-based.
- Cloud profile wins, but guest display name can be suggested.

M06 adds a Supabase environment and client scaffold, but Guest Memory remains the active storage layer. `getSupabaseClient()` returns `null` unless public ENV and feature flags are ready. No Guest Memory upload should run until a later milestone adds real auth, consent UI, and a backend-owned sync endpoint.

## YouTube Follower Feature Requests

When a YouTube follower asks for a new feature, start with local memory:

- Save a requested tool as `tool`
- Save a new content object as `future`
- Track interest through `followTopic`
- Track lightweight engagement through `toggleLike`
- Keep the route in `sourceRoute` so the item can deep-link later

This lets KasetHub test retention without forcing login or building backend tables too early.

## Current Limitations

- Data stays on one browser/device.
- Clearing browser storage removes guest memory.
- Export/import is framework-only in M04.
- Supabase client scaffolding exists in M06, but no cloud sync, auth, analytics, or user identity exists yet.
