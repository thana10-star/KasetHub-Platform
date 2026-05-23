# M35 Notification Center Upgrade Foundation Report

## Summary

M35 upgrades KasetHub notifications into a unified local/mock notification center. The app now aggregates weather alerts, crop price alerts, AI credit notices, community moderation notices, My Farm reminders, content updates, account/sync readiness, and system notices without adding real push, LINE Messaging API, email/SMS, backend writes, Supabase writes, scheduler jobs, or network calls.

## Files Changed

- `src/services/notifications/notification.types.ts`
- `src/services/notifications/notification-fixtures.ts`
- `src/services/notifications/notification-center-service.ts`
- `src/hooks/useNotificationCenter.ts`
- `src/routes/NotificationsPage.tsx`
- `src/routes/NotificationSettingsPage.tsx`
- `src/routes/AppHomePage.tsx`
- `src/routes/ProfilePage.tsx`
- `src/routes/MyFarmPage.tsx`
- `src/routes/MyFarmSettingsPage.tsx`
- `src/routes/AdminDashboardPage.tsx`
- `src/routes/QAPage.tsx`
- `src/app/App.tsx`
- `src/types/kaset.ts`
- `src/services/qa/route-registry.ts`
- `README.md`
- `docs/PROJECT_BLUEPRINT.md`
- `docs/NOTIFICATION_CENTER_FOUNDATION.md`
- `docs/NOTIFICATION_DELIVERY_FUTURE_PLAN.md`
- `docs/MY_FARM_HUB_FOUNDATION.md`
- `docs/CROP_WATCH_PRICE_ALERT_UX.md`
- `docs/WEATHER_FORECAST_AGRICULTURE_FOUNDATION.md`
- `docs/COMMUNITY_MODERATION_FOUNDATION.md`
- `docs/FARMER_ACCESSIBILITY_VISUAL_QA.md`
- `docs/M30_NEXT_PHASE_DECISION.md`
- `docs/SUPABASE_SCHEMA_DRAFT.md`
- `docs/SUPABASE_TYPE_MAPPING.md`
- `reports/milestones/M35_NOTIFICATION_CENTER_UPGRADE_FOUNDATION_REPORT.md`

## Routes Added

- `/app/notification-settings`

## Notification Model Notes

- `NotificationItem` represents in-app notification rows with source, priority, CTA, read state, source label, and demo label.
- `NotificationType` supports weather, crop price, AI credit, community report, moderation update, My Farm reminder, content update, account sync, and system notice.
- `NotificationPreference` stores local display preferences only. It is not production delivery consent.
- `NotificationDigestPreview` summarizes total, unread, high-priority, urgent, and tab counts.

## Local State/Preference Notes

- Local notification state is stored in `kasethub.notificationCenter.v1`.
- State includes read IDs, archived demo IDs, and preferences with safe migration.
- Mark read, mark all read, clear read demo, reset demo, and preference toggles never leave the browser.
- No raw images, real user data, push tokens, provider IDs, or endpoint URLs are stored.

## Screens Updated

- `/app/notifications` now has tabs for all, weather, price, My Farm, community, and system; read/unread state; mark read; mark all read; clear read demo; priority badges; source labels; CTA routes; and local/demo notices.
- `/app/notification-settings` shows local mock preferences for price alerts, weather alerts, My Farm reminders, community updates, AI credit notices, content updates, and account/sync notices.
- `/app`, `/app/profile`, `/app/my-farm`, and `/app/admin` now show compact unread/local alert summaries linking to the notification center.
- `/app/my-farm/settings` links to notification settings.
- `/app/qa` includes notification routes in the route checklist.

## Future Delivery Notes

- Future delivery should use backend-generated `notification_events`, user-owned `notification_preferences`, channel-specific `notification_deliveries`, and `notification_digest_jobs`.
- Push, LINE, SMS, and email require explicit consent, quiet hours, rate limits, delivery logs, unsubscribe controls, and backend-owned provider secrets.
- Price notifications must say `ราคาอ้างอิง` and cite source/date before production delivery.
- Weather notifications must cite source/time and avoid production forecast claims until a real provider/source is integrated.

## Verification Commands

```bash
npm run lint
npm run build
```

Both passed. The production build completed with the existing Vite large chunk warning.

## Manual Route Checks

Checked with local Vite on `http://127.0.0.1:5174` and headless Chrome DOM checks.

Passed:

- `/app/notifications`
- `/app/notification-settings`
- `/app`
- `/app/profile`
- `/app/my-farm`
- `/app/my-farm/settings`
- `/app/admin`
- `/app/qa`

## Known Limitations

- No real push notifications.
- No LINE Messaging API.
- No email or SMS delivery.
- No backend notification events.
- No Supabase writes or migrations.
- No real scheduler or alert evaluation job.
- No cross-device sync for read state or preferences.
- Local preferences are not production consent.
- Notification content is derived from mock/local/demo sources only.

## Next Recommended Milestone

M36 should begin the controlled Supabase/Auth staging adapter path, or add a backend notification event/delivery contract if alert delivery becomes the next priority. Real delivery should wait until auth ownership, consent, source freshness, quiet hours, rate limits, and delivery audit logs are designed and tested on staging.
