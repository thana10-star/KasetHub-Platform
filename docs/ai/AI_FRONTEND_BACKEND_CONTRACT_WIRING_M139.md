# AI Frontend Backend Contract Wiring M139

> M141 revision note: Future provider direction is now Gemini-first. The frontend contract flag remains valid, but the OpenAI-specific next-milestone wording below is superseded by `docs/ai/AI_ROADMAP_REVISION_M141.md`.

Status: frontend contract wiring only. M139 lets `/app/ai` call the M138 backend contract stub when a frontend-safe flag is enabled, but it still does not enable live OpenAI, Gemini, or any external AI provider.

## Frontend Mode

Frontend-safe flag:

```text
VITE_AI_BACKEND_CONTRACT_ENABLED=true
```

Default:

```text
false
```

When the flag is off, `/app/ai` keeps the existing safe local fixture behavior. This protects local development and production builds where the Cloudflare Function is not deployed or not meant to be exercised yet.

When the flag is on, `/app/ai` sends farmer questions to:

```http
POST /api/ai/farmer-assistant
```

The frontend never reads provider secrets and does not use:

```text
VITE_OPENAI_API_KEY
VITE_GEMINI_API_KEY
```

## Client Boundary

Client file:

```text
src/services/ai/ai-farmer-assistant-client.ts
```

The client:

- sends JSON `POST` requests to `/api/ai/farmer-assistant`
- normalizes the M138 response contract
- handles non-2xx responses that still contain a valid contract body
- handles invalid JSON safely
- handles network failure safely
- returns Thai user-facing fallback copy for client-side failures
- never calls OpenAI or Gemini directly
- never requires a provider key

## Request Shape

```ts
type FarmerAssistantRequest = {
  question: string;
  crop?: string;
  province?: string;
  topic?: 'plant_problem' | 'soil_fertilizer' | 'water' | 'weather' | 'price' | 'livestock' | 'general';
  userMode?: 'guest' | 'signed_in';
  clientRequestId?: string;
};
```

For M139, `/app/ai` sends:

- trimmed question
- inferred topic from the existing request planner
- `userMode: "guest"`
- client request ID for correlation

It does not send precise location or personal data.

## Status Rendering Rules

`not_configured`

- Shows friendly disabled copy:
  `ตอนนี้ผู้ช่วย AI เกษตรยังไม่ได้เปิดใช้งานเต็มรูปแบบ เรากำลังเตรียมระบบให้ตอบได้อย่างปลอดภัยและน่าเชื่อถือ`
- Does not mention missing API keys.

`blocked`

- Shows the backend safety answer.
- Keeps the warning prominent and calm.
- Does not provide dosage or chemical mixing instructions.

`rate_limited`

- Shows retry-friendly Thai copy.
- Includes `retryAfterSeconds` when provided.

`error`

- Shows user-facing fallback copy.
- Does not expose stack traces, raw JSON, `undefined`, `null`, or provider failure wording.

`ready` with `provider: "mock"` or `provider: "disabled"`

- Renders as a test preview only.
- Clearly says it is not a live AI answer.

## Existing Local Fallback

The previous AI proxy fixture path remains available:

- `src/services/ai-proxy/ai-proxy-adapter.ts`
- local fixture mode by default
- credit preview and current UI remain in place

M139 does not remove local fixtures because they are still useful when the backend contract flag is off or local Cloudflare Functions are unavailable.

## Why Live Provider Is Still Disabled

M138 intentionally returns disabled/not_configured fixture states and never calls OpenAI. M139 only connects the frontend to that contract so the UI can exercise real backend states safely.

Before live provider activation, the owner still needs a guarded runtime milestone to confirm:

- exact OpenAI model
- Cloudflare env setup
- provider timeout
- max tokens
- system prompt
- output safety validator
- abuse and rate-limit strategy
- production rollout flag
- explicit owner approval

## Testing Notes

M139 tests cover:

- client posts to `/api/ai/farmer-assistant`
- `not_configured`, `blocked`, `rate_limited`, `error`, invalid JSON, and network failure handling
- no frontend provider key requirement
- `/app/ai` rendering for backend contract states
- local fixture fallback still available by default

## Next Milestone

Recommended:

```text
M140 AI Real Provider Execution Planning / OpenAI Runtime Guardrails
```

M140 should still be a guardrail milestone before enabling live OpenAI output.
