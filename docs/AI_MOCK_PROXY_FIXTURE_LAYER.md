# AI Mock Proxy Fixture Layer

M11 adds a frontend-only mock proxy layer that looks like the future KasetHub AI backend. It lets the product test request/response flows, credit validation, safety messages, retry states, and plant image analysis outcomes without real AI providers, backend servers, Supabase writes, uploads, or hidden API keys.

## Why This Exists

The UI needs to be ready before real AI infrastructure is connected. The mock proxy gives screens a stable contract now:

- text question response shape
- plant image analysis response shape
- article and video summary response shape
- backend-style request IDs
- credit validation preview
- model routing preview
- safety disclaimers
- logs preview
- retry and failure behavior

When a real backend is added, the frontend should keep the same response ideas and swap the fixture service for a network client behind feature flags.

## Files

- `src/services/ai-proxy/ai-proxy.types.ts`
- `src/services/ai-proxy/ai-proxy-fixtures.ts`
- `src/services/ai-proxy/ai-proxy-mock-service.ts`

## Mock Endpoints

The mock service exposes functions shaped like future backend operations:

- `askTextQuestion()`
- `analyzePlantImage()`
- `summarizeArticle()`
- `summarizeVideo()`

They do not call `fetch`, Supabase, OpenAI, Gemini, AdMob, or any backend.

## Response Shape

Every response includes:

- `requestId`
- `status`
- `requestType`
- `creditCost`
- `creditValidation`
- `modelPlan`
- `answer` or `result`
- `safetyDisclaimers`
- `warnings`
- `logsPreview`
- `retryable`
- `createdAt`

Supported statuses:

- `success`
- `rejected`
- `insufficient_credits`
- `safety_blocked`
- `failed`

## Credit Validation Behavior

The mock proxy reads local M08 AI credit summary and validates whether the request has enough credits. It does not consume credits by itself.

Frontend UI decides when to consume local credits:

- `/app/ai` consumes credits only after a successful mock text response.
- `/app/analyze` only previews 3-credit validation and does not deduct credits in M11.

Future backend rules:

- backend recalculates credit cost
- backend validates balance
- backend deducts credits atomically only for accepted successful requests
- client-provided credit values are treated as display hints only

## Fixture Scenarios

The developer/demo selector supports:

- success
- insufficient credits
- safety blocked
- failed retryable
- low confidence
- no plant detected
- blurry image
- safety warning

For plant image analysis, the service can also infer scenarios from file names:

- `blur` or `เบลอ` -> blurry image
- `no-plant`, `empty`, or `soil` -> no plant detected
- `low` or `unclear` -> low confidence
- `safe` or `chemical` -> safety warning

## Plant Image Result Fields

Mock image analysis results include:

- `diseaseName`
- `cropName`
- `confidence`
- `confidenceLabel`
- `symptoms`
- `causes`
- `treatmentSuggestions`
- `urgency`
- `followUpQuestions`
- `recommendedActions`
- `shouldConsultExpert`

The real backend should keep this structure stable enough for My Farm, history, sharing, and expert review workflows.

## Safety Response Behavior

The fixture layer always includes agriculture safety disclaimers. High-risk questions and image results should remind users that AI guidance is preliminary and should be checked with experts before using pesticide, fertilizer, or disease-treatment advice.

## How To Add A New AI Request Type

1. Add the request type to `src/services/ai/ai-request.types.ts`.
2. Add its credit cost in `src/services/ai/ai-credit-cost-policy.ts`.
3. Add routing in `src/services/ai/ai-routing-policy.ts`.
4. Add fixture result fields in `ai-proxy-fixtures.ts`.
5. Add a mock function or branch in `ai-proxy-mock-service.ts`.
6. Document the future real endpoint in `docs/AI_BACKEND_PROXY_CONTRACT.md`.

## M11 Boundary

M11 is a fixture layer only. There are no provider keys, network calls, real backend endpoints, real image uploads, real Supabase writes, or real AI responses.

## M13 Adapter Usage

From M13 onward, product screens should call the AI proxy adapter instead of importing fixture functions directly.

Adapter entry points:

- `askTextQuestion()`
- `analyzePlantImage()`
- `summarizeArticle()`
- `summarizeVideo()`

In `local_fixture` mode, the adapter delegates to this M11 fixture layer. Backend modes return disabled/test-not-ready responses until a real endpoint exists. This keeps fixture behavior useful while preventing UI code from depending on the fixture implementation.
