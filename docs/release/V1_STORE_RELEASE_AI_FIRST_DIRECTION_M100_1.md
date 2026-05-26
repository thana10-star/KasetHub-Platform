# V1 Store Release AI-First Direction M100.1

## 1. V1 Positioning

KasetHub V1 should be a farmer utility app, not a heavy farm-management system.

The first release should help farmers:

- ask AI about agriculture
- check weather and agriculture risk
- use simple tools and calculators
- learn from articles and videos
- keep a simple farm notebook

## 2. V1 Main User Promise

Thai product promise:

`ถามเรื่องเกษตร เช็กอากาศ ใช้เครื่องมือ และบันทึกฟาร์มง่าย ๆ ในแอพเดียว`

This promise fits the owner’s YouTube audience because it starts with interaction and useful answers, then supports practical follow-up tools.

## 3. V1 Priority Order

1. AI farmer assistant / `ถาม AI เกษตร`
2. Weather / `พยากรณ์อากาศและความเสี่ยงเกษตร`
3. Tools and calculators
4. Knowledge, YouTube videos, and articles
5. Basic My Farm / Farm Records

## 4. AI-First UX Plan

AI should be prominent from:

- Home
- bottom nav `ถาม AI`
- Help page
- future contextual cards under Weather, Tools, and Articles

Recommended AI copy:

- `ถาม AI เกษตร`
- `ถามเรื่องพืช ดิน ปุ๋ย โรค แมลง อากาศ และการจัดการฟาร์ม`
- `พิมพ์คำถามของคุณ เช่น ใบเหลืองเกิดจากอะไร หรือควรเตรียมดินก่อนปลูกอย่างไร`

Avoid overpromising:

- `ตอบถูกทุกเรื่อง`
- `คำแนะนำแน่นอน`
- `ใช้แทนผู้เชี่ยวชาญ`
- `วิเคราะห์โรคได้ชัวร์`

## 5. Weather Direction

Weather remains a V1 priority because it gives immediate daily utility.

V1 should finish:

- Cloudflare Pages env setup for Open-Meteo
- mobile visual check on `/app/weather`
- calm fallback copy when live weather is unavailable
- clear weather uncertainty and safety notes

Weather must continue to avoid GPS, precise farm coordinates, Supabase writes, backend writes, cloud sync, and notifications for V1.

## 6. Tools And Calculator Direction

Keep tools practical and mobile-safe:

- land/area measurement
- planting distance
- fertilizer/fertigation planning scaffold
- yield estimate
- cost estimate

Avoid dangerous pesticide/chemical recommendations. Label-only calculations can remain lower priority.

## 7. Knowledge And YouTube Direction

The owner’s agriculture YouTube channel should become a feedback loop for V1.

Use the audience to learn:

- what farmers want to ask AI
- which weather warnings matter
- which calculator tools are useful
- what basic content should be easier to find

Do not overbuild CMS before V1. Focus on useful starter topics: soil, fertilizer, weather risk, pest/disease basics, land/area tools, and farm records basics.

## 8. Basic My Farm Direction

Farm Records should remain Basic Mode by default.

Keep first-use actions simple:

- add plot
- record income/expense
- record harvest

Advanced analytics, export/restore, sync consent, crop cycles, break-even, and detailed tables should stay lower on the page or inside data-control/advanced areas.

No cloud sync for V1 unless separately approved.

## 9. Features To Defer After V1

- cloud sync
- sync queue
- Supabase writes
- GPS/geolocation
- receipt upload
- OCR
- notifications
- full legal-final PDPA copy
- deep Farm Records analytics
- marketplace/commerce
- advanced AI image diagnosis unless separately scoped
- paid weather provider integration

## 10. Navigation Recommendation

M108.2 updates the bottom nav to prioritize a higher-frequency farmer need:

- `หน้าแรก`
- `ราคาเกษตร`
- `เครื่องมือ`
- `ถาม AI`
- `โปรไฟล์`

AI remains visible in bottom nav. My Farm stays available from Home and secondary locations, while the bottom nav sends farmers to `/app/prices`.

Recommended Home priority:

1. Ask AI
2. Weather
3. Price hub or Tools
4. Tools
5. My Farm compact

Do not re-expand My Farm on Home.

## M101 Implementation Note

M101 applies the first AI-first polish pass:

- Home shows a prominent `ถาม AI เกษตร` card near the top.
- `/app/ai` uses farmer-facing input copy, prompt examples, and a clear fallback state when real AI is not enabled.
- The standard AI safety note appears on the AI page and answer cards.
- Internal AI status/scenario controls remain available under `ข้อมูลเพิ่มเติม / สำหรับทีมงาน`.

## M102 Release Gate Note

M102 keeps the AI-first V1 direction but turns the next step into a release gate:

- enable and verify live Weather through Cloudflare env flags
- keep AI UX ready while real provider execution remains separately scoped
- verify Home, AI, and Weather on mobile
- close store readiness blockers before new product expansion
- keep My Farm/Farm Records as a basic notebook for V1
