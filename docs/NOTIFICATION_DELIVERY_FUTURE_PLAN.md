# Notification Delivery Future Plan

M35 is only an in-app local notification center. Real delivery must be added later behind backend-owned jobs and explicit user consent.

## Future Channels

- In-app notification inbox backed by database events.
- Push notifications after user permission and device registration.
- LINE notification future only after LINE Messaging API consent and channel setup.
- Email/SMS only after separate consent, cost review, and unsubscribe rules.

## Consent Requirements

- Store consent per channel and per notification category.
- Explain price/weather/community/system categories in Thai.
- Make opt-out easy.
- Do not treat M35 local preferences as production consent.

## Quiet Hours And Rate Limits

- Support user quiet hours.
- Rate-limit noisy categories such as weather and price alerts.
- Combine low-priority events into digest jobs.
- Keep emergency/high-risk notices separate and carefully reviewed.

## Backend Event Strategy

Future event creation should happen from trusted backend sources:

- crop price alert job after source freshness validation
- weather alert job after forecast freshness and source attribution
- community/moderation events from moderation workflow
- AI credit notices from backend credit ledger
- My Farm reminders from user-owned records
- account/sync events from authenticated session and sync logs

## Delivery Logs

Store delivery attempts and results in `notification_deliveries`. Include channel, provider response, retry count, failure reason, and created timestamp. Never expose provider secrets in the frontend.

## Anti-Misinformation Rules

- Price alerts must say `ราคาอ้างอิง`, cite source/date, and never guarantee sale price.
- Weather alerts must cite source/time and never claim official forecast unless the source is official and licensed.
- Crop-work recommendations must be guidance, not guaranteed outcomes.
- Community/moderation notices must not imply real admin action until backend moderation exists.

## Rollback

Future delivery flags should support immediate disable per channel. A failed alert job should stop sending, preserve audit logs, and show a safe in-app status rather than retrying indefinitely.
## M36 Phase Decision Note

Real notification delivery should wait until the backend/auth path is proven on staging. Price/weather/community/account notification events need user consent, notification preferences, rate limits, quiet hours, and backend event tables before push, LINE, SMS, or email delivery. M36 does not enable delivery; it only documents the branch strategy and next-phase order.
