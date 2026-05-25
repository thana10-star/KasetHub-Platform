# Calculator AI Backend Adapter Contract

M57 adds a disabled-by-default adapter contract for future calculator AI explanations. It does not call a real AI provider, does not fetch a backend endpoint by default, and does not write to Supabase.

## Service Files

- `src/services/agri-calculators/calculator-ai-adapter.types.ts`
- `src/services/agri-calculators/calculator-ai-adapter.ts`
- `src/services/agri-calculators/calculator-ai-local-fixtures.ts`

## Modes

- `local_fixture`: default. Returns deterministic Thai fixture text from the locked calculator snapshot.
- `backend_disabled`: returns a disabled response and never calls a backend client.
- `backend_test_ready`: still refuses backend/client execution unless both backend and network flags are explicitly true.
- `production_disabled`: returns a disabled response until a future milestone explicitly enables production behavior.

## Feature Flags

```env
VITE_CALCULATOR_AI_MODE=local_fixture
VITE_ENABLE_CALCULATOR_AI_BACKEND=false
VITE_ENABLE_CALCULATOR_AI_NETWORK=false
```

No endpoint URL is defined in M57.

## Request Contract

`CalculatorAIAdapterRequest` wraps the M56 `CalculatorAIExecutionRequest`:

- calculator result summary
- calculator type
- optional crop key/label
- requested explanation actions
- optional user question
- requested policy/prompt template version
- source route and source surface
- `localOnlyPreview: true`

The adapter always builds a backend architecture review first, including snapshot lock hash and safety decision.

## Response Contract

`CalculatorAIAdapterResponse` includes:

- status
- adapter mode
- explanation text or disabled reason
- policy version
- prompt template version id
- locked result hash
- locked result values
- safety disclaimers
- blocked actions
- audit preview
- `noRealAICall: true`
- network/backend attempt flags

## Safety Rule

The adapter may explain locked calculator values, but it must not:

- change deterministic results
- recompute formulas
- recommend chemical products
- add fertilizer dose outside the calculator result
- mention sponsor products
- claim guaranteed yield or profit
- override label instructions
- hide uncertainty

## Current Boundary

M57 is still local-only. The default path has no network, no real AI, no backend endpoint, no cloud sync, no Supabase write, no sponsor integration, and no payment or AdMob behavior.

## M58 QA Hardening

M58 adds deterministic adapter QA fixtures in `calculator-ai-adapter-qa-fixtures.ts`.

Fixture states cover:

- local fixture success
- backend disabled
- backend network disabled
- backend test ready but blocked because no endpoint/client exists
- invalid request
- oversized request
- sponsor insertion blocked
- deterministic locked-hash mismatch blocked
- policy version mismatch blocked
- invalid crop profile blocked

`/app/calculators/ai-adapter-status` now shows an adapter state matrix, fixture-vs-disabled comparison, current flags, backend blocked reasons, no-network guarantee, safe fallback behavior, and locked hash preservation status.

M58 also adds `/app/calculators/ai-endpoint-plan` for future staging endpoint readiness. It remains no-network and planning-only.

## M59 Edge Function Contract Draft

M59 adds `calculator-ai-edge-contract.types.ts` and `calculator-ai-edge-contract.ts`.

The future endpoint name is `calculator-ai-explain`. The contract defines typed request/response payloads, auth context, policy check, audit event preview, rate-limit check, timeout plan, and failure modes.

Current behavior remains disabled by default:

- no deployed Edge Function
- no fetch or provider call
- no frontend provider key
- no frontend service-role key
- no Supabase writes
- no sponsor or affiliate payload

The contract proves that lock-hash mismatch and policy mismatch are blocked before any future provider path.

## M60 Edge Dry-run Gate

M60 adds a local dry-run readiness plan after the adapter and Edge contract. The adapter still controls calculator AI mode, while the dry-run plan checks the future Edge URL and Edge-specific dry-run/network flags.

Even when `VITE_ENABLE_CALCULATOR_AI_EDGE_DRY_RUN=true` and `VITE_ENABLE_CALCULATOR_AI_EDGE_NETWORK=true`, M60 does not call fetch. A later milestone must explicitly add a staging-only client and tests.
## M81 AI Text Proxy Compatibility

The calculator AI adapter remains disabled/local by default. M81 can preview a future real text proxy status, but calculator explanation text is still bounded by locked snapshots, audit/rate-limit previews, blocked actions, and the backend-only provider-key rule. No frontend provider key or service-role key is allowed.
