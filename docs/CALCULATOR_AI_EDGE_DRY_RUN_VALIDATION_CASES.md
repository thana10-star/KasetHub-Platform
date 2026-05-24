# Calculator AI Edge Dry-run Validation Cases

M60 adds local validation fixture cases for the future `calculator-ai-explain` dry-run path. They are deterministic service fixtures and do not call an endpoint.

## Cases

- `valid_locked_snapshot`: passes local contract validation.
- `missing_snapshot`: blocks because locked result values are absent.
- `lock_hash_mismatch`: blocks before provider paths.
- `policy_mismatch`: blocks before prompt building.
- `oversized_payload`: blocks before prompt building.
- `sponsor_injection_attempt`: blocks hidden sponsor/product placement.
- `chemical_recommendation_attempt`: blocks chemical/product recommendations.
- `no_auth_session`: blocks live persistence until auth/session ownership exists.
- `timeout_fallback`: plans safe disabled copy without mutating calculator values.

## Expected Behavior

Every case must keep:

- `noFetch: true`
- deterministic calculator output unchanged
- provider calls disabled
- Supabase writes disabled
- sponsor and unsafe recommendation content blocked

## Future Use

These fixtures can become backend dry-run test cases after a staging Edge Function exists. They should remain separate from real provider tests and must not require secrets.
