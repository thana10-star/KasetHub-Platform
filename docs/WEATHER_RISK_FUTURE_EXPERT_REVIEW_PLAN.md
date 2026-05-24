# Weather Risk Future Expert Review Plan

M78 intentionally stops before expert-reviewed agronomy rules.

## Future Review Checklist

- Define rule owner and reviewer.
- Record source metadata and last reviewed date.
- Explain field applicability and regional limits.
- Test false-positive and false-negative examples.
- Review safety language for spraying, disease pressure, heat, and harvest drying.
- Confirm no product/sponsor path exists.
- Confirm label instructions always override app copy.

## Future Versioning

Future weather risk tables may include:

- `weather_risk_rule_versions`
- `weather_risk_assessments`
- `weather_risk_notifications`
- `weather_risk_user_acknowledgements`

No migrations are included in M78.

## Release Gate

Before live risk intelligence becomes prescriptive or personalized, KasetHub needs a reviewed rule version, source/audit plan, consent model for any saved preferences, and RLS-reviewed storage.
