# Weather Risk Prescriptive Blocker Policy

M79 blocks prescriptive weather risk output.

## Blocked Until Future Review

- telling a farmer to spray or not spray
- telling a farmer to use a specific product
- telling a farmer a chemical/fertilizer dose
- overriding label instructions
- diagnosing crop disease
- guaranteeing yield, profit, harvest quality, or safety
- sending automated weather risk push notifications

## Approval Gate

Future prescriptive behavior would require:

- expert sources filled
- all required reviewer sign-offs complete
- safety reviewer approved
- rule version locked
- false-positive/false-negative notes reviewed
- release gate approved

M79 still keeps `prescriptiveAllowed: false` even when the approval gate is represented locally.

## M80 Automation / CMS Bypass Policy

M80 adds explicit audit fixtures for automation bypass and CMS publish attempts. Both remain blocked.

Future CMS or automation may prepare drafts, diffs, or review packets, but cannot approve prescriptive weather risk rules.
