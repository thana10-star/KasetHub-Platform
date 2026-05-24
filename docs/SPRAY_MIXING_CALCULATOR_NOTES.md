# Spray Mixing Calculator Notes

M49 adds `/app/calculators/spray-mix` as a local-only calculator for mixing amounts from label ratios.

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

## Required Safety Copy

The route must keep these messages visible:

- `ควรอ่านฉลากจริงก่อนใช้`
- Results are preliminary.
- Results are not an agronomist replacement.
- Follow the real product label and legal restrictions.
- Wear protective equipment and mix in a ventilated area.
- Local history is stored only on this device.

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
