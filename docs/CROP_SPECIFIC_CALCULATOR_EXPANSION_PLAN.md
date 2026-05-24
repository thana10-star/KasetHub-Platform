# Crop-specific Calculator Expansion Plan

M51 prepares crop-specific calculator data foundations without turning KasetHub calculators into hidden agronomy recommendations.

## Scope

- No backend writes.
- No Supabase writes or migrations.
- No AI API calls.
- No real agronomy recommendation engine.
- No pesticide or chemical recommendation engine.
- No OCR.
- No sponsor or affiliate integration.
- No network calls.

## Crop Profiles

Crop profile fixtures live in:

- `src/services/agri-calculators/crop-calculator-profile.types.ts`
- `src/services/agri-calculators/crop-calculator-profiles.ts`
- `src/services/agri-calculators/crop-calculator-boundaries.ts`

Profiles currently cover:

- rice
- cassava
- sugarcane
- maize
- durian
- longan
- rubber
- vegetable_mixed

Each profile includes:

- crop key
- Thai display name
- common spacing examples
- common unit examples
- yield estimate input examples
- cost categories commonly used
- fertilizer planning status: `planning_only`
- safety/disclaimer notes

## UI Use

Crop-aware examples appear on:

- `/app/calculators`
- `/app/calculators/plant-spacing`
- `/app/calculators/fertilizer`
- `/app/calculators/yield-estimate`
- `/app/calculators/cost`

Every crop selector keeps the note:

```text
ตัวอย่างนี้เป็นค่าเริ่มต้นเพื่อช่วยกรอก ไม่ใช่คำแนะนำทางวิชาการสุดท้าย
```

The “ใช้ตัวอย่างของพืชนี้” action fills only safe example inputs. The fertilizer page fills area context only and does not inject crop-specific NPK targets or fertilizer doses.

## Fertilizer Boundary

M51 does not recommend exact fertilizer amounts by crop. Existing NPK math remains deterministic:

```text
fertilizer kg = target nutrient total / (fertilizer nutrient percent / 100)
```

The user still owns the target nutrient input and fertilizer formula input. Future crop rules must be reviewed, versioned, and separated from deterministic math.

## Chemical Boundary

M51 does not add pesticide products, chemical products, label OCR, pest diagnosis, legality checks, or application recommendations. Spray mixing remains label-first arithmetic from values typed by the user.

## Future AI Boundary

AI may later explain what inputs mean or ask clarifying questions, but it must not silently change deterministic calculator output. Any crop-specific recommendation must be labeled, reviewed, and tied to rule versions, source notes, and expert escalation rules.

## Future Sponsor/Affiliate Boundary

Sponsor and affiliate features must remain outside base calculator output. Paid placements must be clearly labeled and must not influence formulas, crop profiles, AI recommendations, or saved calculator history.
