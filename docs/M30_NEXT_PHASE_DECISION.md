# M30 Next Phase Decision

M30 captures the prototype state after M01-M29 and frames the safest next work.

## Recommended Direction

Proceed with staged backend enablement, starting with Supabase Auth and RLS verification before any cloud sync, community write, AI upload, or admin action.

## Option A: Supabase Auth Staging First

Best when the priority is data ownership and safe user identity.

- Configure staging Auth phone OTP.
- Keep production disabled.
- Validate redirect URLs and session persistence.
- Do not enable cloud sync until real session ownership is confirmed.
- Risk: medium.

## Option B: Guest Sync Edge Function Staging

Best after Option A is complete.

- Deploy `guest-memory-sync` to staging only.
- Use service-role key only inside the Edge Function.
- Test idempotency keys, duplicate merge, partial success, and rollback.
- Keep local Guest Memory intact.
- Risk: high.

## Option C: AI Backend Proxy Staging

Best when validating the core AI value proposition.

- Add backend-owned provider keys.
- Enforce credits server-side.
- Log safety events.
- Keep image upload and plant analysis behind staging gates.
- Risk: critical.

## Option D: Admin / CMS / Moderation Staging

Best when the priority is operational control before public content/community.

- Add admin RBAC.
- Protect queues with real auth roles.
- Add audit logs.
- Connect content review and moderation actions only after RLS verification.
- Risk: high.

## Decision Guardrails

- Do not enable production before staging passes.
- Do not put service-role keys in frontend.
- Do not write user-owned data until Auth + RLS are verified.
- Do not connect AI/image upload without backend safety review.
- Do not show crop price data as production truth without source attribution, freshness, and correction workflow.
- Do not show weather data as production truth without source attribution, timestamp, freshness, and location privacy review.
- Do not treat farm area estimates as official land survey results.

## Suggested Milestone Order

1. M31 Image Compression + Preflight Quality Foundation. Completed as a local-only AI cost/safety preparation layer.
2. M32 Weather Forecast Agriculture UX Foundation. Completed as a local/mock weather planning layer.
3. M33 Farm Area Measurement Planner Foundation. Completed as a local/mock calculator and future GPS/map planning layer.
4. M34 My Farm Hub Upgrade Foundation. Completed as a local-first farmer workspace aggregation layer.
5. M35 Notification Center Upgrade Foundation. Completed as a local/mock in-app notification and preference layer.
6. M36 Real Backend Phase Decision + Staging Branch Plan. Completed as planning only.
7. M37 Supabase staging SQL/RLS execution and verification.
8. M38 Phone Auth staging after SQL/RLS checks.
9. M39 Guest Sync Edge Function staging after real session ownership.
10. M40 AI text proxy staging, followed by plant vision and mobile/PWA work.

## M31 Decision Update

M31 is a low-risk preparation milestone because it does not connect backend systems. It improves the future AI path by reducing large images locally, warning about poor photos, and keeping raw image/base64 data out of Guest Memory.

This does not remove the need for backend-owned AI proxy, consent, upload moderation, storage deletion, credit enforcement, and expert escalation before real plant analysis.

## M32 Decision Update

M32 is also low-risk because it keeps all weather values in fixtures and does not request geolocation or call a provider. It improves the farmer-facing prototype by showing how weather, crop-work timing, and risk labels can be presented in simple Thai before source integration.

This does not remove the need for a backend weather cache, source attribution, timestamp/freshness checks, opt-in location handling, alert consent, and expert-reviewed agriculture risk rules before real forecast or notification behavior.

## M33 Decision Update

M33 is low-risk because it keeps land measurement as local calculation and localStorage-only plot estimates. It gives farmers a useful unit conversion and manual measuring workflow without requesting GPS, loading maps, calling providers, or writing backend data.

This does not remove the need for auth, RLS, location privacy review, map provider review, export/share consent, delete controls, and legal copy review before real GPS/map plot boundaries or cloud plot storage are enabled.

## M34 Decision Update

M34 is low-risk because it aggregates existing local data instead of adding new backend behavior. It makes My Farm easier to understand as the farmer workspace while keeping Guest Memory and localStorage as the source of truth.

This does not remove the need for real auth, user ownership, RLS, sync consent, conflict handling, and server-generated dashboard views before My Farm becomes a cross-device production workspace.

## M35 Decision Update

M35 is low-risk because it only organizes local/mock notifications and preferences in the browser. It does not request push permission, call LINE Messaging API, send SMS/email, run scheduler jobs, call backend endpoints, or write Supabase data.

This does not remove the need for explicit delivery consent, quiet hours, rate limits, backend-generated notification events, delivery logs, unsubscribe controls, and source/freshness checks before real notification delivery is enabled.
## M36 Update

M36 turns the broad next-phase discussion into a concrete planning surface at `/app/next-phase`.

Recommended order:

1. Supabase staging connection + SQL/RLS execution on staging.
2. Phone auth staging.
3. Guest Sync staging.
4. Real AI text proxy.
5. Plant vision proxy.
6. PWA/mobile wrapper.

AI text proxy can move earlier if demo value is the priority, but only with backend-owned secrets, rate limits, cost caps, safety logs, and fixture fallback.

No real backend/API/auth behavior is enabled by this planning milestone.
