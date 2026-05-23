# Crop Watch + Price Alert UX

M22 adds a local-first crop watch and price alert preference foundation. It is UX-only and uses localStorage. There is no real push notification, no real price API, no backend job, no Supabase write, and no production price claim.

## Product Boundary

- Watches are stored only in the current browser.
- Alert preferences are mock preferences, not active push notifications.
- Mock alerts in `/app/notifications` are sample/demo rows.
- Prices remain `ราคาอ้างอิง`.
- Required disclaimer stays visible: `ราคาจริงขึ้นกับพื้นที่ เกรดสินค้า ความชื้น ฤดูกาล และผู้รับซื้อ`

## Local Files

- `src/services/crop-prices/crop-watch.types.ts`
- `src/services/crop-prices/crop-watch-service.ts`
- `src/hooks/useCropWatch.ts`
- `src/routes/CropWatchPage.tsx`

The service uses a versioned localStorage key and safe migration fallback. Screens subscribe through `useCropWatch()`.

## Crop Watch Model

`CropWatch` stores:

- crop key and crop name
- linked price fixture ID
- preferred market and region
- latest demo/reference price label
- source label
- reliability level
- enabled/disabled status
- alert preferences
- local timestamps

`CropWatchAlertPreference` supports:

- `price_up`
- `price_down`
- `target_price`
- `weekly_summary`

`target_price` may include a local numeric target. It is still only a local preference.

## UX Rules

`/app/prices`:

- shows watch status on each price card
- has quick buttons for price up, price down, and weekly summary
- links to `/app/crop-watch`
- keeps demo/local-only notices near alert controls

`/app/prices/:priceId`:

- shows a crop watch card
- shows an alert preference card
- includes target price input for demo preference testing
- keeps the AI price explanation CTA safety-labeled
- repeats the strong `ราคาอ้างอิง` disclaimer

`/app/crop-watch`:

- shows followed crops
- shows enabled alert preferences
- shows latest mock price, market, region, and source
- supports enabling/disabling and removing watches
- links back to price detail pages
- explains local-only storage and no real push

`/app/notifications`:

- is upgraded in M35 into the unified local Notification Center
- includes crop price alert examples from Crop Watch or fixture fallback
- labels them as `ราคาอ้างอิง` demo/sample
- does not claim any push delivery occurred

## Guest Memory Relationship

M21 already stores followed crop topics in Guest Memory. M22 keeps crop watch preferences in a dedicated localStorage store because alert preferences need their own versioned state. Price follow actions can still mirror a followed topic into Guest Memory so existing memory views continue to work.

Future sync should map both:

- Guest Memory followed topic: interest signal.
- Crop Watch: alert and market/region preference state.

## My Farm Hub Relationship

M34 reads Crop Watch records into `/app/my-farm` so followed crops and mock price alert preferences appear beside plots, weather, saved content, and AI history. The hub does not evaluate alerts, call price APIs, or convert local watch state into trusted production notifications.

## Future Backend Requirements

Real alerts should require:

- verified price source snapshots
- source freshness checks
- backend alert evaluation job
- user-owned alert preferences
- push/LINE/email delivery consent
- delivery logs and quiet-hour controls
- unsubscribe and disable controls
- anti-misinformation disclaimers in all message bodies

The browser must not decide trusted alert delivery or write production alert records directly.

## Current Limitations

- No real price updates.
- No push notification.
- No LINE Messaging API.
- No background jobs.
- No server state.
- No Supabase writes.
- No cross-device sync.
- No real notification delivery; M35 preferences are in-app local filters only.
