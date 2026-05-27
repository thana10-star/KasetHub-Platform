# M116.5 Community UX Polish: Buttons, Icons, Copy

## 1. Summary

M116.5 polishes the `/app/community` V1 staging UI without changing backend behavior. The work makes post/comment actions more compact, keeps icons visible, simplifies composer copy, preserves readable Thai time display, and removes the confusing primary composer wording around safety checks.

## 2. Owner Feedback Addressed

- Reduced oversized Like / Comment / Share / Report buttons.
- Kept action icons using the existing `lucide-react` icon library.
- Preserved readable post and comment timestamps.
- Replaced confusing composer copy such as "เปิดเขียนหลังตรวจความปลอดภัย" with production-facing user copy.
- Kept the composer safe-by-default while making it feel like a real user action.

## 3. Button Size / Action UI Changes

- Post actions now use compact pill buttons with short Thai labels:
  - "ถูกใจ 0"
  - "คอมเมนต์ 0"
  - "แชร์"
  - "รายงาน"
- Active liked state keeps the same "ถูกใจ N" label with a filled heart and soft visual state.
- Removed the disabled "เพิ่มเติม" post action so actions do not dominate the card.
- Own post actions "ซ่อน" and "ลบ" are compact.
- Comment and reply actions now use compact buttons:
  - "ถูกใจ 0"
  - "ตอบกลับ"
  - "ซ่อน"
- Feed category filters now wrap on mobile instead of using a horizontal scrolling row.

## 4. Icon Usage

Used the existing `lucide-react` dependency only. No new icon library was added.

- Heart: like / active like
- MessageCircle: comment count
- Share2: share
- Flag: report
- Camera: image attach
- Send: submit post/comment/reply
- Reply: reply action
- Trash2: delete own post
- EyeOff: hide own post/comment

## 5. Composer Copy Changes

Composer title and subtitle:

- Title: "เขียนโพสต์"
- Subtitle: "เล่าเรื่องฟาร์ม ถามปัญหาพืช หรือแชร์ประสบการณ์"

Status and button copy:

- Writes enabled + signed in:
  - Badge: "พร้อมใช้งาน"
  - Submit: "ส่งโพสต์"
- Writes enabled + signed out:
  - Badge: "เข้าสู่ระบบก่อน"
  - Submit: "เข้าสู่ระบบเพื่อเขียนโพสต์"
- Writes disabled:
  - Badge: "ยังไม่เปิดเขียนโพสต์"
  - Submit: "เปิดใช้งานหลังตั้งค่าบัญชี"
  - Copy: "ตอนนี้อ่านและแชร์ได้ก่อน ระบบเขียนโพสต์จะเปิดหลังตั้งค่าบัญชี"

Image attach disabled copy is now:

- "แนบรูปได้เมื่อเปิดเขียนโพสต์"

The confusing primary composer copy "เปิดเขียนหลังตรวจความปลอดภัย" / "เปิดเขียนหลังตรวจสอบความปลอดภัย" is no longer rendered.

## 6. Time Readability Behavior

- Post time remains under the author name.
- Comment and reply time remains under each author name.
- Time formatting is Thai-friendly with short month, Buddhist year, and hour/minute, for example "26 พ.ค. 2569 20:37".
- Raw ISO timestamps are not shown in the UI.

## 7. Mobile Layout Notes

Mobile smoke was checked at 390px width.

- `/app/community` rendered with no document-level horizontal overflow.
- Feed filters wrap instead of creating a visible horizontal scrollbar.
- Composer remains readable.
- Bottom nav remains visible.
- Comment/reply indentation is shallow.
- Image preview height is capped on mobile.
- Report reason select is smaller and constrained.

Screenshot artifact:

- `reports/milestones/M116_5_community_mobile_smoke.png`

## 8. Tests / Checks Run

- `npm run lint` passed.
- `npm run build` passed.
- `npm run test` passed: 44 files, 381 tests.
- `git diff --check` passed.
- Focused Community tests passed:
  - `npm run test -- src/routes/CommunityPage.test.tsx src/routes/CommunityPage.interaction.test.tsx`
- Browser route smoke passed at mobile width for:
  - `/app/community`
  - `/app/notifications`
  - `/app`
  - `/app/prices`
  - `/app/ai`
  - `/app/weather`
  - `/app/profile`

Route smoke confirmed no error logs, root content present, bottom nav present, no old composer safety-check copy, and no document-level horizontal overflow.

## 9. Known Limitations

- Community writes remain disabled by default unless the existing staging flag/auth/readiness conditions are met.
- No backend behavior changed.
- No service role key is exposed.
- RLS is not bypassed.
- No fake engagement was added.
- Local smoke may show an empty real-feed state unless staging data and a signed-in session are available.
- Push notifications, private chat, follow/friend systems, multiple images, GPS/geolocation, and AI image diagnosis remain out of scope.

## 10. Owner Retest Steps

1. Open `/app/community` on a mobile viewport.
2. Confirm composer shows "เขียนโพสต์" and the simpler status/button copy.
3. Confirm the old "ตรวจความปลอดภัย" / "ตรวจสอบความปลอดภัย" composer copy is gone.
4. With staging writes enabled and signed in, confirm the submit button says "ส่งโพสต์".
5. Open comments on a real post and confirm "ถูกใจ", "คอมเมนต์", "แชร์", "รายงาน", and "ตอบกลับ" are compact and tappable.
6. Confirm post/comment/reply time remains visible and readable.
7. Confirm no horizontal page scroll appears on mobile.
8. Smoke `/app/notifications`, `/app`, `/app/prices`, `/app/ai`, `/app/weather`, and `/app/profile`.
