# Fertilizer UI Rules M123

Date: 2026-05-27

## Current State

Fertilizer remains guarded and source-pending on `/app/prices`.

The app must not show fertilizer numbers until rows include formula, package size, unit, source, updated date, fetched date, and context.

## When No Verified Fertilizer Rows Exist

Show:

- `ราคาปุ๋ย`
- `ยังไม่แสดงราคา`
- source-pending copy

Do not show:

- numeric fertilizer prices
- formula rows such as `46-0-0` or `15-15-15`
- package sizes
- fake charts
- sample fertilizer rows
- Home fertilizer rows

## When Verified Fertilizer Rows Exist

Show each row with:

- fertilizer name
- formula
- package size
- price and unit
- source display name
- updated date
- fetched/check date if space allows
- stale label when stale
- province/shop/market context when relevant
- notes when the row is wholesale, retail, event, reference, or owner-curated

## Labels

Use clear labels:

- `ราคาปุ๋ย`
- `สูตร`
- `ขนาดบรรจุ`
- `บาท/กระสอบ`
- `แหล่งข้อมูล`
- `อัปเดต`
- `ข้อมูลเก่า / ควรตรวจสอบอีกครั้ง`
- `ข้อมูลอ้างอิง` for annual/provincial datasets
- `ราคาเฉพาะร้าน/พื้นที่` for local shop rows
- `ราคาโปรโมชัน/กิจกรรม` for event rows

## Home Rule

Do not show fertilizer on Home in M123.

Even after verified rows exist, Home display should wait for owner approval because fertilizer prices vary by formula, package size, shop, province, brand, and delivery cost.

## Farmer-Facing Safety Copy

When fertilizer rows are added later, `/app/prices` should include short copy near the fertilizer section:

`ราคาปุ๋ยอาจต่างกันตามสูตร ขนาดกระสอบ ร้าน พื้นที่ และค่าขนส่ง ควรตรวจสอบร้านหรือแหล่งข้อมูลจริงก่อนซื้อ`

## No-Fake-Data Rule

Never use crop sample rows, calculator fertilizer examples, event article snippets, or old annual averages as live fertilizer prices.
