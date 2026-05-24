# Spray Mixing Calculator Notes

M49 adds `/app/calculators/spray-mix` as a local-only calculator for mixing amounts from label ratios. M50 adds validation hardening, deterministic QA fixtures, and local share-summary support.

## What It Does

The calculator asks for:

- tank size in liters
- chemical amount from the real label
- unit: cc, ml, or gram
- label water volume in liters

It then calculates:

```text
required amount = label amount / label water liters * tank liters
```

Example:

```text
20 cc per 20 L label rate, 15 L tank
20 / 20 * 15 = 15 cc
```

## Tank Sizes

Supported presets:

- 10L
- 15L
- 20L
- 200L
- custom

Custom tank size is still local arithmetic. It does not infer sprayer type, nozzle rate, crop canopy, wind, or field coverage.

## Warning Logic

The M49 foundation warns when calculated concentration per liter is high:

- cc/ml over 10 per liter
- gram over 20 per liter

These thresholds are guardrails for double-checking input. They are not regulatory or agronomic limits.

M50 also prevents invalid saves when the tank size, label amount, label water volume, or unit is empty, zero, negative, non-number, or missing from corrupted local state. Very large tank sizes trigger review warnings.

## QA Fixture Examples

Deterministic checks include:

- 20 cc per 20 L label rate, 20 L tank = 20 cc
- 20 cc per 20 L label rate, 10 L tank = 10 cc
- 20 cc per 20 L label rate, 200 L tank = 200 cc

These appear on `/app/calculators/qa` with expected vs actual output.

## Required Safety Copy

The route must keep these messages visible:

- `ควรอ่านฉลากจริงก่อนใช้`
- Results are preliminary.
- Results are not an agronomist replacement.
- Follow the real product label and legal restrictions.
- Wear protective equipment and mix in a ventilated area.
- Local history is stored only on this device.

## Share Summary

Valid spray results can be copied or shared as local text only. The summary includes:

- `สรุปผลคำนวณเบื้องต้น`
- required chemical amount
- concentration per liter
- warnings when present
- `ควรตรวจสอบฉลาก/ผู้เชี่ยวชาญก่อนใช้งานจริง`

No PDF, file export, backend save, Supabase write, sponsor routing, or AI recommendation is added.

## What It Does Not Do

- No product recommendation.
- No pest/disease diagnosis.
- No pesticide legality check.
- No weather/wind drift check.
- No worker safety certification.
- No backend write.
- No Supabase write.
- No AI API call.
- No sponsor or affiliate routing.

## Future Integration Notes

Future AI can help read label text only after image/text safety review exists. Even then, the app should show extracted label data as user-confirmed inputs before calculating.

Future sponsor or affiliate features must not replace the label-first calculation. Paid product placement must be labeled and separated from the calculator result.
