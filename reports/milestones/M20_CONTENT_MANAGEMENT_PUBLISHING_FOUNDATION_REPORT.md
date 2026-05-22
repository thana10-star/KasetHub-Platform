# M20 Content Management + Publishing Foundation Report

## Summary

M20 adds a local content management and publishing foundation for KasetHub. Articles now have body sections, taxonomy, authors, difficulty, publishing status, related content, and offline body cache metadata. The app now supports article detail pages, an admin preview, fixture-backed article search/filtering, a YouTube import planner, and offline article body cache planning. No production CMS, YouTube API, transcript fetch, backend write, Supabase mutation, service worker, Cache API, or network call is added.

## Files Changed

- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/CONTENT_MANAGEMENT_FOUNDATION.md`
- `docs/YOUTUBE_IMPORT_CONTENT_STRATEGY.md`
- `docs/OFFLINE_ARTICLE_CACHE_STRATEGY.md`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/data/mockData.ts`
- `src/components/kaset/ArticleCard.tsx`
- `src/routes/ArticlesPage.tsx`
- `src/routes/ArticleDetailPage.tsx`
- `src/routes/ContentAdminPreviewPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/QAPage.tsx`
- `src/services/content/content.types.ts`
- `src/services/content/content-taxonomy.ts`
- `src/services/content/content-fixtures.ts`
- `src/services/content/youtube-import-planner.ts`
- `src/services/content/offline-article-cache.ts`
- `src/services/offline/offline-article-service.ts`
- `src/services/guest-memory/guest-memory-service.ts`
- `reports/milestones/M20_CONTENT_MANAGEMENT_PUBLISHING_FOUNDATION_REPORT.md`

## Routes Added

- `/app/articles/:articleId`
- `/app/content-admin-preview`

## Article Foundation

- `articleContents` is now the canonical local fixture for article bodies.
- Legacy `articles` mock data is derived from `articleContents.map(contentToArticle)` to avoid duplicate article fixtures.
- `/app/articles` supports local search, content category filtering, and difficulty filtering.
- `ArticleCard` links to article detail routes and shares `/app/articles/:articleId`.
- Article detail pages show body sections, checklists, key takeaways, safety notes, related videos, related articles, save, offline, and share actions.

## Offline Cache Foundation

- Saved/offline article behavior remains Guest Memory-backed.
- Saving an article enriches metadata with local body cache preview fields:
  - `offlineAvailable`
  - `cachedAt`
  - `cacheVersion`
  - `bodyCachePreview`
  - `cacheSizeWarning`
- `offline-article-cache.ts` summarizes cache readiness for the admin preview.
- Guest Memory article source routes now point to `/app/articles/:articleId`.

## YouTube Import Planner

- `youtube-import-planner.ts` maps local YouTube fixtures into import candidates.
- The planner proposes category, difficulty, ownership check status, editor review state, and workflow notes.
- The planner is fixture-only and does not call YouTube Data API, fetch transcripts, download videos, or write CMS rows.

## Admin Preview

`/app/content-admin-preview` shows:

- article count
- video content count
- offline cache readiness count and estimated size
- publishing workflow preview
- article inventory
- YouTube import candidates
- offline cache readiness rows

## Verification Commands

```bash
npm run lint
npm run build
```

Both commands passed. The production build completed with the existing Vite chunk-size warning.

## Manual Route Checks

Headless Chrome checks passed for:

- `/app/articles`
- `/app/articles/article-001`
- `/app/content-admin-preview`
- `/app/profile`
- `/app/memory`
- `/app/qa`

## Known Limitations

- No production CMS
- No real admin authentication or roles
- No YouTube Data API
- No transcript fetch
- No AI article generation
- No backend writes
- No Supabase content mutations
- No service worker or Cache API
- Offline body cache is metadata preview only
- Content fixtures remain sample data

## Next Recommended Milestone

M21 should decide whether to deepen the content path with editor roles and CMS-ready API contracts, or move toward production offline reading with IndexedDB and a PWA/service-worker milestone. Either path should keep backend writes disabled until ownership, auth, and review policies are finalized.
