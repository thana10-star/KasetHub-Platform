# Calculator AI Edge Function Security Plan

M59 defines security requirements for the future `calculator-ai-explain` Edge Function before live AI is enabled.

## Server-only Secrets

The following must never appear in frontend code, Vite env, localStorage, route params, client logs, share text, or saved calculator summaries:

- AI provider keys
- Supabase service-role key
- Edge Function signing secrets
- hidden sponsor or affiliate payloads
- raw provider prompts containing private data

Provider keys and service-role credentials belong only in backend or Edge Function secret stores.

## Lock-hash Verification

The backend must treat deterministic calculator values as immutable:

1. Receive a locked snapshot.
2. Rebuild or verify the snapshot lock hash.
3. Compare it with `expectedLockedResultHash`.
4. Reject on mismatch before prompt building.
5. Instruct AI to echo locked values only.

AI must not recompute formulas, mutate outputs, or claim a corrected deterministic result.

## Policy Checks

The backend must select a reviewed policy version and prompt template version before provider calls.

Block before provider when:

- policy version mismatches
- prompt template is inactive or unreviewed
- requested action is blocked
- user question requests sponsor/product insertion
- user question asks for pesticide/chemical product recommendation
- prompt would override label instructions or remove uncertainty

## Audit And Rate Limits

Future backend tables may record:

- request envelope metadata
- snapshot lock verification
- policy check result
- rate-limit decision
- safety filter decision
- timeout/failure status

No audit rows are written in M59. Future writes require schema/RLS review and retention policy.

## Timeout Behavior

Timeouts must return safe disabled copy. They must not:

- retry repeatedly until spam occurs
- hide uncertainty
- change calculator results
- replace safety disclaimers
- expose provider internals to the user

## Sponsor Separation

Sponsor or affiliate content must not be mixed into prompts, policy checks, AI explanations, or calculator result cards. Any future sponsored surface must be clearly labeled and separate from formula output.

## M59 Status

No Edge Function is deployed. No provider is called. No Supabase write occurs. No network path is active by default.

## M60 Dry-run Secret Gate

M60 adds local dry-run flags but no secrets:

- `VITE_CALCULATOR_AI_EDGE_URL`
- `VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN`
- `VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK`

The dry-run planner rejects provider-key and service-role-key concepts in frontend config. A URL alone is not enough to call the endpoint, and flags alone are not enough to call the endpoint.
