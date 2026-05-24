# Calculator Export Template Guide

M54 adds reusable text export templates for agriculture calculator summaries. The templates are text-only and keep deterministic calculator output separate from future AI explanations.

## Files

- `src/services/agri-calculators/calculator-export-template.types.ts`
- `src/services/agri-calculators/calculator-export-template-service.ts`

## Template Coverage

Text templates support:

- spray mix
- plant spacing
- fertilizer helper
- yield estimate
- cost estimate

Each template includes:

- calculator title
- formatted input recap
- formatted result recap
- Thai disclaimer
- generated date/time
- `KasetHub เครื่องคำนวณเกษตร` source label
- optional crop label
- short LINE-friendly version
- long detail version

## LINE-friendly Rules

- Keep lines short.
- Put the most useful result lines near the top.
- Keep `ผลคำนวณเบื้องต้น` and `ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง`.
- Truncate oversized text with a clear note to check the full detail in KasetHub.

## Long Detail Rules

The long version should include input recap, result recap, warnings, generated time, source label, local-only note, and no-PDF/no-backend/no-AI boundary copy.

## Boundaries

- No PDF generation.
- No backend save.
- No Supabase write.
- No AI-generated explanation.
- No sponsor or affiliate content.
- No hidden crop recommendation.

