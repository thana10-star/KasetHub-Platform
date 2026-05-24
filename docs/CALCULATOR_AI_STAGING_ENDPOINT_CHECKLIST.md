# Calculator AI Staging Endpoint Checklist

M58 defines the checklist for a future calculator AI explanation backend endpoint. This is planning only. No endpoint exists, no network call is enabled, and no AI provider is called.

## Backend Ownership

Future prompt execution must be owned by a backend route or Supabase Edge Function. The frontend must never hold:

- provider API keys
- service-role keys
- hidden sponsor payloads
- prompt template secrets
- audit-write credentials

## Required Request Checks

Before a provider call, the backend must verify:

- calculator type is supported
- summary id exists
- locked result recap is present
- snapshot lock hash matches the payload
- policy version id exists and is active/reviewed
- prompt template version id matches the policy
- crop key is valid or cleared from context
- payload size stays under reviewed limits
- source route/surface is allowed

## Required Safety Checks

The endpoint must reject before AI when the request asks for:

- formula mutation
- hidden sponsor or affiliate insertion
- chemical or pesticide product recommendations
- fertilizer dose outside the locked calculator output
- label override
- guaranteed yield or profit
- uncertainty removal

## Audit And Rate Limits

Before staging traffic, backend controls must exist for:

- request id
- user/session hash
- snapshot id
- snapshot lock hash
- policy version id
- prompt template version id
- safety decision
- blocked action ids
- daily explanation limits
- repeated request limits
- timeout and retry caps

## Production Blockers

Do not enable production AI explanations while any of these are missing:

- backend-only prompt builder
- provider key isolation
- lock-hash verification
- policy version validation
- audit log table and RLS review
- safety event table and admin review path
- rate limits and abuse prevention
- timeout fallback copy
- sponsor separation review
- regression tests proving deterministic values do not change

## Current M58 Boundary

M58 adds QA fixtures and an endpoint plan route only. It does not add a real backend endpoint, fetch, AI API call, Supabase write, cloud sync, AdMob/payment, sponsor integration, or live network path.

## M59 Contract Draft

M59 adds the typed Edge Function contract for `calculator-ai-explain`.

The contract is ready for review only. Before deployment, the operator must still confirm:

- Supabase project and auth ownership are ready for this surface
- Edge Function secrets are configured outside frontend env
- lock-hash verification runs server-side
- policy version and prompt template registry are reviewed
- audit and rate-limit tables have RLS and retention review
- timeout behavior returns safe disabled copy
- provider calls remain impossible from frontend code

## M60 Dry-run Checklist

M60 adds `/app/calculators/ai-edge-dry-run`.

The route must show:

- endpoint URL status without exposing the full value
- dry-run flag state
- edge network flag state
- backend adapter flag state
- secret checklist
- validation fixtures
- audit/rate-limit dry-run preview
- production blockers
- "ยังไม่เรียก endpoint จริง"

M60 still does not deploy or call `calculator-ai-explain`.
