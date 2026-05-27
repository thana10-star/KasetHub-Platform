# M116.7 Community Water Category Update Report

## 1. Summary

M116.7 adds `น้ำและระบบน้ำ` to the Community category system so farmers can post and filter water-management topics directly. This is a focused category/content update only.

## 2. Files Created

- `docs/community/COMMUNITY_CATEGORY_WATER_M116_7.md`
- `reports/milestones/M116_7_COMMUNITY_WATER_CATEGORY_UPDATE_REPORT.md`

## 3. Files Modified

- `src/services/community/community.types.ts`
- `src/services/community/community-service.ts`
- `src/services/community/community-service.test.ts`
- `src/routes/CommunityPage.test.tsx`
- `src/routes/CommunityPage.interaction.test.tsx`
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

## 7. Tests/Checks Run

- `npm run lint` passed.
- `npm run build` passed. Vite reported the existing large chunk warning after a successful build.
- `npm run test` passed: 44 test files, 388 tests.
- `git diff --check` passed.
- Mobile route smoke at a 390px viewport passed for `/app/community`, `/app`, `/app/prices`, `/app/ai`, `/app/weather`, and `/app/profile`.
- Route smoke confirmed `น้ำและระบบน้ำ` appears on Community composer and filter buttons, no horizontal overflow, visible bottom nav, and no old composer safety-gate copy.

## 8. Known Limitations

- This milestone does not add backend category analytics, moderation automation, or per-category notification behavior.
- Existing community rows with older category values are unchanged.
- No new content seeding or fake engagement is added.

## 9. Next Recommended Milestone

After owner retest, consider a small Community topic-quality milestone: lightweight category-specific placeholder examples and posting guidance, still without adding backend behavior or fake posts.
