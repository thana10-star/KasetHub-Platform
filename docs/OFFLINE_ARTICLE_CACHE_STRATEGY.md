# Offline Article Cache Strategy

M20 upgrades saved/offline article planning from metadata-only saves toward article body cache readiness.

## Current Behavior

- Saved article state still uses Guest Memory through `src/services/offline/offline-article-service.ts`.
- Saving an article now enriches the saved metadata with a local body cache preview when the article exists in `articleContents`.
- Cache preview fields include:
  - `offlineAvailable`
  - `cachedAt`
  - `cacheVersion`
  - `bodyCachePreview`
  - `cacheSizeWarning`
- `src/services/content/offline-article-cache.ts` summarizes cache readiness for the admin preview.

## Storage Boundary

The current storage mode is `guest_memory_metadata`.

M20 does not add:

- service worker
- Cache API
- IndexedDB article body store
- background sync
- backend article cache endpoint
- Supabase write
- PWA install behavior

## Cache Versioning

Each `ArticleContent` has `offlineCacheVersion`.

Future cache invalidation should compare:

- `articleId`
- `offlineCacheVersion`
- article `updatedAt`
- user saved timestamp
- device storage availability

## Future Offline Architecture

A production offline reader should add:

- an IndexedDB body store for full article sections
- optional Cache API entries for images and public article payloads
- storage quota checks
- stale cache migration
- per-user saved article sync after authenticated ownership is confirmed
- clear local cache controls
- download progress and retry states
- service worker only when the PWA milestone is ready

## Safety Rule

Offline content must preserve safety notes and source metadata. Disease, pesticide, fertilizer, pricing, and AI-assisted advice should not be cached without its disclaimer and publish version.

## M65 Bundled Agriculture Articles

M65 adds bundled offline agriculture article fixtures that are available without a cache fetch:

- core article outlines live inside the app bundle
- planned image metadata uses local paths only
- cover images remain placeholders until optimized assets are intentionally added
- future CMS content can override or extend body content, while the bundled article remains a fallback

The M65 offline article library is not a service worker cache, IndexedDB body store, or Supabase CMS mirror yet. It is a schema and UI foundation for offline reading.
