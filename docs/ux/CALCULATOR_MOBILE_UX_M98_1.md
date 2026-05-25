# Calculator Mobile UX M98.1

## Purpose

M98.1 responds to real mobile preview feedback in the `เครื่องมือ` / calculator area.

The goal is to make calculator pages easier to understand on mobile, make crop selection obviously tappable, and replace the weak chemical-mix emphasis with a safer fertilizer/fertigation planning direction.

## What Changed

- Crop selectors now use a highlighted tappable select with `พืชที่เลือก`, `เลือกพืช`, `แตะเพื่อเปลี่ยนชนิดพืช`, and a chevron.
- Calculator hero copy uses Thai production-facing wording instead of `Local calculator`.
- Share summary copy uses Thai user-facing wording instead of `local-only` / `LINE-friendly`.
- Area/unit rows stack on mobile and only become two columns at larger widths.
- N/P/K fertilizer inputs stack on mobile and use a mobile-safe grid.
- Long result values and unit suffixes can wrap instead of pushing cards wider than the viewport.

## Crop Selection

The planting-distance calculator no longer defaults to rice. It now starts with `ข้าวโพด`, which better matches clear row/plant spacing assumptions.

Calculator crop options include:

- ข้าวโพด
- อ้อย
- มันสำปะหลัง
- ยางพารา
- ยูคาลิปตัส / ยูคา
- พริก
- ปาล์มน้ำมัน

Rice remains available as a crop profile, but it is not the headline/default spacing example.

## Fertilizer / Fertigation Direction

The fertilizer tool is now `คำนวณปุ๋ย/การให้ปุ๋ย`.

It adds safe planning context fields:

- อายุพืช / ระยะพืช
- วิธีให้ปุ๋ย
- หว่าน/โรย
- ผ่านน้ำหยด
- ผสมน้ำรด

The calculation still uses only the user-entered target rate and fertilizer formula. It does not invent crop-stage fertilizer rates.

## Chemical Tool Boundary

The previous chemical-mix surface is deprioritized and renamed `คำนวณตามฉลากยา/สาร`.

It remains available because existing routes and tests must not break, but it is limited to arithmetic based on label values that the user enters.

It must not:

- recommend pesticide or chemical rates
- override product labels
- claim official agronomy guidance
- use AI to create dosage instructions

## Mobile Layout Rules

Calculator pages should:

- use one column on narrow screens
- avoid fixed-width input rows
- keep unit suffixes from forcing horizontal scroll
- wrap Thai warning and result text safely
- use large tap targets for selectors and buttons
- keep advanced/QA/planning content lower or inside secondary sections

## Non-goals

M98.1 does not add backend writes, Supabase writes, cloud sync, GPS/geolocation, AI execution, receipt upload, OCR, notifications, official agronomy recommendations, or dangerous pesticide/chemical dosage advice.
