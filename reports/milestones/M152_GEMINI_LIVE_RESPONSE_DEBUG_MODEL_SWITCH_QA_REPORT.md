# M152 Gemini Live Response Debug + Model Switch QA Report

## Summary

M152 adds opt-in backend debug metadata for Gemini farmer-assistant responses and creates model-switch QA guidance. Debug is disabled by default and only appears when the server-side env `AI_DEBUG_RESPONSE=true` is set.

The goal is to identify whether the latest live failures come from Gemini model/API behavior, parser mismatch, output validator rejection, fallback mapping, timeout, gate configuration, or model choice without exposing raw provider data to users.

## CONTEXT.md Read Confirmation

Read `CONTEXT.md` before implementation. Relevant context confirmed:

- AI is a major engagement feature but provider execution must stay backend/server-side.
- Farmer-facing copy should be Thai, practical, and not technical.
- Provider secrets must not be exposed, committed, or moved into frontend env.
- Graphify context must be read before editing.
- `CONTEXT.md`, `graphify-out`, generated/cache files, and secrets must not be modified or committed.

## Graphify Pre-Check Result

Read:

- `graphify-out/.graphify_analysis.json`
- `graphify-out/graph.json`

Graphify confirmed the relevant AI dependency cluster around:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/providers/*`
- `functions/api/ai/guardrails/*`
- `docs/ai/*`
- `reports/milestones/M151*`

No `graphify-out` files were modified.

## Files Created/Modified

Created:

- `docs/ai/AI_GEMINI_MODEL_SWITCH_QA_M152.md`
- `docs/ai/AI_GEMINI_LIVE_DEBUG_RETEST_M152.md`
- `reports/milestones/M152_GEMINI_LIVE_RESPONSE_DEBUG_MODEL_SWITCH_QA_REPORT.md`

Modified:

- `functions/api/ai/farmer-assistant.ts`
- `functions/api/ai/farmer-assistant.test.ts`
- `functions/api/ai/providers/gemini-live-provider.ts`
- `functions/api/ai/providers/provider-types.ts`

Unmodified by design:

- `CONTEXT.md`
- `graphify-out/*`
- `/app/ai` UI files
- Community, Weather, Prices, YouTube, Supabase, and auth code

## Live Issue Summary

After M151 deploy, the normal live retest:

```text
ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร
```

first returned:

```text
status: ready
provider: gemini
providerMode: live
```

but the answer remained generic:

```text
ควรเริ่มตรวจว่าพืชของคุณมีอาการผิดปกติอย่างไรบ้างครับ...
```

A later full JSON retest returned:

```text
status: error
provider: disabled
providerMode: disabled
answer: ยังตอบคำถามนี้ไม่ได้อย่างปลอดภัย ลองถามใหม่โดยเล่าปัญหาเกษตรให้สั้นและชัดขึ้น
```

That second result suggests the issue may be parser, provider error, output validator, timeout, or fallback mapping, not only prompt quality.

## Likely Failure Points

Current live path:

1. Endpoint validates request JSON and topic/user mode.
2. Endpoint blocks high-risk chemical/emergency input before provider execution.
3. Endpoint selects Gemini only if live gates and backend secret are present.
4. Gemini live provider builds request, calls injected/global backend fetch, and maps Gemini HTTP/fetch failures.
5. Parser converts Gemini response shape into provider-neutral text.
6. Timeout wrapper catches slow or malformed provider execution.
7. Output validator checks the answer before returning it.
8. Safety fallback mapper replaces unsafe or malformed output with Thai safe copy.

The latest error copy is consistent with:

- parser missing/empty text
- malformed Gemini response
- Gemini provider error
- output validator rejection such as non-Thai, fake live claim, raw provider error, model ID, or secret-like output
- provider timeout

## Debug Metadata Design

Debug appears only when:

```text
AI_DEBUG_RESPONSE=true
```

Default is false. The frontend does not control this flag.

Debug shape:

```ts
debug?: {
  stage:
    | "validation"
    | "input_safety_block"
    | "rate_limit"
    | "provider_select"
    | "provider_call"
    | "provider_timeout"
    | "provider_error"
    | "parser"
    | "output_validator"
    | "fallback_mapper"
    | "success";
  reasonCodes: string[];
  providerMode?: "disabled" | "dry_run" | "live" | "live_blocked";
  model?: string;
  liveGate?: "disabled" | "dry_run" | "live_blocked" | "live";
  safeSummary?: string;
}
```

Debug never includes:

- raw Gemini response text
- raw provider error messages
- request URL
- request headers
- `x-goog-api-key`
- `GEMINI_API_KEY`
- secret-like values
- stack traces

Internal provider trace is kept non-enumerable so direct provider serialization does not leak internal fields. The endpoint converts it to public `debug` only when `AI_DEBUG_RESPONSE=true`.

## Trace Propagation Summary

Endpoint debug stages now cover:

- `validation` for invalid JSON, method, or contract failures
- `rate_limit` for spam/rate-limit fixture
- `input_safety_block` for high-risk prompt blocks before provider execution
- `provider_select` for missing live key or disabled provider selection
- `provider_timeout` for timeout wrapper failure
- `provider_error` for Gemini HTTP/fetch/API mapped failures
- `parser` for Gemini malformed, empty, missing-text, or safety-blocked response shapes
- `output_validator` for unsafe provider answer replacement
- `success` for provider output that passed endpoint output validation

Safe reason codes include:

- `success_live_validated`
- `live_key_missing`
- `gemini_auth_error`
- `gemini_rate_limited`
- `gemini_quota_exceeded`
- `gemini_safety_blocked`
- `gemini_malformed_response`
- `gemini_missing_text`
- `provider_timeout`
- `dangerous_chemical_mixing`
- `fake_live_data_claim`
- `mostly_non_thai`

## Model Switch QA Summary

Created `docs/ai/AI_GEMINI_MODEL_SWITCH_QA_M152.md` with a controlled sequence for:

- current production `AI_MODEL`
- `gemini-2.5-flash`
- `gemini-2.5-pro`
- `gemini-2.5-flash-lite`

The guide says to verify model names against current Gemini docs before testing, run one normal cassava prompt and one high-risk prompt per model, capture `status/provider/providerMode/debug`, and compare answer quality, latency, and safety.

## Tests Updated

Added endpoint tests for:

- debug disabled by default
- validation failure includes `debug.stage=validation` only when enabled
- missing key includes `debug.stage=provider_select` and `live_key_missing`
- successful mocked live response includes `debug.stage=success` and `success_live_validated`
- high-risk input block includes `debug.stage=input_safety_block`
- unsafe mocked live output includes `debug.stage=output_validator`
- parser missing text includes `debug.stage=parser`
- provider timeout includes `debug.stage=provider_timeout`
- debug does not expose placeholder key, raw provider response, URL, headers, or internal trace fields
- configured `AI_MODEL` appears only as a safe debug model label when debug is enabled

Updated provider behavior so internal debug trace is non-enumerable and direct provider serialization does not expose it.

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `npm run test -- functions/api/ai/farmer-assistant.test.ts functions/api/ai/providers/gemini-live-provider.test.ts functions/api/ai/providers/gemini-request-builder.test.ts functions/api/ai/providers/gemini-response-parser.test.ts functions/api/ai/providers/gemini-error-mapper.test.ts functions/api/ai/guardrails/output-validator.test.ts functions/api/ai/guardrails/safety-fallbacks.test.ts functions/api/ai/guardrails/provider-timeout.test.ts functions/api/ai/guardrails/rollout-gate.test.ts`
- `git diff --check`

AI-focused tests:

- 9 files passed
- 89 tests passed

Build note: `npm run build` emitted the existing Vite chunk-size warning. Build-generated changes to `dist/index.html` and `tsconfig.app.tsbuildinfo` were restored so generated/cache artifacts are not part of M152.

`git diff --check` returned success with Windows line-ending warnings only.

Secret-pattern scan found no real `AIza...` or `sk-...` style key and no committed `VITE_GEMINI_API_KEY=` / real `GEMINI_API_KEY=` value in M152-touched files.

## Retest Steps

After deploying M152, temporarily set:

```text
AI_DEBUG_RESPONSE=true
```

Run:

```powershell
$response = Invoke-RestMethod `
  -Uri "https://kasethub.pages.dev/api/ai/farmer-assistant" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"question":"ใบมันสำปะหลังเหลืองควรเริ่มตรวจอะไร","topic":"plant_problem","userMode":"guest","clientRequestId":"m152-debug-cassava"}'

$response | ConvertTo-Json -Depth 12
```

Interpret:

- `debug.stage=success`: model answered and validator allowed it; evaluate answer quality.
- `debug.stage=output_validator`: model answered but guardrails replaced it.
- `debug.stage=parser`: parser could not read Gemini response safely.
- `debug.stage=provider_error`: Gemini API/model/auth/quota/rate/server error was mapped safely.
- `debug.stage=provider_timeout`: provider timed out.
- `debug.stage=provider_select`: live gate/key/model setup blocked execution.

## Known Limitations

- M152 does not run a real Gemini call from this environment.
- Debug metadata is safe but should still be used temporarily and turned off after diagnosis.
- Debug does not store raw full question/answer logs.
- Debug does not reveal raw Gemini response bodies, so parser fixes may still require mocked reproduction.
- No image AI, memory, RAG, weather grounding, price grounding, billing, or persistent quota system was added.

## Proposed Next Milestone

Recommend: **M153 Gemini Model Comparison Live Retest + Prompt/Parser Fix**

M153 should:

- deploy M152
- enable `AI_DEBUG_RESPONSE=true` temporarily
- run live tests across 1-2 selected models
- capture debug stage/reason codes
- decide whether the problem is model, parser, validator, or prompt
- fix the exact failure point
- turn `AI_DEBUG_RESPONSE=false` if not needed

## Safety Confirmation

M152 did not:

- commit `GEMINI_API_KEY`
- add `VITE_GEMINI_API_KEY`
- expose secrets
- expose raw Gemini responses to users
- weaken high-risk chemical blocking
- make uncontrolled live calls
- change unrelated systems
- modify `CONTEXT.md`
- modify `graphify-out`
- add fake weather, price, source, or citation data
