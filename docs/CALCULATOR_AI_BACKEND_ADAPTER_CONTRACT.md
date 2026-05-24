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
