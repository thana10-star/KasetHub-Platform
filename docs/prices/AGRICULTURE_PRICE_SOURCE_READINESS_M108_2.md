# M108.2 Agriculture Price Source Readiness

## 1. Why Price Data Matters

Farmers often check market prices more frequently than they open farm notebook features. M108.2 therefore makes `ราคาเกษตร` a primary bottom-navigation entry while keeping `ฟาร์มของฉัน` available from Home, Profile, Help, Farm Records, and direct routes.

Price data can influence harvest timing, buyer conversations, and short-term planning. Because of that, KasetHub must not invent, randomize, or display sample commodity prices as if they were real.

## 2. Required Source Qualities

- Reliable enough for farmer-facing use, with a clear owner or publisher.
- Update frequency must be known and shown when prices are displayed.
- Thai commodity coverage must include crops farmers are likely to check often, such as rice, corn, cassava, sugarcane, rubber, palm oil, chili, vegetables, and fruit.
- No scraping from risky or permission-unclear sources.
- Every displayed price must have source attribution, date/freshness, unit, market/area, and stale-data handling.

## 3. Candidate Source Types

- Official open data sources.
- Government commodity price pages or reports.
- Market, auction, cooperative, or buying-point sources with permission or explicit public reuse terms.
- Owner-curated temporary lists, only when source/date/unit are recorded and the UI clearly labels the source.

## 4. V1 Rule

- No fake prices.
- No demo numbers presented as market data.
- If a real source is not connected, the app must show source pending wording such as `ยังไม่แสดงราคาจริงจนกว่าจะเชื่อมแหล่งข้อมูล`.
- Old detail links should fall back to the source-pending price hub instead of showing sample values.

## 5. Future Adapter Plan

- Add a price adapter behind a clear mode flag.
- Normalize commodity, unit, grade, market, region, source, and captured date.
- Add cache and stale-data labels before production display.
- Require source attribution on every price row and detail state.
- Add commodity mapping for Thai crop names, aliases, grades, and units.
- Keep error and fallback states explicit when a source fails or becomes stale.

## 6. Privacy

- No personal data is required to show commodity prices.
- No GPS or browser geolocation is required.
- Price preferences can remain local until a separate account/sync milestone adds explicit user consent, ownership, export/delete controls, and backend privacy review.
