# M138 AI Backend Proxy Contract Stub Report

## Summary

M138 added a safe Cloudflare Pages Function contract stub for the future KasetHub AI farmer assistant:

```http
POST /api/ai/farmer-assistant
```

The endpoint validates requests and returns safe fixture/disabled responses only. It does not call OpenAI, Gemini, or any external AI provider, and it does not change `/app/ai` runtime behavior.

## CONTEXT.md Read Confirmation

`CONTEXT.md` was read first and used as the current project context. It was not modified.

## Graphify Pre-Check Result

Graphify context was checked before editing:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

The graph helped identify existing AI route/service boundaries, current Cloudflare Function patterns, docs, tests, and route dependencies. Actual source files were still inspected before editing. `graphify-out` was not modified.

## Files Created/Modified

Created:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/farmer-assistant.test.ts`
- `docs/ai/AI_BACKEND_PROXY_STUB_M138.md`
- `reports/milestones/M138_AI_BACKEND_PROXY_CONTRACT_STUB_REPORT.md`

Modified:

- None outside the new M138 files.

## Endpoint Behavior

The new endpoint:

- accepts `POST` only
- returns `405` for non-POST methods
- parses JSON safely
- returns `400` for invalid JSON or validation failures
- returns `429` for obvious spam/rate-limit fixture cases
- returns normalized JSON with `Cache-Control: no-store`
- returns `not_configured` for normal valid questions in M138
- returns `not_configured` even if server-side OpenAI env is present, because live provider execution is explicitly out of scope

No backend writes, database writes, OpenAI calls, Gemini calls, or external AI calls were added.

## Validation Behavior

Supported request fields:

- `question`
- `crop`
- `province`
- `topic`
- `userMode`
- `clientRequestId`

Validation rules implemented:

- `question` is required
- `question` is trimmed
- empty questions are rejected
- default max question length is `1200`
- server-side `AI_MAX_INPUT_CHARS` can adjust the limit, capped at `4000`
- invalid `topic` is rejected
- invalid `userMode` is rejected
- optional context fields must be strings if provided
- precise location is not required
- invalid JSON does not leak parser errors or stack traces

## Fixture States Implemented

The stub includes fixture helpers for:

- `ready_mock`
- `not_configured`
- `rate_limited`
- `blocked_high_risk`
- `provider_error`
- `timeout`
- `validation_error`

Fixtures use safe Thai copy and use only `provider: "mock"` or `provider: "disabled"`. They do not pretend to be live provider output.

## Safety Blocking Behavior

A small, testable high-risk guard was added for obvious unsafe requests:

- pesticide/chemical dosage requests
- dangerous chemical mixing requests
- human or animal emergency-health wording

Blocked responses return `status: "blocked"` and `safetyLevel: "high_risk"` with Thai copy that avoids dosage instructions and recommends reading the real label and consulting a local agriculture expert.

This is intentionally narrow. Stronger safety and abuse handling should be added before live provider rollout.

## Env/Security Notes

Server-side env names read safely:

- `AI_PROVIDER`
- `OPENAI_API_KEY`
- `AI_MAX_INPUT_CHARS`
- `AI_COOLDOWN_SECONDS`

Security protections:

- missing env does not crash the endpoint
- `OPENAI_API_KEY` is never returned
- secret values are not logged
- no frontend provider key was added
- no `VITE_OPENAI_API_KEY`
- no `VITE_GEMINI_API_KEY`
- no direct browser provider call

## Tests Updated

Added endpoint tests for:

- non-POST method returns `405`
- invalid JSON is rejected safely
- missing/empty question is rejected
- too-long question is rejected
- server-side max input override is honored without exposing env names
- invalid `topic` and `userMode` are rejected
- valid question with no provider returns `not_configured`
- server-side OpenAI env does not trigger a provider call
- high-risk chemical dosage/mixing requests return `blocked/high_risk`
- obvious spam returns `rate_limited`
- all fixture states avoid live-provider claims and secret exposure

## Verification Results

Passed:

- `npm run test -- functions/api/ai/farmer-assistant.test.ts`
  - 1 test file passed
  - 11 tests passed
- `npm run lint`
- `npm run build`
  - Build passed.
  - Vite reported the existing large chunk size warning.
- `npm run test`
  - 54 test files passed
  - 521 tests passed
- `git diff --check`

Additional checks:

- No `VITE_OPENAI_API_KEY`, `VITE_GEMINI_API_KEY`, or `VITE_AI_PROVIDER_SECRET` references were found in non-test `src` or `functions` code.
- No committed-looking OpenAI or Google provider key patterns were found in `src`, `functions`, `docs`, or `reports`.
- Generated build artifacts touched by `npm run build` were restored before final diff review.

## Known Limitations

- No live OpenAI call exists yet.
- `/app/ai` is not connected to this endpoint yet.
- Rate limiting is fixture-only and not backed by durable storage.
- Safety blocking is a narrow stub, not a complete classifier.
- No provider timeout or output validation is implemented because there is no provider call in M138.

## Proposed Next Milestone

Recommended next:

```text
M139 AI Frontend Contract Wiring / Disabled Backend State
```

M139 should connect `/app/ai` to the backend stub safely, show `not_configured` or disabled backend state with natural Thai copy, preserve local fallback behavior if needed, and still avoid any live provider call unless the owner explicitly approves that scope.

## No-Live-Provider Confirmation

M138 did not add:

- live OpenAI calls
- Gemini calls
- external AI provider calls
- API key values
- frontend AI keys
- `VITE_OPENAI_API_KEY`
- `VITE_GEMINI_API_KEY`
- real-provider `/app/ai` runtime integration
- backend writes
- database writes
- fake live AI output
- fake weather, price, or source data
