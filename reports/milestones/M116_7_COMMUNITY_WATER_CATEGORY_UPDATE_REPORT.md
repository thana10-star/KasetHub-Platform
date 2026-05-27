# M116.7 Community Water Category Update Report

## 1. Summary

M116.7 adds `น้ำและระบบน้ำ` to the Community category system so farmers can post and filter water-management topics directly. This is a focused category/content update only.

Additional owner polish in this pass makes visible post comment counts show directly on closed post cards. Counts now include top-level comments and one-level replies when readable, and local successful comment/reply/hide actions update the card count immediately without fake engagement.

## 2. Files Created

- `docs/community/COMMUNITY_CATEGORY_WATER_M116_7.md`
- `docs/community/COMMUNITY_COMMENT_COUNT_VISIBILITY_M116_7.md`
- `reports/milestones/M116_7_COMMUNITY_WATER_CATEGORY_UPDATE_REPORT.md`

## 3. Files Modified

- `src/services/community/community.types.ts`
- `src/services/community/community-service.ts`
- `src/services/community/community-service.test.ts`
- `src/routes/CommunityPage.test.tsx`
- `src/routes/CommunityPage.interaction.test.tsx`
- `src/routes/community-page-helpers.ts`
- `docs/community/COMMUNITY_REAL_FOUNDATION_M109.md`

## 4. Category Added

Added category:

- `น้ำและระบบน้ำ`

Covered topics include irrigation, drip systems, sprinklers, ponds, water shortage, flooding, brackish/saline water, pumps, pipes, and filters.

## 5. Existing Category Preservation

Existing categories are preserved:

- `ปัญหาพืช`
- `ดินและปุ๋ย`
- `อากาศ`
- `ราคาเกษตร`
- `เครื่องมือ/แอพ`
- `เรื่องเล่าจากฟาร์ม`
- `อื่น ๆ`

The fallback category is now named explicitly as `อื่น ๆ` instead of relying on an array index, so future category insertions do not shift fallback behavior.

## 6. Mobile Layout Notes

Composer category chips and feed filter chips continue to use wrapping flex layout. The new water category can wrap to a new line on mobile, avoiding horizontal overflow.

The comment action button remains compact. When the count is above zero, only the count itself becomes a small badge inside the pill, avoiding a wider separate control.

## 7. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. Vite reported the existing large chunk warning after a successful build.
- `npm run test` passed: 44 test files, 392 tests.
- `git diff --check` passed.
- Mobile route smoke at a 390px viewport passed for `/app/community`, `/app`, `/app/prices`, `/app/ai`, `/app/weather`, and `/app/profile`.
- Route smoke confirmed `น้ำและระบบน้ำ` appears on Community composer and filter buttons, the Community comment action remains present, no horizontal overflow, visible bottom nav, and no old composer safety-gate copy.
- Targeted Community tests passed for comment count rendering, backend comment-row counting, top-level comment/reply count increments, hide decrement, and stale refresh reconciliation.

## 8. Known Limitations

- This milestone does not add backend category analytics, moderation automation, or per-category notification behavior.
- Existing community rows with older category values are unchanged.
- No new content seeding or fake engagement is added.
- Comment count accuracy still depends on readable published `community_comments` rows or the existing post `comment_count` fallback.

## 9. Next Recommended Milestone

After owner retest, consider a small Community topic-quality milestone: lightweight category-specific placeholder examples and posting guidance, still without adding backend behavior or fake posts.
