# Offline Agriculture Article Library

M65 adds a bundled offline agriculture article library for KasetHub. The library is designed for evergreen, Thai-first farming knowledge that can be read without a network connection while staying compatible with a future Supabase CMS.

## Content Model

Offline articles use `OfflineAgriArticle` in `src/services/content/offline-agri-article.types.ts`.

Each article includes:

- stable `id` and `slug`
- category and Thai title
- short Thai summary
- difficulty level: `basic`, `intermediate`, or `advanced`
- reading minutes
- `offlineAvailable: true`
- body readiness: `outline_only` or `starter_content`
- `sourceStatus: internal_draft`
- planned cover and inline image metadata
- Thai alt text and future image prompt notes
- safety notes
- related calculator or app route where useful
- `futureCmsKey` for Supabase CMS compatibility

## Categories

M65 starts with seven Thai farming categories:

- Soil / ดิน
- Water / น้ำ
- Fertilizer / ปุ๋ย
- Rice / ข้าว
- Sugarcane / อ้อย
- Cassava / มันสำปะหลัง
- Farm Finance / บัญชีเกษตรและการเงิน

Each category currently has two starter topics. These are outlines and short snippets, not full official articles.

## Offline Rules

- Core evergreen articles can be bundled in the app.
- Seasonal, loan, rate, government scheme, and fast-changing articles should come from future CMS content.
- The bundled article stays as a fallback if CMS is unavailable.
- No external image URLs are used in the offline fixtures.
- No network call is required to render `/app/articles/offline`.

## User Safety

Every detail page must show:

- `ข้อมูลนี้เป็นความรู้เบื้องต้น`
- `ควรตรวจสอบกับหน่วยงานเกษตร/ผู้เชี่ยวชาญในพื้นที่`

Finance content must also warn that loan or government scheme conditions can change. Fertilizer or chemical-adjacent content must remind users to read the real label before use.

