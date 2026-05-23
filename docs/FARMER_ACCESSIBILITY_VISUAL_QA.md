# Farmer Accessibility + Visual QA Checklist

M15 focuses on making KasetHub easier for older and non-tech Thai farmers to understand on a phone. This is a frontend polish milestone only. It does not add backend, auth, Supabase writes, real AI, real ads, or real image uploads.

## UX Principles

- Use short Thai sentences.
- Make primary actions large and obvious.
- Keep Guest mode visible: users can continue without signup.
- Explain local-only data in plain language.
- Mark prototype, mock, and demo states clearly.
- Keep AI and disease-analysis warnings clear but not frightening.
- Avoid hiding important actions behind small text links.

## Text Readability

- Page titles should be readable at a glance.
- Supporting copy should use comfortable line height.
- Avoid long technical labels on user-facing surfaces.
- Developer/debug terms are allowed only when labeled as prototype or test mode.
- Important warnings should be repeated near the action they affect.

## Tap Target Size

- Primary buttons should be at least 48px tall.
- Bottom navigation items should be comfortable to tap.
- Share sheet actions should be large enough for thumb use.
- Profile menu rows should behave like full-width touch targets.
- Floating buttons should remain clear but not cover important content.

## Contrast

- Deep green remains the main action color.
- Warning boxes use amber backgrounds with readable dark text.
- Dangerous or destructive actions use rose/red tones.
- Badges should not rely on color alone; the label must explain the state.
- White cards need subtle borders/shadows on the soft green background.

## Thai Language Clarity

- Prefer direct wording such as “ข้อมูลนี้อยู่ในเครื่องนี้เท่านั้น”.
- Prefer “ยังไม่อัปโหลดรูปจริง” over technical storage terms in user copy.
- Keep “ใช้งานต่อได้เลย ไม่ต้องสมัคร” visible in account/auth areas.
- Replace backend wording with plain explanations unless it is a developer panel.

## Guest Mode Clarity

- Users can use the app immediately without creating an account.
- Saved data stays on the current device in this prototype.
- Future phone/LINE backup should be positioned as optional, not forced.
- Clearing browser data can remove local Guest Memory.

## Safety Disclaimer Clarity

- AI answers are guidance only.
- Plant disease analysis is preliminary.
- Chemical, pesticide, fertilizer, and disease guidance should encourage local expert confirmation.
- Price information must be labeled as sample/reference data unless connected to a trusted real source.
- Weather information must say `ยังไม่ใช่ข้อมูลพยากรณ์จริง` until a trusted source, timestamp, and freshness policy are connected.
- Farm area calculations must say “เป็นการคำนวณประมาณการ ไม่ใช่การรังวัดที่ดินอย่างเป็นทางการ” and avoid official land survey claims.
- Community reports and hidden posts should say they are local-only until a real moderation team exists.
- Community chemical or disease advice should repeat: “คำแนะนำเรื่องสารเคมี/โรคพืชควรตรวจสอบกับผู้เชี่ยวชาญ”.
- Admin previews should clearly say “หน้านี้เป็นตัวอย่างระบบผู้ดูแล ยังไม่มีสิทธิ์จริง” and avoid suggesting that a real server action happened.

## Image Upload Clarity

- Current version keeps image preview local.
- No real upload, Supabase Storage, or AI vision call happens in M15.
- Future uploads should require consent.
- Users should avoid uploading personal or sensitive images.
- Raw image data must stay out of Guest Memory/localStorage.

## AI Credit Clarity

- Show how many free questions remain today.
- Show rewarded credits separately.
- Explain that rewarded ads are mock/demo-only.
- Show estimated credit cost before asking.
- Real backend enforcement must happen server-side later.

## Saved/Bookmark Clarity

- Save actions should confirm success.
- Saved Articles, Saved Videos, My Farm, and Memory should explain whether data is local.
- Profile should give clear paths to saved content.
- Memory page should explain export/clear actions before user taps them.

## Routes Reviewed In M15

- `/app`
- `/app/admin`
- `/app/ai`
- `/app/analyze`
- `/app/youtube`
- `/app/community`
- `/app/community-rules`
- `/app/moderation-center`
- `/app/prices`
- `/app/weather`
- `/app/farm-area`
- `/app/farm-area-guide`
- `/app/profile`
- `/app/memory`
- `/app/auth`
- `/app/ai-credits`
- `/app/qa`

## Screenshot Guidance

When doing visual QA, capture mobile screenshots for:

- App home
- Admin Dashboard
- AI assistant
- Plant analysis
- YouTube Hub
- Community
- Community rules
- Moderation center
- Weather forecast
- Notification Center
- Notification settings
- Farm area calculator
- Farm area guide
- Profile
- Memory
- Auth
- AI credits
- QA checklist

Check for clipped Thai text, tiny buttons, overlapping badges, hidden warnings, and confusing demo/backend labels.

## Known UX Risks

- Developer panels are useful for the prototype but should be hidden from normal users later.
- Some pages include many advanced planning details because the project is still foundation-heavy.
- Real user testing with farmers has not happened yet.
- There is no in-app font size setting yet.

## Next Polish Tasks

- Test the app with older farmers and record confusing wording.
- Add a simple font-size setting in a later mobile/PWA milestone.
- Move developer/debug panels behind a prototype toggle before production.
- Run automated contrast and accessibility checks once the design system stabilizes.

## M30 Internal MVP QA Snapshot

M30 adds `/app/mvp-snapshot` and `docs/M30_ROUTE_CHECKLIST.md` to make route coverage visible before real staging work begins. The route should be checked on mobile viewport together with `/app/admin`, `/app/qa`, `/app/profile`, `/app/supabase-readiness`, and the main farmer-facing modules.

Accessibility review should still focus on plain Thai, large tap targets, readable warnings, no overlapping text, and clear local/mock/demo boundaries. M30 does not make the app production-ready or add real backend behavior.

## M32 Weather UX Notes

`/app/weather` should keep province/location selection manual, never ask for geolocation on load, and repeat that all values are mock/demo. Weather recommendation cards should use cautious Thai, avoid production claims, and remind users to check local conditions before spraying, harvesting, or working during heat/rain.

## M33 Farm Area UX Notes

`/app/farm-area` should keep number inputs large, labels plain, and results easy to compare in square meters, ตารางวา, งาน, and ไร่. It must not request GPS/geolocation or show real maps in M33. Saved plot cards should repeat that data is stored only on this device.

`/app/farm-area-guide` should use simple measuring steps, avoid legal/survey language, and keep the official-survey disclaimer visible near manual measurement guidance.

## M35 Notification UX Notes

`/app/notifications` and `/app/notification-settings` should keep large tap targets, plain Thai category labels, visible local/mock notices, and clear read/unread status. The settings screen must not look like it enables real push, LINE, SMS, or email delivery.
