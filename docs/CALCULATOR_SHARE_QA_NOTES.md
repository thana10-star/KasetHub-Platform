# Calculator Share QA Notes

M54 hardens calculator share/export behavior before AI explanations or advanced monetization unlocks are added.

## Tested Behaviors

Vitest now covers:

- export template formatting for every calculator category
- short LINE-friendly template generation
- long detail template generation
- empty summary protection
- unsupported native share fallback
- clipboard copy success
- missing clipboard handling
- oversized text truncation

## Thai States

Share/copy flows should use clear Thai states:

- `คัดลอกข้อความสำเร็จ`
- `อุปกรณ์นี้ไม่รองรับการแชร์โดยตรง`
- `ลองคัดลอกข้อความแทน`

## Saved Results QA

`/app/calculators/saved-results` should show:

- compact result view
- expanded detail view
- LINE-friendly preview
- quick copy action
- native share with text-copy fallback
- delete confirmation
- calculator type filter
- local-only storage reminder

## Regression Boundary

Share templates and fallback helpers must not change deterministic formulas. If a future recommendation or AI layer is added, tests should prove the core calculator result remains unchanged.

