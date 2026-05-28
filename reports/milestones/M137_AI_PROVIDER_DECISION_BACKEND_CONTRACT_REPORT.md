# M137 AI Provider Decision + Backend Contract Report

## Summary

M137 finalized the owner-approved provider direction and backend contract for KasetHub's future real AI farmer assistant. The primary V1 text provider path is OpenAI through backend/server-side infrastructure only. This milestone remains contract/foundation only and does not implement live provider calls.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first. It confirms that AI เกษตร is the next major engagement/revenue feature after YouTube and must remain backend/proxy only, with no frontend provider key, farmer-friendly Thai copy, uncertainty handling, and safety around pesticide/chemical advice.

## Graphify Pre-Check Result

Graphify files were read before editing:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify identified the existing AI route, mock proxy layer, AI text dry-run contracts, route registry, and AI docs as the relevant dependency area. Actual source files were inspected before creating the M137 docs.

## Files Created

- `docs/ai/AI_PROVIDER_DECISION_AND_BACKEND_CONTRACT_M137.md`
- `docs/ai/AI_BACKEND_FIXTURE_STATES_M137.md`
- `reports/milestones/M137_AI_PROVIDER_DECISION_BACKEND_CONTRACT_REPORT.md`

## Files Modified

No runtime source files were modified.

## Provider Decision Summary

Primary V1 provider path:

- OpenAI API through backend/server-side Cloudflare Function only.

Fallback:

- disabled/mock/local fixture mode remains available for staging, `not_configured`, cost safety, and provider outage.

Future comparison:

- Gemini may be evaluated later, but it is not part of M137 implementation.

## Backend Contract Summary

Future endpoint:

```http
POST /api/ai/farmer-assistant
```

Planned Cloudflare Function path:

```text
functions/api/ai/farmer-assistant.ts
```

Request fields:

- `question: string`
- `crop?: string`
- `province?: string`
- `topic?: "plant_problem" | "soil_fertilizer" | "water" | "weather" | "price" | "livestock" | "general"`
- `userMode?: "guest" | "signed_in"`
- `clientRequestId?: string`

Response fields:

- `status: "ready" | "not_configured" | "rate_limited" | "blocked" | "error"`
- `answer?: string`
- `safetyLevel?: "normal" | "caution" | "high_risk"`
- `followUpQuestions?: string[]`
- `disclaimers?: string[]`
- `provider?: "openai" | "disabled" | "mock"`
- `requestId?: string`
- `retryAfterSeconds?: number`

Validation contract:

- `question` required.
- Trim input.
- Reject empty input.
- Recommended max question length: 1,200 characters.
- Province is optional only; no precise location required.
- Reject simple obvious spam/abuse before provider work.

## Fixture State Summary

M137 documented future test fixtures for:

- `ready`
- `not_configured`
- `rate_limited`
- `blocked_high_risk`
- `provider_error`
- `timeout`
- `validation_error`

Fixtures use safe Thai copy and `provider: "mock"` or `provider: "disabled"` so they do not pretend to be live provider output.

## Env / Security Contract

Server-side env names:

- `AI_PROVIDER=openai`
- `OPENAI_API_KEY`
- `AI_MODEL`
- `AI_TIMEOUT_MS`
- `AI_MAX_INPUT_CHARS`
- `AI_MAX_OUTPUT_TOKENS`
- `AI_DAILY_LIMIT_GUEST`
- `AI_DAILY_LIMIT_SIGNED_IN`
- `AI_COOLDOWN_SECONDS`

Forbidden frontend env:

- `VITE_OPENAI_API_KEY`
- `VITE_GEMINI_API_KEY`
- `VITE_AI_PROVIDER_SECRET`
- any provider secret exposed to frontend

Missing `OPENAI_API_KEY` should return `not_configured`, not crash.

## Safety Contract

Minimum rules documented for M138/M139:

- answer in simple Thai
- ask clarifying questions when details are missing
- do not claim guaranteed diagnosis
- do not provide confident chemical/pesticide dosage unless based on verified label/source
- do not invent live weather, price, or official source data
- include disclaimers for chemicals, disease diagnosis, financial/legal-like claims, animal health, and human health
- recommend local agriculture office/expert for high-risk cases
- no fake citations

## Frontend Integration Contract

Future `/app/ai` should:

- send the farmer question to backend proxy only
- never see a provider key
- handle `ready`, `not_configured`, `rate_limited`, `blocked`, and `error`
- use natural Thai copy
- keep local fixture/disabled fallback until backend is explicitly enabled
- avoid technical farmer-facing wording such as `API error`, `provider failed`, `undefined`, or `null`

## M138 Readiness Checklist

M138 AI Backend Proxy Contract Stub / No Live Provider Call should:

- create `functions/api/ai/farmer-assistant.ts`
- accept `POST` only
- validate request JSON
- trim and validate `question`
- enforce max question length of 1,200 characters by default
- reject empty questions safely
- return `not_configured` when provider is not enabled or key is missing
- include contract fixtures for all documented states
- add endpoint tests
- add frontend secret-guard tests
- still avoid OpenAI calls unless owner explicitly upgrades M138 scope

## Verification Results

Completed in this working session:

- `npm run lint` passed.
- `npm run build` passed. Vite still reports the existing large bundle warning, but the build completed successfully.
- `npm run test` passed: 53 test files and 510 tests.
- `git diff --check` passed.
- Runtime source/function secret scan passed: no `VITE_OPENAI_API_KEY`, `VITE_GEMINI_API_KEY`, `OPENAI_API_KEY`, or `GEMINI_API_KEY` references exist in non-test `src` or `functions` files.

Generated build artifacts were restored after verification.

## Known Limitations

- No AI Cloudflare Function was created in M137.
- No TypeScript runtime contract file was added because docs-only is safer for this milestone and avoids any runtime behavior change.
- No owner-selected OpenAI model was locked; model choice should be confirmed against current provider docs during implementation planning.
- Existing older docs and source contain historical placeholder routes such as `/api/ai/ask`; M137 narrows the next farmer assistant path to `/api/ai/farmer-assistant`.

## M137 Safety Confirmation

- No live OpenAI call implemented.
- No API key added.
- No frontend AI key added.
- No `VITE_OPENAI_API_KEY` added.
- No `VITE_GEMINI_API_KEY` added.
- No secrets committed.
- No fake AI live data added.
- No runtime `/app/ai` provider integration added.
- No Community, Weather, Prices, YouTube, Supabase, auth, or unrelated route behavior changed.
- `CONTEXT.md` was not modified.
- `graphify-out` was not modified.
