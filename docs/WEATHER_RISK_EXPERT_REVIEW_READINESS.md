# Weather Risk Expert Review Readiness

M79 adds expert-review readiness for KasetHub agriculture weather risk rules.

The rules may continue to show broad caution cards, but they cannot become prescriptive until expert review, safety review, source metadata, false-positive/false-negative review, version locking, and a separate release gate exist.

## Reviewer Roles

- `agronomy_expert`
- `crop_protection_expert`
- `weather_data_reviewer`
- `safety_reviewer`

All M79 sign-offs remain pending.

## Required Review Evidence

- source metadata placeholders
- reviewer placeholders
- false-positive examples
- false-negative examples
- safety reviewer approval
- locked rule version
- release gate approval

## Current Boundary

M79 keeps `prescriptiveAllowed: false` for every rule version.

No rule may recommend a product, sponsor, exact chemical dose, exact fertilizer dose, label override, or guaranteed outcome.
