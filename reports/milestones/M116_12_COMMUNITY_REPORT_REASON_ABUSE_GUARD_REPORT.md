# M116.12 Community Report Reason Abuse Guard Report

## 1. Summary

M116.12 fixes Community report reason submission so the UI displays Thai labels but sends only database-safe reason codes. It also adds V1 anti-abuse guards for login, double-submit prevention, local duplicate feedback, and duplicate database errors.

## 2. Root Cause

The staging report dialog could submit a display label such as `เนื้อหาไม่เหมาะสม` into `community_reports.reason`. The database check constraint expects reason codes, so the insert failed with `community_reports_reason_check`.

## 3. Reason Mapping Fix

The form state and service now use these codes:

| Thai label | DB code |
| --- | --- |
| `สแปม` | `spam` |
| `ข้อมูลอันตราย` | `dangerous_information` |
| `ข้อมูลส่วนตัว` | `personal_information` |
| `เนื้อหาไม่เหมาะสม` | `inappropriate` |
| `อื่น ๆ` | `other` |

Unknown reasons are rejected before insert with friendly copy. Thai labels are not sent to `community_reports.reason`.

## 4. Anti-Abuse Behavior

- Signed-in user required for report submission.
- Anonymous reports are blocked with `เข้าสู่ระบบก่อนรายงาน`.
- Submit button disables while sending.
- Submit handler ignores duplicate in-flight submits.
- Successful report marks the target locally for the session.
- Reopening the same target shows `คุณแจ้งรายงานนี้แล้ว`.
- Duplicate unique-index errors show `คุณแจ้งรายงานนี้แล้ว`.
- Non-duplicate insert failures show `ส่งรายงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง`.
- No CAPTCHA was added.

## 5. SQL Unique-Guard Draft

Created:

`supabase/sql/community_report_unique_guard_m116_12.sql`

It adds partial unique indexes for one report per reporter per post and one report per reporter per comment. Owner must apply it manually; the app already handles duplicate errors if the SQL is applied.

The M110 schema draft was also aligned to the current database reason code `inappropriate`.

## 6. Report Dialog UX Behavior

- Report options stay in the dialog, not inline on feed cards.
- The dialog shows reason options, optional note, cancel, and submit.
- Success/error feedback appears in the dialog.
- Submit is disabled while sending, when signed out, or when the target was already reported locally.
- Mobile layout stays as a bottom sheet with safe scrolling.

## 7. Tests / Checks Run

Completed:

- `npm run test -- CommunityPage community-service`
- `npm run lint`
- `npm run build`
- `npm run test`
- `git diff --check`

Results:

- Focused Community tests: 3 files passed, 63 tests passed.
- Full tests: 45 files passed, 422 tests passed.
- Production build passed with the existing large chunk warning.
- `git diff --check` passed with line-ending warnings only.
- Route smoke passed for `/app/community`, `/app`, `/app/prices`, `/app/ai`, `/app/weather`, and `/app/profile`.

## 8. Mobile Smoke Result

Completed in the in-app browser at 390px viewport.

Results:

- Document width: 390px client / 390px scroll.
- App scroll container: 390px client / 390px scroll.
- Report dialog opened from a post report button.
- Dialog width: 358px, left 16px, right 374px, within viewport.
- Reason options were visible: `สแปม`, `ข้อมูลอันตราย`, `ข้อมูลส่วนตัว`, `เนื้อหาไม่เหมาะสม`, `อื่น ๆ`.
- `ยกเลิก` and `ส่งรายงาน` were visible.
- Signed-out gate copy was visible: `เข้าสู่ระบบก่อนรายงาน`.
- No document-level horizontal overflow.

## 9. Owner Retest Steps

1. Login User A or User B.
2. Open `/app/community`.
3. Tap `รายงาน` on a post.
4. Select `สแปม` and submit.
5. Confirm `ขอบคุณที่แจ้ง ทีมงานจะตรวจสอบ` appears.
6. Tap `รายงาน` on the same post again.
7. Confirm `คุณแจ้งรายงานนี้แล้ว` or duplicate-safe copy.
8. Try `เนื้อหาไม่เหมาะสม` and confirm it no longer fails the check constraint.
9. Confirm the report dialog does not clutter the feed card.
10. Confirm signed-out users cannot submit reports.

## 10. Known Limitations

- No CAPTCHA in M116.12.
- No admin moderation dashboard.
- No backend rate limiting yet.
- SQL unique indexes are drafted but not assumed applied.
- Production writes remain controlled by `VITE_ENABLE_COMMUNITY_WRITES=false` by default.

## 11. Next Recommended Milestone

Add backend report rate limiting and a minimal moderation queue/operational review path before any public Community write launch.
