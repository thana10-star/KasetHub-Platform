# M65 Offline Agriculture Article Library + Image Framework Report

## Summary

M65 adds a hybrid offline-first agriculture article foundation for KasetHub. The app now has bundled Thai agriculture article fixtures, taxonomy, planned image metadata, offline article list/detail routes, safety disclaimers, and future Supabase CMS compatibility notes.

No Supabase writes, backend CMS writes, AI article generation, YouTube import, sponsor/affiliate injection, external image loading, or required network calls were added.

## Files Changed

Offline article domain:

- `src/services/content/offline-agri-article.types.ts`
- `src/services/content/offline-agri-article-taxonomy.ts`
- `src/services/content/offline-agri-article-fixtures.ts`
- `src/services/content/offline-agri-article-service.ts`
- `src/services/content/offline-agri-article-image-plan.ts`
- `src/services/content/offline-agri-article-service.test.ts`

Routes and UI:

- `src/routes/OfflineAgriArticlesPage.tsx`
- `src/routes/OfflineAgriArticleDetailPage.tsx`
- `src/routes/ArticlesPage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`

Docs:

- `docs/OFFLINE_AGRICULTURE_ARTICLE_LIBRARY.md`
- `docs/OFFLINE_ARTICLE_IMAGE_ASSET_FRAMEWORK.md`
- `docs/AGRICULTURE_ARTICLE_SAFETY_POLICY.md`
- `docs/HYBRID_OFFLINE_CMS_CONTENT_STRATEGY.md`
- `docs/CONTENT_MANAGEMENT_FOUNDATION.md`
- `docs/OFFLINE_ARTICLE_CACHE_STRATEGY.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `docs/PROJECT_BLUEPRINT.md`
- `README.md`

Build artifacts updated by verification:

- `dist/index.html`
- `tsconfig.app.tsbuildinfo`

## Routes Added

- `/app/articles/offline`
- `/app/articles/offline/:slug`

## Article Category Counts

M65 adds 14 bundled offline article topics:

- Soil / ดิน: 2
- Water / น้ำ: 2
- Fertilizer / ปุ๋ย: 2
- Rice / ข้าว: 2
- Sugarcane / อ้อย: 2
- Cassava / มันสำปะหลัง: 2
- Farm Finance / บัญชีเกษตรและการเงิน: 2

The manual detail route check uses:

- `/app/articles/offline/soil-types-before-planting`

## Image Framework Notes

M65 adds planned image metadata only. Each article has a planned local cover path, Thai alt text, future prompt note, required aspect ratio, and offline size warning.

Image rules:

- prefer compressed `.webp`
- use one cover per article
- use only 1-3 inline images for important articles
- no external network image URLs in offline fixtures
- no heavy raw images or base64 blobs

## Offline Readiness Notes

All M65 article fixtures use `offlineAvailable: true`. The offline list and detail routes render from bundled app data and do not require Supabase, CMS, image CDN, or network calls.

## CMS Compatibility Notes

Each article includes a `futureCmsKey` and compatibility metadata. Future Supabase CMS content can override or extend article body content while keeping the bundled article as an offline fallback.

Seasonal, loan/rate, government scheme, market timing, and fast-changing articles should come from CMS rather than being hardcoded forever.

## Safety / Disclaimer Notes

Every article detail shows:

- `ข้อมูลนี้เป็นความรู้เบื้องต้น`
- `ควรตรวจสอบกับหน่วยงานเกษตร/ผู้เชี่ยวชาญในพื้นที่`

Finance articles include:

- `เงื่อนไขสินเชื่อ/โครงการรัฐเปลี่ยนได้ ควรตรวจสอบกับหน่วยงานจริง`

Fertilizer/chemical-adjacent articles include:

- `อ่านฉลากจริงก่อนใช้เสมอ`

## Tests

Vitest coverage includes:

- article count matches expected topic list
- all articles have slug/category/title/summary
- all articles are offline available
- all article categories exist
- every article has planned cover image metadata
- finance articles include the finance disclaimer
- fertilizer/chemical articles include the label safety disclaimer
- offline article service can find by slug
- no article uses an external network image URL

Result:

- 6 test files passed.
- 92 tests passed.

## Verification Commands

```bash
npm run lint
npm run test
npm run build
```

Results:

- `npm run lint` passed.
- `npm run test` passed: 6 files, 92 tests.
- `npm run build` passed.
- Vite reported the existing large chunk warning after production build.

Manual route checks were run against `http://127.0.0.1:5173` using Chrome headless DOM rendering with UTF-8 output decoding.

Checked routes:

- `/app/articles/offline` passed.
- `/app/articles/offline/soil-types-before-planting` passed.
- `/app/articles` passed.
- `/app/profile` passed.
- `/app/my-farm` passed.
- `/app/admin` passed.
- `/app/qa` passed.

## Known Limitations

- Articles are outlines and starter snippets, not full official articles.
- No real CMS or Supabase article rows exist yet.
- No article images are bundled beyond existing UI placeholders.
- No AI article generation or editorial automation.
- No YouTube import.
- No external image/CDN loading.
- No sponsor, affiliate, or product injection.
- No seasonal/government/loan facts are treated as lasting hardcoded claims.

## Next Recommended Milestone

M66 should add offline article content QA and CMS contract readiness: fuller editorial review checklists, article version fixtures, CMS override conflict rules, image asset size validation, and tests proving online CMS content can be planned without losing offline safety disclaimers.

