# V1 Store Release Direction M100

## M100.1 Update

M100.1 refines this direction into an AI-first farmer utility release plan. Use `docs/release/V1_STORE_RELEASE_AI_FIRST_DIRECTION_M100_1.md` as the current V1 priority document.

## Direction

M100 starts a feature-freeze posture for V1 Store Release Mode.

The next work should make existing core features real, polished, and understandable rather than adding broad new systems.

## V1 Priorities

- Weather real API readiness and Cloudflare env verification.
- Mobile UI polish for Home, My Farm, Farm Records, calculators, Weather, AI, Profile, and Help.
- App icon, color, and store-facing visual polish.
- Keep Farm Records in Basic Farm Records Mode by default.
- Keep My Farm as a simple farmer hub.
- Keep calculators mobile-safe and safety-bound.
- Keep Profile/settings calm, with advanced/admin tools secondary.

## Defer Until After V1 Preview

- Cloud sync.
- Sync queue.
- Supabase writes.
- GPS/geolocation.
- Receipt upload.
- OCR.
- Notifications.
- AI processing of Farm Records.
- Full legal-final PDPA copy.
- Paid weather provider integration.
- Complex backend workflows.

## V1 Product Bar

V1 should feel useful even with local-first tools:

- A farmer can open the app and understand where to start.
- Farm Records can store real local user data on the device.
- Weather can show live Open-Meteo data when Cloudflare flags are enabled, and backup data when unavailable.
- Calculators remain usable on mobile without dangerous chemical or pesticide recommendations.
- Help and Profile explain the app without sounding like developer documentation.

## Release Rule

New systems should wait unless they unblock V1 launch quality. Small copy, layout, safety, route, and environment-readiness fixes are acceptable.
