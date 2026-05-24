# Calculator Export Share Foundation

M53 upgrades calculator sharing with a structured local result summary model and a saved-results route. M54 adds reusable text export templates plus share fallback hardening. The feature remains local-only and does not generate PDF/files or write to any backend.

## Files

- `src/services/agri-calculators/calculator-result-summary.types.ts`
- `src/services/agri-calculators/calculator-result-summary-service.ts`
- `src/services/agri-calculators/calculator-export-template.types.ts`
- `src/services/agri-calculators/calculator-export-template-service.ts`
- `src/routes/CalculatorSavedResultsPage.tsx`
- `src/routes/CalculatorExportPreviewPage.tsx`

## Result Summary Model

Each summary includes:

- summary title
- input recap
- result recap
- safety disclaimer
- calculator route
- share text
- LINE, Facebook, and native share metadata
- `createdAt`
- local id

Saved summaries are stored under `kasethub.calculatorResultSummaries.v1`.

M54 export templates add a short LINE-friendly text version and a long detail text version. Both include generated time, source label, result recap, and Thai safety copy.

## User Actions

Valid calculator results support:

- copy summary
- share summary
- save local summary
- send to LINE through the existing share service
- open saved summaries from `/app/calculators/saved-results`
- preview text templates from `/app/calculators/export-preview`

Saved results can be filtered by calculator type, copied quickly, expanded for full detail, shared again, sent to LINE, opened in the original calculator, or deleted locally with confirmation.

## Fallback Behavior

M54 share helpers handle:

- unsupported native share
- missing clipboard
- empty summary text
- oversized summary text
- native share failure with clipboard fallback

## Boundaries

- No PDF generation.
- No file export yet.
- No backend save.
- No Supabase write.
- No analytics or share event upload.
- No sponsor/affiliate routing.
- No AI-generated recommendation.

Every summary must keep `ผลคำนวณเบื้องต้น` and `ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง` visible.
