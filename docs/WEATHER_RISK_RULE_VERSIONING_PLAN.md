# Weather Risk Rule Versioning Plan

M79 defines local-only rule version metadata for the M78 weather risk categories.

Versioned categories:

- `spraying_risk`
- `irrigation_timing`
- `disease_pressure`
- `heat_stress`
- `field_work_risk`
- `harvest_drying_risk`

Each version includes:

- rule id
- version id
- status: `planning_only`
- source metadata placeholders
- pending reviewer sign-offs
- false-positive examples
- false-negative examples
- `prescriptiveAllowed: false`

## Future Requirements

Before production use, each rule version needs a source owner, citation, reviewed date, field applicability note, expert sign-off, safety sign-off, locked version, audit event, and rollback plan.
