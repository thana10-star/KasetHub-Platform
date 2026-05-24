# Calculator AI Edge Function Contract

M59 drafts the future Supabase Edge Function contract for calculator AI explanations. This is a design stub only. No Edge Function is deployed, no endpoint is called, no AI provider is called, and no Supabase rows are written.

## Endpoint

- Endpoint name: `calculator-ai-explain`
- Method: `POST`
- Owner: backend or Supabase Edge Function only
- Frontend provider keys: forbidden
- Frontend service-role key: forbidden
- Default network behavior: disabled

## Request Payload

`CalculatorAIEdgeRequest` contains:

- `endpointName`
- `method`
- `requestId`
- `sourceRoute`
- `executionRequest`
- `lockedSnapshot`
- `expectedLockedResultHash`
- `expectedPolicyVersionId`
- `authContext`
- `maxPayloadChars`
- `noProviderKeyInPayload`
- `noServiceRoleKeyInPayload`
- `noSponsorPayload`

The frontend may send a locked calculator snapshot in a future staging milestone, but it must never send provider keys, service-role keys, hidden sponsor payloads, or formula override instructions.

## Response Payload

`CalculatorAIEdgeResponse` contains:

- `status`
- optional `explanationText`
- `disabledReason`
- locked result hash and locked result values
- policy check result
- rate-limit check preview
- timeout plan
- audit events
- failure modes
- safety disclaimers
- `providerCallAttempted`
- `networkCallAttempted`
- `supabaseWriteAttempted`
- `deterministicResultUnchanged`
- `noRealAICall`

M59 responses are contract previews only. They do not include AI-generated text.

## Required Server Checks

Before any future provider call, the Edge Function must:

- verify auth/session ownership when live history is involved
- validate calculator type, summary id, source route, crop key, and payload size
- verify `expectedLockedResultHash`
- verify `expectedPolicyVersionId`
- reject sponsor, affiliate, chemical product, label override, and formula mutation attempts
- enforce rate limits and repeated-request rules
- apply timeout handling
- safety-filter provider output before display
- write audit events only after schema/RLS/retention review

## Current Boundary

M59 keeps the adapter and Edge contract disabled-by-default. `calculator-ai-explain` exists only as a typed contract and in-app review screen.
