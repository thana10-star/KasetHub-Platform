# M116.12 Community Report Reason And Abuse Guard

## 1. Root Cause

The staging report dialog allowed users to choose Thai labels such as `เนื้อหาไม่เหมาะสม`, but `community_reports.reason` expects database-safe reason codes. Sending a display label to `community_reports.reason` can violate `community_reports_reason_check`.

M116.12 keeps Thai labels in the UI and sends only database codes to the service/database.

## 2. UI Labels Vs Database Codes

| UI label | Database reason code |
| --- | --- |
| `สแปม` | `spam` |
| `ข้อมูลอันตราย` | `dangerous_information` |
| `ข้อมูลส่วนตัว` | `personal_information` |
| `เนื้อหาไม่เหมาะสม` | `inappropriate` |
| `อื่น ๆ` | `other` |

The form state uses the database code. The label map is only for display.

## 3. V1 Anti-Abuse Rules

- Reports require a signed-in Supabase user.
- Anonymous reports are not allowed.
- The submit button is disabled while a report is sending.
- The submit handler ignores a second submit while one is in flight.
- Successful reports are tracked in local page state for the current session.
- Opening the same target again in the same session shows `คุณแจ้งรายงานนี้แล้ว`.
- Duplicate database errors are mapped to `คุณแจ้งรายงานนี้แล้ว`.
- Other report insert failures show `ส่งรายงานไม่สำเร็จ กรุณาลองใหม่อีกครั้ง`.
- Raw Supabase error messages are not shown to users.

## 4. CAPTCHA Deferred

CAPTCHA is deferred for V1 because the immediate staging issue is a reason-code mismatch, and the first safe abuse controls are lower-friction: authenticated-only reports, local duplicate prevention, double-submit prevention, and a database unique-index plan.

Future CAPTCHA can be considered only if real abuse appears after launch. The next stronger controls should be backend rate limiting and a moderation queue before adding user-facing friction.

## 5. Unique Index SQL Plan

SQL draft:

`supabase/sql/community_report_unique_guard_m116_12.sql`

It adds partial unique indexes:

- one report per `reporter_user_id` per `post_id`
- one report per `reporter_user_id` per `comment_id`

The owner must apply this SQL manually in Supabase staging/production after confirming the community schema exists. The app already handles duplicate errors safely if the indexes are present.

## 6. Future Moderation And Rate Limits

Recommended future work:

- Backend rate limits for reports per user per hour/day.
- Moderator/admin queue for reviewing report targets.
- Report aggregation by target and reason.
- Audit trail for moderation actions.
- Expert escalation for dangerous agricultural/chemical advice.

## 7. Owner Retest Steps

1. Login as User A or User B.
2. Open `/app/community`.
3. Tap `รายงาน` on a post.
4. Select `สแปม` and submit.
5. Confirm `ขอบคุณที่แจ้ง ทีมงานจะตรวจสอบ` appears.
6. Tap `รายงาน` on the same post again.
7. Confirm `คุณแจ้งรายงานนี้แล้ว` appears.
8. Try `เนื้อหาไม่เหมาะสม` and confirm it no longer fails the check constraint.
9. Confirm the report dialog does not clutter the feed card.
10. Confirm a signed-out user cannot submit a report.
